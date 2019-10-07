'use strict'

const Boom = require('@hapi/boom')

const h = require('./h')

const {
  serializeRequest,
  serializeQuery
} = require('./serl')

async function parseRequest (r, event) {
  /*

    request.app: doable
    request.auth:
    request.events
    request.headers
    request.info
    request.logs
    request.method
    request.mime
    request.orig
    request.params
    request.paramsArray
    request.path
    request.payload
    request.plugins
    request.pre
    request.response
    request.preResponses
    request.query
    request.raw
    request.route
    request.server
    request.state
    request.url

*/
  const request = {}
  const parsed = await serializeRequest(event.request)
  const route = r.route

  const url = new URL(event.request.url)

  // app
  request.app = route.app

  // auth
  // events
  // headers
  request.headers = parsed.headers
  // info
  // logs

  // method
  request.method = event.request.method.toLowerCase()

  // mime

  // orig
  request.orig = {}
  // params
  request.params = r.params
  // paramsArray
  request.paramsArray = r.paramsArray
  // path
  request.path = url.pathname

  // payload // TODO: use lib
  switch (request.headers['content-type']) {
    case 'application/json': {
      request.payload = JSON.parse(parsed.body)

      break
    }
    default: {
      request.payload = parsed.body
    }
  }
  // plugins
  // pre
  // response
  // preResponses

  // query
  request.query = serializeQuery(url.searchParams)

  // raw
  request.raw = event.request
  request.rawEvent = event

  // route
  // server
  // state
  // url
  request.url = event.request.url
  request._url = url

  return request
}

async function processRoute (r, event) {
  const request = await parseRequest(r, event)

  const route = r.route

  if (route.validate) {
    Array('headers', 'params', 'query', 'payload').forEach(key => {
      if (route.validate[key]) {
        request.orig[key] = request[key]
        const {error, value} = route.validate[key].validate(request[key])
        if (error) {
          throw Boom.badRequest(error)
        }

        request[key] = value
      }
    })
  }

  // TODO: response toolkit

  const out = route.handler.call(route.bind, request, h(route, request))

  return out // will be resolved downstream if async
}

module.exports = (router) => async (event) => {
  try {
    const r = router.route(event.request.method.toLowerCase(), new URL(event.request.url).pathname)

    if (r instanceof Error) {
      throw r
    }

    const res = await processRoute(r, event)

    if (res === undefined || res == null) {
      throw Boom.badImplementation('Response is null or undefined')
    } else if (res instanceof Response) {
      return res
    } else if (res['@h']) {
      return res.build()
    } else if (typeof res === 'object') {
      return new Response(JSON.stringify(res), {
        headers: {'Content-Type': 'application/json'}
      })
    } else if (typeof res === 'string') {
      return new Response(res)
    } else {
      throw Boom.badImplementation('Invalid response')
    }
  } catch (err) {
    if (!err.isBoom) {
      console.error(err)
      err = Boom.badImplementation(err.toString()) // eslint-disable-line no-ex-assign
    }

    console.error(err)

    return new Response(JSON.stringify(err.output.payload), {
      headers: Object.assign(err.output.headers, {'Content-Type': 'application/json'}),
      status: err.output.statusCode
    })
  }
}
