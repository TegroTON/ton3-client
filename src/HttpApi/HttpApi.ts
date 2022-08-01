import {Address, BOC, Cell} from 'ton3-core';
import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';
import reporter from 'io-ts-reporters';
import axios from 'axios';
import {addressInformation, getTransactions, getMasterchain, callGetMethod, bocResponse, feeResponse} from "./types";
import {base64ToHex} from "../utils";

export interface HttpApiParameters {
    timeout?: number;
    apiKey?: string;
}

interface HttpApiResolvedParameters extends HttpApiParameters {
    timeout: number;
}

export class HttpApi {
    readonly endpoint: string;

    private readonly parameters: HttpApiResolvedParameters;

    constructor(endpoint: string, parameters?: HttpApiParameters) {
        this.endpoint = endpoint;

        this.parameters = {
            timeout: parameters?.timeout || 30000, // 30 seconds by default
            apiKey: parameters?.apiKey
        }
    }

    getAddressInformation(address: Address) {
        return this.doCall('getAddressInformation', { address: address.toString() }, addressInformation);
    }

    async getTransactions(address: Address, opts: { limit: number, lt?: string, hash?: string, to_lt?: string, inclusive?: boolean }) {
        const inclusive = opts.inclusive;
        delete opts.inclusive;

        // Convert hash
        let hash: string | undefined = undefined;
        if (opts.hash) {
            hash = base64ToHex(opts.hash);
        }

        // Adjust limit
        let limit = opts.limit;
        if (opts.hash && opts.lt && inclusive !== true) {
            limit++;
        }

        // Do request
        let res = await this.doCall('getTransactions', { address: address.toString(), ...opts, limit, hash }, getTransactions);
        if (res.length > limit) {
            res = res.slice(0, limit);
        }

        // Adjust result
        if (opts.hash && opts.lt && inclusive !== true) {
            res.shift();
            return res;
        } else {
            return res;
        }
    }

    async getMasterchainInfo() {
        return await this.doCall('getMasterchainInfo', {}, getMasterchain);
    }

    async getTransaction(address: Address, lt: string, hash: string) {
        let convHash = base64ToHex(hash);
        let res = await this.doCall('getTransactions', { address: address.toString(), lt, hash: convHash, limit: 1 }, getTransactions);
        let ex = res.find((v) => v.transaction_id.lt === lt && v.transaction_id.hash === hash);
        if (ex) {
            return ex;
        } else {
            return null;
        }
    }

    async callGetMethod(address: Address, method: string, params: any[]) {
        return await this.doCall('runGetMethod', { address: address.toString(), method, stack: params }, callGetMethod);
    }

    async sendBoc(body: Cell) {
        await this.doCall('sendBoc', { boc: BOC.toBase64Standard(body, {has_index: false}) }, bocResponse);
    }

    async estimateFee(address: Address, args: {
        body: Cell,
        initCode: Cell | null,
        initData: Cell | null,
        ignoreSignature: boolean
    }) {
        return await this.doCall('estimateFee', {
            address: address.toString(),
            body: BOC.toBase64Standard(args.body, {has_index: false}),
            'init_data': args.initData ? BOC.toBase64Standard(args.initData, {has_index: false}) : '',
            'init_code': args.initCode ? BOC.toBase64Standard(args.initCode, {has_index: false}) : '',
            ignore_chksig: args.ignoreSignature
        }, feeResponse);
    }

    private async doCall<T>(method: string, body: any, codec: t.Type<T>) {
        let headers: Record<string, any> = {
            'Content-Type': 'application/json'
        }
        if (this.parameters.apiKey) {
            headers['X-API-Key'] = this.parameters.apiKey
        }
        let res = await axios.post<{ ok: boolean, result: T }>(this.endpoint, JSON.stringify({
            id: '1',
            jsonrpc: '2.0',
            method: method,
            params: body
        }), {
            headers,
            timeout: this.parameters.timeout,
        })
        if (res.status !== 200 || !res.data.ok) {
            throw Error('Received error: ' + JSON.stringify(res.data));
        }
        let decoded = codec.decode(res.data.result);
        if (isRight(decoded)) {
            return decoded.right;
        } else {
            throw Error('Malformed response: ' + reporter.report(decoded).join(', '));
        }
    }
}
