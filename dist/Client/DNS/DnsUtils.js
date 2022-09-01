"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsResolve = exports.domainToBuffer = exports.dnsResolveImpl = exports.parseNextResolverRecord = exports.parseSmartContractAddressRecord = exports.parseSmartContractAddressImpl = exports.createNextResolverRecord = exports.createAdnlAddressRecord = exports.createSmartContractAddressRecord = exports.categoryToBigInt = exports.DNS_CATEGORY_SITE = exports.DNS_CATEGORY_WALLET = exports.DNS_CATEGORY_NEXT_RESOLVER = void 0;
const hash_1 = require("ton3-core/dist/utils/hash");
const helpers_1 = require("ton3-core/dist/utils/helpers");
const ton3_core_1 = require("ton3-core");
exports.DNS_CATEGORY_NEXT_RESOLVER = 'dns_next_resolver';
exports.DNS_CATEGORY_WALLET = 'wallet';
exports.DNS_CATEGORY_SITE = 'site';
function categoryToBigInt(category) {
    if (!category)
        return BigInt(0);
    const categoryBytes = (0, helpers_1.stringToBytes)(category);
    const categoryHash = (0, hash_1.sha256)(categoryBytes);
    return BigInt(`0x${categoryHash}`);
}
exports.categoryToBigInt = categoryToBigInt;
function createSmartContractAddressRecord(smartContractAddress) {
    return new ton3_core_1.Builder()
        .storeUint(0x9fd3, 16)
        .storeAddress(smartContractAddress)
        .storeUint(0, 8)
        .cell();
}
exports.createSmartContractAddressRecord = createSmartContractAddressRecord;
function createAdnlAddressRecord(adnlAddress) {
    return new ton3_core_1.Builder()
        .storeUint(0xad01, 16)
        .storeUint(adnlAddress, 256)
        .storeUint(0, 8)
        .cell();
}
exports.createAdnlAddressRecord = createAdnlAddressRecord;
function createNextResolverRecord(smartContractAddress) {
    return new ton3_core_1.Builder()
        .storeUint(0xba93, 16)
        .storeAddress(smartContractAddress)
        .cell();
}
exports.createNextResolverRecord = createNextResolverRecord;
function parseSmartContractAddressImpl(cell, prefix0, prefix1) {
    const ds = ton3_core_1.Slice.parse(cell);
    if (ds.loadUint(8) !== prefix0 || ds.loadUint(8) !== prefix1)
        throw new Error('Invalid dns record value prefix');
    return ds.loadAddress();
}
exports.parseSmartContractAddressImpl = parseSmartContractAddressImpl;
function parseSmartContractAddressRecord(cell) {
    return parseSmartContractAddressImpl(cell, 0x9f, 0xd3);
}
exports.parseSmartContractAddressRecord = parseSmartContractAddressRecord;
function parseNextResolverRecord(cell) {
    return parseSmartContractAddressImpl(cell, 0xba, 0x93);
}
exports.parseNextResolverRecord = parseNextResolverRecord;
async function dnsResolveImpl(client, dnsAddress, rawDomainBytes, category, oneStep) {
    const len = rawDomainBytes.length * 8;
    const domainCell = new ton3_core_1.Builder()
        .storeBytes(rawDomainBytes)
        .cell();
    const categoryBigInt = categoryToBigInt(category);
    const { stack, } = await client.callGetMethod(dnsAddress, 'dnsresolve', [['tvm.Slice', ton3_core_1.BOC.toBase64Standard(domainCell, { has_index: false })], ['num', categoryBigInt.toString()]]);
    if (stack.length !== 2) {
        throw new Error('Invalid dnsresolve response');
    }
    const resultLen = Number(stack[0]);
    const cell = stack[1];
    if (cell && !cell.bits) {
        throw new Error('Invalid dnsresolve response');
    }
    if (resultLen === 0) {
        return null;
    }
    if (resultLen % 8 !== 0) {
        throw new Error('domain split not at a component boundary');
    }
    if (resultLen > len) {
        throw new Error(`invalid response ${resultLen}/${len}`);
    }
    else if (resultLen === len) {
        if (category === exports.DNS_CATEGORY_NEXT_RESOLVER) {
            return cell ? parseNextResolverRecord(cell) : null;
        }
        if (category === exports.DNS_CATEGORY_WALLET) {
            return cell ? parseSmartContractAddressRecord(cell) : null;
        }
        if (category === exports.DNS_CATEGORY_SITE) {
            return cell || null;
        }
        return cell;
    }
    else {
        if (!cell) {
            return null;
        }
        const nextAddress = parseNextResolverRecord(cell);
        if (oneStep) {
            if (category === exports.DNS_CATEGORY_NEXT_RESOLVER) {
                return nextAddress;
            }
            return null;
        }
        return dnsResolveImpl(client, nextAddress, rawDomainBytes.slice(resultLen / 8), category, false);
    }
}
exports.dnsResolveImpl = dnsResolveImpl;
function domainToBuffer(domain) {
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
        for (let c = 127; c <= 159; c++) {
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
exports.domainToBuffer = domainToBuffer;
async function dnsResolve(client, rootDnsAddress, domain, category, oneStep) {
    const rawDomainBuffer = domainToBuffer(domain);
    return dnsResolveImpl(client, rootDnsAddress, rawDomainBuffer, category, oneStep);
}
exports.dnsResolve = dnsResolve;
//# sourceMappingURL=DnsUtils.js.map