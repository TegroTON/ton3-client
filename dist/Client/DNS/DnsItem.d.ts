import { Address, Cell, Coins, Contracts } from 'ton3-core';
import { TonClient } from '../Client';
import { NFTItemData } from './types';
export declare class DnsItem extends Contracts.ContractBase {
    readonly index: bigint;
    readonly collectionAddress: Address;
    constructor(workchain: 0, index: bigint, collectionAddress: Address);
    getData(client: TonClient): Promise<NFTItemData>;
    createTransferBody(params: {
        queryId?: number;
        newOwnerAddress: Address;
        forwardAmount?: Coins;
        forwardPayload?: Uint8Array;
        responseAddress: Address;
    }): Cell;
    createGetStaticDataBody(params: {
        queryId?: number;
    }): Cell;
    getDomain(client: TonClient): Promise<string>;
    getAuctionInfo(client: TonClient): Promise<{
        maxBidAddress: Address | null;
        maxBidAmount: Coins;
        auctionEndTime: number;
    }>;
    getLastFillUpTime(client: TonClient): Promise<number>;
    resolve(client: TonClient, domain: string, category?: string, oneStep?: boolean): Promise<Cell | Address | bigint | null>;
}
