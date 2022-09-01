"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsCollection = void 0;
const ton3_core_1 = require("ton3-core");
const DnsUtils_1 = require("./DnsUtils");
const Source_1 = require("./Source");
class DnsCollection extends ton3_core_1.Contracts.ContractBase {
    constructor(workchain, collectionContent, dnsItemCodeHex) {
        const code = Source_1.Source.DnsCollection();
        const storage = new ton3_core_1.Builder()
            .storeRef(collectionContent)
            .storeRef(ton3_core_1.BOC.fromStandard(dnsItemCodeHex))
            .cell();
        super(workchain, code, storage);
        this.collectionContent = collectionContent;
        this.dnsItemCodeHex = dnsItemCodeHex;
    }
    async getCollectionData(client) {
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
    async getNftItemContent(client, nftItem) {
        return nftItem.getData(client);
    }
    async getNftItemAddressByIndex(client, index) {
        const { stack } = await client.callGetMethod(this.address, 'get_nft_address_by_index', [['num', index.toString()]]);
        return ton3_core_1.Slice.parse(stack[0]).preloadAddress();
    }
    async resolve(client, domain, category, oneStep) {
        return (0, DnsUtils_1.dnsResolve)(client, this.address, domain, category, oneStep);
    }
}
exports.DnsCollection = DnsCollection;
//# sourceMappingURL=DnsCollection.js.map