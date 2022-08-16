"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpApi = void 0;
const ton3_core_1 = require("ton3-core");
const Either_1 = require("fp-ts/lib/Either");
const io_ts_reporters_1 = __importDefault(require("io-ts-reporters"));
const axios_1 = __importDefault(require("axios"));
const types_1 = require("./types");
const utils_1 = require("../utils");
class HttpApi {
    constructor(endpoint, parameters) {
        this.endpoint = endpoint;
        this.parameters = {
            timeout: parameters?.timeout || 30000,
            apiKey: parameters?.apiKey,
        };
    }
    getAddressInformation(address) {
        return this.doCall('getAddressInformation', { address: address.toString() }, types_1.addressInformation);
    }
    async getTransactions(address, opts) {
        const { inclusive } = opts;
        delete opts.inclusive;
        let hash;
        if (opts.hash) {
            hash = (0, utils_1.base64ToHex)(opts.hash);
        }
        let { limit } = opts;
        if (opts.hash && opts.lt && !inclusive) {
            limit++;
        }
        let res = await this.doCall('getTransactions', {
            address: address.toString(),
            ...opts,
            limit,
            hash,
        }, types_1.getTransactions);
        if (res.length > limit) {
            res = res.slice(0, limit);
        }
        if (opts.hash && opts.lt && !inclusive) {
            res.shift();
            return res;
        }
        return res;
    }
    async getMasterchainInfo() {
        return this.doCall('getMasterchainInfo', {}, types_1.getMasterchain);
    }
    async getTransaction(address, lt, hash) {
        const convHash = (0, utils_1.base64ToHex)(hash);
        const res = await this.doCall('getTransactions', {
            address: address.toString(),
            lt,
            hash: convHash,
            limit: 1,
        }, types_1.getTransactions);
        const ex = res.find((v) => v.transaction_id.lt === lt && v.transaction_id.hash === hash);
        if (ex) {
            return ex;
        }
        return null;
    }
    async callGetMethod(address, method, params) {
        return this.doCall('runGetMethod', { address: address.toString(), method, stack: params }, types_1.callGetMethod);
    }
    async sendBoc(body) {
        await this.doCall('sendBoc', { boc: ton3_core_1.BOC.toBase64Standard(body, { has_index: false }) }, types_1.bocResponse);
    }
    async estimateFee(address, args) {
        return this.doCall('estimateFee', {
            address: address.toString(),
            body: ton3_core_1.BOC.toBase64Standard(args.body, { has_index: false }),
            init_data: args.initData ? ton3_core_1.BOC.toBase64Standard(args.initData, { has_index: false }) : '',
            init_code: args.initCode ? ton3_core_1.BOC.toBase64Standard(args.initCode, { has_index: false }) : '',
            ignore_chksig: args.ignoreSignature,
        }, types_1.feeResponse);
    }
    async doCall(method, body, codec) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.parameters.apiKey) {
            headers['X-API-Key'] = this.parameters.apiKey;
        }
        const res = await axios_1.default.post(this.endpoint, JSON.stringify({
            id: '1',
            jsonrpc: '2.0',
            method,
            params: body,
        }), {
            headers,
            timeout: this.parameters.timeout,
        });
        if (res.status !== 200 || !res.data.ok) {
            throw Error(`Received error: ${JSON.stringify(res.data)}`);
        }
        const decoded = codec.decode(res.data.result);
        if ((0, Either_1.isRight)(decoded)) {
            return decoded.right;
        }
        throw Error(`Malformed response: ${io_ts_reporters_1.default.report(decoded).join(', ')}`);
    }
}
exports.HttpApi = HttpApi;
//# sourceMappingURL=HttpApi.js.map