import { Address, Coins } from 'ton3-core';
import { base64ToBytes, bytesToString } from 'ton3-core/dist/utils/helpers';
import { HTTPMessage, HTTPTransaction } from '../HttpApi/types';
import { TonMessage, TonTransaction } from './types';

export function convertMessage(t: HTTPMessage): TonMessage {
    return {
        source: t.source !== '' ? new Address(t.source) : null,
        destination: t.destination !== '' ? new Address(t.destination) : null,
        forwardFee: new Coins(t.fwd_fee, { isNano: true }),
        ihrFee: new Coins(t.ihr_fee, { isNano: true }),
        value: new Coins(t.value, { isNano: true }),
        createdLt: t.created_lt,
        body: (
            t.msg_data['@type'] === 'msg.dataRaw'
                ? { type: 'data', data: base64ToBytes(t.msg_data.body) }
                : (t.msg_data['@type'] === 'msg.dataText'
                    ? { type: 'text', text: bytesToString(base64ToBytes(t.msg_data.text)) }
                    : null)),
    };
}

export function convertTransaction(r: HTTPTransaction): TonTransaction {
    const inMessage = r.in_msg ? convertMessage(r.in_msg) : null;
    const type = inMessage && inMessage.source ? 'internal' : 'external';
    return {
        id: { lt: r.transaction_id.lt, hash: r.transaction_id.hash },
        time: r.utime,
        data: r.data,
        storageFee: new Coins(r.storage_fee, { isNano: true }),
        otherFee: new Coins(r.other_fee, { isNano: true }),
        fee: new Coins(r.fee, { isNano: true }),
        inMessage,
        outMessages: r.out_msgs.map(convertMessage),
        type,
    };
}
