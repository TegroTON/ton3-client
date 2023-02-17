import {
    Address, BOC, Builder, Slice,
} from 'ton3-core';
import {
    JettonBurn, JettonTransaction, JettonTransfer,
} from './types';
import { JettonOperation } from './constants';
import { TonTransaction } from '../../HttpApi/types';

export default {
    parseTransaction(transaction: TonTransaction, decimals: number): JettonTransaction | null {
        if (transaction.inMessage?.body?.type !== 'data') {
            return null; // Not a jetton transaction
        }

        const bodySlice = transaction.inMessage.body.data.parse();
        const operation = bodySlice.loadUint(32);
        // console.log(operation)
        try {
            switch (operation) {
                case JettonOperation.TRANSFER:
                    return this.parseTransferTransaction(bodySlice, transaction, decimals);
                case JettonOperation.INTERNAL_TRANSFER:
                    return this.parseInternalTransferTransaction(bodySlice, transaction, decimals);
                case JettonOperation.BURN:
                    return this.parseBurnTransaction(bodySlice, transaction, decimals);
                default:
                    return null; // Unknown operation
            }
        } catch {
            return null;
        }
    },

    /*
     burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
     response_destination:MsgAddress custom_payload:(Maybe ^Cell)
     = InternalMsgBody;
    */
    parseBurnTransaction(
        bodySlice: Slice,
        transaction: TonTransaction,
        decimals: number,
    ): JettonBurn {
        const queryId = bodySlice.loadBigUint(64);
        const amount = bodySlice.loadCoins(decimals);

        // bodySlice.readAddress(); // response_destination
        // bodySlice.skip(1); // custom_payload

        return {
            operation: JettonOperation.BURN,
            queryId,
            amount,
            transaction,
        };
    },

    /*
     transfer query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
     response_destination:MsgAddress custom_payload:(Maybe ^Cell)
     forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
     = InternalMsgBody;
     */
    parseTransferTransaction(
        bodySlice: Slice,
        transaction: TonTransaction,
        decimals: number,
    ): JettonTransfer {
        const queryId = bodySlice.loadBigUint(64);
        const amount = bodySlice.loadCoins(decimals);

        const source = transaction.inMessage?.source ?? null;
        const destination = bodySlice.loadAddress() as Address;

        bodySlice.loadAddress(); // response_destination
        bodySlice.skipDict(); // custom_payload

        const forwardTonAmount = bodySlice.loadCoins();
        const forwardPayload = bodySlice.loadBit()
            ? bodySlice.loadRef().parse()
            : bodySlice;

        let comment;
        let data;

        if (forwardPayload.bits.length > 0) {
            data = new Builder().storeSlice(forwardPayload).cell()
                .toString('base64', { has_index: false });
        }
        if (forwardPayload.bits.length >= 32) {
            const op = forwardPayload.loadUint(32);
            if (op === 0) {
                comment = forwardPayload.loadText();
            }
        }

        return {
            operation: JettonOperation.TRANSFER,
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

    /*
     internal_transfer  query_id:uint64 amount:(VarUInteger 16) from:MsgAddress
     response_address:MsgAddress
     forward_ton_amount:(VarUInteger 16)
     forward_payload:(Either Cell ^Cell)
     = InternalMsgBody;
     */
    parseInternalTransferTransaction(
        bodySlice: Slice,
        transaction: TonTransaction,
        decimals: number,
    ): JettonTransfer {
        const queryId = bodySlice.loadBigUint(64);
        const amount = bodySlice.loadCoins(decimals);

        const source = bodySlice.loadAddress() as Address;
        const destination = null;

        bodySlice.loadAddress(); // response_address

        const forwardTonAmount = bodySlice.loadCoins();
        const forwardPayload = bodySlice.loadBit()
            ? bodySlice.loadRef().parse()
            : bodySlice;

        let comment;
        let data;

        if (forwardPayload.bits.length > 0) {
            data = new Builder().storeSlice(bodySlice).cell()
                .toString('base64', { has_index: false });
        }
        if (forwardPayload.bits.length >= 32) {
            const op = bodySlice.loadUint(32);
            if (op === 0) {
                comment = bodySlice.loadText();
            }
        }

        return {
            operation: JettonOperation.INTERNAL_TRANSFER,
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
