"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsItem = void 0;
const ton3_core_1 = require("ton3-core");
const DnsUtils_1 = require("./DnsUtils");
const Source_1 = require("./Source");
class DnsItem extends ton3_core_1.Contracts.ContractBase {
    constructor(workchain, index, collectionAddress) {
        const code = Source_1.Source.DnsItem();
        const storage = new ton3_core_1.Builder()
            .storeUint(index, 256)
            .storeAddress(collectionAddress)
            .cell();
        super(workchain, code, storage);
        this.index = index;
        this.collectionAddress = collectionAddress;
    }
    async getData(client) {
        const { stack } = await client.callGetMethod(this.address, 'get_nft_data');
        const isInitialized = stack[0][1].toNumber() === -1;
        const index = BigInt(stack[1]);
        const collectionAddress = new ton3_core_1.Address(stack[2]);
        const ownerAddress = isInitialized ? new ton3_core_1.Address(stack[3]) : null;
        const contentCell = stack[4];
        return {
            isInitialized,
            index,
            collectionAddress,
            ownerAddress,
            contentCell,
        };
    }
    createTransferBody(params) {
        const body = new ton3_core_1.Builder()
            .storeUint(0x5fcc3d14, 32)
            .storeUint(params.queryId || 0, 64)
            .storeAddress(params.newOwnerAddress)
            .storeAddress(params.responseAddress)
            .storeBit(0)
            .storeCoins(params.forwardAmount || new ton3_core_1.Coins(0))
            .storeBit(0);
        if (params.forwardPayload) {
            body.storeBytes(params.forwardPayload);
        }
        return body.cell();
    }
    createGetStaticDataBody(params) {
        return new ton3_core_1.Builder()
            .storeUint(0x2fcb26a2, 32)
            .storeUint(params.queryId || 0, 64)
            .cell();
    }
    async getDomain(client) {
        const { stack } = await client.callGetMethod(this.address, 'get_domain');
        return Buffer.from(stack[0][1])
            .toString('utf-8');
    }
    async getAuctionInfo(client) {
        const { stack } = await client.callGetMethod(this.address, 'get_auction_info');
        const maxBidAddress = new ton3_core_1.Address(stack[0]);
        const maxBidAmount = new ton3_core_1.Coins(stack[1], { isNano: true });
        const auctionEndTime = new stack[2].toNumber();
        return {
            maxBidAddress,
            maxBidAmount,
            auctionEndTime,
        };
    }
    async getLastFillUpTime(client) {
        const { stack } = await client.callGetMethod(this.address, 'get_last_fill_up_time');
        return new stack[0].toNumber();
    }
    async resolve(client, domain, category, oneStep) {
        return (0, DnsUtils_1.dnsResolve)(client, this.address, domain, category, oneStep);
    }
}
exports.DnsItem = DnsItem;
//# sourceMappingURL=DnsItem.js.map