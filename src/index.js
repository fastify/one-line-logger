const pretty = require('pino-pretty')

const LEVEL_TO_STRING = {
  60: 'fatal',
  50: 'error',
  40: 'warn',
  30: 'info',
  20: 'debug',
  10: 'trace'
}

const messageFormat = (log, messageKey) => {
  const date = new Date(log.time)

  const [day, month, year] = date.toLocaleDateString().split('/')
  const time = `${year}-${month}-${day} ${date.toLocaleTimeString()}.${date.getMilliseconds()}`

  const level = LEVEL_TO_STRING[log.level]

  const logMessages = [time, level]

  if (log.req) {
    const { method, url } = log.req

    logMessages.push(`${method} ${url}`)
  }

  logMessages.push(log[messageKey])

  return logMessages.join(' - ')
}

const target = (opts) =>
  pretty({
    messageFormat,
    ignore: 'pid,hostname,time,level',
    hideObject: true,
    ...opts
  })

// module.exports = target;
module.exports = target
module.exports.messageFormat = messageFormat
