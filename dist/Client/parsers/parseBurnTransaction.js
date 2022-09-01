"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBurnTransaction = void 0;
const constants_1 = require("../constants");
function parseBurnTransaction(bodySlice, transaction) {
    const queryId = bodySlice.loadBigUint(64);
    const amount = bodySlice.loadCoins();
    return {
        operation: constants_1.JettonOperation.BURN,
        time: transaction.time,
        queryId,
        amount,
    };
}
exports.parseBurnTransaction = parseBurnTransaction;
//# sourceMappingURL=parseBurnTransaction.js.map