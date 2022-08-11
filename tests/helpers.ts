import target from '../src'
import pino from 'pino'
import { Writable } from 'readable-stream'
import pretty from 'pino-pretty'
import fastify, { FastifyServerOptions } from 'fastify'

export const TIME = '20:51:48.0'
export const EPOCH = 1487076708000
export const MESSAGE_KEY = 'message'

export type HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS'

export const pinoFactory = (opts: pretty.PrettyOptions) => {
  const level = opts.minimumLevel || 'info'

  return pino(
    { level },
    target({
      colorize: false,
      ...opts
    })
  )
}

export const serverFactory = (
  messages: string[],
  opts: pretty.PrettyOptions = {},
  fastifyOpts: FastifyServerOptions = {}
) => {
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
