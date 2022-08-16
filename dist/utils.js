"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64ToHex = void 0;
const helpers_1 = require("ton3-core/dist/utils/helpers");
const base64ToHex = (base64) => {
    return (0, helpers_1.bytesToHex)((0, helpers_1.base64ToBytes)(base64));
};
exports.base64ToHex = base64ToHex;
//# sourceMappingURL=utils.js.map