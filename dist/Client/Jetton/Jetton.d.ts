import { Address, Cell, Coins } from 'ton3-core';
import { TonClient } from '../Client';
import { MetadataKeys } from '../../Utils/Metadata/types';
import { JettonTransaction } from './types';
export declare class Jetton {
    private readonly client;
    constructor(client: TonClient);
    getWalletAddress(jettonMasterContract: Address, walletOwner: Address): Promise<Address>;
    getData(jettonMasterContract: Address, opts?: {
        metadataKeys?: MetadataKeys;
    }): Promise<{
        totalSupply: any;
        adminAddress: import("ton3-core/dist/msgAddress").MsgAddressExt | Address;
        content: {
            [key: string]: string;
        };
        jettonWalletCode: any;
    }>;
    getDecimals(jettonMasterContract: Address): Promise<number>;
    getDecimalsByWallet(jettonWallet: Address): Promise<number>;
    getWalletData(jettonWallet: Address): Promise<{
        balance: Coins;
        ownerAddress: Address;
        jettonMasterAddress: Address;
        jettonWalletCode: Cell;
    }>;
    getBalance(jettonWallet: Address): Promise<Coins>;
    getTransactions(jettonWallet: Address, limit?: number, decimals?: number): Promise<JettonTransaction[]>;
}
