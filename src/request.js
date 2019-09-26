'use strict'

const Boom = require('@hapi/boom')

function parseRequest (r, event) {
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
  const request = Object.assign({}, event.request)
  const route = r.route

  const url = new URL(event.request.url)

  // app
  request.app = route.app

  // auth
  // events
  // headers: native
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

  // payload: TODO
  // plugins
  // pre
  // response
  // preResponses
  // query

  // raw
  request.raw = event.request

  // route
  // server
  // state
  // url: native

  return request
}

function processRoute (r, event) {
  const request = parseRequest(r, event)

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

  const out = route.handler.call(route.bind, request)

  return out // will be resolved downstream if async
}

module.exports = (router) => async (event) => {
  try {
    const r = router.route(event.request.method.toLowerCase(), new URL(event.request.url).pathname)

    if (r instanceof Error) {
      throw r
    }

    const res = await processRoute(r, event)

    if (res instanceof Response) {
      return res
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
      err = Boom.badImplementation(err.toString()) // eslint-disable-line no-ex-assign
    }

    console.error(err)

    return new Response(JSON.stringify(err.output.payload), {
      headers: Object.assign(err.output.headers, {'Content-Type': 'application/json'}),
      status: err.output.statusCode
    })
  }
}
