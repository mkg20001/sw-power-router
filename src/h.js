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

    bytes: (num) => {
      t.headers['content-length'] = String(num)

      return t
    },
    charset: (charset) => {
      priv.mime.charset = charset

      return t
    },
    code: (code) => {
      t.statusCode = code

      return t
    },
    message: (msg) => {
      priv.statusText = msg

      return t
    },
    compressed: (encoding) => {
      throw new Error('Unsupported')
    },
    created: (uri) => {
      t.statusCode = 201
      t.headers.location = uri

      return t
    },
    etag: (tag, opt) => {
      if (!opt) { opt = {} }

      if (opt.weak) {
        tag = 'W/' + tag
      }

      if (opt.vary && priv.encoding) {
        tag += '-' + priv.encoding
      }

      return t
    },
    header: (name, value, opt) => {
      if (!opt) { opt = {} }
    }
  }

  const priv = {
    mime: mimos.path(request.path)
  }
}

module.exports = (route, request) => {
  const h = {
    response: (data) => createResponseToolkit(route, request, h, data)
  }
}
