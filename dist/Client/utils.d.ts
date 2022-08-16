import { HTTPMessage, HTTPTransaction } from '../HttpApi/types';
import { TonMessage, TonTransaction } from './types';
export declare function convertMessage(t: HTTPMessage): TonMessage;
export declare function convertTransaction(r: HTTPTransaction): TonTransaction;
