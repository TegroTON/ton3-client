"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Either_1 = require("fp-ts/lib/Either");
const io_ts_reporters_1 = __importDefault(require("io-ts-reporters"));
class Method {
    constructor(params) {
        this.params = params;
    }
    async call(body) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.params.apiKey) {
            headers['X-API-Key'] = this.params.apiKey;
        }
        const data = JSON.stringify({
            id: '1',
            jsonrpc: '2.0',
            method: this.params.methodName,
            params: body && this.params.inTransformer(body),
        });
        const res = await axios_1.default.post(this.params.endpoint, data, {
            headers,
            timeout: this.params.timeout,
        });
        if (res.status !== 200) {
            throw Error(`Received error: ${JSON.stringify(res.data)}`);
        }
        const decoded = this.params.codec.decode(res.data.result);
        if ((0, Either_1.isRight)(decoded)) {
            return this.params.outTransformer(decoded.right);
        }
        throw Error(`Malformed response: ${io_ts_reporters_1.default.report(decoded).join(', ')}`);
    }
}
exports.default = Method;
//# sourceMappingURL=Method.js.map