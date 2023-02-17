/// <reference types="node" />
import { Address, Cell } from 'ton3-core';
import { MsgAddressExt } from 'ton3-core/dist/msgAddress';
import { TonClient } from '../Client';
export declare const DNS_CATEGORY_NEXT_RESOLVER = "dns_next_resolver";
export declare const DNS_CATEGORY_WALLET = "wallet";
export declare const DNS_CATEGORY_SITE = "site";
export declare function categoryToBigInt(category: string | undefined): bigint;
export declare function parseSmartContractAddressImpl(cell: Cell, prefix0: number, prefix1: number): Address | MsgAddressExt;
export declare function parseSmartContractAddressRecord(cell: Cell): Address | MsgAddressExt;
export declare function parseNextResolverRecord(cell: Cell): Address | MsgAddressExt;
export declare function dnsResolveImpl(client: TonClient, dnsAddress: Address, rawDomainBytes: Uint8Array, category: string | undefined, oneStep: boolean | undefined): Promise<Cell | Address | MsgAddressExt | bigint | null>;
export declare function domainToBuffer(domain: string): Buffer;
export declare function dnsResolve(client: TonClient, rootDnsAddress: Address, domain: string, category: string | undefined, oneStep: boolean | undefined): Promise<Cell | Address | MsgAddressExt | bigint | null>;
