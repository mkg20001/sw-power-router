'use strict'

module.exports = (router) => (options) => {
  // TODO: write schema, validate and push directly instead

  /*

    route.options.app: TODO (any, copy)
    route.options.auth: USELESS
        route.options.auth.access
        route.options.auth.access.scope
        route.options.auth.access.entity
        route.options.auth.mode
        route.options.auth.payload
        route.options.auth.strategies
        route.options.auth.strategy
    route.options.bind: TODO
    route.options.cache: TODO2
    route.options.compression: USELESS
    route.options.cors: TODO2
    route.options.description: TODO
    route.options.ext: CONSIDERING
    route.options.files: USELESS
    route.options.handler: REQUIRED
    route.options.id: CONSIDERING
    route.options.isInternal: USELESS
    route.options.json: TODO2
    route.options.jsonp: CONSIDERING
    route.options.log: CONSIDERING
    route.options.notes: TODO (str or str[], copy)
    route.options.payload: CONSIDERING
        route.options.payload.allow
        route.options.payload.compression
        route.options.payload.defaultContentType
        route.options.payload.failAction
        route.options.payload.maxBytes
        route.options.payload.multipart
        route.options.payload.output
        route.options.payload.override
        route.options.payload.parse
        route.options.payload.protoAction
        route.options.payload.timeout
        route.options.payload.uploads
    route.options.plugins: CONSIDERING
    route.options.pre: CONSIDERING
    route.options.response: TODO
        route.options.response.disconnectStatusCode
        route.options.response.emptyStatusCode
        route.options.response.failAction
        route.options.response.modify
        route.options.response.options
        route.options.response.ranges
        route.options.response.sample
        route.options.response.schema
        route.options.response.status
    route.options.rules: WTF
    route.options.security: CONSIDERING
    route.options.state: CONSIDERING
    route.options.tags: TODO (str[], copy)
    route.options.timeout: CONSIDERING
        route.options.timeout.server
        route.options.timeout.socket
    route.options.validate: TODO
        route.options.validate.errorFields
        route.options.validate.failAction
        route.options.validate.headers
        route.options.validate.options
        route.options.validate.params
        route.options.validate.payload
        route.options.validate.query
        route.options.validate.state

  */

  const route = {}

  // route.options.app
  route.app = options.app
  // route.options.bind
  route.bind = options.bind
  // route.options.cache: TODO2
  // route.options.cors: TODO2
  // route.options.description
  route.description = options.description
  // route.options.handler
  route.handler = options.handler
  // route.options.json
  route.json = options.json
  // route.options.notes: TODO (str or str[], copy)
  route.notes = options.notes
  // route.options.response: TODO2
  // route.options.tags
  route.tags = options.tags
  // route.options.validate: TODO
  route.validate = options.validate

  return router.add({
    method: options.method.toLowerCase(),
    path: options.path
  }, route)
}
