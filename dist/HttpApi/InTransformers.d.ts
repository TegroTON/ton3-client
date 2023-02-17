import { Address, Cell } from 'ton3-core';
export interface InAddressInformation {
    address: Address;
}
export interface InGetTransactions {
    address: Address;
    limit?: number;
    lt?: string;
    hash?: string;
    to_lt?: string;
    archival?: boolean;
}
export interface InEstimateFee {
    address: Address;
    body: Cell;
    initCode?: Cell;
    initData?: Cell;
    ignoreSignature?: boolean;
}
export interface InRunGetMethod {
    address: Address;
    method: string;
    params?: any[];
    raw?: boolean;
}
export interface InSendBoc {
    body: Cell;
}
export interface InGetConfigParam {
    configId: number;
    seqno?: bigint | string;
}
declare const _default: {
    getAddressInformation: (opts: InAddressInformation) => {
        address: string;
    };
    getTransactions: (opts: InGetTransactions) => {
        address: string;
        limit?: number | undefined;
        lt?: string | undefined;
        hash?: string | undefined;
        to_lt?: string | undefined;
        archival?: boolean | undefined;
    };
    estimateFee: (opts: InEstimateFee) => {
        address: string;
        body: string;
        init_data: string;
        init_code: string;
        ignore_chksig: boolean;
    };
    runGetMethod: (opts: InRunGetMethod) => {
        address: string;
        method: string;
        stack: any[];
    };
    sendBoc: (opts: InSendBoc) => {
        boc: string;
    };
    getConfigParam: (opts: InGetConfigParam) => {
        config_id: number;
        seqno: string | undefined;
    };
};
export default _default;
