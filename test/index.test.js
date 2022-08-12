'use strict'

const { EPOCH, TIME, MESSAGE_KEY } = require('./helpers')
const { messageFormat } = require('../src')
const { test } = require('tap')

const testCases = [
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

testCases.forEach(([logDescriptor, expectedLog]) => {
  test('format log correctly with different logDescriptor', (t) => {
    const log = messageFormat(logDescriptor, MESSAGE_KEY)

    t.equal(log, expectedLog)
    t.end()
  })
})
