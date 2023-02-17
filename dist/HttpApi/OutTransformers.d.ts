import * as t from 'io-ts';
import { Cell } from 'ton3-core';
import Codecs from './Codecs';
import { TonAddressInformation, TonFees, TonGetMethod, TonTransaction } from './types';
declare const _default: {
    getAddressInformation: (x: t.TypeOf<typeof Codecs.addressInformation>) => TonAddressInformation;
    getTransactions: (x: t.TypeOf<typeof Codecs.getTransactions>) => TonTransaction[];
    estimateFee: (x: t.TypeOf<typeof Codecs.estimateFee>) => TonFees;
    runGetMethod: (x: t.TypeOf<typeof Codecs.runGetMethod>) => TonGetMethod;
    sendBoc: (x: t.TypeOf<typeof Codecs.bocResponse>) => t.TypeOf<typeof Codecs.bocResponse>;
    getConfigParam: (x: t.TypeOf<typeof Codecs.getConfigParam>) => Cell;
};
export default _default;
