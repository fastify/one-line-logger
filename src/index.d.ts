import pretty from 'pino-pretty'
export interface Request {
    method: string;
    url: string;
}
export declare type LogDescriptor = Record<string, unknown> & {
    time: number;
    level: number;
    req?: Request;
};
export declare const messageFormat: (log: LogDescriptor, messageKey: string) => string
declare const target: (opts: pretty.PrettyOptions) => pretty.PrettyStream
export default target
