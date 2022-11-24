import { Address, Coins } from 'ton3-core';
import { JettonOperation } from './constants';
export declare type TonMessageData = {
    type: 'text';
    text: string;
} | {
    type: 'data';
    data: Uint8Array;
};
export declare type TonMessage = {
    source: Address | null;
    destination: Address | null;
    value: Coins;
    forwardFee: Coins;
    ihrFee: Coins;
    createdLt: string;
    body: TonMessageData | null;
};
export declare type TonTransaction = {
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
    type: ('external' | 'internal');
};
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
export declare type JettonTransaction = JettonTransfer | JettonBurn;
export declare type MetadataKeys = {
    [key: string]: bigint;
};
