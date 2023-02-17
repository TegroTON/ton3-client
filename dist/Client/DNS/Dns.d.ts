import { Address, Cell } from 'ton3-core';
import { MsgAddressExt } from 'ton3-core/dist/msgAddress';
import { TonClient } from '../Client';
export declare class Dns {
    private readonly client;
    constructor(client: TonClient);
    getRootDnsAddress(): Promise<Address>;
    resolve(domain: string, category: string | undefined, oneStep?: boolean): Promise<Cell | Address | MsgAddressExt | bigint | null>;
    getWalletAddress(domain: string): Promise<Address | MsgAddressExt>;
}
