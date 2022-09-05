import {
    Address, BOC, Builder, Cell, Coins, Slice,
} from 'ton3-core';
import { TonClient } from '../Client';
import { JettonTransaction, MetadataKeys } from '../types';
import { parseMetadata } from '../parsers/parseMetadata';
import { JettonOperation } from '../constants';
import { parseTransferTransaction } from '../parsers/parseTransferTransaction';
import { parseInternalTransferTransaction } from '../parsers/parseInternalTransferTransaction';
import { parseBurnTransaction } from '../parsers/parseBurnTransaction';

export class Jetton {
    private readonly client: TonClient;

    constructor(client: TonClient) {
        this.client = client;
    }

    async getWalletAddress(
        jettonMasterContract: Address,
        walletOwner: Address,
    ): Promise<Address> {
        const ownerAddressCell = new Builder().storeAddress(walletOwner).cell();

        const { stack } = await this.client.callGetMethod(jettonMasterContract, 'get_wallet_address', [
            [
                'tvm.Slice',
                BOC.toBase64Standard(ownerAddressCell, { has_index: false }),
            ],
        ]);

        return Slice.parse(stack[0] as Cell).preloadAddress();
    }

    async getData(jettonMasterContract: Address, opts?: { metadataKeys?: MetadataKeys }) {
        const { stack } = await this.client.callGetMethod(jettonMasterContract, 'get_jetton_data', []);

        const totalSupply = stack[0];

        const adminAddress = Slice.parse(stack[2] as Cell).loadAddress();

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
        } = await this.client.callGetMethod(jettonWallet, 'get_wallet_data', []);

        if (exitCode === -13) throw new Error('Jetton wallet is not deployed.');
        if (exitCode !== 0) throw new Error('Cannot retrieve jetton wallet data.');

        const jettonMasterAddress = Slice.parse(stack[2] as Cell).preloadAddress();

        const decimals = await this.getDecimals(jettonMasterAddress);

        const balance = new Coins(stack[0], { isNano: true, decimals });
        const ownerAddress = Slice.parse(stack[1] as Cell).preloadAddress();
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
        const transactions = await this.client.getTransactions(jettonWallet, { limit });
        const jettonDecimals = decimals ?? await this.getDecimalsByWallet(jettonWallet);

        return transactions
            .map((transaction): JettonTransaction | null => {
                if (transaction.inMessage?.body?.type !== 'data') {
                    return null; // Not a jetton transaction
                }

                const bodySlice = Slice.parse(BOC.fromStandard(transaction.inMessage.body.data));
                const operation = bodySlice.loadUint(32);

                try {
                    switch (operation) {
                        case JettonOperation.TRANSFER:
                            return parseTransferTransaction(bodySlice, transaction, jettonDecimals);
                        case JettonOperation.INTERNAL_TRANSFER:
                            return parseInternalTransferTransaction(bodySlice, transaction, jettonDecimals);
                        case JettonOperation.BURN:
                            return parseBurnTransaction(bodySlice, transaction, jettonDecimals);
                        default:
                            return null; // Unknown operation
                    }
                } catch {
                    return null;
                }
            })
            .filter((transaction) => !!transaction) as JettonTransaction[];
    }
}
