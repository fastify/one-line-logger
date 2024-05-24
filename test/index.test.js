'use strict'

const { EPOCH, TIME, MESSAGE_KEY, mockTime, unmockTime } = require('./helpers')
const target = require('..')
const tap = require('tap')
const pretty = require('pino-pretty')
const { messageFormatFactory } = target

const { test } = tap

const messageFormat = messageFormatFactory(
  undefined,
  undefined,
  pretty.isColorSupported
)

tap.before(() => {
  mockTime()
})

tap.teardown(() => {
  unmockTime()
})

test('able to instantiate target without arguments', (t) => {
  target()
  t.pass()
  t.end()
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

  await logDescriptorLogPairs.forEach(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.equal(log, expectedLogColored)
          t.end()
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.equal(log, expectedLogUncolored)
          t.end()
        }
      )
    }
  )
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

  await logDescriptorColorizedLogPairs.forEach(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.equal(log, expectedLogColored)
          t.end()
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.equal(log, expectedLogUncolored)
          t.end()
        }
      )
    }
  )
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

  await logCustomLevelsLogPairs.forEach(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.equal(log, expectedLogColored)
          t.end()
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.equal(log, expectedLogUncolored)
          t.end()
        }
      )
    }
  )
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

  await logCustomLevelsLogPairs.forEach(
    async ([logDescriptor, expectedLogColored, expectedLogUncolored]) => {
      await t.test(
        'colors supported in TTY',
        { skip: !pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.equal(log, expectedLogColored)
          t.end()
        }
      )

      await t.test(
        'colors not supported in TTY',
        { skip: pretty.isColorSupported },
        (t) => {
          const log = messageFormat(logDescriptor, MESSAGE_KEY)
          t.equal(log, expectedLogUncolored)
          t.end()
        }
      )
    }
  )
})
