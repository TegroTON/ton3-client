import {
    Address, Builder, Cell, Coins, Contracts,
} from 'ton3-core';
import { dnsResolve } from './DnsUtils';
import { Source } from './Source';
import { TonClient } from '../Client';
import { NFTItemData } from './types';

export class DnsItem extends Contracts.ContractBase {
    readonly index: bigint;

    readonly collectionAddress: Address;

    constructor(
        workchain: 0,
        index: bigint,
        collectionAddress: Address,
    ) {
        const code = Source.DnsItem();

        const storage = new Builder()
            .storeUint(index, 256)
            .storeAddress(collectionAddress)
            .cell();

        super(workchain, code, storage);

        this.index = index;
        this.collectionAddress = collectionAddress;
    }

    async getData(client: TonClient): Promise<NFTItemData> {
        const { stack } = await client.callGetMethod(this.address, 'get_nft_data');

        const isInitialized = stack[0][1].toNumber() === -1;
        const index = BigInt(stack[1]);
        const collectionAddress = new Address(stack[2]);
        const ownerAddress = isInitialized ? new Address(stack[3]) : null;
        const contentCell = stack[4];

        return {
            isInitialized,
            index,
            collectionAddress,
            ownerAddress,
            contentCell,
        };
    }

    createTransferBody(params: {
        queryId?: number,
        newOwnerAddress: Address,
        forwardAmount?: Coins,
        forwardPayload?: Uint8Array,
        responseAddress: Address
    }): Cell {
        const body = new Builder()
            .storeUint(0x5fcc3d14, 32) // transfer op
            .storeUint(params.queryId || 0, 64)
            .storeAddress(params.newOwnerAddress)
            .storeAddress(params.responseAddress)
            .storeBit(0) // null custom_payload
            .storeCoins(params.forwardAmount || new Coins(0))
            .storeBit(0); // forward_payload in this slice, not separate cell

        if (params.forwardPayload) {
            body.storeBytes(params.forwardPayload);
        }
        return body.cell();
    }

    createGetStaticDataBody(params: { queryId?: number }): Cell {
        return new Builder()
            .storeUint(0x2fcb26a2, 32) // OP
            .storeUint(params.queryId || 0, 64) // query_id
            .cell();
    }

    async getDomain(client: TonClient): Promise<string> {
        const { stack } = await client.callGetMethod(this.address, 'get_domain');
        return Buffer.from(stack[0][1])
            .toString('utf-8');
    }

    async getAuctionInfo(client: TonClient): Promise<{
        maxBidAddress: Address | null,
        maxBidAmount: Coins,
        auctionEndTime: number
    }> {
        const { stack } = await client.callGetMethod(this.address, 'get_auction_info');
        const maxBidAddress = new Address(stack[0]);
        const maxBidAmount = new Coins(stack[1], { isNano: true });
        const auctionEndTime = new stack[2].toNumber();
        return {
            maxBidAddress,
            maxBidAmount,
            auctionEndTime,
        };
    }

    async getLastFillUpTime(client: TonClient): Promise<number> {
        const { stack } = await client.callGetMethod(this.address, 'get_last_fill_up_time');
        return new stack[0].toNumber();
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
