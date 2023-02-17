import { Address, Cell } from 'ton3-core';
import { TonClient } from '../Client';
// import { MetadataKeys } from '../../Utils/Metadata/types';

export class Nft {
    private readonly client: TonClient;

    constructor(client: TonClient) {
        this.client = client;
    }

    // async getItemData(nftItem: Address, opts?: { metadataKeys?: MetadataKeys }) {
    //
    // }
    //
    // async getCollectionData(nftCollection: Address, opts?: { metadataKeys?: MetadataKeys }) {
    //
    // }

    async getItemAddress(nftCollection: Address, index: number) {
        const { stack } = await this.client.runGetMethod({
            address: nftCollection,
            method: 'get_nft_address_by_index',
            params: [index],
        });

        return (stack[0] as Cell).parse().loadAddress();
    }

    async getRoyaltyParams(nftCollection: Address) {
        const { stack } = await this.client.runGetMethod({
            address: nftCollection,
            method: 'royalty_params',
        });

        const numerator = stack[0];
        const denominator = stack[1];

        const royaltyAddress = (stack[2] as Cell).parse().loadAddress();

        return { numerator, denominator, royaltyAddress };
    }
}
