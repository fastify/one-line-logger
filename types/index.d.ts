import { PinoPretty } from 'pino-pretty'

declare namespace oneLineLogger {
  export interface Request {
    method: string;
    url: string;
  }

  export interface CustomColor {
    [key: number]: string;
  }

  export type LogDescriptor = Record<string, unknown> & {
    time: number;
    level: number;
    colors?: CustomColor;
    req?: Request;
  }

  export interface TimeFormatOptions {
    timeOnly?: boolean;
    customTimeFormat?: string;
  }

  interface BaseOptions extends PinoPretty.PrettyOptions {
    levels?: Record<string, number>;
    colors?: CustomColor;
  }

  export type OneLineLoggerOptions = BaseOptions & (
    | { timeOnly?: boolean; customTimeFormat?: never }
    | { timeOnly?: never; customTimeFormat?: string }
    | { timeOnly?: never; customTimeFormat?: never }
  )

  export const messageFormatFactory: (levels: Record<string, number> | undefined, colors: CustomColor | undefined, colorize: boolean, options?: TimeFormatOptions) => (log: LogDescriptor, messageKey: string) => string

  export const oneLineLogger: (opts?: OneLineLoggerOptions) => PinoPretty.PrettyStream
  export { oneLineLogger as default }
}

declare function oneLineLogger (opts?: oneLineLogger.OneLineLoggerOptions): PinoPretty.PrettyStream
export = oneLineLogger
