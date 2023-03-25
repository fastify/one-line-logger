'use-strict'
const formatDate = require('./formatDate')
const colorizerFactory = require('pino-pretty').colorizerFactory

const messageFormatFactory = (colorize, levels) => {
  const colorizer = colorizerFactory(colorize === true)

  const levelLookUp = {
    60: colorizer('fatal').toLowerCase(),
    50: colorizer('error').toLowerCase(),
    40: colorizer('warn').toLowerCase(),
    30: colorizer('info').toLowerCase(),
    20: colorizer('debug').toLowerCase(),
    10: colorizer('trace').toLowerCase()
  }

  const shouldAddCustomLevels = !!levels
  if (shouldAddCustomLevels) {
    Object.entries(levels).forEach(([name, level]) => {
      const customLevels = { [level]: name }
      const customLevelNames = { [name]: level }
      levelLookUp[level] = colorizer(name, { customLevelNames, customLevels }).toLowerCase()
    })
  }

  const colorizeMessage = colorizer.message

  const messageFormat = (log, messageKey) => {
    const time = formatDate(log.time)
    const level = levelLookUp[log.level]

    return log.req
      ? `${time} - ${level} - ${log.req.method} ${log.req.url} - ${colorizeMessage(log[messageKey])}`
      : `${time} - ${level} - ${colorizeMessage(log[messageKey])}`
  }

  return messageFormat
}

module.exports = messageFormatFactory
