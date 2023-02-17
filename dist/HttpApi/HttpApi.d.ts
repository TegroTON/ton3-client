import * as t from 'io-ts';
import { Cell } from 'ton3-core';
import Codecs from './Codecs';
import { InAddressInformation, InEstimateFee, InGetConfigParam, InGetTransactions, InRunGetMethod, InSendBoc } from './InTransformers';
import { TonTransaction, TonAddressInformation, TonFees, TonGetMethod } from './types';
export interface HttpApiParameters {
    endpoint: string;
    timeout?: number;
    apiKey?: string;
}
export interface HttpApiResolvedParameters extends HttpApiParameters {
    timeout: number;
}
export declare class HttpApi {
    protected readonly params: HttpApiResolvedParameters;
    getAddressInformation: (opts: InAddressInformation) => Promise<TonAddressInformation>;
    getTransactions: (opts: InGetTransactions) => Promise<TonTransaction[]>;
    estimateFee: (opts: InEstimateFee) => Promise<TonFees>;
    runGetMethod: (opts: InRunGetMethod) => Promise<TonGetMethod>;
    sendBoc: (opts: InSendBoc) => Promise<t.TypeOf<typeof Codecs.bocResponse>>;
    getConfigParam: (opts: InGetConfigParam) => Promise<Cell>;
    constructor(params: HttpApiParameters);
}
