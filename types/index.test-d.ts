import oneLineLogger, {
  Request,
  LogDescriptor,
  messageFormatFactory,
  oneLineLogger as oneLineLoggerNamed
} from "..";
import { expectType } from "tsd"
import pretty from 'pino-pretty'

expectType<string>(({} as Request).method)
expectType<string>(({} as Request).url)

expectType<number>(({} as LogDescriptor).level)
expectType<number>(({} as LogDescriptor).time)
expectType<Request | undefined>(({} as LogDescriptor).req)

expectType<(colorize: boolean, levels: Record<string, number>) => (log: LogDescriptor, messageKey: string) => string>(messageFormatFactory)

expectType<typeof oneLineLogger>(oneLineLoggerNamed)
expectType<(opts?: pretty.PrettyOptions) => pretty.PrettyStream>(oneLineLogger)
