'use strict'

const { Writable } = require('readable-stream')
const fastify = require('fastify')
const pino = require('pino')
const target = require('..')

const HOUR = 20
const TIME = `2017-02-14 ${HOUR}:51:48.000+0800`
const EPOCH = 1487076708000
const TIMEZONE_OFFSET = -8 * 60
const MESSAGE_KEY = 'message'

const pinoFactory = (opts) => {
  const level = opts.minimumLevel || 'info'

  return pino(
    { level },
    target({
      colorize: false,
      ...opts
    })
  )
}

const serverFactory = (messages, opts, fastifyOpts) => {
  const destination = new Writable({
    write (chunk, _enc, cb) {
      messages.push(chunk.toString())

      process.nextTick(cb)
    }
  })

  const pinoLogger = pinoFactory({ destination, ...opts })

  return fastify({
    logger: pinoLogger,
    ...fastifyOpts
  })
}

const dateOriginalNow = Date.now
const dateGetTimezoneOffset = Date.prototype.getTimezoneOffset
const dateOriginalGetHours = Date.prototype.getHours

const mockTime = () => {
  Date.now = () => EPOCH

  // eslint-disable-next-line
  Date.prototype.getTimezoneOffset = () => TIMEZONE_OFFSET;

  // eslint-disable-next-line
  Date.prototype.getHours = () => HOUR;
}

const unmockTime = () => {
  Date.now = dateOriginalNow
  // eslint-disable-next-line
  Date.prototype.getTimezoneOffset = dateGetTimezoneOffset
  // eslint-disable-next-line
  Date.prototype.getHours = dateOriginalGetHours
}

module.exports = {
  TIME,
  EPOCH,
  MESSAGE_KEY,
  TIMEZONE_OFFSET,
  pinoFactory,
  serverFactory,
  mockTime,
  unmockTime
}
