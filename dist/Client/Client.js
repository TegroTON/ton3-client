"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TonClient = void 0;
const ton3_core_1 = require("ton3-core");
const helpers_1 = require("ton3-core/dist/utils/helpers");
const HttpApi_1 = require("../HttpApi/HttpApi");
const DNS_1 = __importDefault(require("./DNS"));
const Jetton_1 = __importDefault(require("./Jetton"));
const NFT_1 = __importDefault(require("./NFT"));
class TonClient extends HttpApi_1.HttpApi {
    constructor(params) {
        super(params);
        this.DNS = new DNS_1.default(this);
        this.Jetton = new Jetton_1.default(this);
        this.NFT = new NFT_1.default(this);
    }
    isTestnet() {
        return this.params.endpoint.indexOf('testnet') > -1;
    }
    async getBalance(address) {
        return (await this.getAddressInformation({ address })).balance;
    }
    async isContractDeployed(address) {
        return (await this.getAddressInformation({ address })).state === 'active';
    }
    async sendMessage(src, key) {
        await this.sendBoc({ body: src.sign(key) });
    }
    async getEstimateFee(src) {
        const msgSlice = (src instanceof ton3_core_1.Cell ? src : src.sign((0, helpers_1.hexToBytes)('4a41991bb2834030d8587e12dd0e8140c181316db51b289890ccd4f64e41345f4a41991bb2834030d8587e12dd0e8140c181316db51b289890ccd4f64e41345f'))).parse();
        msgSlice.skip(2);
        msgSlice.loadAddress();
        const address = msgSlice.loadAddress();
        if (!(address instanceof ton3_core_1.Address))
            throw Error('Unsupported Address (addr_none or other)');
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
                const stateSlice = msgSlice.loadRef().parse();
                const { data, code } = parseState(stateSlice);
                initData = data;
                initCode = code;
            }
            else {
                const stateSlice = msgSlice.loadRef().parse();
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
        return this.estimateFee({
            address,
            body,
            initData,
            initCode,
            ignoreSignature: true,
        });
    }
}
exports.TonClient = TonClient;
//# sourceMappingURL=Client.js.map