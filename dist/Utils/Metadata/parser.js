"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMetadata = void 0;
const ton3_core_1 = require("ton3-core");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
const uriToJson = async (uri) => {
    const res = await axios_1.default.get(uri.replace(/^ipfs:\/\//, constants_1.IPFS_GATEWAY_PREFIX), { timeout: 60000 });
    if (res.status !== 200) {
        throw Error(`Received error: ${JSON.stringify(res.data)}`);
    }
    return res.data;
};
const parseOnchain = async (content, keys = constants_1.JettonMetadataKeys) => {
    const deserializers = {
        key: (k) => (new ton3_core_1.Builder().storeBits(k).cell()).parse()
            .loadBigUint(256),
        value: (v) => v.refs[0],
    };
    const parsed = [...ton3_core_1.Hashmap.parse(256, content.refs[0].parse(), { deserializers })];
    const normalize = parsed.map((elem) => {
        const name = Object.keys(keys).find((key) => keys[key] === elem[0]);
        const ds = elem[1].parse();
        if (ds.bits.length < 8)
            return [name, ''];
        const prefix = ds.loadUint(8);
        switch (prefix) {
            case constants_1.DataFormat.SNAKE:
                return [name, ds.loadText()];
            case constants_1.DataFormat.CHUNK:
                return [name, ''];
            default:
                return [name, ''];
        }
    });
    const metadata = Object.fromEntries(normalize);
    return Object.fromEntries(Object.keys(keys).map((key) => [key, key in metadata ? metadata[key] : '']));
};
const parseOffchain = async (content, keys = constants_1.JettonMetadataKeys) => {
    const uri = content.parse().skip(8).loadText();
    const metadata = await uriToJson(uri);
    return Object.fromEntries(Object.keys(keys).map((key) => [key, key in metadata ? metadata[key] : '']));
};
const parseMetadata = async (content, keys = constants_1.JettonMetadataKeys) => {
    const ds = content.parse();
    if (ds.bits.length < 8) {
        throw Error('Invalid metadata');
    }
    const contentLayout = ds.loadUint(8);
    switch (contentLayout) {
        case constants_1.ContentLayout.ONCHAIN:
            return parseOnchain(content, keys);
        case constants_1.ContentLayout.OFFCHAIN:
            return parseOffchain(content, keys);
        default:
            throw Error('Invalid metadata prefix');
    }
};
exports.parseMetadata = parseMetadata;
//# sourceMappingURL=parser.js.map