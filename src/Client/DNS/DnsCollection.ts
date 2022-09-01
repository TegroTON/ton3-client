import {
    Address, BOC, Builder, Cell, Contracts, Slice,
} from 'ton3-core';
import { DnsItem } from './DnsItem';
import { dnsResolve } from './DnsUtils';
import { TonClient } from '../Client';
import { Source } from './Source';
import { NFTItemData } from './types';

export class DnsCollection extends Contracts.ContractBase {
    readonly collectionContent: Cell;

    readonly dnsItemCodeHex: string;

    constructor(
        workchain: 0,
        collectionContent: Cell,
        dnsItemCodeHex: string,
    ) {
        const code = Source.DnsCollection();

        const storage = new Builder()
            .storeRef(collectionContent)
            .storeRef(BOC.fromStandard(dnsItemCodeHex))
            .cell();

        super(workchain, code, storage);

        this.collectionContent = collectionContent;
        this.dnsItemCodeHex = dnsItemCodeHex;
    }

    async getCollectionData(client: TonClient): Promise<{
        collectionContentUri: string,
        collectionContent: Cell,
        ownerAddress: Address | null,
        nextItemIndex: number,
    }> {
        const { stack } = await client.callGetMethod(this.address, 'get_collection_data');

        const collectionContent = stack[1];
        const collectionContentUri = collectionContent.bits.buffer.slice(1).toString();
        return {
            collectionContentUri,
            collectionContent,
            ownerAddress: null,
            nextItemIndex: 0,
        };
    }

    async getNftItemContent(client: TonClient, nftItem: DnsItem): Promise<NFTItemData> {
        return nftItem.getData(client);
    }

    async getNftItemAddressByIndex(client: TonClient, index: bigint): Promise<Address> {
        const { stack } = await client.callGetMethod(this.address, 'get_nft_address_by_index', [['num', index.toString()]]);

        return Slice.parse(stack[0]).preloadAddress();
    }

    async resolve(
        client: TonClient,
        domain: string,
        category?: string,
        oneStep?: boolean,
    ): Promise<Cell | Address | bigint | null> {
        return dnsResolve(client, this.address, domain, category, oneStep);
    }
}
