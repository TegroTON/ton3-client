import { Address, BOC, Cell } from 'ton3-core';
import GetMethodStack from '../Utils/GetMethodStack';

export interface InAddressInformation { address: Address }
export interface InGetTransactions {
    address: Address,
    limit?: number,
    lt?: string,
    hash?: string,
    to_lt?: string,
    archival?: boolean
}

export interface InEstimateFee {
    address: Address,
    body: Cell,
    initCode?: Cell,
    initData?: Cell,
    ignoreSignature?: boolean
}

export interface InRunGetMethod {
    address: Address,
    method: string,
    params?: any[] // TODO
    raw?: boolean
}

export interface InSendBoc {
    body: Cell
}

export interface InGetConfigParam {
    configId: number,
    seqno?: bigint | string,
}

export default {
    getAddressInformation: (opts: InAddressInformation) => ({
        address: opts.address.toString('base64', { bounceable: true }),
    }),
    getTransactions: (opts: InGetTransactions) => ({
        ...opts,
        address: opts.address.toString('base64', { bounceable: true }),
    }),
    estimateFee: (opts: InEstimateFee) => ({
        address: opts.address.toString('base64', { bounceable: true }),
        body: opts.body.toString('base64', { has_index: false }),
        init_data: opts.initData ? opts.initData.toString('base64', { has_index: false }) : '',
        init_code: opts.initCode ? opts.initCode.toString('base64', { has_index: false }) : '',
        ignore_chksig: opts.ignoreSignature ?? false,
    }),
    runGetMethod: (opts: InRunGetMethod) => ({
        address: opts.address.toString('base64', { bounceable: true }),
        method: opts.method,
        stack: opts.raw === true || !opts.params ? opts.params ?? [] : GetMethodStack.pack(opts.params),
    }),
    sendBoc: (opts: InSendBoc) => ({
        boc: opts.body.toString('base64', { has_index: false }),
    }),
    getConfigParam: (opts: InGetConfigParam) => ({
        config_id: opts.configId,
        seqno: opts.seqno?.toString(),
    }),
};
