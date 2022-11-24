import { Cell } from 'ton3-core';
import { MetadataKeys } from '../types';
declare const _default: {
    parseMetadata(content: Cell, keys?: MetadataKeys): Promise<{
        [key: string]: string;
    }>;
};
export default _default;
