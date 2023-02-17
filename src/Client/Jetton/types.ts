import { Address, Coins } from 'ton3-core';
import { TonTransaction } from '../../HttpApi/types';
import { JettonOperation } from './constants';

export interface JettonTransfer {
    operation: (JettonOperation.INTERNAL_TRANSFER | JettonOperation.TRANSFER);
    queryId: bigint;
    amount: Coins;
    forwardTonAmount: Coins;
    source: Address | null;
    destination: Address | null;
    comment?: string;
    data?: string;
    transaction: TonTransaction;
}

export interface JettonBurn {
    operation: JettonOperation.BURN;
    queryId: bigint;
    amount: Coins;
    transaction: TonTransaction;
}

export type JettonTransaction = JettonTransfer | JettonBurn;
