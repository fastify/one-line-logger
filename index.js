'use strict'

const pretty = require('pino-pretty')
const messageFormatFactory = require('./lib/messageFormatFactory')

const oneLineLogger = (opts = {}) => {
  const { levels, colors, ...rest } = opts

  const messageFormat = messageFormatFactory(
    levels,
    colors,
    opts.colorize ?? pretty.isColorSupported
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
