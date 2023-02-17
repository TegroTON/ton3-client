"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nft = void 0;
class Nft {
    constructor(client) {
        this.client = client;
    }
    async getItemAddress(nftCollection, index) {
        const { stack } = await this.client.runGetMethod({
            address: nftCollection,
            method: 'get_nft_address_by_index',
            params: [index],
        });
        return stack[0].parse().loadAddress();
    }
    async getRoyaltyParams(nftCollection) {
        const { stack } = await this.client.runGetMethod({
            address: nftCollection,
            method: 'royalty_params',
        });
        const numerator = stack[0];
        const denominator = stack[1];
        const royaltyAddress = stack[2].parse().loadAddress();
        return { numerator, denominator, royaltyAddress };
    }
}
exports.Nft = Nft;
//# sourceMappingURL=Nft.js.map