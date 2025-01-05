'use strict'

const benchmark = require('benchmark')
const messageFormatFactory = require('../lib/messageFormatFactory')

const colors = {
  60: 'red',
  50: 'red',
  40: 'yellow',
  30: 'green',
  20: 'blue',
  10: 'cyan'
}
const formatMessageColorized = messageFormatFactory(true, colors, true)
const log = {
  time: Date.now(),
  level: 30,
  message: 'oneLineLogger',
  req: {
    method: 'GET',
    url: 'http://localhost'
  }
}

new benchmark.Suite()
  .add('formatMessageColorized', function () { formatMessageColorized(log, 'message') }, { minSamples: 100 })
  .on('cycle', function onCycle (event) { console.log(String(event.target)) })
  .run()
