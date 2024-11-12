import pretty from 'pino-pretty';
import { expectType, expectAssignable } from "tsd";
import oneLineLogger, {
  CustomColor,
  LogDescriptor,
  Request,
  messageFormatFactory,
  oneLineLogger as oneLineLoggerNamed
} from "..";

expectType<string>(({} as Request).method)
expectType<string>(({} as Request).url)

expectType<number>(({} as LogDescriptor).level)
expectType<number>(({} as LogDescriptor).time)
expectType<Request | undefined>(({} as LogDescriptor).req)

expectType<(colorize: boolean, levels: Record<string, number>, colors?: CustomColor) => (log: LogDescriptor, messageKey: string) => string>(messageFormatFactory)

expectType<typeof oneLineLogger>(oneLineLoggerNamed)
expectAssignable<(opts?: pretty.PrettyOptions) => pretty.PrettyStream>(oneLineLogger)
