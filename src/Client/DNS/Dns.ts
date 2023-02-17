import { Address, Cell } from 'ton3-core';
import { bitsToHex } from 'ton3-core/dist/utils/helpers';
import { MsgAddressExt } from 'ton3-core/dist/msgAddress';
import { DNS_CATEGORY_WALLET, dnsResolve } from './DnsUtils';
import { TonClient } from '../Client';

export class Dns {
    private readonly client: TonClient;

    constructor(client: TonClient) {
        this.client = client;
    }

    async getRootDnsAddress(): Promise<Address> {
        const cell = await this.client.getConfigParam({ configId: 4 });
        if (cell.bits.length !== 256) throw new Error(`Invalid ConfigParam 4 length ${cell.bits.length}`);
        const addrHash = bitsToHex(cell.bits);
        return new Address(`-1:${addrHash}`);
    }

    async resolve(
        domain: string,
        category: string | undefined,
        oneStep = false,
    ): Promise<Cell | Address | MsgAddressExt | bigint | null> {
        return dnsResolve(this.client, await this.getRootDnsAddress(), domain, category, oneStep);
    }

    async getWalletAddress(domain: string): Promise<Address | MsgAddressExt> {
        const result = await this.resolve(domain, DNS_CATEGORY_WALLET);
        if (!(result instanceof Address)) return Address.NONE;
        return new Address(result, { bounceable: true });
    }
}
