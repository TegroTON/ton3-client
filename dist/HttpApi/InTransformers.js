"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetMethodStack_1 = __importDefault(require("../Utils/GetMethodStack"));
exports.default = {
    getAddressInformation: (opts) => ({
        address: opts.address.toString('base64', { bounceable: true }),
    }),
    getTransactions: (opts) => ({
        ...opts,
        address: opts.address.toString('base64', { bounceable: true }),
    }),
    estimateFee: (opts) => ({
        address: opts.address.toString('base64', { bounceable: true }),
        body: opts.body.toString('base64', { has_index: false }),
        init_data: opts.initData ? opts.initData.toString('base64', { has_index: false }) : '',
        init_code: opts.initCode ? opts.initCode.toString('base64', { has_index: false }) : '',
        ignore_chksig: opts.ignoreSignature ?? false,
    }),
    runGetMethod: (opts) => ({
        address: opts.address.toString('base64', { bounceable: true }),
        method: opts.method,
        stack: opts.raw === true || !opts.params ? opts.params ?? [] : GetMethodStack_1.default.pack(opts.params),
    }),
    sendBoc: (opts) => ({
        boc: opts.body.toString('base64', { has_index: false }),
    }),
    getConfigParam: (opts) => ({
        config_id: opts.configId,
        seqno: opts.seqno?.toString(),
    }),
};
//# sourceMappingURL=InTransformers.js.map