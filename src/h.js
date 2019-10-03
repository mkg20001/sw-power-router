'use strict'

/*

    response.app
    response.events
    response.headers
    response.plugins
    response.settings
        response.settings.passThrough
        response.settings.stringify
        response.settings.ttl
        response.settings.varyEtag
    response.source
    response.statusCode
    response.variety

response.bytes(length)
response.charset(charset)
response.code(statusCode)
response.message(httpMessage)
response.compressed(encoding)
response.created(uri)
response.encoding(encoding)
response.etag(tag, options)
response.header(name, value, options)
response.location(uri)
response.redirect(uri)
response.replacer(method)
response.spaces(count)
response.state(name, value, [options])
response.suffix(suffix)
response.ttl(msec)
response.type(mimeType)
response.unstate(name, [options])
response.vary(header)
response.takeover()
response.temporary(isTemporary)
response.permanent(isPermanent)
response.rewritable(isRewritable)

*/

const Mimos = require('@hapi/mimos')

const mimos = new Mimos()

const {vf} = require('./util')
const Joi = require('@hapi/joi')

function createResponseToolkit (route, request, h, data) {
  const t = {
    app: route.app || {},
    events: null,
    headers: {},
    plugins: null,
    settings: {

    },
    source: data,
    statusCode: 200,
    variety: Buffer.isBuffer(data) ? 'buffer' : 'plain', // TODO: stream

    bytes: vf(Joi.number().integer(), (num) => {
      t.headers['content-length'] = String(num)

      return t
    }),
    charset: vf(Joi.string().required(), (charset) => {
      priv.mime.charset = charset

      return t
    }),
    code: vf(Joi.number().min(100).max(999).required(), (code) => {
      t.statusCode = code

      return t
    }),
    message: vf(Joi.string().required(), (msg) => {
      priv.statusText = msg

      return t
    }),
    compressed: vf(Joi.string().required(), (encoding) => {
      throw new Error('Unsupported')
    }),
    created: vf(Joi.string().required(), (uri) => {
      t.statusCode = 201
      t.headers.location = uri

      return t
    }),
    etag: vf(Joi.string().required(), Joi.object().keys({
      weak: Joi.boolean().default(false),
      vary: Joi.boolean().default(true)
    }), (tag, opt) => {
      if (opt.weak) {
        tag = 'W/' + tag
      }

      if (opt.vary && priv.encoding) {
        tag += '-' + priv.encoding
      }

      t.headers.etag = tag

      return t
    }),
    header: vf(Joi.string().required(), Joi.any().required(), Joi.object().keys({
      append: Joi.boolean().default(false),
      seperator: Joi.string().default(','),
      override: Joi.boolean().default(true),
      duplicate: Joi.boolean().default(true)
    }), (name, value, opt) => {
      // TODO: duplicate

      if (t.headers[name] != null) {
        if (opt.append) {
          t.headers[name] += opt.seperator + value
        } else if (opt.overwrite) {
          t.headers[name] = value
        } else {
          throw new Error('Header value can not be written')
        }
      } else {
        t.headers[name] = value
      }

      return t
    }),
    location: vf(Joi.string().required(), (uri) => {
      t.headers.location = location

      return t
    }),
    redirect: vf(Joi.string().required(), (uri) => {
      t.headers.location = uri
      t.statusCode = 302

      const c = () => {
        if (R.r) {
          return R.p ? 301 : 302
        } else {
          return R.p ? 308 : 307
        }
      }

      const R = priv.redirect = {}

      t.temporary = () => {
        R.p = false

        t.statusCode = c()
        return t
      }

      t.permanent = () => {
        R.p = true

        t.statusCode = c()
        return t
      }

      t.rewritable = () => {
        R.r = true

        t.statusCode = c()
        return t
      }

      return t
    }),
    replacer: (Joi.any().required(), () => {
      throw new Error('TODO')
    }),
    spaces: (Joi.any().required(), () => {
      throw new Error('TODO')
    }),
    state: (Joi.any().required(), () => {
      throw new Error('TODO')
    }),
    suffix: (Joi.any().required(), () => {
      throw new Error('TODO')
    }),
    ttl: (Joi.any().required(), () => {
      throw new Error('TODO')
    }),
    type: (Joi.string().required(), (type) => {
      priv.mime.type = type

      return t
    }),
    unstate: (Joi.any().required(), () => {
      throw new Error('TODO')
    }),
    vary: (Joi.any().required(), () => {
      throw new Error('TODO')
    }),
    takeover: (Joi.any().required(), () => {
      throw new Error('TODO')
    }),

    build: () => {
      t.headers['content-type'] = `${priv.mime.type}; charset=${priv.mime.charset}`

      // TODO: encoding

      return new Response(t.source, {
        headers: t.headers,
        statusText: priv.statusText,
        status: t.statusCode
      })
    },
    '@h': true
  }

  const priv = {
    mime: mimos.path(request.path)
  }

  return t
}

module.exports = (route, request) => {
  const h = {
    response: (data) => createResponseToolkit(route, request, h, data)
  }
}
