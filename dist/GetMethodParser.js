"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ton3_core_1 = require("ton3-core");
class GetMethodParser {
    static parseObject(x) {
        const typeName = x['@type'];
        switch (typeName) {
            case 'tvm.list':
            case 'tvm.tuple':
                return x.elements.map(GetMethodParser.parseObject);
            case 'tvm.cell':
                return ton3_core_1.BOC.from(x.bytes)[0];
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
    static parseResponseStack(pair) {
        const typeName = pair[0];
        const value = pair[1];
        switch (typeName) {
            case 'num':
                return value.slice(0, 1) === '-' ? BigInt(0) - BigInt(value.slice(1)) : BigInt(value);
            case 'list':
            case 'tuple':
                return GetMethodParser.parseObject(value);
            case 'cell':
                return ton3_core_1.BOC.from(value.bytes)[0];
            default:
                throw new Error(`unknown type ${typeName}`);
        }
    }
    static parseRawResult(result) {
        return this.parseStack(result.stack);
    }
    static parseStack(stack) {
        return stack.map(GetMethodParser.parseResponseStack);
    }
    static makeArg(arg) {
        if (arg instanceof BigInt || arg instanceof Number) {
            return ['num', arg];
        }
        throw new Error(`unknown arg type ${arg}`);
    }
    static makeArgs(args) {
        return args.map(this.makeArg);
    }
}
exports.default = GetMethodParser;
//# sourceMappingURL=GetMethodParser.js.map