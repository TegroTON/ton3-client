import { MetadataKeys } from './types';

enum ContentLayout {
    ONCHAIN = 0x00,
    OFFCHAIN = 0x01,
}

enum DataFormat {
    SNAKE = 0x00,
    CHUNK = 0x01,
}

const CommonMetadataKeys: MetadataKeys = {
    uri: BigInt('0x70e5d7b6a29b392f85076fe15ca2f2053c56c2338728c4e33c9e8ddb1ee827cc'),
    name: BigInt('0x82a3537ff0dbce7eec35d69edc3a189ee6f17d82f353a553f9aa96cb0be3ce89'),
    description: BigInt('0xc9046f7a37ad0ea7cee73355984fa5428982f8b37c8f7bcec91f7ac71a7cd104'),
    image: BigInt('0x6105d6cc76af400325e94d588ce511be5bfdbb73b437dc51eca43917d7a43e3d'),
    image_data: BigInt('0xd9a88ccec79eef59c84b671136a20ece4cd00caaad5bc47e2c208829154ee9e4'),
};

const NFTMetadataKeys: MetadataKeys = {
    ...CommonMetadataKeys,
    attributes: BigInt('0xf1b4db36f908e557e2321176b6d345f5a700d4fba979381605327fdc1c8adbf7'),
};

const JettonMetadataKeys: MetadataKeys = {
    ...CommonMetadataKeys,
    symbol: BigInt('0xb76a7ca153c24671658335bbd08946350ffc621fa1c516e7123095d4ffd5c581'),
    decimals: BigInt('0xee80fd2f1e03480e2282363596ee752d7bb27f50776b95086a0279189675923e'),
};

const IPFS_GATEWAY_PREFIX = 'https://ipfs.io/ipfs/';

export {
    ContentLayout,
    DataFormat,
    CommonMetadataKeys,
    NFTMetadataKeys,
    JettonMetadataKeys,
    IPFS_GATEWAY_PREFIX,
};
