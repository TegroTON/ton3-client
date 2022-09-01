import { Address, Cell } from 'ton3-core';
import { DNS_CATEGORY_WALLET, dnsResolve } from './DnsUtils';
import { TonClient } from '../Client';

const testnetRootDnsAddress = 'Ef_v5x0Thgr6pq6ur2NvkWhIf4DxAxsL-Nk5rknT6n99oPKX';
const mainnetRootDnsAddress = 'Ef-OJd0IF0yc0xkhgaAirq12WawqnUoSuE9RYO3S7McG6lDh';

export class Dns {
    private readonly client: TonClient;

    constructor(client: TonClient) {
        this.client = client;
    }

    getRootDnsAddress(): Address {
        if (this.client.isTestnet()) {
            return new Address(testnetRootDnsAddress);
        }
        return new Address(mainnetRootDnsAddress);
    }

    async resolve(
        domain: string,
        category: string | undefined,
        oneStep = false,
    ): Promise<Cell | Address | bigint | null> {
        return dnsResolve(this.client, this.getRootDnsAddress(), domain, category, oneStep);
    }

    getWalletAddress(domain: string): Promise<Cell | Address | bigint | null> {
        return this.resolve(domain, DNS_CATEGORY_WALLET);
    }
}
