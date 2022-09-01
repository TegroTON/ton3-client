import { Slice } from 'ton3-core';
import { JettonIncomeTransaction, TonTransaction } from '../types';
export declare function parseInternalTransferTransaction(bodySlice: Slice, transaction: TonTransaction): JettonIncomeTransaction;
