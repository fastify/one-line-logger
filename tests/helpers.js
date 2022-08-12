const { Writable } = require('readable-stream')
const fastify = require('fastify')
const pino = require('pino')
const target = require('../src')

const TIME = '2017-02-14 20:51:48.0'
const EPOCH = 1487076708000
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
    write (chunk, enc, cb) {
      messages.push(chunk.toString())

      process.nextTick(cb)
    }
  })

  const pino = pinoFactory({ destination, ...opts })

  return fastify({
    logger: pino,
    ...fastifyOpts
  })
}

module.exports = {
  TIME,
  EPOCH,
  MESSAGE_KEY,
  pinoFactory,
  serverFactory
}
