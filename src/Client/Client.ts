import {
    Address, BOC, Builder, Cell, Coins, Slice,
} from 'ton3-core';
import { base64ToBytes, hexToBytes } from 'ton3-core/dist/utils/helpers';
import { MessageExternalIn } from 'ton3-core/dist/contracts';
import { HttpApi } from '../HttpApi/HttpApi';
import GetMethodParser from './parsers/GetMethodParser';
import { TonTransaction } from './types';
import { convertTransaction } from './utils';
import Dns from './DNS';
import Jetton from './Jetton';

export type TonClientParameters = {
    endpoint: string;
    timeout?: number;
    apiKey?: string;
};

export type TonClientResolvedParameters = {
    endpoint: string;
};

export class TonClient {
    readonly parameters: TonClientResolvedParameters;

    #api: HttpApi;

    DNS: Dns;

    Jetton: Jetton;

    constructor(parameters: TonClientParameters) {
        this.parameters = {
            endpoint: parameters.endpoint,
        };
        this.#api = new HttpApi(this.parameters.endpoint, {
            timeout: parameters.timeout,
            apiKey: parameters.apiKey,
        });

        this.DNS = new Dns(this);
        this.Jetton = new Jetton(this);
    }

    isTestnet(): boolean {
        return this.#api.endpoint.indexOf('testnet') > -1;
    }

    async callGetMethod(
        address: Address,
        name: string,
        params: any[] = [],
    ): Promise<{ gasUsed: number, stack: any[], exitCode: number }> {
        const res = await this.#api.callGetMethod(address, name, params);
        return {
            gasUsed: res.gas_used,
            stack: GetMethodParser.parseStack(res.stack),
            exitCode: res.exit_code,
        };
    }

    async getTransactions(address: Address, opts: {
        limit: number,
        lt?: string,
        hash?: string,
        to_lt?: string,
        inclusive?: boolean,
        archival?: boolean
    }): Promise<TonTransaction[]> {
        // Fetch transactions
        try {
            const tx = await this.#api.getTransactions(address, opts);
            const res: TonTransaction[] = [];
            for (const r of tx) {
                res.push(convertTransaction(r));
            }
            return res;
        } catch {
            return [];
        }
    }

    async getBalance(address: Address): Promise<Coins> {
        return (await this.getContractState(address)).balance;
    }

    async isContractDeployed(address: Address): Promise<boolean> {
        return (await this.getContractState(address)).state === 'active';
    }

    async getContractState(address: Address) {
        const info = await this.#api.getAddressInformation(address);
        const balance = new Coins(info.balance, { isNano: true });
        const state = info.state as 'frozen' | 'active' | 'uninitialized';
        return {
            balance,
            state,
            code: info.code !== '' ? base64ToBytes(info.code) : null,
            data: info.data !== '' ? base64ToBytes(info.data) : null,
            lastTransaction: info.last_transaction_id.lt !== '0' ? {
                lt: info.last_transaction_id.lt,
                hash: info.last_transaction_id.hash,
            } : null,
            blockId: {
                workchain: info.block_id.workchain,
                shard: info.block_id.shard,
                seqno: info.block_id.seqno,
            },
            timestamp: info.sync_utime,
        };
    }

    async getConfigParam(configId: number, seqno?:number) {
        const { bytes } = (await this.#api.getConfigParam(configId, { seqno })).config;
        return bytes ? BOC.fromStandard(bytes) : new Cell();
    }

    async sendMessage(src: MessageExternalIn, key: Uint8Array) {
        await this.sendBoc(src.sign(key));
    }

    async sendBoc(src: Cell) {
        await this.#api.sendBoc(src);
    }

    async getEstimateFee(
        src: MessageExternalIn | Cell,
    ): Promise<{ inFwdFee: Coins, storageFee: Coins, gasFee: Coins, fwdFee: Coins }> {
        const msgSlice = Slice.parse(src instanceof Cell ? src : src.sign(hexToBytes('4a41991bb2834030d8587e12dd0e8140c181316db51b289890ccd4f64e41345f4a41991bb2834030d8587e12dd0e8140c181316db51b289890ccd4f64e41345f')));
        msgSlice.skip(2);
        msgSlice.loadAddress();
        const address = msgSlice.loadAddress();
        if (!address) throw Error('Invalid Address (addr_none)');
        msgSlice.loadCoins();

        let body;
        let initCode;
        let initData;

        const parseState = (stateSlice: Slice): { data?: Cell, code?: Cell } => {
            let data;
            let code;
            const maybeDepth = stateSlice.loadBit();
            if (maybeDepth) stateSlice.skip(5);
            const maybeTickTock = stateSlice.loadBit();
            if (maybeTickTock) stateSlice.skip(2);
            const maybeCode = stateSlice.loadBit();
            if (maybeCode) code = stateSlice.loadRef();
            const maybeData = stateSlice.loadBit();
            if (maybeData) data = stateSlice.loadRef();
            stateSlice.skipDict();
            return { data, code };
        };

        const maybeState = msgSlice.loadBit();
        if (maybeState) {
            const eitherState = msgSlice.loadBit();
            if (eitherState) {
                const stateSlice = Slice.parse(msgSlice.loadRef());
                const { data, code } = parseState(stateSlice);
                initData = data;
                initCode = code;
            } else {
                const stateSlice = Slice.parse(msgSlice.loadRef());
                const { data, code } = parseState(stateSlice);
                initData = data;
                initCode = code;
            }
        }

        const eitherBody = msgSlice.loadBit();
        if (eitherBody) {
            body = msgSlice.loadRef();
        } else {
            body = new Builder().storeSlice(msgSlice).cell();
        }

        const {
            source_fees: {
                in_fwd_fee, storage_fee, gas_fee, fwd_fee,
            },
        } = await this.#api.estimateFee(address, {
            body,
            initData,
            initCode,
            ignoreSignature: true,
        });

        return {
            inFwdFee: new Coins(in_fwd_fee, { isNano: true }),
            storageFee: new Coins(storage_fee, { isNano: true }),
            gasFee: new Coins(gas_fee, { isNano: true }),
            fwdFee: new Coins(fwd_fee, { isNano: true }),
        };
    }
}
