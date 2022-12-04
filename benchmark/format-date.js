'use strict'

const benchmark = require('benchmark')
const dateformat = require('dateformat')
const formatDate = require('../lib/formatDate')

const now = Date.now()

new benchmark.Suite()
  .add('dateformat', function () { dateformat(now, 'yyyy-mm-dd HH:MM:ss.lo') }, { minSamples: 100 })
  .add('formatDate', function () { formatDate(now) }, { minSamples: 100 })
  .on('cycle', function onCycle (event) { console.log(String(event.target)) })
  .run()
