"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _TonClient_api;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TonClient = void 0;
const ton3_core_1 = require("ton3-core");
const helpers_1 = require("ton3-core/dist/utils/helpers");
const HttpApi_1 = require("../HttpApi/HttpApi");
const GetMethodParser_1 = __importDefault(require("../GetMethodParser"));
const utils_1 = require("./utils");
class TonClient {
    constructor(parameters) {
        _TonClient_api.set(this, void 0);
        this.parameters = {
            endpoint: parameters.endpoint,
        };
        __classPrivateFieldSet(this, _TonClient_api, new HttpApi_1.HttpApi(this.parameters.endpoint, {
            timeout: parameters.timeout,
            apiKey: parameters.apiKey,
        }), "f");
    }
    isTestnet() {
        return __classPrivateFieldGet(this, _TonClient_api, "f").endpoint.indexOf('testnet') > -1;
    }
    async callGetMethodWithError(address, name, params = []) {
        const res = await __classPrivateFieldGet(this, _TonClient_api, "f").callGetMethod(address, name, params);
        return { gasUsed: res.gas_used, stack: GetMethodParser_1.default.parseStack(res.stack), exitCode: res.exit_code };
    }
    async getTransactions(address, opts) {
        const tx = await __classPrivateFieldGet(this, _TonClient_api, "f").getTransactions(address, opts);
        const res = [];
        for (const r of tx) {
            res.push((0, utils_1.convertTransaction)(r));
        }
        return res;
    }
    async getBalance(address) {
        return (await this.getContractState(address)).balance;
    }
    async isContractDeployed(address) {
        return (await this.getContractState(address)).state === 'active';
    }
    async getContractState(address) {
        const info = await __classPrivateFieldGet(this, _TonClient_api, "f").getAddressInformation(address);
        const balance = new ton3_core_1.Coins(info.balance, { isNano: true });
        const state = info.state;
        return {
            balance,
            state,
            code: info.code !== '' ? (0, helpers_1.base64ToBytes)(info.code) : null,
            data: info.data !== '' ? (0, helpers_1.base64ToBytes)(info.data) : null,
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
}
exports.TonClient = TonClient;
_TonClient_api = new WeakMap();
//# sourceMappingURL=Client.js.map