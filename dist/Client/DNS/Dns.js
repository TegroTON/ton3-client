"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dns = void 0;
const ton3_core_1 = require("ton3-core");
const DnsUtils_1 = require("./DnsUtils");
const testnetRootDnsAddress = 'Ef_v5x0Thgr6pq6ur2NvkWhIf4DxAxsL-Nk5rknT6n99oPKX';
const mainnetRootDnsAddress = 'Ef-OJd0IF0yc0xkhgaAirq12WawqnUoSuE9RYO3S7McG6lDh';
class Dns {
    constructor(client) {
        this.client = client;
    }
    getRootDnsAddress() {
        if (this.client.isTestnet()) {
            return new ton3_core_1.Address(testnetRootDnsAddress);
        }
        return new ton3_core_1.Address(mainnetRootDnsAddress);
    }
    async resolve(domain, category, oneStep = false) {
        return (0, DnsUtils_1.dnsResolve)(this.client, this.getRootDnsAddress(), domain, category, oneStep);
    }
    getWalletAddress(domain) {
        return this.resolve(domain, DnsUtils_1.DNS_CATEGORY_WALLET);
    }
}
exports.Dns = Dns;
//# sourceMappingURL=Dns.js.map