'use-strict'

const pretty = require('pino-pretty')
const formatDate = require('./lib/formatDate')
const { colorizerFactory } = pretty

const LEVEL_TO_STRING = {
  60: 'fatal',
  50: 'error',
  40: 'warn',
  30: 'info',
  20: 'debug',
  10: 'trace'
}

const messageFormatFactory = (colorize) => {
  const colorizer = colorizerFactory(colorize === true)

  const messageFormat = (log, messageKey) => {
    const time = formatDate(log.time)
    const level = colorizer(LEVEL_TO_STRING[log.level]).toLowerCase()

    const logMessages = [time, level]

    if (log.req) {
      const { method, url } = log.req

      logMessages.push(`${method} ${url}`)
    }

    logMessages.push(colorizer.message(log[messageKey]))

    return logMessages.join(' - ')
  }

  return messageFormat
}

const target = (opts = {}) => {
  const { colorize, ...rest } = opts

  const messageFormat = messageFormatFactory(colorize)

  return pretty({
    messageFormat,
    ignore: 'pid,hostname,time,level',
    hideObject: true,
    colorize: false,
    ...rest
  })
}

module.exports = target
module.exports.messageFormatFactory = messageFormatFactory
