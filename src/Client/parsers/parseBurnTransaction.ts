/**
 burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
 response_destination:MsgAddress custom_payload:(Maybe ^Cell)
 = InternalMsgBody;
 */
import { Slice } from 'ton3-core';
import { JettonBurnTransaction, TonTransaction } from '../types';
import { JettonOperation } from '../constants';

export function parseBurnTransaction(bodySlice: Slice, transaction: TonTransaction): JettonBurnTransaction {
    const queryId = bodySlice.loadBigUint(64);
    const amount = bodySlice.loadCoins();

    // bodySlice.readAddress(); // response_destination
    // bodySlice.skip(1); // custom_payload

    return {
        operation: JettonOperation.BURN,
        time: transaction.time,
        queryId,
        amount,
    };
}
