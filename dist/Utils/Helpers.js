"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSnake = exports.base64ToHex = void 0;
const helpers_1 = require("ton3-core/dist/utils/helpers");
const ton3_core_1 = require("ton3-core");
const base64ToHex = (base64) => (0, helpers_1.bytesToHex)((0, helpers_1.base64ToBytes)(base64));
exports.base64ToHex = base64ToHex;
const loadSnake = (slice) => {
    const loadPart = (cellSlice, result) => {
        let newResult = new Uint8Array([...result, ...cellSlice.loadBytes(cellSlice.bits.length)]);
        if (cellSlice.refs.length > 0) {
            newResult = loadPart(ton3_core_1.Slice.parse(cellSlice.loadRef()), newResult);
        }
        return newResult;
    };
    return loadPart(slice, new Uint8Array());
};
exports.loadSnake = loadSnake;
//# sourceMappingURL=Helpers.js.map