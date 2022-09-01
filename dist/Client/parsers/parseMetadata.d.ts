import { Cell } from 'ton3-core';
import { MetadataKeys } from '../types';
export declare const parseMetadata: (content: Cell, keys?: MetadataKeys) => Promise<{
    [key: string]: string;
}>;
