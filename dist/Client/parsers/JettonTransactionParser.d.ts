import { Slice } from 'ton3-core';
import { JettonBurn, JettonTransaction, JettonTransfer, TonTransaction } from '../types';
declare const _default: {
    parseTransaction(transaction: TonTransaction, decimals: number): JettonTransaction | null;
    parseBurnTransaction(bodySlice: Slice, transaction: TonTransaction, decimals: number): JettonBurn;
    parseTransferTransaction(bodySlice: Slice, transaction: TonTransaction, decimals: number): JettonTransfer;
    parseInternalTransferTransaction(bodySlice: Slice, transaction: TonTransaction, decimals: number): JettonTransfer;
};
export default _default;
