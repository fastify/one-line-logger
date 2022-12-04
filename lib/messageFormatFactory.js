'use-strict'
const formatDate = require('./formatDate')
const colorizerFactory = require('pino-pretty').colorizerFactory

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

  const levelLookUp = {}
  const colorizeMessage = colorizer.message

  const messageFormat = (log, messageKey) => {
    const time = formatDate(log.time)
    const level = levelLookUp[log.level] || (levelLookUp[log.level] = colorizer(LEVEL_TO_STRING[log.level]).toLowerCase())

    return log.req
      ? `${time} - ${level} - ${log.req.method} ${log.req.url} - ${colorizeMessage(log[messageKey])}`
      : `${time} - ${level} - ${colorizeMessage(log[messageKey])}`
  }

  return messageFormat
}

module.exports = messageFormatFactory
module.exports.messageFormatFactory = messageFormatFactory
module.exports.LEVEL_TO_STRING = LEVEL_TO_STRING
