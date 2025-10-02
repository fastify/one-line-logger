'use strict'

const { Bench } = require('tinybench')
const messageFormatFactory = require('../lib/message-format-factory')

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

const benchmark = new Bench()

benchmark.add('formatMessageColorized', function () { formatMessageColorized(log, 'message') })

benchmark.run().then(() => {
  console.table(benchmark.table())
})
