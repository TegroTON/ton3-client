import { Address, Coins } from 'ton3-core';
import { JettonOperation } from './constants';

export type TonMessageData = {
    type: 'text',
    text: string
} | {
    type: 'data',
    data: Uint8Array
};

export type TonMessage = {
    source: Address | null;
    destination: Address | null;
    value: Coins;
    forwardFee: Coins;
    ihrFee: Coins;
    createdLt: string;
    body: TonMessageData | null;
};

export type TonTransaction = {
    id: {
        lt: string;
        hash: string;
    };
    time: number;
    storageFee: Coins;
    otherFee: Coins;
    fee: Coins;
    data: string;
    inMessage: TonMessage | null;
    outMessages: TonMessage[];
};

export interface JettonIncomeTransaction {
    operation: JettonOperation.INTERNAL_TRANSFER;
    time: number;
    queryId: bigint;
    amount: Coins;
    forwardTonAmount: Coins;
    from: Address | null;
    comment?: string;
    data?: string;
}

export interface JettonOutcomeTransaction {
    operation: JettonOperation.TRANSFER;
    time: number;
    queryId: bigint;
    amount: Coins;
    forwardTonAmount: Coins;
    destination: Address | null;
    comment?: string;
    data?: string;
}

export interface JettonBurnTransaction {
    operation: JettonOperation.BURN;
    time: number;
    queryId: bigint;
    amount: Coins;
}

export type JettonTransaction = JettonIncomeTransaction | JettonOutcomeTransaction | JettonBurnTransaction;

export type MetadataKeys = { [key: string]: bigint };
