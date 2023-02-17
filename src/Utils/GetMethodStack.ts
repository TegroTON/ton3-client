import {
    Address,
    BOC, Builder, Cell, Coins, Slice,
} from 'ton3-core';
import { MsgAddress, MsgAddressExt, MsgAddressInt } from 'ton3-core/dist/msgAddress';

const parseObject = (x: any): any => {
    const typeName = x['@type'];
    switch (typeName) {
        case 'tvm.list':
        case 'tvm.tuple':
            return x.elements.map(parseObject);
        case 'tvm.cell':
            return Cell.from(x.bytes);
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

const parseResponseStack = (pair: any[]): any => {
    const typeName = pair[0];
    const value = pair[1];

    switch (typeName) {
        case 'num':
            return value.slice(0, 1) === '-' ? BigInt(0) - BigInt(value.slice(1)) : BigInt(value);
        case 'list':
        case 'tuple':
            return parseObject(value);
        case 'cell':
            return Cell.from(value.bytes);
        default:
            throw new Error(`unknown type ${typeName}`);
    }
};

const packRequestStack = (elem: any): any[] => {
    if (elem instanceof Cell) {
        return ['tvm.Cell', elem.toString('base64', { has_index: false })];
    } if (typeof elem === 'bigint' || typeof elem === 'number') {
        return ['num', elem.toString()];
    } if (elem instanceof Coins) {
        return ['num', elem.toNano()];
    } if (elem instanceof Slice) {
        return ['tvm.Slice', elem.toString('base64', { has_index: false })];
    } if (elem instanceof MsgAddressInt || elem instanceof MsgAddressExt) {
        return packRequestStack(new Builder().storeAddress(elem).cell().parse());
    }
    throw new Error(`unknown type of ${elem}`);
};

// export type getMethodRequestStackType = (Cell | Slice | number | bigint | Coins | Address | MsgAddressExt | MsgAddressInt)

export default {
    parse(stack: any): any[] {
        return stack.map(parseResponseStack);
    },
    pack(stack: any): any[] {
        return stack.map(packRequestStack);
    },
};
