import { sha256 } from 'ton3-core/dist/utils/hash';
import { stringToBytes } from 'ton3-core/dist/utils/helpers';
import {
    Address, BOC, Builder, Cell, Slice,
} from 'ton3-core';
import { TonClient } from '../Client';

export const DNS_CATEGORY_NEXT_RESOLVER = 'dns_next_resolver'; // Smart Contract address
export const DNS_CATEGORY_WALLET = 'wallet'; // Smart Contract address
export const DNS_CATEGORY_SITE = 'site'; // ADNL address

export function categoryToBigInt(category: string | undefined): bigint {
    if (!category) return BigInt(0); // all categories
    const categoryBytes = stringToBytes(category);
    const categoryHash = sha256(categoryBytes);
    return BigInt(`0x${categoryHash}`);
}

export function createSmartContractAddressRecord(smartContractAddress: Address): Cell {
    return new Builder()
        .storeUint(0x9fd3, 16) // https://github.com/ton-blockchain/ton/blob/7e3df93ca2ab336716a230fceb1726d81bac0a06/crypto/block/block.tlb#L827
        .storeAddress(smartContractAddress)
        .storeUint(0, 8)
        .cell();
}

export function createAdnlAddressRecord(adnlAddress: bigint): Cell {
    return new Builder()
        .storeUint(0xad01, 16) // https://github.com/ton-blockchain/ton/blob/7e3df93ca2ab336716a230fceb1726d81bac0a06/crypto/block/block.tlb#L821
        .storeUint(adnlAddress, 256)
        .storeUint(0, 8)
        .cell();
}

export function createNextResolverRecord(smartContractAddress: Address): Cell {
    return new Builder()
        .storeUint(0xba93, 16) // https://github.com/ton-blockchain/ton/blob/7e3df93ca2ab336716a230fceb1726d81bac0a06/crypto/block/block.tlb#L819
        .storeAddress(smartContractAddress)
        .cell();
}

export function parseSmartContractAddressImpl(
    cell: Cell,
    prefix0: number,
    prefix1: number,
): Address | null {
    const ds = Slice.parse(cell);
    if (ds.loadUint(8) !== prefix0 || ds.loadUint(8) !== prefix1) throw new Error('Invalid dns record value prefix');
    return ds.loadAddress();
}

export function parseSmartContractAddressRecord(cell: Cell): Address | null {
    return parseSmartContractAddressImpl(cell, 0x9f, 0xd3);
}

export function parseNextResolverRecord(cell: Cell): Address | null {
    return parseSmartContractAddressImpl(cell, 0xba, 0x93);
}

export async function dnsResolveImpl(
    client: TonClient,
    dnsAddress: Address,
    rawDomainBytes: Uint8Array,
    category: string | undefined,
    oneStep: boolean | undefined,
): Promise<Cell | Address | bigint | null> {
    const len = rawDomainBytes.length * 8;

    const domainCell = new Builder()
        .storeBytes(rawDomainBytes)
        .cell();

    const categoryBigInt = categoryToBigInt(category);

    const {
        stack,
    } = await client.callGetMethod(
        dnsAddress,
        'dnsresolve',
        [['tvm.Slice', BOC.toBase64Standard(domainCell, { has_index: false })], ['num', categoryBigInt.toString()]],
    );

    if (stack.length !== 2) {
        throw new Error('Invalid dnsresolve response');
    }
    const resultLen = Number(stack[0]);

    const cell = stack[1] as Cell;

    if (cell && !cell.bits) { // not a Cell
        throw new Error('Invalid dnsresolve response');
    }

    if (resultLen === 0) {
        return null; // domain cannot be resolved
    }

    if (resultLen % 8 !== 0) {
        throw new Error('domain split not at a component boundary');
    }

    if (resultLen > len) {
        throw new Error(`invalid response ${resultLen}/${len}`);
    } else if (resultLen === len) {
        if (category === DNS_CATEGORY_NEXT_RESOLVER) {
            return cell ? parseNextResolverRecord(cell) : null;
        }
        if (category === DNS_CATEGORY_WALLET) {
            return cell ? parseSmartContractAddressRecord(cell) : null;
        }
        if (category === DNS_CATEGORY_SITE) {
            return cell || null; // todo: convert to BN;
        }
        return cell;
    } else {
        if (!cell) {
            return null; // domain cannot be resolved
        }
        const nextAddress = parseNextResolverRecord(cell);
        if (oneStep) {
            if (category === DNS_CATEGORY_NEXT_RESOLVER) {
                return nextAddress;
            }
            return null;
        }
        return dnsResolveImpl(
            client,
            nextAddress as Address,
            rawDomainBytes.slice(resultLen / 8),
            category,
            false,
        );
    }
}

export function domainToBuffer(domain: string): Buffer {
    if (!domain || !domain.length) {
        throw new Error('empty domain');
    }
    if (domain === '.') {
        return Buffer.from([0]);
    }

    const domainNorm = domain.toLowerCase();

    for (let i = 0; i < domainNorm.length; i++) {
        if (domainNorm.charCodeAt(i) <= 32) {
            throw new Error('bytes in range 0..32 are not allowed in domain names');
        }
    }

    for (let i = 0; i < domainNorm.length; i++) {
        const s = domainNorm.substring(i, i + 1);
        for (let c = 127; c <= 159; c++) { // another control codes range
            if (s === String.fromCharCode(c)) {
                throw new Error('bytes in range 127..159 are not allowed in domain names');
            }
        }
    }

    const arr = domainNorm.split('.');

    arr.forEach((part) => {
        if (!part.length) {
            throw new Error('domain name cannot have an empty component');
        }
    });

    const rawDomain = `\0${arr.reverse()
        .join('\0')}\0`;
    return Buffer.from(rawDomain, 'utf-8');
}

export async function dnsResolve(
    client: TonClient,
    rootDnsAddress: Address,
    domain: string,
    category: string | undefined,
    oneStep: boolean | undefined,
): Promise<Cell | Address | bigint | null> {
    const rawDomainBuffer = domainToBuffer(domain);
    return dnsResolveImpl(client, rootDnsAddress, rawDomainBuffer, category, oneStep);
}
