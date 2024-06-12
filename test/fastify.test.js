'use strict'

const { serverFactory, TIME, unmockTime, mockTime } = require('./helpers')
const pretty = require('pino-pretty')
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
  t.beforeEach(async () => {
    await server.listen({ port: 63995 })
    t.teardown(async () => await server.close())
  })

  t.test('colors supported in TTY', { skip: !pretty.isColorSupported }, (t) => {
    const messagesExpected = [
      `${TIME} - \x1B[32minfo\x1B[39m - \x1B[36mServer listening at http://127.0.0.1:63995\x1B[39m\n`,
      `${TIME} - \x1B[32minfo\x1B[39m - \x1B[36mServer listening at http://[::1]:63995\x1B[39m\n`
    ]

    // sort because the order of the messages is not guaranteed
    t.same(messages.sort(), messagesExpected.sort())
    t.end()
  })

  t.test(
    'colors not supported in TTY',
    { skip: pretty.isColorSupported },
    (t) => {
      const messagesExpected = [
        `${TIME} - info - Server listening at http://127.0.0.1:63995\n`,
        `${TIME} - info - Server listening at http://[::1]:63995\n`
      ]

      // sort because the order of the messages is not guaranteed
      t.same(messages.sort(), messagesExpected.sort())
      t.end()
    }
  )
})

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
methods.forEach((method) => {
  test('should log request and response messages for %p', async (t) => {
    t.beforeEach(async () => {
      const serverMethod = method === 'HEAD' ? 'GET' : method
      server[serverMethod.toLowerCase()]('/path', (_, req) => {
        req.send()
      })

      await server.inject({
        method,
        url: '/path'
      })
    })

    t.test(
      'colors supported in TTY',
      { skip: !pretty.isColorSupported },
      (t) => {
        const messagesExpected = [
          `${TIME} - \x1B[32minfo\x1B[39m - ${method} /path - \x1B[36mincoming request\x1B[39m\n`,
          `${TIME} - \x1B[32minfo\x1B[39m - \x1B[36mrequest completed\x1B[39m\n`
        ]
        t.same(messages, messagesExpected)
        t.end()
      }
    )

    t.test(
      'colors not supported in TTY',
      { skip: pretty.isColorSupported },
      (t) => {
        const messagesExpected = [
          `${TIME} - info - ${method} /path - incoming request\n`,
          `${TIME} - info - request completed\n`
        ]
        t.same(messages, messagesExpected)
        t.end()
      }
    )
  })
})

test('should handle user defined log', async (t) => {
  t.beforeEach(async () => {
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
  })

  t.test('colors supported in TTY', { skip: !pretty.isColorSupported }, (t) => {
    const messagesExpected = [
      `${TIME} - \x1B[32minfo\x1B[39m - GET /a-path-with-user-defined-log - \x1B[36mincoming request\x1B[39m\n`,
      `${TIME} - \x1B[41mfatal\x1B[49m - \x1B[36ma user defined fatal log\x1B[39m\n`,
      `${TIME} - \x1B[31merror\x1B[39m - \x1B[36ma user defined error log\x1B[39m\n`,
      `${TIME} - \x1B[33mwarn\x1B[39m - \x1B[36ma user defined warn log\x1B[39m\n`,
      `${TIME} - \x1B[32minfo\x1B[39m - \x1B[36ma user defined info log\x1B[39m\n`,
      `${TIME} - \x1B[34mdebug\x1B[39m - \x1B[36ma user defined debug log\x1B[39m\n`,
      `${TIME} - \x1B[90mtrace\x1B[39m - \x1B[36ma user defined trace log\x1B[39m\n`,
      `${TIME} - \x1B[32minfo\x1B[39m - \x1B[36mrequest completed\x1B[39m\n`
    ]
    t.same(messages, messagesExpected)
    t.end()
  })

  t.test(
    'colors not supported in TTY',
    { skip: pretty.isColorSupported },
    (t) => {
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
    }
  )
})
