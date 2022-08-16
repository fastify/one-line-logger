'use strict'

const { serverFactory, TIME, unmockTime, mockTime } = require('./helpers')
const tap = require('tap')

const { test } = tap

const messages = []
let server = serverFactory(messages, { colorize: false })

tap.before(() => {
  mockTime()
})

tap.teardown(() => {
  unmockTime()
})

tap.beforeEach(() => {
  // empty messages array
  messages.splice(0, messages.length)

  server = serverFactory(messages)
})

test('should log server started messages', async (t) => {
  await server.listen({ port: 63995 })

  const messagesExpected = [
    `${TIME} - info - Server listening at http://127.0.0.1:63995\n`,
    `${TIME} - info - Server listening at http://[::1]:63995\n`
  ]

  // sort because the order of the messages is not guaranteed
  t.same(messages.sort(), messagesExpected.sort())
  await server.close()
  t.end()
})

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
methods.forEach((method) => {
  test('should log request and response messages for %p', async (t) => {
    const serverMethod = method === 'HEAD' ? 'GET' : method
    server[serverMethod.toLowerCase()]('/path', (_, req) => {
      req.send()
    })

    await server.inject({
      method,
      url: '/path'
    })

    const messagesExpected = [
      `${TIME} - info - ${method} /path - incoming request\n`,
      `${TIME} - info - request completed\n`
    ]

    t.same(messages, messagesExpected)
    t.end()
  })
})

test('should handle user defined log', async (t) => {
  server = serverFactory(messages, { minimumLevel: 'trace' })

  server.get('/a-path-with-user-defined-log', (res, req) => {
    res.log.fatal('a user defined fatal log')
    res.log.error('a user defined error log')
    res.log.warn('a user defined warn log')
    res.log.info('a user defined info log')
    res.log.debug('a user defined debug log')
    res.log.trace('a user defined trace log')

    req.send()
  })

  await server.inject('/a-path-with-user-defined-log')

  const messagesExpected = [
    `${TIME} - info - GET /a-path-with-user-defined-log - incoming request\n`,
    `${TIME} - fatal - a user defined fatal log\n`,
    `${TIME} - error - a user defined error log\n`,
    `${TIME} - warn - a user defined warn log\n`,
    `${TIME} - info - a user defined info log\n`,
    `${TIME} - debug - a user defined debug log\n`,
    `${TIME} - trace - a user defined trace log\n`,
    `${TIME} - info - request completed\n`
  ]

  t.same(messages, messagesExpected)
  t.end()
})
