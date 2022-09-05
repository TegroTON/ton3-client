import { BOC, Builder, Slice } from 'ton3-core';
import { bytesToString } from 'ton3-core/dist/utils/helpers';
import { JettonOutcomeTransaction, TonTransaction } from '../types';
import { loadSnake } from '../../Utils/Helpers';
import { JettonOperation } from '../constants';

/**
 transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
 response_destination:MsgAddress custom_payload:(Maybe ^Cell)
 forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
 = InternalMsgBody;
 */

export function parseTransferTransaction(bodySlice: Slice, transaction: TonTransaction, decimals: number): JettonOutcomeTransaction {
    const queryId = bodySlice.loadBigUint(64);
    const amount = bodySlice.loadCoins(decimals);
    const destination = bodySlice.loadAddress();

    bodySlice.loadAddress(); // response_destination
    bodySlice.skipDict(); // custom_payload

    const forwardTonAmount = bodySlice.loadCoins();
    const forwardPayload = bodySlice.loadBit()
        ? Slice.parse(bodySlice.loadRef())
        : bodySlice;

    let comment;
    let data;

    if (forwardPayload.bits.length > 0) {
        data = BOC.toBase64Standard(new Builder().storeSlice(bodySlice).cell(), { has_index: false });
    }
    if (forwardPayload.bits.length >= 32) {
        const op = bodySlice.loadUint(32);
        if (op === 0) {
            comment = bytesToString(loadSnake(bodySlice));
        }
    }

    return {
        operation: JettonOperation.TRANSFER,
        time: transaction.time,
        queryId,
        amount,
        destination,
        comment,
        data,
        forwardTonAmount,
    };
}
