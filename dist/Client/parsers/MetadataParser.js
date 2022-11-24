"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ton3_core_1 = require("ton3-core");
const helpers_1 = require("ton3-core/dist/utils/helpers");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const Helpers_1 = require("../../Utils/Helpers");
const uriToJson = async (uri) => {
    const res = await axios_1.default.get(uri.replace(/^ipfs:\/\//, constants_1.IPFS_GATEWAY_PREFIX), { timeout: 60000 });
    if (res.status !== 200) {
        throw Error(`Received error: ${JSON.stringify(res.data)}`);
    }
    return res.data;
};
const parseOnchain = async (content, keys = constants_1.JettonMetadataKeys) => {
    const deserializers = {
        key: (k) => ton3_core_1.Slice.parse(new ton3_core_1.Builder().storeBits(k).cell()).loadBigUint(256),
        value: (v) => v.refs[0],
    };
    const parsed = [...ton3_core_1.Hashmap.parse(256, ton3_core_1.Slice.parse(content.refs[0]), { deserializers })];
    const normalize = parsed.map((elem) => {
        const name = Object.keys(keys).find((key) => keys[key] === elem[0]);
        const ds = ton3_core_1.Slice.parse(elem[1]);
        if (ds.bits.length < 8)
            return [name, ''];
        const prefix = ds.loadUint(8);
        switch (prefix) {
            case constants_1.DataFormat.SNAKE:
                return [name, (0, helpers_1.bytesToString)((0, Helpers_1.loadSnake)(ds))];
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
    const uri = (0, helpers_1.bytesToString)((0, Helpers_1.loadSnake)(ton3_core_1.Slice.parse(content).skip(8)));
    const metadata = await uriToJson(uri);
    return Object.fromEntries(Object.keys(keys).map((key) => [key, key in metadata ? metadata[key] : '']));
};
exports.default = {
    async parseMetadata(content, keys = constants_1.JettonMetadataKeys) {
        const ds = ton3_core_1.Slice.parse(content);
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
    },
};
//# sourceMappingURL=MetadataParser.js.map