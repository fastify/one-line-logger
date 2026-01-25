'use strict'

const { test } = require('node:test')
const { formatDate } = require('../lib/format-date')

const timeFormatRE = /^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d\.\d\d\d[+-]\d\d\d\d$/
const timeOnlyFormatRE = /^\d\d:\d\d:\d\d\.\d\d\d$/

test('should generate valid formatted time', (t) => {
  const iterations = 1e5
  const maxTimestamp = 2 ** 31 * 1000
  t.plan(iterations)

  for (let i = 0; i < iterations; ++i) {
    const randomInt = Math.floor(Math.random() * maxTimestamp)
    t.assert.ok(timeFormatRE.test(formatDate(randomInt)))
  }
})

test('should generate time-only format when timeOnly option is true', (t) => {
  const iterations = 1e5
  const maxTimestamp = 2 ** 31 * 1000
  t.plan(iterations)

  for (let i = 0; i < iterations; ++i) {
    const randomInt = Math.floor(Math.random() * maxTimestamp)
    t.assert.ok(timeOnlyFormatRE.test(formatDate(randomInt, { timeOnly: true })))
  }
})

test('should generate custom format when customTimeFormat option is provided', (t) => {
  const timestamp = 1660177682194 // 2022-08-11 01:08:02.194 UTC
  const result = formatDate(timestamp, { customTimeFormat: 'yyyy-mm-dd' })
  t.assert.strictEqual(result, '2022-08-11')
})

test('customTimeFormat should take precedence over timeOnly', (t) => {
  const timestamp = 1660177682194
  const result = formatDate(timestamp, { customTimeFormat: 'HH:MM', timeOnly: true })
  // customTimeFormat should be used, not timeOnly
  t.assert.match(result, /^\d\d:\d\d$/)
})
