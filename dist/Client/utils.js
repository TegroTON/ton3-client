"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTransaction = exports.convertMessage = void 0;
const ton3_core_1 = require("ton3-core");
const helpers_1 = require("ton3-core/dist/utils/helpers");
function convertMessage(t) {
    return {
        source: t.source !== '' ? new ton3_core_1.Address(t.source) : null,
        destination: t.destination !== '' ? new ton3_core_1.Address(t.destination) : null,
        forwardFee: new ton3_core_1.Coins(t.fwd_fee, true),
        ihrFee: new ton3_core_1.Coins(t.ihr_fee, true),
        value: new ton3_core_1.Coins(t.value, true),
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
    return {
        id: { lt: r.transaction_id.lt, hash: r.transaction_id.hash },
        time: r.utime,
        data: r.data,
        storageFee: new ton3_core_1.Coins(r.storage_fee, true),
        otherFee: new ton3_core_1.Coins(r.other_fee, true),
        fee: new ton3_core_1.Coins(r.fee, true),
        inMessage: r.in_msg ? convertMessage(r.in_msg) : null,
        outMessages: r.out_msgs.map(convertMessage),
    };
}
exports.convertTransaction = convertTransaction;
//# sourceMappingURL=utils.js.map