import { BOC } from 'ton3-core';

export default class GetMethodParser {
    static parseObject(x: any): any {
        const typeName = x['@type'];
        switch (typeName) {
            case 'tvm.list':
            case 'tvm.tuple':
                return x.elements.map(GetMethodParser.parseObject);
            case 'tvm.cell':
                return BOC.from(x.bytes)[0];
            case 'tvm.stackEntryCell':
                return GetMethodParser.parseObject(x.cell);
            case 'tvm.stackEntryTuple':
                return GetMethodParser.parseObject(x.tuple);
            case 'tvm.stackEntryNumber':
                return GetMethodParser.parseObject(x.number);
            case 'tvm.numberDecimal':
                return x.number.slice(0, 1) === '-' ? BigInt(0) - BigInt(x.number.slice(1)) : BigInt(x.number);
            default:
                throw new Error(`unknown type ${typeName}`);
        }
    }

    static parseResponseStack(pair: any[]): any {
        const typeName = pair[0];
        const value = pair[1];

        switch (typeName) {
            case 'num':
                return value.slice(0, 1) === '-' ? BigInt(0) - BigInt(value.slice(1)) : BigInt(value);
            case 'list':
            case 'tuple':
                return GetMethodParser.parseObject(value);
            case 'cell':
                return BOC.from(value.bytes)[0];
            default:
                throw new Error(`unknown type ${typeName}`);
        }
    }

    static parseRawResult(result: any) {
        return this.parseStack(result.stack);
    }

    static parseStack(stack: any): any[] {
        return stack.map(GetMethodParser.parseResponseStack);
    }

    static makeArg(arg: any) {
        if (arg instanceof BigInt || arg instanceof Number) {
            return ['num', arg];
        }
        throw new Error(`unknown arg type ${arg}`);
    }

    static makeArgs(args: any) {
        return args.map(this.makeArg);
    }
}
