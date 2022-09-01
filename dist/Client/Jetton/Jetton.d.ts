import { Address, Cell, Coins } from 'ton3-core';
import { TonClient } from '../Client';
import { JettonTransaction, MetadataKeys } from '../types';
export declare class Jetton {
    private readonly client;
    constructor(client: TonClient);
    getJettonWalletAddress(jettonMasterContract: Address, walletOwner: Address): Promise<Address>;
    getJettonData(jettonMasterContract: Address, opts?: {
        metadataKeys?: MetadataKeys;
    }): Promise<{
        totalSupply: any;
        adminAddress: Address | null;
        content: {
            [key: string]: string;
        };
        jettonWalletCode: any;
    }>;
    getJettonWalletData(jettonWallet: Address): Promise<{
        balance: Coins;
        ownerAddress: Address;
        jettonMasterAddress: Address;
        jettonWalletCode: Cell;
    }>;
    getJettonBalance(jettonWallet: Address): Promise<Coins>;
    getJettonTransactions(jettonWallet: Address, limit?: number): Promise<JettonTransaction[]>;
}
