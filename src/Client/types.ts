import {Address, Coins} from "ton3-core";

export type TonMessageData = {
    type: 'text',
    text: string
} | {
    type: 'data',
    data: Uint8Array
}

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
