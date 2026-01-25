import pretty from 'pino-pretty'
import { expectType, expectAssignable } from 'tsd'
import oneLineLogger, {
  CustomColor,
  LogDescriptor,
  Request,
  TimeFormatOptions,
  OneLineLoggerOptions,
  messageFormatFactory,
  oneLineLogger as oneLineLoggerNamed
} from '..'

expectType<string>(({} as Request).method)
expectType<string>(({} as Request).url)

expectType<number>(({} as LogDescriptor).level)
expectType<number>(({} as LogDescriptor).time)
expectType<Request | undefined>(({} as LogDescriptor).req)

expectType<(levels: Record<string, number> | undefined, colors: CustomColor | undefined, colorize: boolean, options?: TimeFormatOptions) => (log: LogDescriptor, messageKey: string) => string>(messageFormatFactory)

expectType<typeof oneLineLogger>(oneLineLoggerNamed)
expectAssignable<(opts?: OneLineLoggerOptions) => pretty.PrettyStream>(oneLineLogger)

// Test timeOnly option
const loggerTimeOnly = oneLineLogger({ timeOnly: true })
expectAssignable<pretty.PrettyStream>(loggerTimeOnly)

// Test customTimeFormat option
const loggerCustomFormat = oneLineLogger({ customTimeFormat: 'HH:MM:ss' })
expectAssignable<pretty.PrettyStream>(loggerCustomFormat)

// Test both options together (customTimeFormat takes precedence)
const loggerBoth = oneLineLogger({ timeOnly: true, customTimeFormat: 'yyyy-mm-dd' })
expectAssignable<pretty.PrettyStream>(loggerBoth)
