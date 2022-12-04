import { PinoPretty } from 'pino-pretty'

type OneLineLogger = typeof PinoPretty

declare namespace oneLineLogger {
  export interface Request {
    method: string;
    url: string;
  }

  export type LogDescriptor = Record<string, unknown> & {
    time: number;
    level: number;
    req?: Request;
  }
  export const messageFormatFactory: (colorize: boolean) => (log: LogDescriptor, messageKey: string) => string

  export const LEVEL_TO_STRING: {
    60: 'fatal',
    50: 'error',
    40: 'warn',
    30: 'info',
    20: 'debug',
    10: 'trace'
    [key: number]: string;
  }

  export const oneLineLogger: OneLineLogger
  export { oneLineLogger as default}
}

declare function oneLineLogger(...params: Parameters<OneLineLogger>): ReturnType<OneLineLogger>
export = oneLineLogger
