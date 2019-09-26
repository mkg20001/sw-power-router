# sw-power-router

A powerfull router for your service worker

# What does it do?

It provides a powerful, hapi-component based routing mechanism to your service worker that allows you to run anything pretty easily
- Make APIs as a function and handle status-code based errors easily via boom integration
- Add parameters into the path and let them get handled
- If you're lazy just return a string and the router will handle other things for you

# API

- `Router(self)` returns object
  - `router.route({method, path}, handler)` adds a route
