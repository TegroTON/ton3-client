import { Slice } from 'ton3-core';
import { JettonOutcomeTransaction, TonTransaction } from '../types';
export declare function parseTransferTransaction(bodySlice: Slice, transaction: TonTransaction): JettonOutcomeTransaction;
