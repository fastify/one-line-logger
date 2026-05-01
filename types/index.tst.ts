import pretty from 'pino-pretty'
import { expect } from 'tstyche'
import oneLineLogger, {
  CustomColor,
  LogDescriptor,
  Request,
  TimeFormatOptions,
  OneLineLoggerOptions,
  messageFormatFactory,
  oneLineLogger as oneLineLoggerNamed
} from '.'

expect<Request['method']>().type.toBe<string>()
expect<Request['url']>().type.toBe<string>()

// Test LogDescriptor interface
expect<LogDescriptor['level']>().type.toBe<number>()
expect<LogDescriptor['time']>().type.toBe<number>()
expect<LogDescriptor['req']>().type.toBe<Request | undefined>()

// Test messageFormatFactory
expect(messageFormatFactory).type.toBe<(
  levels: Record<string, number> | undefined,
  colors: CustomColor | undefined,
  colorize: boolean,
  options?: TimeFormatOptions
) => (log: LogDescriptor, messageKey: string) => string>()

// Test Export Named e Default
expect(oneLineLoggerNamed).type.toBe(oneLineLogger)
expect(oneLineLogger).type.toBeAssignableTo<(opts?: OneLineLoggerOptions) => pretty.PrettyStream>()

// Test timeOnly option
const loggerTimeOnly = oneLineLogger({ timeOnly: true })
expect(loggerTimeOnly).type.toBeAssignableTo<pretty.PrettyStream>()

// Test customTimeFormat option
const loggerCustomFormat = oneLineLogger({ customTimeFormat: 'HH:MM:ss' })
expect(loggerCustomFormat).type.toBeAssignableTo<pretty.PrettyStream>()

// Test that both options together is a type error
expect<OneLineLoggerOptions>().type.not.toBeAssignableFrom({
  timeOnly: true,
  customTimeFormat: 'yyyy-mm-dd'
})
