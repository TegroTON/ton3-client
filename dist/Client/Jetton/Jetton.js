"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jetton = void 0;
const ton3_core_1 = require("ton3-core");
const transactionParser_1 = __importDefault(require("./transactionParser"));
const parser_1 = require("../../Utils/Metadata/parser");
class Jetton {
    constructor(client) {
        this.client = client;
    }
    async getWalletAddress(jettonMasterContract, walletOwner) {
        const { stack } = await this.client.runGetMethod({
            address: jettonMasterContract,
            method: 'get_wallet_address',
            params: [walletOwner],
        });
        return stack[0].parse().preloadAddress();
    }
    async getData(jettonMasterContract, opts) {
        const { stack } = await this.client.runGetMethod({ address: jettonMasterContract, method: 'get_jetton_data' });
        const totalSupply = stack[0];
        const adminAddress = stack[2].parse().loadAddress();
        const contentCell = stack[3];
        const jettonWalletCode = stack[4];
        return {
            totalSupply,
            adminAddress,
            content: await (0, parser_1.parseMetadata)(contentCell, opts?.metadataKeys),
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
        const { stack, exitCode, } = await this.client.runGetMethod({ address: jettonWallet, method: 'get_wallet_data' });
        if (exitCode === -13)
            throw new Error('Jetton wallet is not deployed.');
        if (exitCode !== 0)
            throw new Error('Cannot retrieve jetton wallet data.');
        const jettonMasterAddress = stack[2].parse().preloadAddress();
        const decimals = await this.getDecimals(jettonMasterAddress);
        const balance = new ton3_core_1.Coins(stack[0], { isNano: true, decimals });
        const ownerAddress = stack[1].parse().preloadAddress();
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
        const transactions = await this.client.getTransactions({ address: jettonWallet, limit });
        const jettonDecimals = decimals ?? await this.getDecimalsByWallet(jettonWallet);
        return transactions
            .map((transaction) => transactionParser_1.default.parseTransaction(transaction, jettonDecimals))
            .filter((transaction) => !!transaction);
    }
}
exports.Jetton = Jetton;
//# sourceMappingURL=Jetton.js.map