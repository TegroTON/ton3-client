import { Address, Cell } from 'ton3-core';
declare type NFTItemData = {
    isInitialized: boolean;
    index: bigint;
    collectionAddress: Address | null;
    ownerAddress: Address | null;
    contentCell: Cell;
};
export { NFTItemData, };
