import { MetadataKeys } from './types';
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
export { ContentLayout, DataFormat, CommonMetadataKeys, NFTMetadataKeys, JettonMetadataKeys, IPFS_GATEWAY_PREFIX, };
