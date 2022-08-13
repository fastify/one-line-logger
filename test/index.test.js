'use strict'

const { EPOCH, TIME, MESSAGE_KEY, mockTime, unmockTime } = require('./helpers')
const { messageFormatFactory } = require('../src')
const t = require('tap')

const { test } = t

const messageFormat = messageFormatFactory(false)
const messageFormatColorized = messageFormatFactory(true)

t.before(() => {
  mockTime()
})

t.teardown(() => {
  unmockTime()
})

const logDescriptorLogPairs = [
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
]

logDescriptorLogPairs.forEach(([logDescriptor, expectedLog]) => {
  test('format log correctly with different logDescriptor', (t) => {
    const log = messageFormat(logDescriptor, MESSAGE_KEY)

    t.equal(log, expectedLog)
    t.end()
  })
})

const logDescriptorColorizedLogPairs = [
  [
    { time: EPOCH, level: 10, [MESSAGE_KEY]: 'basic log' },
    `${TIME} - \u001B[90mtrace\u001B[39m - \u001B[36mbasic log\u001B[39m`
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
    `${TIME} - \u001B[32minfo\u001B[39m - GET /path - \u001B[36mbasic incoming request log\u001B[39m`
  ]
]
logDescriptorColorizedLogPairs.forEach(([logDescriptor, logColorized]) => {
  test('colorize log correctly with different logDescriptor', (t) => {
    const log = messageFormatColorized(logDescriptor, MESSAGE_KEY)

    t.equal(log, logColorized)
    t.end()
  })
})
