'use-strict'

const pretty = require('pino-pretty')
const messageFormatFactory = require('./lib/messageFormatFactory')

const oneLineLogger = (opts = {}) => {
  const { colorize, levels, ...rest } = opts

  const messageFormat = messageFormatFactory(colorize, levels)

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
