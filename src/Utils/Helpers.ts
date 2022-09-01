import { base64ToBytes, bytesToHex } from 'ton3-core/dist/utils/helpers';
import { Slice } from 'ton3-core';

export const base64ToHex = (base64: string): string => bytesToHex(base64ToBytes(base64));

export const loadSnake = (slice: Slice): Uint8Array => {
    const loadPart = (cellSlice: Slice, result: Uint8Array) => {
        let newResult = new Uint8Array([...result, ...cellSlice.loadBytes(cellSlice.bits.length)]);
        if (cellSlice.refs.length > 0) {
            newResult = loadPart(Slice.parse(cellSlice.loadRef()), newResult);
        }
        return newResult;
    };
    return loadPart(slice, new Uint8Array());
};
