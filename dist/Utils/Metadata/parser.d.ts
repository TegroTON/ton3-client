import { Cell } from 'ton3-core';
import { MetadataKeys } from './types';
declare const parseMetadata: (content: Cell, keys?: MetadataKeys) => Promise<{
    [key: string]: string;
}>;
export { parseMetadata, };
