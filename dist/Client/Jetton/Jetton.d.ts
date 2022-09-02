import { Address, Cell, Coins } from 'ton3-core';
import { TonClient } from '../Client';
import { JettonTransaction, MetadataKeys } from '../types';
export declare class Jetton {
    private readonly client;
    constructor(client: TonClient);
    getWalletAddress(jettonMasterContract: Address, walletOwner: Address): Promise<Address>;
    getData(jettonMasterContract: Address, opts?: {
        metadataKeys?: MetadataKeys;
    }): Promise<{
        totalSupply: any;
        adminAddress: Address | null;
        content: {
            [key: string]: string;
        };
        jettonWalletCode: any;
    }>;
    getWalletData(jettonWallet: Address): Promise<{
        balance: Coins;
        ownerAddress: Address;
        jettonMasterAddress: Address;
        jettonWalletCode: Cell;
    }>;
    getBalance(jettonWallet: Address): Promise<Coins>;
    getTransactions(jettonWallet: Address, limit?: number): Promise<JettonTransaction[]>;
}
