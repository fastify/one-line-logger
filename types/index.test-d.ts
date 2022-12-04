import oneLineLogger, {
  LEVEL_TO_STRING, Request,
  LogDescriptor,
  messageFormatFactory,
  oneLineLogger as oneLineLoggerNamed
} from "..";
import { expectType } from "tsd"
import pretty from 'pino-pretty'

expectType<'trace'>(LEVEL_TO_STRING[10])
expectType<'debug'>(LEVEL_TO_STRING[20])
expectType<'info'>(LEVEL_TO_STRING[30])
expectType<'warn'>(LEVEL_TO_STRING[40])
expectType<'error'>(LEVEL_TO_STRING[50])
expectType<'fatal'>(LEVEL_TO_STRING[60])

expectType<string>(LEVEL_TO_STRING[70])

expectType<string>(({} as Request).method)
expectType<string>(({} as Request).url)

expectType<number>(({} as LogDescriptor).level)
expectType<number>(({} as LogDescriptor).time)
expectType<Request | undefined>(({} as LogDescriptor).req)

expectType<(colorize: boolean) => (log: LogDescriptor, messageKey: string) => string>(messageFormatFactory)

expectType<typeof oneLineLogger>(oneLineLoggerNamed)
expectType<(opts?: pretty.PrettyOptions) => pretty.PrettyStream>(oneLineLogger)
