import {
    Address, BOC, Builder, Cell, Coins, Slice,
} from 'ton3-core';
import { TonClient } from '../Client';
import transactionParser from './transactionParser';
import { MetadataKeys } from '../../Utils/Metadata/types';
import { parseMetadata } from '../../Utils/Metadata/parser';
import { JettonTransaction } from './types';

export class Jetton {
    private readonly client: TonClient;

    constructor(client: TonClient) {
        this.client = client;
    }

    async getWalletAddress(
        jettonMasterContract: Address,
        walletOwner: Address,
    ): Promise<Address> {
        const { stack } = await this.client.runGetMethod({
            address: jettonMasterContract,
            method: 'get_wallet_address',
            params: [walletOwner],
        });

        return (stack[0] as Cell).parse().preloadAddress() as Address;
    }

    async getData(jettonMasterContract: Address, opts?: { metadataKeys?: MetadataKeys }) {
        const { stack } = await this.client.runGetMethod({ address: jettonMasterContract, method: 'get_jetton_data' });

        const totalSupply = stack[0];

        const adminAddress = (stack[2] as Cell).parse().loadAddress();

        const contentCell = stack[3];
        const jettonWalletCode = stack[4];

        return {
            totalSupply,
            adminAddress,
            content: await parseMetadata(contentCell, opts?.metadataKeys),
            jettonWalletCode,
        };
    }

    async getDecimals(jettonMasterContract: Address) {
        const { content } = await this.getData(jettonMasterContract);
        return ~~(content.decimals) || 9;
    }

    async getDecimalsByWallet(jettonWallet: Address) {
        const { jettonMasterAddress } = await this.getWalletData(jettonWallet);
        return this.getDecimals(jettonMasterAddress);
    }

    async getWalletData(jettonWallet: Address): Promise<{
        balance: Coins,
        ownerAddress: Address,
        jettonMasterAddress: Address,
        jettonWalletCode: Cell
    }> {
        const {
            stack,
            exitCode,
        } = await this.client.runGetMethod({ address: jettonWallet, method: 'get_wallet_data' });

        if (exitCode === -13) throw new Error('Jetton wallet is not deployed.');
        if (exitCode !== 0) throw new Error('Cannot retrieve jetton wallet data.');

        const jettonMasterAddress = (stack[2] as Cell).parse().preloadAddress() as Address;

        const decimals = await this.getDecimals(jettonMasterAddress);

        const balance = new Coins(stack[0], { isNano: true, decimals });
        const ownerAddress = (stack[1] as Cell).parse().preloadAddress() as Address;
        const jettonWalletCode = stack[3];

        return {
            balance,
            ownerAddress,
            jettonMasterAddress,
            jettonWalletCode,
        };
    }

    async getBalance(jettonWallet: Address): Promise<Coins> {
        const { balance } = await this.getWalletData(jettonWallet);
        return balance;
    }

    async getTransactions(jettonWallet: Address, limit = 5, decimals?: number) {
        const transactions = await this.client.getTransactions({ address: jettonWallet, limit });
        const jettonDecimals = decimals ?? await this.getDecimalsByWallet(jettonWallet);

        return transactions
            .map((transaction): JettonTransaction | null => transactionParser.parseTransaction(transaction, jettonDecimals))
            .filter((transaction) => !!transaction) as JettonTransaction[];
    }
}
