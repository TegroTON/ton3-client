import axios from 'axios';
import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';
import reporter from 'io-ts-reporters';
import { HttpApiResolvedParameters } from './HttpApi';

export interface MethodParameters<I, O, R, T> extends HttpApiResolvedParameters {
    methodName: string;
    codec: t.Type<T>;
    inTransformer: (x: I) => R;
    outTransformer: (x: T) => O;
}

export default class Method<I, O, R, T> {
    constructor(private params: MethodParameters<I, O, R, T>) {}

    async call(body?: I): Promise<O> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (this.params.apiKey) {
            headers['X-API-Key'] = this.params.apiKey;
        }
        const data = JSON.stringify({
            id: '1',
            jsonrpc: '2.0',
            method: this.params.methodName,
            params: body && this.params.inTransformer(body),
        });
        const res = await axios.post<{ ok: boolean, result: T }>(
            this.params.endpoint,
            data,
            {
                headers,
                timeout: this.params.timeout,
            },
        );
        if (res.status !== 200) {
            throw Error(`Received error: ${JSON.stringify(res.data)}`);
        }
        const decoded = this.params.codec.decode(res.data.result);
        if (isRight(decoded)) {
            return this.params.outTransformer(decoded.right);
        }
        throw Error(`Malformed response: ${reporter.report(decoded).join(', ')}`);
    }
}
