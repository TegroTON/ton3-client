import { Slice } from 'ton3-core';
import { JettonBurnTransaction, TonTransaction } from '../types';
export declare function parseBurnTransaction(bodySlice: Slice, transaction: TonTransaction, decimals: number): JettonBurnTransaction;
