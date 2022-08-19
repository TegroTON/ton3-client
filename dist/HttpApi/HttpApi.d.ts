import { Address, Cell } from 'ton3-core';
export interface HttpApiParameters {
    timeout?: number;
    apiKey?: string;
}
export declare class HttpApi {
    readonly endpoint: string;
    private readonly parameters;
    constructor(endpoint: string, parameters?: HttpApiParameters);
    getAddressInformation(address: Address): Promise<{
        balance: string | number;
        state: "active" | "uninitialized" | "frozen";
        data: string;
        code: string;
        last_transaction_id: {
            '@type': "internal.transactionId";
            lt: string;
            hash: string;
        };
        block_id: {
            '@type': "ton.blockIdExt";
            workchain: number;
            shard: string;
            seqno: number;
            root_hash: string;
            file_hash: string;
        };
        sync_utime: number;
    }>;
    getTransactions(address: Address, opts: {
        limit: number;
        lt?: string;
        hash?: string;
        to_lt?: string;
        inclusive?: boolean;
    }): Promise<{
        data: string;
        utime: number;
        transaction_id: {
            lt: string;
            hash: string;
        };
        fee: string;
        storage_fee: string;
        other_fee: string;
        in_msg: {
            source: string;
            destination: string;
            value: string;
            fwd_fee: string;
            ihr_fee: string;
            created_lt: string;
            body_hash: string;
            msg_data: {
                '@type': "msg.dataRaw";
                body: string;
            } | {
                '@type': "msg.dataText";
                text: string;
            } | {
                '@type': "msg.dataDecryptedText";
                text: string;
            } | {
                '@type': "msg.dataEncryptedText";
                text: string;
            };
        } | undefined;
        out_msgs: {
            source: string;
            destination: string;
            value: string;
            fwd_fee: string;
            ihr_fee: string;
            created_lt: string;
            body_hash: string;
            msg_data: {
                '@type': "msg.dataRaw";
                body: string;
            } | {
                '@type': "msg.dataText";
                text: string;
            } | {
                '@type': "msg.dataDecryptedText";
                text: string;
            } | {
                '@type': "msg.dataEncryptedText";
                text: string;
            };
        }[];
    }[]>;
    getMasterchainInfo(): Promise<{
        state_root_hash: string;
        last: {
            '@type': "ton.blockIdExt";
            workchain: number;
            shard: string;
            seqno: number;
            root_hash: string;
            file_hash: string;
        };
        init: {
            '@type': "ton.blockIdExt";
            workchain: number;
            shard: string;
            seqno: number;
            root_hash: string;
            file_hash: string;
        };
    }>;
    getTransaction(address: Address, lt: string, hash: string): Promise<{
        data: string;
        utime: number;
        transaction_id: {
            lt: string;
            hash: string;
        };
        fee: string;
        storage_fee: string;
        other_fee: string;
        in_msg: {
            source: string;
            destination: string;
            value: string;
            fwd_fee: string;
            ihr_fee: string;
            created_lt: string;
            body_hash: string;
            msg_data: {
                '@type': "msg.dataRaw";
                body: string;
            } | {
                '@type': "msg.dataText";
                text: string;
            } | {
                '@type': "msg.dataDecryptedText";
                text: string;
            } | {
                '@type': "msg.dataEncryptedText";
                text: string;
            };
        } | undefined;
        out_msgs: {
            source: string;
            destination: string;
            value: string;
            fwd_fee: string;
            ihr_fee: string;
            created_lt: string;
            body_hash: string;
            msg_data: {
                '@type': "msg.dataRaw";
                body: string;
            } | {
                '@type': "msg.dataText";
                text: string;
            } | {
                '@type': "msg.dataDecryptedText";
                text: string;
            } | {
                '@type': "msg.dataEncryptedText";
                text: string;
            };
        }[];
    } | null>;
    callGetMethod(address: Address, method: string, params: any[]): Promise<{
        gas_used: number;
        exit_code: number;
        stack: unknown[];
    }>;
    sendBoc(body: Cell): Promise<void>;
    estimateFee(address: Address, args: {
        body: Cell;
        initCode?: Cell;
        initData?: Cell;
        ignoreSignature: boolean;
    }): Promise<{
        '@type': "query.fees";
        source_fees: {
            '@type': "fees";
            in_fwd_fee: number;
            storage_fee: number;
            gas_fee: number;
            fwd_fee: number;
        };
    }>;
    private doCall;
}
