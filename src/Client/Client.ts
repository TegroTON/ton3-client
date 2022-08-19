import { Address, Cell, Coins } from 'ton3-core';
import { base64ToBytes } from 'ton3-core/dist/utils/helpers';
import { MessageExternalIn } from 'ton3-core/dist/contracts';
import { HttpApi } from '../HttpApi/HttpApi';
import GetMethodParser from '../GetMethodParser';
import { TonTransaction } from './types';
import { convertTransaction } from './utils';

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

    constructor(parameters: TonClientParameters) {
        this.parameters = {
            endpoint: parameters.endpoint,
        };
        this.#api = new HttpApi(this.parameters.endpoint, {
            timeout: parameters.timeout,
            apiKey: parameters.apiKey,
        });
    }

    isTestnet(): boolean {
        return this.#api.endpoint.indexOf('testnet') > -1;
    }

    async callGetMethodWithError(
        address: Address,
        name: string,
        params: any[] = [],
    ): Promise<{ gasUsed: number, stack: any[], exitCode: number }> {
        const res = await this.#api.callGetMethod(address, name, params);
        return { gasUsed: res.gas_used, stack: GetMethodParser.parseStack(res.stack), exitCode: res.exit_code };
    }

    async getTransactions(address: Address, opts: {
        limit: number,
        lt?: string,
        hash?: string,
        to_lt?: string,
        inclusive?: boolean
    }) {
        // Fetch transactions
        const tx = await this.#api.getTransactions(address, opts);
        const res: TonTransaction[] = [];
        for (const r of tx) {
            res.push(convertTransaction(r));
        }
        return res;
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

    async sendMessage(src: MessageExternalIn, key: Uint8Array) {
        await this.sendBoc(src.sign(key));
    }

    async sendBoc(src: Cell) {
        await this.#api.sendBoc(src);
    }

    async getEstimateFee(
        address: Address,
        body: Cell,
        ignoreSignature = true,
    ) {
        const {
            source_fees: {
                in_fwd_fee, storage_fee, gas_fee, fwd_fee,
            },
        } = await this.#api.estimateFee(address, {
            body,
            ignoreSignature,
        });

        return {
            inFwdFee: new Coins(in_fwd_fee, { isNano: true }),
            storageFee: new Coins(storage_fee, { isNano: true }),
            gasFee: new Coins(gas_fee, { isNano: true }),
            fwdFee: new Coins(fwd_fee, { isNano: true }),
        };
    }
}
