import {
    Bit, Builder, Cell, Hashmap, Slice,
} from 'ton3-core';
import axios from 'axios';
import {
    ContentLayout, DataFormat, IPFS_GATEWAY_PREFIX, JettonMetadataKeys,
} from './constants';
import { MetadataKeys } from './types';

const uriToJson = async (uri: string): Promise<{ [key: string]: string }> => {
    const res = await axios.get(uri.replace(/^ipfs:\/\//, IPFS_GATEWAY_PREFIX), { timeout: 60000 });
    if (res.status !== 200) {
        throw Error(`Received error: ${JSON.stringify(res.data)}`);
    }
    return res.data;
};

const parseOnchain = async (
    content: Cell,
    keys: MetadataKeys = JettonMetadataKeys,
): Promise<{ [key: string]: string }> => {
    const deserializers = {
        key: (k: Bit[]): bigint => (new Builder().storeBits(k).cell()).parse()
            .loadBigUint(256),
        value: (v: Cell): Cell => v.refs[0],
    };
    const parsed = [...Hashmap.parse(256, content.refs[0].parse(), { deserializers })];

    const normalize = parsed.map((elem) => {
        const name = Object.keys(keys).find((key) => keys[key] === elem[0]);
        const ds = elem[1].parse();
        if (ds.bits.length < 8) return [name, ''];
        const prefix = ds.loadUint(8);

        switch (prefix) {
            case DataFormat.SNAKE:
                return [name, ds.loadText()];
            case DataFormat.CHUNK:
                return [name, ''];
            default:
                return [name, ''];
        }
    });
    const metadata = Object.fromEntries(normalize);

    return Object.fromEntries(Object.keys(keys).map((key) => [key, key in metadata ? metadata[key] : '']));
};

const parseOffchain = async (
    content: Cell,
    keys: MetadataKeys = JettonMetadataKeys,
): Promise<{ [key: string]: string }> => {
    const uri = content.parse().skip(8).loadText();
    const metadata = await uriToJson(uri);

    return Object.fromEntries(Object.keys(keys).map((key) => [key, key in metadata ? metadata[key] : '']));
};

const parseMetadata = async (content: Cell, keys: MetadataKeys = JettonMetadataKeys) => {
    const ds = content.parse();
    if (ds.bits.length < 8) {
        throw Error('Invalid metadata');
    }

    const contentLayout = ds.loadUint(8);

    switch (contentLayout) {
        case ContentLayout.ONCHAIN:
            return parseOnchain(content, keys);
        case ContentLayout.OFFCHAIN:
            return parseOffchain(content, keys);
        default:
            throw Error('Invalid metadata prefix');
    }
};
export {
    parseMetadata,
};
