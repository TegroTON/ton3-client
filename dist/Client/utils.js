"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTransaction = exports.convertMessage = void 0;
const ton3_core_1 = require("ton3-core");
const helpers_1 = require("ton3-core/dist/utils/helpers");
function convertMessage(t) {
    return {
        source: t.source !== '' ? new ton3_core_1.Address(t.source) : null,
        destination: t.destination !== '' ? new ton3_core_1.Address(t.destination) : null,
        forwardFee: new ton3_core_1.Coins(t.fwd_fee, { isNano: true }),
        ihrFee: new ton3_core_1.Coins(t.ihr_fee, { isNano: true }),
        value: new ton3_core_1.Coins(t.value, { isNano: true }),
        createdLt: t.created_lt,
        body: (t.msg_data['@type'] === 'msg.dataRaw'
            ? { type: 'data', data: (0, helpers_1.base64ToBytes)(t.msg_data.body) }
            : (t.msg_data['@type'] === 'msg.dataText'
                ? { type: 'text', text: (0, helpers_1.bytesToString)((0, helpers_1.base64ToBytes)(t.msg_data.text)) }
                : null)),
    };
}
exports.convertMessage = convertMessage;
function convertTransaction(r) {
    const inMessage = r.in_msg ? convertMessage(r.in_msg) : null;
    const type = inMessage && inMessage.source ? 'external' : 'internal';
    return {
        id: { lt: r.transaction_id.lt, hash: r.transaction_id.hash },
        time: r.utime,
        data: r.data,
        storageFee: new ton3_core_1.Coins(r.storage_fee, { isNano: true }),
        otherFee: new ton3_core_1.Coins(r.other_fee, { isNano: true }),
        fee: new ton3_core_1.Coins(r.fee, { isNano: true }),
        inMessage,
        outMessages: r.out_msgs.map(convertMessage),
        type,
    };
}
exports.convertTransaction = convertTransaction;
//# sourceMappingURL=utils.js.map