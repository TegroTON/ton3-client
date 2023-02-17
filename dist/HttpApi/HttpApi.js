"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpApi = void 0;
const Method_1 = __importDefault(require("./Method"));
const Codecs_1 = __importDefault(require("./Codecs"));
const InTransformers_1 = __importDefault(require("./InTransformers"));
const OutTransformers_1 = __importDefault(require("./OutTransformers"));
class HttpApi {
    constructor(params) {
        this.params = {
            ...params,
            timeout: params?.timeout || 30000,
        };
        this.getAddressInformation = (opts) => new Method_1.default({
            ...this.params,
            methodName: 'getAddressInformation',
            codec: Codecs_1.default.addressInformation,
            inTransformer: InTransformers_1.default.getAddressInformation,
            outTransformer: OutTransformers_1.default.getAddressInformation,
        }).call(opts);
        this.getTransactions = (opts) => new Method_1.default({
            ...this.params,
            methodName: 'getTransactions',
            codec: Codecs_1.default.getTransactions,
            inTransformer: InTransformers_1.default.getTransactions,
            outTransformer: OutTransformers_1.default.getTransactions,
        }).call(opts);
        this.estimateFee = (opts) => new Method_1.default({
            ...this.params,
            methodName: 'estimateFee',
            codec: Codecs_1.default.estimateFee,
            inTransformer: InTransformers_1.default.estimateFee,
            outTransformer: OutTransformers_1.default.estimateFee,
        }).call(opts);
        this.runGetMethod = (opts) => new Method_1.default({
            ...this.params,
            methodName: 'runGetMethod',
            codec: Codecs_1.default.runGetMethod,
            inTransformer: InTransformers_1.default.runGetMethod,
            outTransformer: OutTransformers_1.default.runGetMethod,
        }).call(opts);
        this.sendBoc = (opts) => new Method_1.default({
            ...this.params,
            methodName: 'sendBoc',
            codec: Codecs_1.default.bocResponse,
            inTransformer: InTransformers_1.default.sendBoc,
            outTransformer: OutTransformers_1.default.sendBoc,
        }).call(opts);
        this.getConfigParam = (opts) => new Method_1.default({
            ...this.params,
            methodName: 'getConfigParam',
            codec: Codecs_1.default.getConfigParam,
            inTransformer: InTransformers_1.default.getConfigParam,
            outTransformer: OutTransformers_1.default.getConfigParam,
        }).call(opts);
    }
}
exports.HttpApi = HttpApi;
//# sourceMappingURL=HttpApi.js.map