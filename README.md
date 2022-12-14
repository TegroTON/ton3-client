# 💎 @tegro/ton3-client
[![License](https://img.shields.io/badge/license-MIT-brightgreen)](https://opensource.org/licenses/MIT)
[![ton3](https://img.shields.io/badge/for%20use%20with-ton3-brightgreen)](https://github.com/tonstack/ton3-core)
[![npm](https://img.shields.io/npm/v/@tegro/ton3-client.svg)](https://npmjs.com/package/@tegro/ton3-client)
[![TON](https://img.shields.io/badge/based%20on-The%20Open%20Network-blue)](https://ton.org/)

> :warning: Work in progress, API can (and most likely will) be changed!

## How to install

```
npm i @tegro/ton3-client
```

## Simple usage

```typescript
import { TonClient } from '@tegro/ton3-client';
import { Coins, Address } from 'ton3-core';

const endpoint = 'https://api.toncenter.com/jsonRPC'; // jsonRPC API url
const apiKey = 'HERE_WILL_BE_YOUR_API_KEY_IF_IT_IS_REQUIRED';

const tonClient = new TonClient({ endpoint, apiKey });

// This is a part of Tegro Wallet
const getBestWalletTypeByPublicKey = async (publicKey: Uint8Array) => {
    const walletTypes = ['org.ton.wallets.v3.r2', 'org.ton.wallets.v4.r2'];
    let maxBalance = new Coins(0);
    let bestContract = walletTypes[0];
    for (const walletType of walletTypes) {
        const wallet = Wallet.openByPubKey({
            workchain: 0,
            publicKey,
            version: walletType,
        });
        const balance = await tonClient.getBalance(wallet.address);
        if (balance.gt(maxBalance)) {
            maxBalance = balance;
            bestContract = walletType;
        }
    }
    return bestContract;
}

```

## TON DNS example

```typescript
// ... tonClient has been declared before

const getAddressFromDomain = async (domain: string) => {
    if (!(/\S+.ton\b/.test(domain))) return undefined; // is not domain
    try {
        const mbAddr = await tonClient.DNS.getWalletAddress(domain);
        return mbAddr instanceof Address ? mbAddr : undefined;
    } catch {
        return undefined;
    }
}

```


## Jettons example

```typescript
// ... tonClient has been declared before

const jettonsExample = async (jettonAddress: Address, myAddress: Address) => {
    // user jetton wallet address
    const jettonWallet = await tonClient.Jetton.getWalletAddress(jettonAddress, myAddress);
    
    // jetton metadata
    const { content } = await tonClient.Jetton.getData(jettonAddress);
    
    const deployed = await tonClient.isContractDeployed(jettonWallet);
    
    // user jetton balance
    const balance = deployed ? await tonClient.Jetton.getBalance(jettonWallet) : new Coins(0, { decimals: meta.decimals });
    
    // user jetton transactions
    const transactions = deployed ? await tonClient.Jetton.getTransactions(jettonWallet) : []
}

```

## Bug Report
If you have questions or suggestions, please file an [Issue](https://github.com/TegroTON/.github/issues/new/choose).

## License

MIT License




