import * as t from 'io-ts';
declare const _default: {
    message: t.TypeC<{
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
    getTransactions: t.ArrayC<t.TypeC<{
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
    transaction: t.TypeC<{
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
    blockIdExt: t.TypeC<{
        '@type': t.LiteralC<"ton.blockIdExt">;
        workchain: t.NumberC;
        shard: t.StringC;
        seqno: t.NumberC;
        root_hash: t.StringC;
        file_hash: t.StringC;
    }>;
    addressInformation: t.TypeC<{
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
    estimateFee: t.TypeC<{
        '@type': t.LiteralC<"query.fees">;
        source_fees: t.TypeC<{
            '@type': t.LiteralC<"fees">;
            in_fwd_fee: t.NumberC;
            storage_fee: t.NumberC;
            gas_fee: t.NumberC;
            fwd_fee: t.NumberC;
        }>;
    }>;
    runGetMethod: t.TypeC<{
        gas_used: t.NumberC;
        exit_code: t.NumberC;
        stack: t.ArrayC<t.UnknownC>;
    }>;
    bocResponse: t.TypeC<{
        '@type': t.LiteralC<"ok">;
    }>;
    getConfigParam: t.TypeC<{
        '@type': t.LiteralC<"configInfo">;
        config: t.TypeC<{
            '@type': t.LiteralC<"tvm.cell">;
            bytes: t.StringC;
        }>;
    }>;
};
export default _default;
