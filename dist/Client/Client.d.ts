import { Address, Cell, Coins } from 'ton3-core';
import { MessageExternalIn } from 'ton3-core/dist/contracts';
import { JettonTransaction, MetadataKeys, TonTransaction } from './types';
export declare type TonClientParameters = {
    endpoint: string;
    timeout?: number;
    apiKey?: string;
};
export declare type TonClientResolvedParameters = {
    endpoint: string;
};
export declare class TonClient {
    #private;
    readonly parameters: TonClientResolvedParameters;
    constructor(parameters: TonClientParameters);
    isTestnet(): boolean;
    callGetMethod(address: Address, name: string, params?: any[]): Promise<{
        gasUsed: number;
        stack: any[];
        exitCode: number;
    }>;
    getTransactions(address: Address, opts: {
        limit: number;
        lt?: string;
        hash?: string;
        to_lt?: string;
        inclusive?: boolean;
        archival?: boolean;
    }): Promise<TonTransaction[]>;
    getBalance(address: Address): Promise<Coins>;
    isContractDeployed(address: Address): Promise<boolean>;
    getContractState(address: Address): Promise<{
        balance: Coins;
        state: "active" | "uninitialized" | "frozen";
        code: Uint8Array | null;
        data: Uint8Array | null;
        lastTransaction: {
            lt: string;
            hash: string;
        } | null;
        blockId: {
            workchain: number;
            shard: string;
            seqno: number;
        };
        timestamp: number;
    }>;
    sendMessage(src: MessageExternalIn, key: Uint8Array): Promise<void>;
    sendBoc(src: Cell): Promise<void>;
    getEstimateFee(src: MessageExternalIn | Cell): Promise<{
        inFwdFee: Coins;
        storageFee: Coins;
        gasFee: Coins;
        fwdFee: Coins;
    }>;
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
