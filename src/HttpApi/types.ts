import { Address, Cell, Coins } from 'ton3-core';
import * as t from 'io-ts';

export type TonMessageData = {
    type: 'text',
    text: string
} | {
    type: 'data',
    data: Cell
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
    type: ('external' | 'internal')
};

export type TonAddressInformation = {
    state: 'active' | 'uninitialized' | 'frozen'
    balance: Coins
    code: Cell | null
    data: Cell | null
    lastTransaction: {
        lt: string
        hash: string
    } | null
    blockId: {
        workchain: number
        shard: string
        seqno: number
    }
    timestamp: number
};

export type TonFees = {
    in_fwd_fee: Coins,
    storage_fee: Coins,
    gas_fee: Coins,
    fwd_fee: Coins,
};

export type TonGetMethod = {
    gasUsed: number,
    exitCode: number,
    stack: any[]
};
