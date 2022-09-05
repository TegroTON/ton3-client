"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInternalTransferTransaction = void 0;
const ton3_core_1 = require("ton3-core");
const helpers_1 = require("ton3-core/dist/utils/helpers");
const Helpers_1 = require("../../Utils/Helpers");
const constants_1 = require("../constants");
function parseInternalTransferTransaction(bodySlice, transaction, decimals) {
    const queryId = bodySlice.loadBigUint(64);
    const amount = bodySlice.loadCoins(decimals);
    const from = bodySlice.loadAddress();
    bodySlice.loadAddress();
    const forwardTonAmount = bodySlice.loadCoins();
    const forwardPayload = bodySlice.loadBit()
        ? ton3_core_1.Slice.parse(bodySlice.loadRef())
        : bodySlice;
    let comment;
    let data;
    if (forwardPayload.bits.length > 0) {
        data = ton3_core_1.BOC.toBase64Standard(new ton3_core_1.Builder().storeSlice(bodySlice).cell(), { has_index: false });
    }
    if (forwardPayload.bits.length >= 32) {
        const op = bodySlice.loadUint(32);
        if (op === 0) {
            comment = (0, helpers_1.bytesToString)((0, Helpers_1.loadSnake)(bodySlice));
        }
    }
    return {
        operation: constants_1.JettonOperation.INTERNAL_TRANSFER,
        time: transaction.time,
        queryId,
        amount,
        from,
        comment,
        data,
        forwardTonAmount,
    };
}
exports.parseInternalTransferTransaction = parseInternalTransferTransaction;
//# sourceMappingURL=parseInternalTransferTransaction.js.map