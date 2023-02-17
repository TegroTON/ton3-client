"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ton3_core_1 = require("ton3-core");
const helpers_1 = require("ton3-core/dist/utils/helpers");
const Helpers_1 = require("../Utils/Helpers");
const GetMethodStack_1 = __importDefault(require("../Utils/GetMethodStack"));
function transformMessage(m) {
    return {
        source: m.source !== '' ? new ton3_core_1.Address(m.source) : null,
        destination: m.destination !== '' ? new ton3_core_1.Address(m.destination) : null,
        forwardFee: new ton3_core_1.Coins(m.fwd_fee, { isNano: true }),
        ihrFee: new ton3_core_1.Coins(m.ihr_fee, { isNano: true }),
        value: new ton3_core_1.Coins(m.value, { isNano: true }),
        createdLt: m.created_lt,
        body: (m.msg_data['@type'] === 'msg.dataRaw'
            ? { type: 'data', data: ton3_core_1.Cell.from(m.msg_data.body) }
            : (m.msg_data['@type'] === 'msg.dataText'
                ? { type: 'text', text: (0, helpers_1.bytesToString)((0, helpers_1.base64ToBytes)(m.msg_data.text)) }
                : null)),
    };
}
exports.default = {
    getAddressInformation: (x) => ({
        state: x.state,
        balance: new ton3_core_1.Coins(x.balance, { isNano: true }),
        code: x.code !== '' ? ton3_core_1.Cell.from(x.code) : null,
        data: x.data !== '' ? ton3_core_1.Cell.from(x.data) : null,
        lastTransaction: x.last_transaction_id.lt !== '0' ? {
            lt: x.last_transaction_id.lt,
            hash: x.last_transaction_id.hash,
        } : null,
        blockId: {
            workchain: x.block_id.workchain,
            shard: x.block_id.shard,
            seqno: x.block_id.seqno,
        },
        timestamp: x.sync_utime,
    }),
    getTransactions: (x) => x.map((tr) => {
        const inMessage = tr.in_msg ? transformMessage(tr.in_msg) : null;
        const type = inMessage && inMessage.source ? 'internal' : 'external';
        return {
            id: { lt: tr.transaction_id.lt, hash: (0, Helpers_1.base64ToHex)(tr.transaction_id.hash) },
            time: tr.utime,
            data: tr.data,
            storageFee: new ton3_core_1.Coins(tr.storage_fee, { isNano: true }),
            otherFee: new ton3_core_1.Coins(tr.other_fee, { isNano: true }),
            fee: new ton3_core_1.Coins(tr.fee, { isNano: true }),
            inMessage,
            outMessages: tr.out_msgs.map(transformMessage),
            type,
        };
    }),
    estimateFee: (x) => ({
        in_fwd_fee: new ton3_core_1.Coins(x.source_fees.in_fwd_fee, { isNano: true }),
        gas_fee: new ton3_core_1.Coins(x.source_fees.gas_fee, { isNano: true }),
        storage_fee: new ton3_core_1.Coins(x.source_fees.storage_fee, { isNano: true }),
        fwd_fee: new ton3_core_1.Coins(x.source_fees.fwd_fee, { isNano: true }),
    }),
    runGetMethod: (x) => ({
        exitCode: x.exit_code,
        gasUsed: x.gas_used,
        stack: GetMethodStack_1.default.parse(x.stack),
    }),
    sendBoc: (x) => x,
    getConfigParam: (x) => (x.config.bytes ? ton3_core_1.Cell.from(x.config.bytes) : new ton3_core_1.Cell()),
};
//# sourceMappingURL=OutTransformers.js.map