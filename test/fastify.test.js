'use strict'

const { before, beforeEach, after, test, describe, afterEach } = require('node:test')
const pretty = require('pino-pretty')
const { serverFactory, TIME, unmockTime, mockTime } = require('./helpers')

before(() => {
  mockTime()
})

after(() => {
  unmockTime()
})

describe('should log server started messages', () => {
  let messages
  let server

  beforeEach(async () => {
    server = serverFactory(messages = [])
    await server.listen({ host: '127.0.0.1', port: 63995 })
  })
  afterEach(async () => { await server.close() })

  test('colors supported in TTY', { skip: !pretty.isColorSupported }, (t) => {
    // sort because the order of the messages is not guaranteed
    t.assert.deepStrictEqual(messages[0], `${TIME} - \x1B[32minfo\x1B[39m - \x1B[36mServer listening at http://127.0.0.1:63995\x1B[39m\n`)
  })

  test(
    'colors not supported in TTY',
    { skip: pretty.isColorSupported },
    (t) => {
      const messagesExpected = [
        `${TIME} - info - Server listening at http://127.0.0.1:63995\n`,
        `${TIME} - info - Server listening at http://[::1]:63995\n`
      ]

      // sort because the order of the messages is not guaranteed
      t.assert.deepStrictEqual(messages.sort(), messagesExpected.sort())
    }
  )
});

['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].forEach((method) => {
  describe(`should log request and response messages for ${method}`, () => {
    let messages
    let server

    beforeEach(async () => {
      server = serverFactory(messages = [])

      const serverMethod = method === 'HEAD' ? 'GET' : method
      server[serverMethod.toLowerCase()]('/path', (_, req) => {
        req.send()
      })

      await server.inject({
        method,
        url: '/path'
      })
    })

    test(
      'colors supported in TTY',
      { skip: !pretty.isColorSupported },
      (t) => {
        const messagesExpected = [
          `${TIME} - \x1B[32minfo\x1B[39m - req-1 - ${method} /path - \x1B[36mincoming request\x1B[39m\n`,
          `${TIME} - \x1B[32minfo\x1B[39m - req-1 - \x1B[36mrequest completed\x1B[39m\n`
        ]
        t.assert.deepEqual(messages, messagesExpected)
      }
    )

    test(
      'colors not supported in TTY',
      { skip: pretty.isColorSupported },
      (t) => {
        const messagesExpected = [
          `${TIME} - info - req-1 - ${method} /path - incoming request\n`,
          `${TIME} - info - req-1 - request completed\n`
        ]
        t.assert.deepEqual(messages, messagesExpected)
      }
    )
  })
})

describe('should handle user defined log', () => {
  let messages
  let server
  beforeEach(async () => {
    server = serverFactory(messages = [], { minimumLevel: 'trace' })

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

  test('colors supported in TTY', { skip: !pretty.isColorSupported }, (t) => {
    const messagesExpected = [
      `${TIME} - \x1B[32minfo\x1B[39m - req-1 - GET /a-path-with-user-defined-log - \x1B[36mincoming request\x1B[39m\n`,
      `${TIME} - \x1B[41mfatal\x1B[49m - req-1 - \x1B[36ma user defined fatal log\x1B[39m\n`,
      `${TIME} - \x1B[31merror\x1B[39m - req-1 - \x1B[36ma user defined error log\x1B[39m\n`,
      `${TIME} - \x1B[33mwarn\x1B[39m - req-1 - \x1B[36ma user defined warn log\x1B[39m\n`,
      `${TIME} - \x1B[32minfo\x1B[39m - req-1 - \x1B[36ma user defined info log\x1B[39m\n`,
      `${TIME} - \x1B[34mdebug\x1B[39m - req-1 - \x1B[36ma user defined debug log\x1B[39m\n`,
      `${TIME} - \x1B[90mtrace\x1B[39m - req-1 - \x1B[36ma user defined trace log\x1B[39m\n`,
      `${TIME} - \x1B[32minfo\x1B[39m - req-1 - \x1B[36mrequest completed\x1B[39m\n`
    ]
    t.assert.deepStrictEqual(messages, messagesExpected)
  })

  test(
    'colors not supported in TTY',
    { skip: pretty.isColorSupported },
    (t) => {
      const messagesExpected = [
        `${TIME} - info - req-1 - GET /a-path-with-user-defined-log - incoming request\n`,
        `${TIME} - fatal - req-1 - a user defined fatal log\n`,
        `${TIME} - error - req-1 - a user defined error log\n`,
        `${TIME} - warn - req-1 - a user defined warn log\n`,
        `${TIME} - info - req-1 - a user defined info log\n`,
        `${TIME} - debug - req-1 - a user defined debug log\n`,
        `${TIME} - trace - req-1 - a user defined trace log\n`,
        `${TIME} - info - req-1 - request completed\n`
      ]
      t.assert.deepStrictEqual(messages, messagesExpected)
    }
  )
})
