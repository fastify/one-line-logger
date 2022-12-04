'use strict'

const formatDate = require('../lib/formatDate')
const test = require('tap').test

const timeFormatRE = /^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d\.\d\d\d[+-]\d\d\d\d$/

test('should generate valid formatted time', (t) => {
  const iterations = 1e5
  const maxTimestamp = 2 ** 31 * 1000
  t.plan(iterations)

  for (let i = 0; i < iterations; ++i) {
    const randomInt = Math.floor(Math.random() * maxTimestamp)
    t.ok(timeFormatRE.test(formatDate(randomInt)))
  }
})
