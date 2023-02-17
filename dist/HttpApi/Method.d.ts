import * as t from 'io-ts';
import { HttpApiResolvedParameters } from './HttpApi';
export interface MethodParameters<I, O, R, T> extends HttpApiResolvedParameters {
    methodName: string;
    codec: t.Type<T>;
    inTransformer: (x: I) => R;
    outTransformer: (x: T) => O;
}
export default class Method<I, O, R, T> {
    private params;
    constructor(params: MethodParameters<I, O, R, T>);
    call(body?: I): Promise<O>;
}
