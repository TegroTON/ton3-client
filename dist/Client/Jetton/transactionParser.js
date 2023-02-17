"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ton3_core_1 = require("ton3-core");
const constants_1 = require("./constants");
exports.default = {
    parseTransaction(transaction, decimals) {
        if (transaction.inMessage?.body?.type !== 'data') {
            return null;
        }
        const bodySlice = transaction.inMessage.body.data.parse();
        const operation = bodySlice.loadUint(32);
        try {
            switch (operation) {
                case constants_1.JettonOperation.TRANSFER:
                    return this.parseTransferTransaction(bodySlice, transaction, decimals);
                case constants_1.JettonOperation.INTERNAL_TRANSFER:
                    return this.parseInternalTransferTransaction(bodySlice, transaction, decimals);
                case constants_1.JettonOperation.BURN:
                    return this.parseBurnTransaction(bodySlice, transaction, decimals);
                default:
                    return null;
            }
        }
        catch {
            return null;
        }
    },
    parseBurnTransaction(bodySlice, transaction, decimals) {
        const queryId = bodySlice.loadBigUint(64);
        const amount = bodySlice.loadCoins(decimals);
        return {
            operation: constants_1.JettonOperation.BURN,
            queryId,
            amount,
            transaction,
        };
    },
    parseTransferTransaction(bodySlice, transaction, decimals) {
        const queryId = bodySlice.loadBigUint(64);
        const amount = bodySlice.loadCoins(decimals);
        const source = transaction.inMessage?.source ?? null;
        const destination = bodySlice.loadAddress();
        bodySlice.loadAddress();
        bodySlice.skipDict();
        const forwardTonAmount = bodySlice.loadCoins();
        const forwardPayload = bodySlice.loadBit()
            ? bodySlice.loadRef().parse()
            : bodySlice;
        let comment;
        let data;
        if (forwardPayload.bits.length > 0) {
            data = new ton3_core_1.Builder().storeSlice(forwardPayload).cell()
                .toString('base64', { has_index: false });
        }
        if (forwardPayload.bits.length >= 32) {
            const op = forwardPayload.loadUint(32);
            if (op === 0) {
                comment = forwardPayload.loadText();
            }
        }
        return {
            operation: constants_1.JettonOperation.TRANSFER,
            queryId,
            amount,
            source,
            destination,
            comment,
            data,
            forwardTonAmount,
            transaction,
        };
    },
    parseInternalTransferTransaction(bodySlice, transaction, decimals) {
        const queryId = bodySlice.loadBigUint(64);
        const amount = bodySlice.loadCoins(decimals);
        const source = bodySlice.loadAddress();
        const destination = null;
        bodySlice.loadAddress();
        const forwardTonAmount = bodySlice.loadCoins();
        const forwardPayload = bodySlice.loadBit()
            ? bodySlice.loadRef().parse()
            : bodySlice;
        let comment;
        let data;
        if (forwardPayload.bits.length > 0) {
            data = new ton3_core_1.Builder().storeSlice(bodySlice).cell()
                .toString('base64', { has_index: false });
        }
        if (forwardPayload.bits.length >= 32) {
            const op = bodySlice.loadUint(32);
            if (op === 0) {
                comment = bodySlice.loadText();
            }
        }
        return {
            operation: constants_1.JettonOperation.INTERNAL_TRANSFER,
            queryId,
            amount,
            source,
            destination,
            comment,
            data,
            forwardTonAmount,
            transaction,
        };
    },
};
//# sourceMappingURL=transactionParser.js.map