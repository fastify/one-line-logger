'use strict'

const benchmark = require('benchmark')
const formatDate = require('../lib/formatDate')

const now = Date.now()

new benchmark.Suite()
  .add('formatDate', function () { formatDate(now) }, { minSamples: 100 })
  .on('cycle', function onCycle (event) { console.log(String(event.target)) })
  .run()
