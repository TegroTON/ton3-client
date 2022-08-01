import {HTTPMessage, HTTPTransaction} from "../HttpApi/types";
import {TonMessage, TonTransaction} from "./types";
import {Address, Coins} from "ton3-core";
import {base64ToBytes, bytesToString} from "ton3-core/dist/utils/helpers";

export function convertMessage(t: HTTPMessage): TonMessage {
    return {
        source: t.source !== '' ? new Address(t.source) : null,
        destination: t.destination !== '' ? new Address(t.destination) : null,
        forwardFee: new Coins(t.fwd_fee, true),
        ihrFee: new Coins(t.ihr_fee, true),
        value: new Coins(t.value, true),
        createdLt: t.created_lt,
        body: (
            t.msg_data['@type'] === 'msg.dataRaw'
                ? { type: 'data', data: base64ToBytes(t.msg_data.body) }
                : (t.msg_data['@type'] === 'msg.dataText'
                    ? { type: 'text', text: bytesToString(base64ToBytes(t.msg_data.text)) }
                    : null))
    };
}

export function convertTransaction(r: HTTPTransaction): TonTransaction {
    return {
        id: { lt: r.transaction_id.lt, hash: r.transaction_id.hash },
        time: r.utime,
        data: r.data,
        storageFee: new Coins(r.storage_fee, true),
        otherFee: new Coins(r.other_fee, true),
        fee: new Coins(r.fee, true),
        inMessage: r.in_msg ? convertMessage(r.in_msg) : null,
        outMessages: r.out_msgs.map(convertMessage)
    }
}
