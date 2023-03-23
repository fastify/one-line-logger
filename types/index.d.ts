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
  export const messageFormatFactory: (colorize: boolean, levels: Record<string, number>) => (log: LogDescriptor, messageKey: string) => string

  export const oneLineLogger: OneLineLogger
  export { oneLineLogger as default}
}

declare function oneLineLogger(...params: Parameters<OneLineLogger>): ReturnType<OneLineLogger>
export = oneLineLogger
