'use strict'

const Call = require('@hapi/call')
const Boom = require('@hapi/boom')

const Request = require('./request')
const Route = require('./route')

// NOTE: call takes route methods only in lowercase
// TODO: add @hapi/subtext payload parsing
// TODO: add h() response creation + full h() api compat
// TODO: copy some more of hapis stuff

module.exports = (self) => {
  const router = new Call.Router()

  const _request = Request(router)
  const _route = Route(router)

  self.addEventListener('fetch', (event) => {
    if (event.request.url.includes(self.location.origin)) { // if we are in SW scope
      event.respondWith(_request(event))
    } else {
      return event.respondWith(fetch(event.request))
    }
  })

  return {
    route: _route
  }
}
