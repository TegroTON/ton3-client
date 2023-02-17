"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ton3_core_1 = require("ton3-core");
const msgAddress_1 = require("ton3-core/dist/msgAddress");
const parseObject = (x) => {
    const typeName = x['@type'];
    switch (typeName) {
        case 'tvm.list':
        case 'tvm.tuple':
            return x.elements.map(parseObject);
        case 'tvm.cell':
            return ton3_core_1.Cell.from(x.bytes);
        case 'tvm.stackEntryCell':
            return parseObject(x.cell);
        case 'tvm.stackEntryTuple':
            return parseObject(x.tuple);
        case 'tvm.stackEntryNumber':
            return parseObject(x.number);
        case 'tvm.numberDecimal':
            return x.number.slice(0, 1) === '-' ? BigInt(0) - BigInt(x.number.slice(1)) : BigInt(x.number);
        default:
            throw new Error(`unknown type ${typeName}`);
    }
};
const parseResponseStack = (pair) => {
    const typeName = pair[0];
    const value = pair[1];
    switch (typeName) {
        case 'num':
            return value.slice(0, 1) === '-' ? BigInt(0) - BigInt(value.slice(1)) : BigInt(value);
        case 'list':
        case 'tuple':
            return parseObject(value);
        case 'cell':
            return ton3_core_1.Cell.from(value.bytes);
        default:
            throw new Error(`unknown type ${typeName}`);
    }
};
const packRequestStack = (elem) => {
    if (elem instanceof ton3_core_1.Cell) {
        return ['tvm.Cell', elem.toString('base64', { has_index: false })];
    }
    if (typeof elem === 'bigint' || typeof elem === 'number') {
        return ['num', elem.toString()];
    }
    if (elem instanceof ton3_core_1.Coins) {
        return ['num', elem.toNano()];
    }
    if (elem instanceof ton3_core_1.Slice) {
        return ['tvm.Slice', elem.toString('base64', { has_index: false })];
    }
    if (elem instanceof msgAddress_1.MsgAddressInt || elem instanceof msgAddress_1.MsgAddressExt) {
        return packRequestStack(new ton3_core_1.Builder().storeAddress(elem).cell().parse());
    }
    throw new Error(`unknown type of ${elem}`);
};
exports.default = {
    parse(stack) {
        return stack.map(parseResponseStack);
    },
    pack(stack) {
        return stack.map(packRequestStack);
    },
};
//# sourceMappingURL=GetMethodStack.js.map