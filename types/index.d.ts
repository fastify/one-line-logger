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

  export type OneLineLoggerOptions = PinoPretty.PrettyOptions & {
    levels?: Record<string, number>;
    colors?: CustomColor;
    timeOnly?: boolean;
    customTimeFormat?: string;
  }

  export const messageFormatFactory: (levels: Record<string, number> | undefined, colors: CustomColor | undefined, colorize: boolean, options?: TimeFormatOptions) => (log: LogDescriptor, messageKey: string) => string

  export const oneLineLogger: (opts?: OneLineLoggerOptions) => PinoPretty.PrettyStream
  export { oneLineLogger as default }
}

declare function oneLineLogger (opts?: oneLineLogger.OneLineLoggerOptions): PinoPretty.PrettyStream
export = oneLineLogger
