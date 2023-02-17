import * as t from 'io-ts';
import {
    Address, Cell, Coins,
} from 'ton3-core';
import { base64ToBytes, bytesToString } from 'ton3-core/dist/utils/helpers';
import Codecs from './Codecs';
import {
    TonAddressInformation, TonFees, TonGetMethod, TonMessage, TonTransaction,
} from './types';
import { base64ToHex } from '../Utils/Helpers';
import GetMethodStack from '../Utils/GetMethodStack';

function transformMessage(m: t.TypeOf<typeof Codecs.message>): TonMessage {
    return {
        source: m.source !== '' ? new Address(m.source) : null,
        destination: m.destination !== '' ? new Address(m.destination) : null,
        forwardFee: new Coins(m.fwd_fee, { isNano: true }),
        ihrFee: new Coins(m.ihr_fee, { isNano: true }),
        value: new Coins(m.value, { isNano: true }),
        createdLt: m.created_lt,
        body: (
            m.msg_data['@type'] === 'msg.dataRaw'
                ? { type: 'data', data: Cell.from(m.msg_data.body) }
                : (m.msg_data['@type'] === 'msg.dataText'
                    ? { type: 'text', text: bytesToString(base64ToBytes(m.msg_data.text)) }
                    : null)),
    };
}

export default {
    getAddressInformation: (
        x: t.TypeOf<typeof Codecs.addressInformation>,
    ): TonAddressInformation => ({
        state: x.state,
        balance: new Coins(x.balance, { isNano: true }),
        code: x.code !== '' ? Cell.from(x.code) : null,
        data: x.data !== '' ? Cell.from(x.data) : null,
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
    getTransactions: (
        x: t.TypeOf<typeof Codecs.getTransactions>,
    ): TonTransaction[] => x.map((tr) => {
        const inMessage = tr.in_msg ? transformMessage(tr.in_msg) : null;
        const type = inMessage && inMessage.source ? 'internal' : 'external';
        return {
            id: { lt: tr.transaction_id.lt, hash: base64ToHex(tr.transaction_id.hash) },
            time: tr.utime,
            data: tr.data,
            storageFee: new Coins(tr.storage_fee, { isNano: true }),
            otherFee: new Coins(tr.other_fee, { isNano: true }),
            fee: new Coins(tr.fee, { isNano: true }),
            inMessage,
            outMessages: tr.out_msgs.map(transformMessage),
            type,
        };
    }),
    estimateFee: (x: t.TypeOf<typeof Codecs.estimateFee>): TonFees => ({
        in_fwd_fee: new Coins(x.source_fees.in_fwd_fee, { isNano: true }),
        gas_fee: new Coins(x.source_fees.gas_fee, { isNano: true }),
        storage_fee: new Coins(x.source_fees.storage_fee, { isNano: true }),
        fwd_fee: new Coins(x.source_fees.fwd_fee, { isNano: true }),
    }),
    runGetMethod: (x: t.TypeOf<typeof Codecs.runGetMethod>): TonGetMethod => ({
        exitCode: x.exit_code,
        gasUsed: x.gas_used,
        stack: GetMethodStack.parse(x.stack),
    }),
    sendBoc: (x: t.TypeOf<typeof Codecs.bocResponse>): t.TypeOf<typeof Codecs.bocResponse> => x,
    getConfigParam: (x: t.TypeOf<typeof Codecs.getConfigParam>): Cell => (
        x.config.bytes ? Cell.from(x.config.bytes) : new Cell()
    ),
};
