import {
    Bit, Builder, Cell, Hashmap, Slice,
} from 'ton3-core';
import { bytesToString } from 'ton3-core/dist/utils/helpers';
import axios from 'axios';
import {
    ContentLayout, DataFormat, IPFS_GATEWAY_PREFIX, JettonMetadataKeys,
} from '../constants';
import { MetadataKeys } from '../types';
import { loadSnake } from '../../Utils/Helpers';

const uriToJson = async (uri: string): Promise<{ [key: string]: string }> => {
    const res = await axios.get(uri.replace(/^ipfs:\/\//, IPFS_GATEWAY_PREFIX), { timeout: 60000 });
    if (res.status !== 200) {
        throw Error(`Received error: ${JSON.stringify(res.data)}`);
    }
    return res.data;
};

const parseOnchain = async (content: Cell, keys: MetadataKeys = JettonMetadataKeys): Promise<{ [key: string]: string }> => {
    const deserializers = {
        key: (k: Bit[]): bigint => Slice.parse(new Builder().storeBits(k).cell()).loadBigUint(256),
        value: (v: Cell): Cell => v.refs[0],
    };
    const parsed = [...Hashmap.parse(256, Slice.parse(content.refs[0]), { deserializers })];

    const normalize = parsed.map((elem) => {
        const name = Object.keys(keys).find((key) => keys[key] === elem[0]);
        const ds = Slice.parse(elem[1]);
        if (ds.bits.length < 8) return [name, ''];
        const prefix = ds.loadUint(8);

        switch (prefix) {
            case DataFormat.SNAKE:
                return [name, bytesToString(loadSnake(ds))];
            case DataFormat.CHUNK:
                return [name, ''];
            default:
                return [name, ''];
        }
    });
    const metadata = Object.fromEntries(normalize);

    return Object.fromEntries(Object.keys(keys).map((key) => [key, key in metadata ? metadata[key] : '']));
};

const parseOffchain = async (content: Cell, keys: MetadataKeys = JettonMetadataKeys): Promise<{ [key: string]: string }> => {
    const uri = bytesToString(loadSnake(Slice.parse(content).skip(8)));
    const metadata = await uriToJson(uri);

    return Object.fromEntries(Object.keys(keys).map((key) => [key, key in metadata ? metadata[key] : '']));
};

export const parseMetadata = async (content: Cell, keys: MetadataKeys = JettonMetadataKeys) => {
    const ds = Slice.parse(content);
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
