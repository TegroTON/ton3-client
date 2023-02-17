import {
    Address, Builder, Cell, Coins, Slice,
} from 'ton3-core';
import { hexToBytes } from 'ton3-core/dist/utils/helpers';
import { MessageExternalIn } from 'ton3-core/dist/contracts';
import { HttpApi, HttpApiParameters } from '../HttpApi/HttpApi';
import Dns from './DNS';
import Jetton from './Jetton';
import Nft from './NFT';
import { TonFees } from '../HttpApi/types';

export type TonClientParameters = HttpApiParameters;

export class TonClient extends HttpApi {
    DNS: Dns;

    Jetton: Jetton;

    NFT: Nft;

    constructor(params: TonClientParameters) {
        super(params);

        this.DNS = new Dns(this);
        this.Jetton = new Jetton(this);
        this.NFT = new Nft(this);
    }

    isTestnet(): boolean {
        return this.params.endpoint.indexOf('testnet') > -1;
    }

    async getBalance(address: Address): Promise<Coins> {
        return (await this.getAddressInformation({ address })).balance;
    }

    async isContractDeployed(address: Address): Promise<boolean> {
        return (await this.getAddressInformation({ address })).state === 'active';
    }

    async sendMessage(src: MessageExternalIn, key: Uint8Array) {
        await this.sendBoc({ body: src.sign(key) });
    }

    async getEstimateFee(
        src: MessageExternalIn | Cell,
    ): Promise<TonFees> {
        const msgSlice = (src instanceof Cell ? src : src.sign(hexToBytes('4a41991bb2834030d8587e12dd0e8140c181316db51b289890ccd4f64e41345f4a41991bb2834030d8587e12dd0e8140c181316db51b289890ccd4f64e41345f'))).parse();
        msgSlice.skip(2);
        msgSlice.loadAddress();
        const address = msgSlice.loadAddress();
        if (!(address instanceof Address)) throw Error('Unsupported Address (addr_none or other)');
        msgSlice.loadCoins();

        let body;
        let initCode;
        let initData;

        const parseState = (stateSlice: Slice): { data?: Cell, code?: Cell } => {
            let data;
            let code;
            const maybeDepth = stateSlice.loadBit();
            if (maybeDepth) stateSlice.skip(5);
            const maybeTickTock = stateSlice.loadBit();
            if (maybeTickTock) stateSlice.skip(2);
            const maybeCode = stateSlice.loadBit();
            if (maybeCode) code = stateSlice.loadRef();
            const maybeData = stateSlice.loadBit();
            if (maybeData) data = stateSlice.loadRef();
            stateSlice.skipDict();
            return { data, code };
        };

        const maybeState = msgSlice.loadBit();
        if (maybeState) {
            const eitherState = msgSlice.loadBit();
            if (eitherState) {
                const stateSlice = msgSlice.loadRef().parse();
                const { data, code } = parseState(stateSlice);
                initData = data;
                initCode = code;
            } else {
                const stateSlice = msgSlice.loadRef().parse();
                const { data, code } = parseState(stateSlice);
                initData = data;
                initCode = code;
            }
        }

        const eitherBody = msgSlice.loadBit();
        if (eitherBody) {
            body = msgSlice.loadRef();
        } else {
            body = new Builder().storeSlice(msgSlice).cell();
        }

        return this.estimateFee({
            address,
            body,
            initData,
            initCode,
            ignoreSignature: true,
        });
    }
}
