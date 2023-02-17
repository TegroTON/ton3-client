import * as t from 'io-ts';
import { Cell } from 'ton3-core';
import Method from './Method';
import Codecs from './Codecs';
import InTransformers, {
    InAddressInformation,
    InEstimateFee, InGetConfigParam,
    InGetTransactions, InRunGetMethod, InSendBoc,
} from './InTransformers';
import OutTransformers from './OutTransformers';
import {
    TonTransaction, TonAddressInformation, TonFees, TonGetMethod,
} from './types';

export interface HttpApiParameters {
    endpoint: string;
    timeout?: number;
    apiKey?: string;
}

export interface HttpApiResolvedParameters extends HttpApiParameters {
    timeout: number;
}

export class HttpApi {
    protected readonly params: HttpApiResolvedParameters;

    public getAddressInformation: (opts: InAddressInformation) => Promise<TonAddressInformation>;

    public getTransactions: (opts: InGetTransactions) => Promise<TonTransaction[]>;

    public estimateFee: (opts: InEstimateFee) => Promise<TonFees>;

    public runGetMethod: (opts: InRunGetMethod) => Promise<TonGetMethod>;

    public sendBoc: (opts: InSendBoc) => Promise<t.TypeOf<typeof Codecs.bocResponse>>;

    public getConfigParam: (opts: InGetConfigParam) => Promise<Cell>;

    constructor(params: HttpApiParameters) {
        this.params = {
            ...params,
            timeout: params?.timeout || 30000, // 30 seconds by default
        };

        this.getAddressInformation = (opts) => new Method({
            ...this.params,
            methodName: 'getAddressInformation',
            codec: Codecs.addressInformation,
            inTransformer: InTransformers.getAddressInformation,
            outTransformer: OutTransformers.getAddressInformation,
        }).call(opts);

        this.getTransactions = (opts) => new Method({
            ...this.params,
            methodName: 'getTransactions',
            codec: Codecs.getTransactions,
            inTransformer: InTransformers.getTransactions,
            outTransformer: OutTransformers.getTransactions,
        }).call(opts);

        this.estimateFee = (opts) => new Method({
            ...this.params,
            methodName: 'estimateFee',
            codec: Codecs.estimateFee,
            inTransformer: InTransformers.estimateFee,
            outTransformer: OutTransformers.estimateFee,
        }).call(opts);

        this.runGetMethod = (opts) => new Method({
            ...this.params,
            methodName: 'runGetMethod',
            codec: Codecs.runGetMethod,
            inTransformer: InTransformers.runGetMethod,
            outTransformer: OutTransformers.runGetMethod,
        }).call(opts);

        this.sendBoc = (opts) => new Method({
            ...this.params,
            methodName: 'sendBoc',
            codec: Codecs.bocResponse,
            inTransformer: InTransformers.sendBoc,
            outTransformer: OutTransformers.sendBoc,
        }).call(opts);

        this.getConfigParam = (opts) => new Method({
            ...this.params,
            methodName: 'getConfigParam',
            codec: Codecs.getConfigParam,
            inTransformer: InTransformers.getConfigParam,
            outTransformer: OutTransformers.getConfigParam,
        }).call(opts);
    }
}
