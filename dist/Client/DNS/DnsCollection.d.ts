import { Address, Cell, Contracts } from 'ton3-core';
import { DnsItem } from './DnsItem';
import { TonClient } from '../Client';
import { NFTItemData } from './types';
export declare class DnsCollection extends Contracts.ContractBase {
    readonly collectionContent: Cell;
    readonly dnsItemCodeHex: string;
    constructor(workchain: 0, collectionContent: Cell, dnsItemCodeHex: string);
    getCollectionData(client: TonClient): Promise<{
        collectionContentUri: string;
        collectionContent: Cell;
        ownerAddress: Address | null;
        nextItemIndex: number;
    }>;
    getNftItemContent(client: TonClient, nftItem: DnsItem): Promise<NFTItemData>;
    getNftItemAddressByIndex(client: TonClient, index: bigint): Promise<Address>;
    resolve(client: TonClient, domain: string, category?: string, oneStep?: boolean): Promise<Cell | Address | bigint | null>;
}
