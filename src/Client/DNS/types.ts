import { Address, Cell } from 'ton3-core';

type NFTItemData = {
    isInitialized: boolean,
    index: bigint,
    collectionAddress: Address | null,
    ownerAddress: Address | null,
    contentCell: Cell
};

export {
    NFTItemData,
};
