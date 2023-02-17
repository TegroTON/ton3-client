import { Address, Cell, Coins } from 'ton3-core';
import { MessageExternalIn } from 'ton3-core/dist/contracts';
import { HttpApi, HttpApiParameters } from '../HttpApi/HttpApi';
import Dns from './DNS';
import Jetton from './Jetton';
import Nft from './NFT';
import { TonFees } from '../HttpApi/types';
export declare type TonClientParameters = HttpApiParameters;
export declare class TonClient extends HttpApi {
    DNS: Dns;
    Jetton: Jetton;
    NFT: Nft;
    constructor(params: TonClientParameters);
    isTestnet(): boolean;
    getBalance(address: Address): Promise<Coins>;
    isContractDeployed(address: Address): Promise<boolean>;
    sendMessage(src: MessageExternalIn, key: Uint8Array): Promise<void>;
    getEstimateFee(src: MessageExternalIn | Cell): Promise<TonFees>;
}
