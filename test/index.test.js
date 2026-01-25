'use strict'

const { before, after, test } = require('node:test')
const pretty = require('pino-pretty')
const { messageFormatFactory, oneLineLogger } = require('..')
const { EPOCH, TIME, TIME_ONLY, MESSAGE_KEY, mockTime, unmockTime } = require('./helpers')

const messageFormat = messageFormatFactory(
  undefined,
  undefined,
  pretty.isColorSupported
)

before(() => {
  mockTime()
})

after(() => {
  unmockTime()
})

test('able to instantiate oneLineLogger without arguments', () => {
  oneLineLogger()
})

test('format log correctly with different logDescriptor', async (t) => {
  const logDescriptorLogPairs = [
    [
      { time: EPOCH, level: 10, [MESSAGE_KEY]: 'basic log' },
      `${TIME} - \x1B[90mtrace\x1B[39m - \x1B[36mbasic log\x1B[39m`,
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
      `${TIME} - \x1B[32minfo\x1B[39m - GET /path - \x1B[36mbasic incoming request log\x1B[39m`,
      `${TIME} - info - GET /path - basic incoming request log`
    ]
  ]

  await Promise.all(logDescriptorLogPairs.map(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogColored)
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogUncolored)
        }
      )
    }
  ))
})

test('colorize log correctly with different logDescriptor', async (t) => {
  const logDescriptorColorizedLogPairs = [
    [
      { time: EPOCH, level: 10, [MESSAGE_KEY]: 'basic log' },
      `${TIME} - \u001B[90mtrace\u001B[39m - \u001B[36mbasic log\u001B[39m`,
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
      `${TIME} - \u001B[32minfo\u001B[39m - GET /path - \u001B[36mbasic incoming request log\u001B[39m`,
      `${TIME} - info - GET /path - basic incoming request log`
    ]
  ]

  await Promise.all(logDescriptorColorizedLogPairs.map(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogColored)
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogUncolored)
        }
      )
    }
  ))
})

test('format log correctly with custom levels', async (t) => {
  const levels = {
    foo: 35,
    bar: 45
  }
  const messageFormat = messageFormatFactory(
    levels,
    undefined,
    pretty.isColorSupported
  )

  const logCustomLevelsLogPairs = [
    [
      { time: EPOCH, level: 35, [MESSAGE_KEY]: 'basic foo log' },
      `${TIME} - \u001b[37mfoo\u001b[39m - \u001B[36mbasic foo log\u001B[39m`,
      `${TIME} - foo - basic foo log`
    ],
    [
      {
        time: EPOCH,
        level: 45,
        [MESSAGE_KEY]: 'basic incoming request bar log',
        req: {
          method: 'GET',
          url: '/bar'
        }
      },
      `${TIME} - \u001b[37mbar\u001b[39m - GET /bar - \u001B[36mbasic incoming request bar log\u001B[39m`,
      `${TIME} - bar - GET /bar - basic incoming request bar log`
    ]
  ]

  await Promise.all(logCustomLevelsLogPairs.map(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogColored)
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogUncolored)
        }
      )
    }
  ))
})

test('format log correctly with custom colors per level', async (t) => {
  const levels = {
    foo: 35,
    bar: 45
  }
  const messageFormat = messageFormatFactory(
    levels,
    {
      35: 'bgCyanBright',
      45: 'yellow'
    },
    pretty.isColorSupported
  )

  const logCustomLevelsLogPairs = [
    [
      { time: EPOCH, level: 35, [MESSAGE_KEY]: 'basic foo log' },
      `${TIME} - \u001B[106mfoo\u001B[49m - \u001B[36mbasic foo log\u001B[39m`,
      `${TIME} - foo - basic foo log`
    ],
    [
      {
        time: EPOCH,
        level: 45,
        [MESSAGE_KEY]: 'basic incoming request bar log',
        req: {
          method: 'GET',
          url: '/bar'
        }
      },
      `${TIME} - \u001B[33mbar\u001B[39m - GET /bar - \u001B[36mbasic incoming request bar log\u001B[39m`,
      `${TIME} - bar - GET /bar - basic incoming request bar log`
    ]
  ]

  await Promise.all(logCustomLevelsLogPairs.map(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogColored)
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogUncolored)
        }
      )
    }
  ))
})

test('format log correctly with reqId', async (t) => {
  const logDescriptorLogPairs = [
    [
      { time: EPOCH, level: 30, reqId: 'req-1', [MESSAGE_KEY]: 'log with reqId' },
      `${TIME} - \x1B[32minfo\x1B[39m - req-1 - \x1B[36mlog with reqId\x1B[39m`,
      `${TIME} - info - req-1 - log with reqId`
    ],
    [
      {
        time: EPOCH,
        level: 30,
        reqId: 'req-2',
        [MESSAGE_KEY]: 'incoming request with reqId',
        req: {
          method: 'POST',
          url: '/api/users'
        }
      },
      `${TIME} - \x1B[32minfo\x1B[39m - req-2 - POST /api/users - \x1B[36mincoming request with reqId\x1B[39m`,
      `${TIME} - info - req-2 - POST /api/users - incoming request with reqId`
    ]
  ]

  await Promise.all(logDescriptorLogPairs.map(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogColored)
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogUncolored)
        }
      )
    }
  ))
})

test('format log correctly with timeOnly option', async (t) => {
  const messageFormatTimeOnly = messageFormatFactory(
    undefined,
    undefined,
    pretty.isColorSupported,
    { timeOnly: true }
  )

  const logDescriptorLogPairs = [
    [
      { time: EPOCH, level: 30, [MESSAGE_KEY]: 'basic log' },
      `${TIME_ONLY} - \x1B[32minfo\x1B[39m - \x1B[36mbasic log\x1B[39m`,
      `${TIME_ONLY} - info - basic log`
    ],
    [
      {
        time: EPOCH,
        level: 30,
        [MESSAGE_KEY]: 'incoming request log',
        req: {
          method: 'GET',
          url: '/path'
        }
      },
      `${TIME_ONLY} - \x1B[32minfo\x1B[39m - GET /path - \x1B[36mincoming request log\x1B[39m`,
      `${TIME_ONLY} - info - GET /path - incoming request log`
    ]
  ]

  await Promise.all(logDescriptorLogPairs.map(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormatTimeOnly(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogColored)
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormatTimeOnly(logDescriptor, MESSAGE_KEY)
          t.assert.strictEqual(log, expectedLogUncolored)
        }
      )
    }
  ))
})

test('format log correctly with customTimeFormat option', async (t) => {
  const messageFormatCustom = messageFormatFactory(
    undefined,
    undefined,
    false,
    { customTimeFormat: 'HH:MM:ss' }
  )

  const logDescriptor = { time: EPOCH, level: 30, [MESSAGE_KEY]: 'basic log' }
  const log = messageFormatCustom(logDescriptor, MESSAGE_KEY)

  // Should match pattern HH:MM:ss - info - basic log
  t.assert.match(log, /^\d\d:\d\d:\d\d - info - basic log$/)
})

test('oneLineLogger with timeOnly option', () => {
  oneLineLogger({ timeOnly: true })
})

test('oneLineLogger with customTimeFormat option', () => {
  oneLineLogger({ customTimeFormat: 'HH:MM:ss' })
})
