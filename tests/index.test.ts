import { LogDescriptor, messageFormat } from '../src'
import { EPOCH, TIME, MESSAGE_KEY } from './helpers'

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
  (logDescriptor: LogDescriptor, expectedLog: string) => {
    const log = messageFormat(logDescriptor, MESSAGE_KEY)

    expect(log).toEqual(expectedLog)
  }
)
