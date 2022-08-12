const { EPOCH, TIME, MESSAGE_KEY } = require('./helpers')
const { messageFormat } = require('../src')

test.each([
  [
    { time: EPOCH, level: 10, [MESSAGE_KEY]: 'basic log' },
    `${TIME} - trace - basic log`
  ],
  [
    {
      time: EPOCH,
      level: 30,
      [MESSAGE_KEY]: 'basic incoming request log',
      req: {
        method: 'GET',
        url: '/path'
      }
    },
    `${TIME} - info - GET /path - basic incoming request log`
  ]
])(
  'format log correctly with different logDescriptors',
  (logDescriptor, expectedLog) => {
    const log = messageFormat(logDescriptor, MESSAGE_KEY)

    expect(log).toEqual(expectedLog)
  }
)
