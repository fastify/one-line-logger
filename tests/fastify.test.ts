import { serverFactory, EPOCH, TIME, HTTPMethods } from './helpers'

const oldDateNow = Date.now

const messages: string[] = []
let server = serverFactory(messages)

beforeAll(() => {
  Date.now = () => EPOCH
})

afterAll(() => {
  Date.now = oldDateNow
})

beforeEach(() => {
  // empty messages array
  messages.splice(0, messages.length)

  server = serverFactory(messages)
})

test('should log server started messages', async () => {
  await server.listen({ port: 63995 })

  const messagesExpected = [
    `${TIME} - info - Server listening at http://127.0.0.1:63995\n`,
    `${TIME} - info - Server listening at http://[::1]:63995\n`
  ]
  expect(messages).toEqual(messagesExpected)
  await server.close()
})

test.each([
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD'
] as HTTPMethods[])(
  'should log request and response messages for %p',
  async (method: HTTPMethods) => {
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
    expect(messages).toEqual(messagesExpected)
  }
)

test('should handle user defined log', async () => {
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

  expect(messages).toEqual(messagesExpected)
})
