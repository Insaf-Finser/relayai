import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MessageReadModel = runtime.Types.Result.DefaultSelection<Prisma.$MessageReadPayload>;
export type AggregateMessageRead = {
    _count: MessageReadCountAggregateOutputType | null;
    _min: MessageReadMinAggregateOutputType | null;
    _max: MessageReadMaxAggregateOutputType | null;
};
export type MessageReadMinAggregateOutputType = {
    id: string | null;
    messageId: string | null;
    userId: string | null;
    readAt: Date | null;
};
export type MessageReadMaxAggregateOutputType = {
    id: string | null;
    messageId: string | null;
    userId: string | null;
    readAt: Date | null;
};
export type MessageReadCountAggregateOutputType = {
    id: number;
    messageId: number;
    userId: number;
    readAt: number;
    _all: number;
};
export type MessageReadMinAggregateInputType = {
    id?: true;
    messageId?: true;
    userId?: true;
    readAt?: true;
};
export type MessageReadMaxAggregateInputType = {
    id?: true;
    messageId?: true;
    userId?: true;
    readAt?: true;
};
export type MessageReadCountAggregateInputType = {
    id?: true;
    messageId?: true;
    userId?: true;
    readAt?: true;
    _all?: true;
};
export type MessageReadAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageReadWhereInput;
    orderBy?: Prisma.MessageReadOrderByWithRelationInput | Prisma.MessageReadOrderByWithRelationInput[];
    cursor?: Prisma.MessageReadWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MessageReadCountAggregateInputType;
    _min?: MessageReadMinAggregateInputType;
    _max?: MessageReadMaxAggregateInputType;
};
export type GetMessageReadAggregateType<T extends MessageReadAggregateArgs> = {
    [P in keyof T & keyof AggregateMessageRead]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMessageRead[P]> : Prisma.GetScalarType<T[P], AggregateMessageRead[P]>;
};
export type MessageReadGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageReadWhereInput;
    orderBy?: Prisma.MessageReadOrderByWithAggregationInput | Prisma.MessageReadOrderByWithAggregationInput[];
    by: Prisma.MessageReadScalarFieldEnum[] | Prisma.MessageReadScalarFieldEnum;
    having?: Prisma.MessageReadScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MessageReadCountAggregateInputType | true;
    _min?: MessageReadMinAggregateInputType;
    _max?: MessageReadMaxAggregateInputType;
};
export type MessageReadGroupByOutputType = {
    id: string;
    messageId: string;
    userId: string;
    readAt: Date;
    _count: MessageReadCountAggregateOutputType | null;
    _min: MessageReadMinAggregateOutputType | null;
    _max: MessageReadMaxAggregateOutputType | null;
};
export type GetMessageReadGroupByPayload<T extends MessageReadGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MessageReadGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MessageReadGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MessageReadGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MessageReadGroupByOutputType[P]>;
}>>;
export type MessageReadWhereInput = {
    AND?: Prisma.MessageReadWhereInput | Prisma.MessageReadWhereInput[];
    OR?: Prisma.MessageReadWhereInput[];
    NOT?: Prisma.MessageReadWhereInput | Prisma.MessageReadWhereInput[];
    id?: Prisma.StringFilter<"MessageRead"> | string;
    messageId?: Prisma.StringFilter<"MessageRead"> | string;
    userId?: Prisma.StringFilter<"MessageRead"> | string;
    readAt?: Prisma.DateTimeFilter<"MessageRead"> | Date | string;
    message?: Prisma.XOR<Prisma.MessageScalarRelationFilter, Prisma.MessageWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type MessageReadOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    message?: Prisma.MessageOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type MessageReadWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    messageId_userId?: Prisma.MessageReadMessageIdUserIdCompoundUniqueInput;
    AND?: Prisma.MessageReadWhereInput | Prisma.MessageReadWhereInput[];
    OR?: Prisma.MessageReadWhereInput[];
    NOT?: Prisma.MessageReadWhereInput | Prisma.MessageReadWhereInput[];
    messageId?: Prisma.StringFilter<"MessageRead"> | string;
    userId?: Prisma.StringFilter<"MessageRead"> | string;
    readAt?: Prisma.DateTimeFilter<"MessageRead"> | Date | string;
    message?: Prisma.XOR<Prisma.MessageScalarRelationFilter, Prisma.MessageWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "messageId_userId">;
export type MessageReadOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
    _count?: Prisma.MessageReadCountOrderByAggregateInput;
    _max?: Prisma.MessageReadMaxOrderByAggregateInput;
    _min?: Prisma.MessageReadMinOrderByAggregateInput;
};
export type MessageReadScalarWhereWithAggregatesInput = {
    AND?: Prisma.MessageReadScalarWhereWithAggregatesInput | Prisma.MessageReadScalarWhereWithAggregatesInput[];
    OR?: Prisma.MessageReadScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MessageReadScalarWhereWithAggregatesInput | Prisma.MessageReadScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MessageRead"> | string;
    messageId?: Prisma.StringWithAggregatesFilter<"MessageRead"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"MessageRead"> | string;
    readAt?: Prisma.DateTimeWithAggregatesFilter<"MessageRead"> | Date | string;
};
export type MessageReadCreateInput = {
    id?: string;
    readAt?: Date | string;
    message: Prisma.MessageCreateNestedOneWithoutReadsInput;
    user: Prisma.UserCreateNestedOneWithoutMessageReadsInput;
};
export type MessageReadUncheckedCreateInput = {
    id?: string;
    messageId: string;
    userId: string;
    readAt?: Date | string;
};
export type MessageReadUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    message?: Prisma.MessageUpdateOneRequiredWithoutReadsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutMessageReadsNestedInput;
};
export type MessageReadUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageReadCreateManyInput = {
    id?: string;
    messageId: string;
    userId: string;
    readAt?: Date | string;
};
export type MessageReadUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageReadUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageReadListRelationFilter = {
    every?: Prisma.MessageReadWhereInput;
    some?: Prisma.MessageReadWhereInput;
    none?: Prisma.MessageReadWhereInput;
};
export type MessageReadOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MessageReadMessageIdUserIdCompoundUniqueInput = {
    messageId: string;
    userId: string;
};
export type MessageReadCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
};
export type MessageReadMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
};
export type MessageReadMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    messageId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    readAt?: Prisma.SortOrder;
};
export type MessageReadCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.MessageReadCreateWithoutUserInput, Prisma.MessageReadUncheckedCreateWithoutUserInput> | Prisma.MessageReadCreateWithoutUserInput[] | Prisma.MessageReadUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.MessageReadCreateOrConnectWithoutUserInput | Prisma.MessageReadCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.MessageReadCreateManyUserInputEnvelope;
    connect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
};
export type MessageReadUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.MessageReadCreateWithoutUserInput, Prisma.MessageReadUncheckedCreateWithoutUserInput> | Prisma.MessageReadCreateWithoutUserInput[] | Prisma.MessageReadUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.MessageReadCreateOrConnectWithoutUserInput | Prisma.MessageReadCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.MessageReadCreateManyUserInputEnvelope;
    connect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
};
export type MessageReadUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.MessageReadCreateWithoutUserInput, Prisma.MessageReadUncheckedCreateWithoutUserInput> | Prisma.MessageReadCreateWithoutUserInput[] | Prisma.MessageReadUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.MessageReadCreateOrConnectWithoutUserInput | Prisma.MessageReadCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.MessageReadUpsertWithWhereUniqueWithoutUserInput | Prisma.MessageReadUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.MessageReadCreateManyUserInputEnvelope;
    set?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    disconnect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    delete?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    connect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    update?: Prisma.MessageReadUpdateWithWhereUniqueWithoutUserInput | Prisma.MessageReadUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.MessageReadUpdateManyWithWhereWithoutUserInput | Prisma.MessageReadUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.MessageReadScalarWhereInput | Prisma.MessageReadScalarWhereInput[];
};
export type MessageReadUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.MessageReadCreateWithoutUserInput, Prisma.MessageReadUncheckedCreateWithoutUserInput> | Prisma.MessageReadCreateWithoutUserInput[] | Prisma.MessageReadUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.MessageReadCreateOrConnectWithoutUserInput | Prisma.MessageReadCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.MessageReadUpsertWithWhereUniqueWithoutUserInput | Prisma.MessageReadUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.MessageReadCreateManyUserInputEnvelope;
    set?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    disconnect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    delete?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    connect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    update?: Prisma.MessageReadUpdateWithWhereUniqueWithoutUserInput | Prisma.MessageReadUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.MessageReadUpdateManyWithWhereWithoutUserInput | Prisma.MessageReadUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.MessageReadScalarWhereInput | Prisma.MessageReadScalarWhereInput[];
};
export type MessageReadCreateNestedManyWithoutMessageInput = {
    create?: Prisma.XOR<Prisma.MessageReadCreateWithoutMessageInput, Prisma.MessageReadUncheckedCreateWithoutMessageInput> | Prisma.MessageReadCreateWithoutMessageInput[] | Prisma.MessageReadUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.MessageReadCreateOrConnectWithoutMessageInput | Prisma.MessageReadCreateOrConnectWithoutMessageInput[];
    createMany?: Prisma.MessageReadCreateManyMessageInputEnvelope;
    connect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
};
export type MessageReadUncheckedCreateNestedManyWithoutMessageInput = {
    create?: Prisma.XOR<Prisma.MessageReadCreateWithoutMessageInput, Prisma.MessageReadUncheckedCreateWithoutMessageInput> | Prisma.MessageReadCreateWithoutMessageInput[] | Prisma.MessageReadUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.MessageReadCreateOrConnectWithoutMessageInput | Prisma.MessageReadCreateOrConnectWithoutMessageInput[];
    createMany?: Prisma.MessageReadCreateManyMessageInputEnvelope;
    connect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
};
export type MessageReadUpdateManyWithoutMessageNestedInput = {
    create?: Prisma.XOR<Prisma.MessageReadCreateWithoutMessageInput, Prisma.MessageReadUncheckedCreateWithoutMessageInput> | Prisma.MessageReadCreateWithoutMessageInput[] | Prisma.MessageReadUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.MessageReadCreateOrConnectWithoutMessageInput | Prisma.MessageReadCreateOrConnectWithoutMessageInput[];
    upsert?: Prisma.MessageReadUpsertWithWhereUniqueWithoutMessageInput | Prisma.MessageReadUpsertWithWhereUniqueWithoutMessageInput[];
    createMany?: Prisma.MessageReadCreateManyMessageInputEnvelope;
    set?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    disconnect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    delete?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    connect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    update?: Prisma.MessageReadUpdateWithWhereUniqueWithoutMessageInput | Prisma.MessageReadUpdateWithWhereUniqueWithoutMessageInput[];
    updateMany?: Prisma.MessageReadUpdateManyWithWhereWithoutMessageInput | Prisma.MessageReadUpdateManyWithWhereWithoutMessageInput[];
    deleteMany?: Prisma.MessageReadScalarWhereInput | Prisma.MessageReadScalarWhereInput[];
};
export type MessageReadUncheckedUpdateManyWithoutMessageNestedInput = {
    create?: Prisma.XOR<Prisma.MessageReadCreateWithoutMessageInput, Prisma.MessageReadUncheckedCreateWithoutMessageInput> | Prisma.MessageReadCreateWithoutMessageInput[] | Prisma.MessageReadUncheckedCreateWithoutMessageInput[];
    connectOrCreate?: Prisma.MessageReadCreateOrConnectWithoutMessageInput | Prisma.MessageReadCreateOrConnectWithoutMessageInput[];
    upsert?: Prisma.MessageReadUpsertWithWhereUniqueWithoutMessageInput | Prisma.MessageReadUpsertWithWhereUniqueWithoutMessageInput[];
    createMany?: Prisma.MessageReadCreateManyMessageInputEnvelope;
    set?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    disconnect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    delete?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    connect?: Prisma.MessageReadWhereUniqueInput | Prisma.MessageReadWhereUniqueInput[];
    update?: Prisma.MessageReadUpdateWithWhereUniqueWithoutMessageInput | Prisma.MessageReadUpdateWithWhereUniqueWithoutMessageInput[];
    updateMany?: Prisma.MessageReadUpdateManyWithWhereWithoutMessageInput | Prisma.MessageReadUpdateManyWithWhereWithoutMessageInput[];
    deleteMany?: Prisma.MessageReadScalarWhereInput | Prisma.MessageReadScalarWhereInput[];
};
export type MessageReadCreateWithoutUserInput = {
    id?: string;
    readAt?: Date | string;
    message: Prisma.MessageCreateNestedOneWithoutReadsInput;
};
export type MessageReadUncheckedCreateWithoutUserInput = {
    id?: string;
    messageId: string;
    readAt?: Date | string;
};
export type MessageReadCreateOrConnectWithoutUserInput = {
    where: Prisma.MessageReadWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageReadCreateWithoutUserInput, Prisma.MessageReadUncheckedCreateWithoutUserInput>;
};
export type MessageReadCreateManyUserInputEnvelope = {
    data: Prisma.MessageReadCreateManyUserInput | Prisma.MessageReadCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type MessageReadUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.MessageReadWhereUniqueInput;
    update: Prisma.XOR<Prisma.MessageReadUpdateWithoutUserInput, Prisma.MessageReadUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.MessageReadCreateWithoutUserInput, Prisma.MessageReadUncheckedCreateWithoutUserInput>;
};
export type MessageReadUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.MessageReadWhereUniqueInput;
    data: Prisma.XOR<Prisma.MessageReadUpdateWithoutUserInput, Prisma.MessageReadUncheckedUpdateWithoutUserInput>;
};
export type MessageReadUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.MessageReadScalarWhereInput;
    data: Prisma.XOR<Prisma.MessageReadUpdateManyMutationInput, Prisma.MessageReadUncheckedUpdateManyWithoutUserInput>;
};
export type MessageReadScalarWhereInput = {
    AND?: Prisma.MessageReadScalarWhereInput | Prisma.MessageReadScalarWhereInput[];
    OR?: Prisma.MessageReadScalarWhereInput[];
    NOT?: Prisma.MessageReadScalarWhereInput | Prisma.MessageReadScalarWhereInput[];
    id?: Prisma.StringFilter<"MessageRead"> | string;
    messageId?: Prisma.StringFilter<"MessageRead"> | string;
    userId?: Prisma.StringFilter<"MessageRead"> | string;
    readAt?: Prisma.DateTimeFilter<"MessageRead"> | Date | string;
};
export type MessageReadCreateWithoutMessageInput = {
    id?: string;
    readAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutMessageReadsInput;
};
export type MessageReadUncheckedCreateWithoutMessageInput = {
    id?: string;
    userId: string;
    readAt?: Date | string;
};
export type MessageReadCreateOrConnectWithoutMessageInput = {
    where: Prisma.MessageReadWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageReadCreateWithoutMessageInput, Prisma.MessageReadUncheckedCreateWithoutMessageInput>;
};
export type MessageReadCreateManyMessageInputEnvelope = {
    data: Prisma.MessageReadCreateManyMessageInput | Prisma.MessageReadCreateManyMessageInput[];
    skipDuplicates?: boolean;
};
export type MessageReadUpsertWithWhereUniqueWithoutMessageInput = {
    where: Prisma.MessageReadWhereUniqueInput;
    update: Prisma.XOR<Prisma.MessageReadUpdateWithoutMessageInput, Prisma.MessageReadUncheckedUpdateWithoutMessageInput>;
    create: Prisma.XOR<Prisma.MessageReadCreateWithoutMessageInput, Prisma.MessageReadUncheckedCreateWithoutMessageInput>;
};
export type MessageReadUpdateWithWhereUniqueWithoutMessageInput = {
    where: Prisma.MessageReadWhereUniqueInput;
    data: Prisma.XOR<Prisma.MessageReadUpdateWithoutMessageInput, Prisma.MessageReadUncheckedUpdateWithoutMessageInput>;
};
export type MessageReadUpdateManyWithWhereWithoutMessageInput = {
    where: Prisma.MessageReadScalarWhereInput;
    data: Prisma.XOR<Prisma.MessageReadUpdateManyMutationInput, Prisma.MessageReadUncheckedUpdateManyWithoutMessageInput>;
};
export type MessageReadCreateManyUserInput = {
    id?: string;
    messageId: string;
    readAt?: Date | string;
};
export type MessageReadUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    message?: Prisma.MessageUpdateOneRequiredWithoutReadsNestedInput;
};
export type MessageReadUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageReadUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    messageId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageReadCreateManyMessageInput = {
    id?: string;
    userId: string;
    readAt?: Date | string;
};
export type MessageReadUpdateWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutMessageReadsNestedInput;
};
export type MessageReadUncheckedUpdateWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageReadUncheckedUpdateManyWithoutMessageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    readAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MessageReadSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    userId?: boolean;
    readAt?: boolean;
    message?: boolean | Prisma.MessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["messageRead"]>;
export type MessageReadSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    userId?: boolean;
    readAt?: boolean;
    message?: boolean | Prisma.MessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["messageRead"]>;
export type MessageReadSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    messageId?: boolean;
    userId?: boolean;
    readAt?: boolean;
    message?: boolean | Prisma.MessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["messageRead"]>;
export type MessageReadSelectScalar = {
    id?: boolean;
    messageId?: boolean;
    userId?: boolean;
    readAt?: boolean;
};
export type MessageReadOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "messageId" | "userId" | "readAt", ExtArgs["result"]["messageRead"]>;
export type MessageReadInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.MessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type MessageReadIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.MessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type MessageReadIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    message?: boolean | Prisma.MessageDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $MessageReadPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MessageRead";
    objects: {
        message: Prisma.$MessagePayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        messageId: string;
        userId: string;
        readAt: Date;
    }, ExtArgs["result"]["messageRead"]>;
    composites: {};
};
export type MessageReadGetPayload<S extends boolean | null | undefined | MessageReadDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MessageReadPayload, S>;
export type MessageReadCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MessageReadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MessageReadCountAggregateInputType | true;
};
export interface MessageReadDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MessageRead'];
        meta: {
            name: 'MessageRead';
        };
    };
    findUnique<T extends MessageReadFindUniqueArgs>(args: Prisma.SelectSubset<T, MessageReadFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MessageReadClient<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MessageReadFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MessageReadFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MessageReadClient<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MessageReadFindFirstArgs>(args?: Prisma.SelectSubset<T, MessageReadFindFirstArgs<ExtArgs>>): Prisma.Prisma__MessageReadClient<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MessageReadFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MessageReadFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MessageReadClient<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MessageReadFindManyArgs>(args?: Prisma.SelectSubset<T, MessageReadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MessageReadCreateArgs>(args: Prisma.SelectSubset<T, MessageReadCreateArgs<ExtArgs>>): Prisma.Prisma__MessageReadClient<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MessageReadCreateManyArgs>(args?: Prisma.SelectSubset<T, MessageReadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MessageReadCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MessageReadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MessageReadDeleteArgs>(args: Prisma.SelectSubset<T, MessageReadDeleteArgs<ExtArgs>>): Prisma.Prisma__MessageReadClient<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MessageReadUpdateArgs>(args: Prisma.SelectSubset<T, MessageReadUpdateArgs<ExtArgs>>): Prisma.Prisma__MessageReadClient<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MessageReadDeleteManyArgs>(args?: Prisma.SelectSubset<T, MessageReadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MessageReadUpdateManyArgs>(args: Prisma.SelectSubset<T, MessageReadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MessageReadUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MessageReadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MessageReadUpsertArgs>(args: Prisma.SelectSubset<T, MessageReadUpsertArgs<ExtArgs>>): Prisma.Prisma__MessageReadClient<runtime.Types.Result.GetResult<Prisma.$MessageReadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MessageReadCountArgs>(args?: Prisma.Subset<T, MessageReadCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MessageReadCountAggregateOutputType> : number>;
    aggregate<T extends MessageReadAggregateArgs>(args: Prisma.Subset<T, MessageReadAggregateArgs>): Prisma.PrismaPromise<GetMessageReadAggregateType<T>>;
    groupBy<T extends MessageReadGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MessageReadGroupByArgs['orderBy'];
    } : {
        orderBy?: MessageReadGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MessageReadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageReadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MessageReadFieldRefs;
}
export interface Prisma__MessageReadClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    message<T extends Prisma.MessageDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MessageDefaultArgs<ExtArgs>>): Prisma.Prisma__MessageClient<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MessageReadFieldRefs {
    readonly id: Prisma.FieldRef<"MessageRead", 'String'>;
    readonly messageId: Prisma.FieldRef<"MessageRead", 'String'>;
    readonly userId: Prisma.FieldRef<"MessageRead", 'String'>;
    readonly readAt: Prisma.FieldRef<"MessageRead", 'DateTime'>;
}
export type MessageReadFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    where: Prisma.MessageReadWhereUniqueInput;
};
export type MessageReadFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    where: Prisma.MessageReadWhereUniqueInput;
};
export type MessageReadFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    where?: Prisma.MessageReadWhereInput;
    orderBy?: Prisma.MessageReadOrderByWithRelationInput | Prisma.MessageReadOrderByWithRelationInput[];
    cursor?: Prisma.MessageReadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MessageReadScalarFieldEnum | Prisma.MessageReadScalarFieldEnum[];
};
export type MessageReadFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    where?: Prisma.MessageReadWhereInput;
    orderBy?: Prisma.MessageReadOrderByWithRelationInput | Prisma.MessageReadOrderByWithRelationInput[];
    cursor?: Prisma.MessageReadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MessageReadScalarFieldEnum | Prisma.MessageReadScalarFieldEnum[];
};
export type MessageReadFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    where?: Prisma.MessageReadWhereInput;
    orderBy?: Prisma.MessageReadOrderByWithRelationInput | Prisma.MessageReadOrderByWithRelationInput[];
    cursor?: Prisma.MessageReadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MessageReadScalarFieldEnum | Prisma.MessageReadScalarFieldEnum[];
};
export type MessageReadCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageReadCreateInput, Prisma.MessageReadUncheckedCreateInput>;
};
export type MessageReadCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MessageReadCreateManyInput | Prisma.MessageReadCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MessageReadCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    data: Prisma.MessageReadCreateManyInput | Prisma.MessageReadCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MessageReadIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MessageReadUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageReadUpdateInput, Prisma.MessageReadUncheckedUpdateInput>;
    where: Prisma.MessageReadWhereUniqueInput;
};
export type MessageReadUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MessageReadUpdateManyMutationInput, Prisma.MessageReadUncheckedUpdateManyInput>;
    where?: Prisma.MessageReadWhereInput;
    limit?: number;
};
export type MessageReadUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MessageReadUpdateManyMutationInput, Prisma.MessageReadUncheckedUpdateManyInput>;
    where?: Prisma.MessageReadWhereInput;
    limit?: number;
    include?: Prisma.MessageReadIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MessageReadUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    where: Prisma.MessageReadWhereUniqueInput;
    create: Prisma.XOR<Prisma.MessageReadCreateInput, Prisma.MessageReadUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MessageReadUpdateInput, Prisma.MessageReadUncheckedUpdateInput>;
};
export type MessageReadDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
    where: Prisma.MessageReadWhereUniqueInput;
};
export type MessageReadDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageReadWhereInput;
    limit?: number;
};
export type MessageReadDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageReadSelect<ExtArgs> | null;
    omit?: Prisma.MessageReadOmit<ExtArgs> | null;
    include?: Prisma.MessageReadInclude<ExtArgs> | null;
};
