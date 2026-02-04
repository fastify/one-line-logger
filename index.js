'use strict'

const pretty = require('pino-pretty')
const { messageFormatFactory } = require('./lib/message-format-factory')

const oneLineLogger = (opts = {}) => {
  const { levels, colors, timeOnly, customTimeFormat, ...rest } = opts

  if (timeOnly && customTimeFormat) {
    throw new Error('Cannot use both timeOnly and customTimeFormat options together')
  }

  const messageFormat = messageFormatFactory(
    levels,
    colors,
    opts.colorize ?? pretty.isColorSupported,
    { timeOnly, customTimeFormat }
  )

  return pretty({
    messageFormat,
    ignore: 'pid,hostname,time,level',
    hideObject: true,
    colorize: false,
    ...rest
  })
}

module.exports = oneLineLogger
module.exports.default = oneLineLogger
module.exports.oneLineLogger = oneLineLogger

module.exports.messageFormatFactory = messageFormatFactory
