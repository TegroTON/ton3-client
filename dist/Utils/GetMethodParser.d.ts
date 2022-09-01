export default class GetMethodParser {
    static parseObject(x: any): any;
    static parseResponseStack(pair: any[]): any;
    static parseRawResult(result: any): any[];
    static parseStack(stack: any): any[];
    static makeArg(arg: any): (string | Number | BigInt)[];
    static makeArgs(args: any): any;
}
