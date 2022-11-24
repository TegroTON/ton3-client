import * as t from 'io-ts';
export declare const blockIdExt: t.TypeC<{
    '@type': t.LiteralC<"ton.blockIdExt">;
    workchain: t.NumberC;
    shard: t.StringC;
    seqno: t.NumberC;
    root_hash: t.StringC;
    file_hash: t.StringC;
}>;
export declare const addressInformation: t.TypeC<{
    balance: t.UnionC<[t.NumberC, t.StringC]>;
    state: t.UnionC<[t.LiteralC<"active">, t.LiteralC<"uninitialized">, t.LiteralC<"frozen">]>;
    data: t.StringC;
    code: t.StringC;
    last_transaction_id: t.TypeC<{
        '@type': t.LiteralC<"internal.transactionId">;
        lt: t.StringC;
        hash: t.StringC;
    }>;
    block_id: t.TypeC<{
        '@type': t.LiteralC<"ton.blockIdExt">;
        workchain: t.NumberC;
        shard: t.StringC;
        seqno: t.NumberC;
        root_hash: t.StringC;
        file_hash: t.StringC;
    }>;
    sync_utime: t.NumberC;
}>;
export declare const bocResponse: t.TypeC<{
    '@type': t.LiteralC<"ok">;
}>;
export declare const feeResponse: t.TypeC<{
    '@type': t.LiteralC<"query.fees">;
    source_fees: t.TypeC<{
        '@type': t.LiteralC<"fees">;
        in_fwd_fee: t.NumberC;
        storage_fee: t.NumberC;
        gas_fee: t.NumberC;
        fwd_fee: t.NumberC;
    }>;
}>;
export declare const callGetMethod: t.TypeC<{
    gas_used: t.NumberC;
    exit_code: t.NumberC;
    stack: t.ArrayC<t.UnknownC>;
}>;
export declare const messageData: t.UnionC<[t.TypeC<{
    '@type': t.LiteralC<"msg.dataRaw">;
    body: t.StringC;
}>, t.TypeC<{
    '@type': t.LiteralC<"msg.dataText">;
    text: t.StringC;
}>, t.TypeC<{
    '@type': t.LiteralC<"msg.dataDecryptedText">;
    text: t.StringC;
}>, t.TypeC<{
    '@type': t.LiteralC<"msg.dataEncryptedText">;
    text: t.StringC;
}>]>;
export declare const message: t.TypeC<{
    source: t.StringC;
    destination: t.StringC;
    value: t.StringC;
    fwd_fee: t.StringC;
    ihr_fee: t.StringC;
    created_lt: t.StringC;
    body_hash: t.StringC;
    msg_data: t.UnionC<[t.TypeC<{
        '@type': t.LiteralC<"msg.dataRaw">;
        body: t.StringC;
    }>, t.TypeC<{
        '@type': t.LiteralC<"msg.dataText">;
        text: t.StringC;
    }>, t.TypeC<{
        '@type': t.LiteralC<"msg.dataDecryptedText">;
        text: t.StringC;
    }>, t.TypeC<{
        '@type': t.LiteralC<"msg.dataEncryptedText">;
        text: t.StringC;
    }>]>;
}>;
export declare const transaction: t.TypeC<{
    data: t.StringC;
    utime: t.NumberC;
    transaction_id: t.TypeC<{
        lt: t.StringC;
        hash: t.StringC;
    }>;
    fee: t.StringC;
    storage_fee: t.StringC;
    other_fee: t.StringC;
    in_msg: t.UnionC<[t.UndefinedC, t.TypeC<{
        source: t.StringC;
        destination: t.StringC;
        value: t.StringC;
        fwd_fee: t.StringC;
        ihr_fee: t.StringC;
        created_lt: t.StringC;
        body_hash: t.StringC;
        msg_data: t.UnionC<[t.TypeC<{
            '@type': t.LiteralC<"msg.dataRaw">;
            body: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataText">;
            text: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataDecryptedText">;
            text: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataEncryptedText">;
            text: t.StringC;
        }>]>;
    }>]>;
    out_msgs: t.ArrayC<t.TypeC<{
        source: t.StringC;
        destination: t.StringC;
        value: t.StringC;
        fwd_fee: t.StringC;
        ihr_fee: t.StringC;
        created_lt: t.StringC;
        body_hash: t.StringC;
        msg_data: t.UnionC<[t.TypeC<{
            '@type': t.LiteralC<"msg.dataRaw">;
            body: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataText">;
            text: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataDecryptedText">;
            text: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataEncryptedText">;
            text: t.StringC;
        }>]>;
    }>>;
}>;
export declare const getTransactions: t.ArrayC<t.TypeC<{
    data: t.StringC;
    utime: t.NumberC;
    transaction_id: t.TypeC<{
        lt: t.StringC;
        hash: t.StringC;
    }>;
    fee: t.StringC;
    storage_fee: t.StringC;
    other_fee: t.StringC;
    in_msg: t.UnionC<[t.UndefinedC, t.TypeC<{
        source: t.StringC;
        destination: t.StringC;
        value: t.StringC;
        fwd_fee: t.StringC;
        ihr_fee: t.StringC;
        created_lt: t.StringC;
        body_hash: t.StringC;
        msg_data: t.UnionC<[t.TypeC<{
            '@type': t.LiteralC<"msg.dataRaw">;
            body: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataText">;
            text: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataDecryptedText">;
            text: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataEncryptedText">;
            text: t.StringC;
        }>]>;
    }>]>;
    out_msgs: t.ArrayC<t.TypeC<{
        source: t.StringC;
        destination: t.StringC;
        value: t.StringC;
        fwd_fee: t.StringC;
        ihr_fee: t.StringC;
        created_lt: t.StringC;
        body_hash: t.StringC;
        msg_data: t.UnionC<[t.TypeC<{
            '@type': t.LiteralC<"msg.dataRaw">;
            body: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataText">;
            text: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataDecryptedText">;
            text: t.StringC;
        }>, t.TypeC<{
            '@type': t.LiteralC<"msg.dataEncryptedText">;
            text: t.StringC;
        }>]>;
    }>>;
}>>;
export declare const getMasterchain: t.TypeC<{
    state_root_hash: t.StringC;
    last: t.TypeC<{
        '@type': t.LiteralC<"ton.blockIdExt">;
        workchain: t.NumberC;
        shard: t.StringC;
        seqno: t.NumberC;
        root_hash: t.StringC;
        file_hash: t.StringC;
    }>;
    init: t.TypeC<{
        '@type': t.LiteralC<"ton.blockIdExt">;
        workchain: t.NumberC;
        shard: t.StringC;
        seqno: t.NumberC;
        root_hash: t.StringC;
        file_hash: t.StringC;
    }>;
}>;
export declare const getConfigParam: t.TypeC<{
    '@type': t.LiteralC<"configInfo">;
    config: t.TypeC<{
        '@type': t.LiteralC<"tvm.cell">;
        bytes: t.StringC;
    }>;
}>;
export declare const getShards: t.TypeC<{
    shards: t.ArrayC<t.TypeC<{
        '@type': t.LiteralC<"ton.blockIdExt">;
        workchain: t.NumberC;
        shard: t.StringC;
        seqno: t.NumberC;
        root_hash: t.StringC;
        file_hash: t.StringC;
    }>>;
}>;
export declare const blockShortTxt: t.TypeC<{
    '@type': t.LiteralC<"blocks.shortTxId">;
    mode: t.NumberC;
    account: t.StringC;
    lt: t.StringC;
    hash: t.StringC;
}>;
export declare const getBlockTransactions: t.TypeC<{
    id: t.TypeC<{
        '@type': t.LiteralC<"ton.blockIdExt">;
        workchain: t.NumberC;
        shard: t.StringC;
        seqno: t.NumberC;
        root_hash: t.StringC;
        file_hash: t.StringC;
    }>;
    req_count: t.NumberC;
    incomplete: t.BooleanC;
    transactions: t.ArrayC<t.TypeC<{
        '@type': t.LiteralC<"blocks.shortTxId">;
        mode: t.NumberC;
        account: t.StringC;
        lt: t.StringC;
        hash: t.StringC;
    }>>;
}>;
export declare type HTTPTransaction = t.TypeOf<typeof getTransactions>[number];
export declare type HTTPMessage = t.TypeOf<typeof message>;
