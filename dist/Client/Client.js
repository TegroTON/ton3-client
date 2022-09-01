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
const GetMethodParser_1 = __importDefault(require("../Utils/GetMethodParser"));
const utils_1 = require("./utils");
const parseTransferTransaction_1 = require("./parsers/parseTransferTransaction");
const parseInternalTransferTransaction_1 = require("./parsers/parseInternalTransferTransaction");
const parseBurnTransaction_1 = require("./parsers/parseBurnTransaction");
const parseMetadata_1 = require("./parsers/parseMetadata");
const constants_1 = require("./constants");
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
    async callGetMethod(address, name, params = []) {
        const res = await __classPrivateFieldGet(this, _TonClient_api, "f").callGetMethod(address, name, params);
        return { gasUsed: res.gas_used, stack: GetMethodParser_1.default.parseStack(res.stack), exitCode: res.exit_code };
    }
    async getTransactions(address, opts) {
        try {
            const tx = await __classPrivateFieldGet(this, _TonClient_api, "f").getTransactions(address, opts);
            const res = [];
            for (const r of tx) {
                res.push((0, utils_1.convertTransaction)(r));
            }
            return res;
        }
        catch {
            return [];
        }
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
    async sendMessage(src, key) {
        await this.sendBoc(src.sign(key));
    }
    async sendBoc(src) {
        await __classPrivateFieldGet(this, _TonClient_api, "f").sendBoc(src);
    }
    async getEstimateFee(src) {
        const msgSlice = ton3_core_1.Slice.parse(src instanceof ton3_core_1.Cell ? src : src.sign((0, helpers_1.hexToBytes)('4a41991bb2834030d8587e12dd0e8140c181316db51b289890ccd4f64e41345f4a41991bb2834030d8587e12dd0e8140c181316db51b289890ccd4f64e41345f')));
        msgSlice.skip(2);
        msgSlice.loadAddress();
        const address = msgSlice.loadAddress();
        if (!address)
            throw Error('Invalid Address (addr_none)');
        msgSlice.loadCoins();
        let body;
        let initCode;
        let initData;
        const parseState = (stateSlice) => {
            let data;
            let code;
            const maybeDepth = stateSlice.loadBit();
            if (maybeDepth)
                stateSlice.skip(5);
            const maybeTickTock = stateSlice.loadBit();
            if (maybeTickTock)
                stateSlice.skip(2);
            const maybeCode = stateSlice.loadBit();
            if (maybeCode)
                code = stateSlice.loadRef();
            const maybeData = stateSlice.loadBit();
            if (maybeData)
                data = stateSlice.loadRef();
            stateSlice.skipDict();
            return { data, code };
        };
        const maybeState = msgSlice.loadBit();
        if (maybeState) {
            const eitherState = msgSlice.loadBit();
            if (eitherState) {
                const stateSlice = ton3_core_1.Slice.parse(msgSlice.loadRef());
                const { data, code } = parseState(stateSlice);
                initData = data;
                initCode = code;
            }
            else {
                const stateSlice = ton3_core_1.Slice.parse(msgSlice.loadRef());
                const { data, code } = parseState(stateSlice);
                initData = data;
                initCode = code;
            }
        }
        const eitherBody = msgSlice.loadBit();
        if (eitherBody) {
            body = msgSlice.loadRef();
        }
        else {
            body = new ton3_core_1.Builder().storeSlice(msgSlice).cell();
        }
        const { source_fees: { in_fwd_fee, storage_fee, gas_fee, fwd_fee, }, } = await __classPrivateFieldGet(this, _TonClient_api, "f").estimateFee(address, {
            body,
            initData,
            initCode,
            ignoreSignature: true,
        });
        return {
            inFwdFee: new ton3_core_1.Coins(in_fwd_fee, { isNano: true }),
            storageFee: new ton3_core_1.Coins(storage_fee, { isNano: true }),
            gasFee: new ton3_core_1.Coins(gas_fee, { isNano: true }),
            fwdFee: new ton3_core_1.Coins(fwd_fee, { isNano: true }),
        };
    }
    async getJettonWalletAddress(jettonMasterContract, walletOwner) {
        const ownerAddressCell = new ton3_core_1.Builder().storeAddress(walletOwner).cell();
        const { stack } = await this.callGetMethod(jettonMasterContract, 'get_wallet_address', [
            [
                'tvm.Slice',
                ton3_core_1.BOC.toBase64Standard(ownerAddressCell, { has_index: false }),
            ],
        ]);
        return ton3_core_1.Slice.parse(stack[0]).preloadAddress();
    }
    async getJettonData(jettonMasterContract, opts) {
        const { stack } = await this.callGetMethod(jettonMasterContract, 'get_jetton_data', []);
        const totalSupply = stack[0];
        const adminAddress = ton3_core_1.Slice.parse(stack[2]).loadAddress();
        const contentCell = stack[3];
        const jettonWalletCode = stack[4];
        return {
            totalSupply,
            adminAddress,
            content: await (0, parseMetadata_1.parseMetadata)(contentCell, opts?.metadataKeys),
            jettonWalletCode,
        };
    }
    async getJettonWalletData(jettonWallet) {
        const { stack, exitCode, } = await this.callGetMethod(jettonWallet, 'get_wallet_data', []);
        if (exitCode === -13)
            throw new Error('Jetton wallet is not deployed.');
        if (exitCode !== 0)
            throw new Error('Cannot retrieve jetton wallet data.');
        const jettonMasterAddress = ton3_core_1.Slice.parse(stack[2]).preloadAddress();
        const getDecimals = async () => {
            const { content } = await this.getJettonData(jettonMasterAddress);
            return 'decimals' in content ? ~~(content.decimals) : 9;
        };
        const decimals = await getDecimals();
        const balance = new ton3_core_1.Coins(stack[0], { isNano: true, decimals });
        const ownerAddress = ton3_core_1.Slice.parse(stack[1]).preloadAddress();
        const jettonWalletCode = stack[3];
        return {
            balance,
            ownerAddress,
            jettonMasterAddress,
            jettonWalletCode,
        };
    }
    async getJettonBalance(jettonWallet) {
        const { balance } = await this.getJettonWalletData(jettonWallet);
        return balance;
    }
    async getJettonTransactions(jettonWallet, limit = 5) {
        const transactions = await this.getTransactions(jettonWallet, { limit });
        return transactions
            .map((transaction) => {
            if (transaction.inMessage?.body?.type !== 'data') {
                return null;
            }
            const bodySlice = ton3_core_1.Slice.parse(ton3_core_1.BOC.fromStandard(transaction.inMessage.body.data));
            const operation = bodySlice.loadUint(32);
            try {
                switch (operation) {
                    case constants_1.JettonOperation.TRANSFER:
                        return (0, parseTransferTransaction_1.parseTransferTransaction)(bodySlice, transaction);
                    case constants_1.JettonOperation.INTERNAL_TRANSFER:
                        return (0, parseInternalTransferTransaction_1.parseInternalTransferTransaction)(bodySlice, transaction);
                    case constants_1.JettonOperation.BURN:
                        return (0, parseBurnTransaction_1.parseBurnTransaction)(bodySlice, transaction);
                    default:
                        return null;
                }
            }
            catch {
                return null;
            }
        })
            .filter((transaction) => !!transaction);
    }
}
exports.TonClient = TonClient;
_TonClient_api = new WeakMap();
//# sourceMappingURL=Client.js.map