import * as t from 'io-ts';

export const blockIdExt = t.type({
    '@type': t.literal('ton.blockIdExt'),
    workchain: t.number,
    shard: t.string,
    seqno: t.number,
    root_hash: t.string,
    file_hash: t.string,
});

export const addressInformation = t.type({
    balance: t.union([t.number, t.string]),
    state: t.union([t.literal('active'), t.literal('uninitialized'), t.literal('frozen')]),
    data: t.string,
    code: t.string,
    last_transaction_id: t.type({
        '@type': t.literal('internal.transactionId'),
        lt: t.string,
        hash: t.string,
    }),
    block_id: blockIdExt,
    sync_utime: t.number,
});

export const bocResponse = t.type({
    '@type': t.literal('ok'),
});

export const feeResponse = t.type({
    '@type': t.literal('query.fees'),
    source_fees: t.type({
        '@type': t.literal('fees'),
        in_fwd_fee: t.number,
        storage_fee: t.number,
        gas_fee: t.number,
        fwd_fee: t.number,
    }),
});

export const callGetMethod = t.type({
    gas_used: t.number,
    exit_code: t.number,
    stack: t.array(t.unknown),
});

export const messageData = t.union([
    t.type({
        '@type': t.literal('msg.dataRaw'),
        body: t.string,
    }),
    t.type({
        '@type': t.literal('msg.dataText'),
        text: t.string,
    }),
    t.type({
        '@type': t.literal('msg.dataDecryptedText'),
        text: t.string,
    }),
    t.type({
        '@type': t.literal('msg.dataEncryptedText'),
        text: t.string,
    }),
]);

export const message = t.type({
    source: t.string,
    destination: t.string,
    value: t.string,
    fwd_fee: t.string,
    ihr_fee: t.string,
    created_lt: t.string,
    body_hash: t.string,
    msg_data: messageData,
});

export const transaction = t.type({
    data: t.string,
    utime: t.number,
    transaction_id: t.type({
        lt: t.string,
        hash: t.string,
    }),
    fee: t.string,
    storage_fee: t.string,
    other_fee: t.string,
    in_msg: t.union([t.undefined, message]),
    out_msgs: t.array(message),
});

export const getTransactions = t.array(transaction);

export const getMasterchain = t.type({
    state_root_hash: t.string,
    last: blockIdExt,
    init: blockIdExt,
});

export const getConfigParam = t.type({
    '@type': t.literal('configInfo'),
    config: t.type({
        '@type': t.literal('tvm.cell'),
        bytes: t.string,
    }),
});

export const getShards = t.type({
    shards: t.array(blockIdExt),
});

export const blockShortTxt = t.type({
    '@type': t.literal('blocks.shortTxId'),
    mode: t.number,
    account: t.string,
    lt: t.string,
    hash: t.string,
});

export const getBlockTransactions = t.type({
    id: blockIdExt,
    req_count: t.number,
    incomplete: t.boolean,
    transactions: t.array(blockShortTxt),
});

export type HTTPTransaction = t.TypeOf<typeof getTransactions>[number];
export type HTTPMessage = t.TypeOf<typeof message>;
