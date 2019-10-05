'use strict'

// credit https://a.kabachnik.info/offline-post-requests-via-service-worker-and-indexeddb.html

/**
 * Serializes a Request into a plain JS object.
 *
 * @param request
 * @returns Promise
 */
function serializeRequest (request) {
  let serialized = {
    url: request.url,
    headers: serializeHeaders(request.headers),
    method: request.method,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer
  }

  // Only if method is not `GET` or `HEAD` is the request allowed to have body.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return request.clone().text().then(function (body) {
      serialized.body = body
      return Promise.resolve(serialized)
    })
  } else {
    return Promise.resolve(serialized)
  }
}

/**
 * Serializes a Response into a plain JS object
 *
 * @param response
 * @returns Promise
 */
function serializeResponse (response) {
  let serialized = {
    headers: serializeHeaders(response.headers),
    status: response.status,
    statusText: response.statusText
  }

  return response.clone().text().then(function (body) {
    serialized.body = body
    return Promise.resolve(serialized)
  })
}

/**
 * Serializes headers into a plain JS object
 *
 * @param headers
 * @returns object
 */
function serializeHeaders (headers) {
  let serialized = {}
  // `for(... of ...)` is ES6 notation but current browsers supporting SW, support this
  // notation as well and this is the only way of retrieving all the headers.
  for (let entry of headers.entries()) {
    if (serialized[entry[0]] == null) {
      serialized[entry[0]] = entry[1]
    } else if (Array.isArray(serialized[entry[0]])) {
      serialized[entry[0]].push(entry[1])
    } else {
      serialized[entry[0]] = [serialized[entry[0]], entry[1]]
    }
  }
  return serialized
}

/**
 * Creates a Response from it's serialized version
 *
 * @param data
 * @returns Promise
 */
function deserializeResponse (data) {
  return Promise.resolve(new Response(data.body, data))
}

/**
 * Creates a Request from it's serialized version
 *
 * @param data
 * @returns Promise
 */
function deserializeRequest (data) {
  return Promise.resolve(new Request(data.body, data))
}

module.exports = {
  serializeHeaders,
  serializeQuery: serializeHeaders,
  serializeRequest,
  serializeResponse,
  deserializeResponse,
  deserializeRequest
}
