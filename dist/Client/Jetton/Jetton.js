"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jetton = void 0;
const ton3_core_1 = require("ton3-core");
const parseMetadata_1 = require("../parsers/parseMetadata");
const constants_1 = require("../constants");
const parseTransferTransaction_1 = require("../parsers/parseTransferTransaction");
const parseInternalTransferTransaction_1 = require("../parsers/parseInternalTransferTransaction");
const parseBurnTransaction_1 = require("../parsers/parseBurnTransaction");
class Jetton {
    constructor(client) {
        this.client = client;
    }
    async getWalletAddress(jettonMasterContract, walletOwner) {
        const ownerAddressCell = new ton3_core_1.Builder().storeAddress(walletOwner).cell();
        const { stack } = await this.client.callGetMethod(jettonMasterContract, 'get_wallet_address', [
            [
                'tvm.Slice',
                ton3_core_1.BOC.toBase64Standard(ownerAddressCell, { has_index: false }),
            ],
        ]);
        return ton3_core_1.Slice.parse(stack[0]).preloadAddress();
    }
    async getData(jettonMasterContract, opts) {
        const { stack } = await this.client.callGetMethod(jettonMasterContract, 'get_jetton_data', []);
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
    async getDecimals(jettonMasterContract) {
        const { content } = await this.getData(jettonMasterContract);
        return ~~(content.decimals) || 9;
    }
    async getDecimalsByWallet(jettonWallet) {
        const { jettonMasterAddress } = await this.getWalletData(jettonWallet);
        return this.getDecimals(jettonMasterAddress);
    }
    async getWalletData(jettonWallet) {
        const { stack, exitCode, } = await this.client.callGetMethod(jettonWallet, 'get_wallet_data', []);
        if (exitCode === -13)
            throw new Error('Jetton wallet is not deployed.');
        if (exitCode !== 0)
            throw new Error('Cannot retrieve jetton wallet data.');
        const jettonMasterAddress = ton3_core_1.Slice.parse(stack[2]).preloadAddress();
        const decimals = await this.getDecimals(jettonMasterAddress);
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
    async getBalance(jettonWallet) {
        const { balance } = await this.getWalletData(jettonWallet);
        return balance;
    }
    async getTransactions(jettonWallet, limit = 5, decimals) {
        const transactions = await this.client.getTransactions(jettonWallet, { limit });
        const jettonDecimals = decimals ?? await this.getDecimalsByWallet(jettonWallet);
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
                        return (0, parseTransferTransaction_1.parseTransferTransaction)(bodySlice, transaction, jettonDecimals);
                    case constants_1.JettonOperation.INTERNAL_TRANSFER:
                        return (0, parseInternalTransferTransaction_1.parseInternalTransferTransaction)(bodySlice, transaction, jettonDecimals);
                    case constants_1.JettonOperation.BURN:
                        return (0, parseBurnTransaction_1.parseBurnTransaction)(bodySlice, transaction, jettonDecimals);
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
exports.Jetton = Jetton;
//# sourceMappingURL=Jetton.js.map