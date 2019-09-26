'use strict'

const Call = require('@hapi/call')
const Boom = require('@hapi/boom')
const Handler = require('./handleRequest')

// NOTE: call takes route methods only in lowercase
// TODO: add @hapi/subtext payload parsing
// TODO: add h() response creation + full h() api compat
// TODO: copy some more of hapis stuff

module.exports = (self) => {
  const router = new Call.Router()
  const state = {app: {}}

  const handler = Handler(router, state)

  self.addEventListener('fetch', (event) => {
    if (event.request.url.includes(self.location.origin)) { // if we are in SW scope
      event.respondWith(handler(event, state))
    } else {
      return event.respondWith(fetch(event.request))
    }
  })

  return {
    route: ({method, path}, handler) => router.add({ method: method.toLowerCase(), path }, {
      handler,
      method,
      path
    })
  }
}
