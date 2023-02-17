"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dns = void 0;
const ton3_core_1 = require("ton3-core");
const helpers_1 = require("ton3-core/dist/utils/helpers");
const DnsUtils_1 = require("./DnsUtils");
class Dns {
    constructor(client) {
        this.client = client;
    }
    async getRootDnsAddress() {
        const cell = await this.client.getConfigParam({ configId: 4 });
        if (cell.bits.length !== 256)
            throw new Error(`Invalid ConfigParam 4 length ${cell.bits.length}`);
        const addrHash = (0, helpers_1.bitsToHex)(cell.bits);
        return new ton3_core_1.Address(`-1:${addrHash}`);
    }
    async resolve(domain, category, oneStep = false) {
        return (0, DnsUtils_1.dnsResolve)(this.client, await this.getRootDnsAddress(), domain, category, oneStep);
    }
    async getWalletAddress(domain) {
        const result = await this.resolve(domain, DnsUtils_1.DNS_CATEGORY_WALLET);
        if (!(result instanceof ton3_core_1.Address))
            return ton3_core_1.Address.NONE;
        return new ton3_core_1.Address(result, { bounceable: true });
    }
}
exports.Dns = Dns;
//# sourceMappingURL=Dns.js.map