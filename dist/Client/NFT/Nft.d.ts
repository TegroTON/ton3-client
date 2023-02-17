import { Address } from 'ton3-core';
import { TonClient } from '../Client';
export declare class Nft {
    private readonly client;
    constructor(client: TonClient);
    getItemAddress(nftCollection: Address, index: number): Promise<import("ton3-core/dist/msgAddress").MsgAddressExt | Address>;
    getRoyaltyParams(nftCollection: Address): Promise<{
        numerator: any;
        denominator: any;
        royaltyAddress: import("ton3-core/dist/msgAddress").MsgAddressExt | Address;
    }>;
}
