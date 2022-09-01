import { MetadataKeys } from './types';
declare enum JettonOperation {
    TRANSFER = 260734629,
    TRANSFER_NOTIFICATION = 1935855772,
    INTERNAL_TRANSFER = 395134233,
    EXCESSES = 3576854235,
    BURN = 1499400124,
    BURN_NOTIFICATION = 2078119902
}
declare enum ContentLayout {
    ONCHAIN = 0,
    OFFCHAIN = 1
}
declare enum DataFormat {
    SNAKE = 0,
    CHUNK = 1
}
declare const CommonMetadataKeys: MetadataKeys;
declare const NFTMetadataKeys: MetadataKeys;
declare const JettonMetadataKeys: MetadataKeys;
declare const IPFS_GATEWAY_PREFIX = "https://ipfs.io/ipfs/";
export { JettonOperation, ContentLayout, DataFormat, CommonMetadataKeys, NFTMetadataKeys, JettonMetadataKeys, IPFS_GATEWAY_PREFIX, };
