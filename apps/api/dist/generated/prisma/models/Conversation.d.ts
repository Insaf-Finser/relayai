import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ConversationModel = runtime.Types.Result.DefaultSelection<Prisma.$ConversationPayload>;
export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null;
    _min: ConversationMinAggregateOutputType | null;
    _max: ConversationMaxAggregateOutputType | null;
};
export type ConversationMinAggregateOutputType = {
    id: string | null;
    subject: string | null;
    status: $Enums.ConversationStatus | null;
    customerId: string | null;
    assignedAgentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    reopenRequestedAt: Date | null;
    reopenRequestMessage: string | null;
};
export type ConversationMaxAggregateOutputType = {
    id: string | null;
    subject: string | null;
    status: $Enums.ConversationStatus | null;
    customerId: string | null;
    assignedAgentId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    reopenRequestedAt: Date | null;
    reopenRequestMessage: string | null;
};
export type ConversationCountAggregateOutputType = {
    id: number;
    subject: number;
    status: number;
    customerId: number;
    assignedAgentId: number;
    createdAt: number;
    updatedAt: number;
    reopenRequestedAt: number;
    reopenRequestMessage: number;
    _all: number;
};
export type ConversationMinAggregateInputType = {
    id?: true;
    subject?: true;
    status?: true;
    customerId?: true;
    assignedAgentId?: true;
    createdAt?: true;
    updatedAt?: true;
    reopenRequestedAt?: true;
    reopenRequestMessage?: true;
};
export type ConversationMaxAggregateInputType = {
    id?: true;
    subject?: true;
    status?: true;
    customerId?: true;
    assignedAgentId?: true;
    createdAt?: true;
    updatedAt?: true;
    reopenRequestedAt?: true;
    reopenRequestMessage?: true;
};
export type ConversationCountAggregateInputType = {
    id?: true;
    subject?: true;
    status?: true;
    customerId?: true;
    assignedAgentId?: true;
    createdAt?: true;
    updatedAt?: true;
    reopenRequestedAt?: true;
    reopenRequestMessage?: true;
    _all?: true;
};
export type ConversationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput | Prisma.ConversationOrderByWithRelationInput[];
    cursor?: Prisma.ConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ConversationCountAggregateInputType;
    _min?: ConversationMinAggregateInputType;
    _max?: ConversationMaxAggregateInputType;
};
export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
    [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateConversation[P]> : Prisma.GetScalarType<T[P], AggregateConversation[P]>;
};
export type ConversationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithAggregationInput | Prisma.ConversationOrderByWithAggregationInput[];
    by: Prisma.ConversationScalarFieldEnum[] | Prisma.ConversationScalarFieldEnum;
    having?: Prisma.ConversationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ConversationCountAggregateInputType | true;
    _min?: ConversationMinAggregateInputType;
    _max?: ConversationMaxAggregateInputType;
};
export type ConversationGroupByOutputType = {
    id: string;
    subject: string;
    status: $Enums.ConversationStatus;
    customerId: string;
    assignedAgentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    reopenRequestedAt: Date | null;
    reopenRequestMessage: string | null;
    _count: ConversationCountAggregateOutputType | null;
    _min: ConversationMinAggregateOutputType | null;
    _max: ConversationMaxAggregateOutputType | null;
};
export type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ConversationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ConversationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ConversationGroupByOutputType[P]>;
}>>;
export type ConversationWhereInput = {
    AND?: Prisma.ConversationWhereInput | Prisma.ConversationWhereInput[];
    OR?: Prisma.ConversationWhereInput[];
    NOT?: Prisma.ConversationWhereInput | Prisma.ConversationWhereInput[];
    id?: Prisma.StringFilter<"Conversation"> | string;
    subject?: Prisma.StringFilter<"Conversation"> | string;
    status?: Prisma.EnumConversationStatusFilter<"Conversation"> | $Enums.ConversationStatus;
    customerId?: Prisma.StringFilter<"Conversation"> | string;
    assignedAgentId?: Prisma.StringNullableFilter<"Conversation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    reopenRequestedAt?: Prisma.DateTimeNullableFilter<"Conversation"> | Date | string | null;
    reopenRequestMessage?: Prisma.StringNullableFilter<"Conversation"> | string | null;
    customer?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    assignedAgent?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    messages?: Prisma.MessageListRelationFilter;
};
export type ConversationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    assignedAgentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    reopenRequestedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reopenRequestMessage?: Prisma.SortOrderInput | Prisma.SortOrder;
    customer?: Prisma.UserOrderByWithRelationInput;
    assignedAgent?: Prisma.UserOrderByWithRelationInput;
    messages?: Prisma.MessageOrderByRelationAggregateInput;
};
export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ConversationWhereInput | Prisma.ConversationWhereInput[];
    OR?: Prisma.ConversationWhereInput[];
    NOT?: Prisma.ConversationWhereInput | Prisma.ConversationWhereInput[];
    subject?: Prisma.StringFilter<"Conversation"> | string;
    status?: Prisma.EnumConversationStatusFilter<"Conversation"> | $Enums.ConversationStatus;
    customerId?: Prisma.StringFilter<"Conversation"> | string;
    assignedAgentId?: Prisma.StringNullableFilter<"Conversation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    reopenRequestedAt?: Prisma.DateTimeNullableFilter<"Conversation"> | Date | string | null;
    reopenRequestMessage?: Prisma.StringNullableFilter<"Conversation"> | string | null;
    customer?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    assignedAgent?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    messages?: Prisma.MessageListRelationFilter;
}, "id">;
export type ConversationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    assignedAgentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    reopenRequestedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reopenRequestMessage?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ConversationCountOrderByAggregateInput;
    _max?: Prisma.ConversationMaxOrderByAggregateInput;
    _min?: Prisma.ConversationMinOrderByAggregateInput;
};
export type ConversationScalarWhereWithAggregatesInput = {
    AND?: Prisma.ConversationScalarWhereWithAggregatesInput | Prisma.ConversationScalarWhereWithAggregatesInput[];
    OR?: Prisma.ConversationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ConversationScalarWhereWithAggregatesInput | Prisma.ConversationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Conversation"> | string;
    subject?: Prisma.StringWithAggregatesFilter<"Conversation"> | string;
    status?: Prisma.EnumConversationStatusWithAggregatesFilter<"Conversation"> | $Enums.ConversationStatus;
    customerId?: Prisma.StringWithAggregatesFilter<"Conversation"> | string;
    assignedAgentId?: Prisma.StringNullableWithAggregatesFilter<"Conversation"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Conversation"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Conversation"> | Date | string;
    reopenRequestedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null;
    reopenRequestMessage?: Prisma.StringNullableWithAggregatesFilter<"Conversation"> | string | null;
};
export type ConversationCreateInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
    customer: Prisma.UserCreateNestedOneWithoutCustomerConversationsInput;
    assignedAgent?: Prisma.UserCreateNestedOneWithoutAssignedConversationsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    customerId: string;
    assignedAgentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer?: Prisma.UserUpdateOneRequiredWithoutCustomerConversationsNestedInput;
    assignedAgent?: Prisma.UserUpdateOneWithoutAssignedConversationsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAgentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationCreateManyInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    customerId: string;
    assignedAgentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
};
export type ConversationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ConversationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAgentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ConversationListRelationFilter = {
    every?: Prisma.ConversationWhereInput;
    some?: Prisma.ConversationWhereInput;
    none?: Prisma.ConversationWhereInput;
};
export type ConversationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ConversationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    assignedAgentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    reopenRequestedAt?: Prisma.SortOrder;
    reopenRequestMessage?: Prisma.SortOrder;
};
export type ConversationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    assignedAgentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    reopenRequestedAt?: Prisma.SortOrder;
    reopenRequestMessage?: Prisma.SortOrder;
};
export type ConversationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    assignedAgentId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    reopenRequestedAt?: Prisma.SortOrder;
    reopenRequestMessage?: Prisma.SortOrder;
};
export type ConversationScalarRelationFilter = {
    is?: Prisma.ConversationWhereInput;
    isNot?: Prisma.ConversationWhereInput;
};
export type ConversationCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput> | Prisma.ConversationCreateWithoutCustomerInput[] | Prisma.ConversationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutCustomerInput | Prisma.ConversationCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ConversationCreateManyCustomerInputEnvelope;
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
};
export type ConversationCreateNestedManyWithoutAssignedAgentInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutAssignedAgentInput, Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput> | Prisma.ConversationCreateWithoutAssignedAgentInput[] | Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutAssignedAgentInput | Prisma.ConversationCreateOrConnectWithoutAssignedAgentInput[];
    createMany?: Prisma.ConversationCreateManyAssignedAgentInputEnvelope;
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
};
export type ConversationUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput> | Prisma.ConversationCreateWithoutCustomerInput[] | Prisma.ConversationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutCustomerInput | Prisma.ConversationCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.ConversationCreateManyCustomerInputEnvelope;
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
};
export type ConversationUncheckedCreateNestedManyWithoutAssignedAgentInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutAssignedAgentInput, Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput> | Prisma.ConversationCreateWithoutAssignedAgentInput[] | Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutAssignedAgentInput | Prisma.ConversationCreateOrConnectWithoutAssignedAgentInput[];
    createMany?: Prisma.ConversationCreateManyAssignedAgentInputEnvelope;
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
};
export type ConversationUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput> | Prisma.ConversationCreateWithoutCustomerInput[] | Prisma.ConversationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutCustomerInput | Prisma.ConversationCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ConversationUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ConversationUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ConversationCreateManyCustomerInputEnvelope;
    set?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    disconnect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    delete?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    update?: Prisma.ConversationUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ConversationUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ConversationUpdateManyWithWhereWithoutCustomerInput | Prisma.ConversationUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
};
export type ConversationUpdateManyWithoutAssignedAgentNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutAssignedAgentInput, Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput> | Prisma.ConversationCreateWithoutAssignedAgentInput[] | Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutAssignedAgentInput | Prisma.ConversationCreateOrConnectWithoutAssignedAgentInput[];
    upsert?: Prisma.ConversationUpsertWithWhereUniqueWithoutAssignedAgentInput | Prisma.ConversationUpsertWithWhereUniqueWithoutAssignedAgentInput[];
    createMany?: Prisma.ConversationCreateManyAssignedAgentInputEnvelope;
    set?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    disconnect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    delete?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    update?: Prisma.ConversationUpdateWithWhereUniqueWithoutAssignedAgentInput | Prisma.ConversationUpdateWithWhereUniqueWithoutAssignedAgentInput[];
    updateMany?: Prisma.ConversationUpdateManyWithWhereWithoutAssignedAgentInput | Prisma.ConversationUpdateManyWithWhereWithoutAssignedAgentInput[];
    deleteMany?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
};
export type ConversationUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput> | Prisma.ConversationCreateWithoutCustomerInput[] | Prisma.ConversationUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutCustomerInput | Prisma.ConversationCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.ConversationUpsertWithWhereUniqueWithoutCustomerInput | Prisma.ConversationUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.ConversationCreateManyCustomerInputEnvelope;
    set?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    disconnect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    delete?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    update?: Prisma.ConversationUpdateWithWhereUniqueWithoutCustomerInput | Prisma.ConversationUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.ConversationUpdateManyWithWhereWithoutCustomerInput | Prisma.ConversationUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
};
export type ConversationUncheckedUpdateManyWithoutAssignedAgentNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutAssignedAgentInput, Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput> | Prisma.ConversationCreateWithoutAssignedAgentInput[] | Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput[];
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutAssignedAgentInput | Prisma.ConversationCreateOrConnectWithoutAssignedAgentInput[];
    upsert?: Prisma.ConversationUpsertWithWhereUniqueWithoutAssignedAgentInput | Prisma.ConversationUpsertWithWhereUniqueWithoutAssignedAgentInput[];
    createMany?: Prisma.ConversationCreateManyAssignedAgentInputEnvelope;
    set?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    disconnect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    delete?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    connect?: Prisma.ConversationWhereUniqueInput | Prisma.ConversationWhereUniqueInput[];
    update?: Prisma.ConversationUpdateWithWhereUniqueWithoutAssignedAgentInput | Prisma.ConversationUpdateWithWhereUniqueWithoutAssignedAgentInput[];
    updateMany?: Prisma.ConversationUpdateManyWithWhereWithoutAssignedAgentInput | Prisma.ConversationUpdateManyWithWhereWithoutAssignedAgentInput[];
    deleteMany?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
};
export type EnumConversationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ConversationStatus;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type ConversationCreateNestedOneWithoutMessagesInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutMessagesInput, Prisma.ConversationUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutMessagesInput;
    connect?: Prisma.ConversationWhereUniqueInput;
};
export type ConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: Prisma.XOR<Prisma.ConversationCreateWithoutMessagesInput, Prisma.ConversationUncheckedCreateWithoutMessagesInput>;
    connectOrCreate?: Prisma.ConversationCreateOrConnectWithoutMessagesInput;
    upsert?: Prisma.ConversationUpsertWithoutMessagesInput;
    connect?: Prisma.ConversationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ConversationUpdateToOneWithWhereWithoutMessagesInput, Prisma.ConversationUpdateWithoutMessagesInput>, Prisma.ConversationUncheckedUpdateWithoutMessagesInput>;
};
export type ConversationCreateWithoutCustomerInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
    assignedAgent?: Prisma.UserCreateNestedOneWithoutAssignedConversationsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateWithoutCustomerInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    assignedAgentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationCreateOrConnectWithoutCustomerInput = {
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput>;
};
export type ConversationCreateManyCustomerInputEnvelope = {
    data: Prisma.ConversationCreateManyCustomerInput | Prisma.ConversationCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type ConversationCreateWithoutAssignedAgentInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
    customer: Prisma.UserCreateNestedOneWithoutCustomerConversationsInput;
    messages?: Prisma.MessageCreateNestedManyWithoutConversationInput;
};
export type ConversationUncheckedCreateWithoutAssignedAgentInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
    messages?: Prisma.MessageUncheckedCreateNestedManyWithoutConversationInput;
};
export type ConversationCreateOrConnectWithoutAssignedAgentInput = {
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutAssignedAgentInput, Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput>;
};
export type ConversationCreateManyAssignedAgentInputEnvelope = {
    data: Prisma.ConversationCreateManyAssignedAgentInput | Prisma.ConversationCreateManyAssignedAgentInput[];
    skipDuplicates?: boolean;
};
export type ConversationUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ConversationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ConversationUpdateWithoutCustomerInput, Prisma.ConversationUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutCustomerInput, Prisma.ConversationUncheckedCreateWithoutCustomerInput>;
};
export type ConversationUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.ConversationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ConversationUpdateWithoutCustomerInput, Prisma.ConversationUncheckedUpdateWithoutCustomerInput>;
};
export type ConversationUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.ConversationScalarWhereInput;
    data: Prisma.XOR<Prisma.ConversationUpdateManyMutationInput, Prisma.ConversationUncheckedUpdateManyWithoutCustomerInput>;
};
export type ConversationScalarWhereInput = {
    AND?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
    OR?: Prisma.ConversationScalarWhereInput[];
    NOT?: Prisma.ConversationScalarWhereInput | Prisma.ConversationScalarWhereInput[];
    id?: Prisma.StringFilter<"Conversation"> | string;
    subject?: Prisma.StringFilter<"Conversation"> | string;
    status?: Prisma.EnumConversationStatusFilter<"Conversation"> | $Enums.ConversationStatus;
    customerId?: Prisma.StringFilter<"Conversation"> | string;
    assignedAgentId?: Prisma.StringNullableFilter<"Conversation"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Conversation"> | Date | string;
    reopenRequestedAt?: Prisma.DateTimeNullableFilter<"Conversation"> | Date | string | null;
    reopenRequestMessage?: Prisma.StringNullableFilter<"Conversation"> | string | null;
};
export type ConversationUpsertWithWhereUniqueWithoutAssignedAgentInput = {
    where: Prisma.ConversationWhereUniqueInput;
    update: Prisma.XOR<Prisma.ConversationUpdateWithoutAssignedAgentInput, Prisma.ConversationUncheckedUpdateWithoutAssignedAgentInput>;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutAssignedAgentInput, Prisma.ConversationUncheckedCreateWithoutAssignedAgentInput>;
};
export type ConversationUpdateWithWhereUniqueWithoutAssignedAgentInput = {
    where: Prisma.ConversationWhereUniqueInput;
    data: Prisma.XOR<Prisma.ConversationUpdateWithoutAssignedAgentInput, Prisma.ConversationUncheckedUpdateWithoutAssignedAgentInput>;
};
export type ConversationUpdateManyWithWhereWithoutAssignedAgentInput = {
    where: Prisma.ConversationScalarWhereInput;
    data: Prisma.XOR<Prisma.ConversationUpdateManyMutationInput, Prisma.ConversationUncheckedUpdateManyWithoutAssignedAgentInput>;
};
export type ConversationCreateWithoutMessagesInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
    customer: Prisma.UserCreateNestedOneWithoutCustomerConversationsInput;
    assignedAgent?: Prisma.UserCreateNestedOneWithoutAssignedConversationsInput;
};
export type ConversationUncheckedCreateWithoutMessagesInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    customerId: string;
    assignedAgentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
};
export type ConversationCreateOrConnectWithoutMessagesInput = {
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutMessagesInput, Prisma.ConversationUncheckedCreateWithoutMessagesInput>;
};
export type ConversationUpsertWithoutMessagesInput = {
    update: Prisma.XOR<Prisma.ConversationUpdateWithoutMessagesInput, Prisma.ConversationUncheckedUpdateWithoutMessagesInput>;
    create: Prisma.XOR<Prisma.ConversationCreateWithoutMessagesInput, Prisma.ConversationUncheckedCreateWithoutMessagesInput>;
    where?: Prisma.ConversationWhereInput;
};
export type ConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: Prisma.ConversationWhereInput;
    data: Prisma.XOR<Prisma.ConversationUpdateWithoutMessagesInput, Prisma.ConversationUncheckedUpdateWithoutMessagesInput>;
};
export type ConversationUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer?: Prisma.UserUpdateOneRequiredWithoutCustomerConversationsNestedInput;
    assignedAgent?: Prisma.UserUpdateOneWithoutAssignedConversationsNestedInput;
};
export type ConversationUncheckedUpdateWithoutMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    assignedAgentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ConversationCreateManyCustomerInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    assignedAgentId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
};
export type ConversationCreateManyAssignedAgentInput = {
    id?: string;
    subject: string;
    status?: $Enums.ConversationStatus;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reopenRequestedAt?: Date | string | null;
    reopenRequestMessage?: string | null;
};
export type ConversationUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assignedAgent?: Prisma.UserUpdateOneWithoutAssignedConversationsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    assignedAgentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    assignedAgentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ConversationUpdateWithoutAssignedAgentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer?: Prisma.UserUpdateOneRequiredWithoutCustomerConversationsNestedInput;
    messages?: Prisma.MessageUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateWithoutAssignedAgentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    messages?: Prisma.MessageUncheckedUpdateManyWithoutConversationNestedInput;
};
export type ConversationUncheckedUpdateManyWithoutAssignedAgentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reopenRequestedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reopenRequestMessage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ConversationCountOutputType = {
    messages: number;
};
export type ConversationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    messages?: boolean | ConversationCountOutputTypeCountMessagesArgs;
};
export type ConversationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationCountOutputTypeSelect<ExtArgs> | null;
};
export type ConversationCountOutputTypeCountMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MessageWhereInput;
};
export type ConversationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    subject?: boolean;
    status?: boolean;
    customerId?: boolean;
    assignedAgentId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    reopenRequestedAt?: boolean;
    reopenRequestMessage?: boolean;
    customer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    assignedAgent?: boolean | Prisma.Conversation$assignedAgentArgs<ExtArgs>;
    messages?: boolean | Prisma.Conversation$messagesArgs<ExtArgs>;
    _count?: boolean | Prisma.ConversationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["conversation"]>;
export type ConversationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    subject?: boolean;
    status?: boolean;
    customerId?: boolean;
    assignedAgentId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    reopenRequestedAt?: boolean;
    reopenRequestMessage?: boolean;
    customer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    assignedAgent?: boolean | Prisma.Conversation$assignedAgentArgs<ExtArgs>;
}, ExtArgs["result"]["conversation"]>;
export type ConversationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    subject?: boolean;
    status?: boolean;
    customerId?: boolean;
    assignedAgentId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    reopenRequestedAt?: boolean;
    reopenRequestMessage?: boolean;
    customer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    assignedAgent?: boolean | Prisma.Conversation$assignedAgentArgs<ExtArgs>;
}, ExtArgs["result"]["conversation"]>;
export type ConversationSelectScalar = {
    id?: boolean;
    subject?: boolean;
    status?: boolean;
    customerId?: boolean;
    assignedAgentId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    reopenRequestedAt?: boolean;
    reopenRequestMessage?: boolean;
};
export type ConversationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "subject" | "status" | "customerId" | "assignedAgentId" | "createdAt" | "updatedAt" | "reopenRequestedAt" | "reopenRequestMessage", ExtArgs["result"]["conversation"]>;
export type ConversationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    assignedAgent?: boolean | Prisma.Conversation$assignedAgentArgs<ExtArgs>;
    messages?: boolean | Prisma.Conversation$messagesArgs<ExtArgs>;
    _count?: boolean | Prisma.ConversationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ConversationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    assignedAgent?: boolean | Prisma.Conversation$assignedAgentArgs<ExtArgs>;
};
export type ConversationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    assignedAgent?: boolean | Prisma.Conversation$assignedAgentArgs<ExtArgs>;
};
export type $ConversationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Conversation";
    objects: {
        customer: Prisma.$UserPayload<ExtArgs>;
        assignedAgent: Prisma.$UserPayload<ExtArgs> | null;
        messages: Prisma.$MessagePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        subject: string;
        status: $Enums.ConversationStatus;
        customerId: string;
        assignedAgentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
    }, ExtArgs["result"]["conversation"]>;
    composites: {};
};
export type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ConversationPayload, S>;
export type ConversationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ConversationCountAggregateInputType | true;
};
export interface ConversationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Conversation'];
        meta: {
            name: 'Conversation';
        };
    };
    findUnique<T extends ConversationFindUniqueArgs>(args: Prisma.SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ConversationFindFirstArgs>(args?: Prisma.SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ConversationFindManyArgs>(args?: Prisma.SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ConversationCreateArgs>(args: Prisma.SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ConversationCreateManyArgs>(args?: Prisma.SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ConversationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ConversationDeleteArgs>(args: Prisma.SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ConversationUpdateArgs>(args: Prisma.SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ConversationDeleteManyArgs>(args?: Prisma.SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ConversationUpdateManyArgs>(args: Prisma.SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ConversationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ConversationUpsertArgs>(args: Prisma.SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma.Prisma__ConversationClient<runtime.Types.Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ConversationCountArgs>(args?: Prisma.Subset<T, ConversationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ConversationCountAggregateOutputType> : number>;
    aggregate<T extends ConversationAggregateArgs>(args: Prisma.Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>;
    groupBy<T extends ConversationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ConversationGroupByArgs['orderBy'];
    } : {
        orderBy?: ConversationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ConversationFieldRefs;
}
export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    assignedAgent<T extends Prisma.Conversation$assignedAgentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Conversation$assignedAgentArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    messages<T extends Prisma.Conversation$messagesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Conversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ConversationFieldRefs {
    readonly id: Prisma.FieldRef<"Conversation", 'String'>;
    readonly subject: Prisma.FieldRef<"Conversation", 'String'>;
    readonly status: Prisma.FieldRef<"Conversation", 'ConversationStatus'>;
    readonly customerId: Prisma.FieldRef<"Conversation", 'String'>;
    readonly assignedAgentId: Prisma.FieldRef<"Conversation", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Conversation", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Conversation", 'DateTime'>;
    readonly reopenRequestedAt: Prisma.FieldRef<"Conversation", 'DateTime'>;
    readonly reopenRequestMessage: Prisma.FieldRef<"Conversation", 'String'>;
}
export type ConversationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where: Prisma.ConversationWhereUniqueInput;
};
export type ConversationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where: Prisma.ConversationWhereUniqueInput;
};
export type ConversationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput | Prisma.ConversationOrderByWithRelationInput[];
    cursor?: Prisma.ConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConversationScalarFieldEnum | Prisma.ConversationScalarFieldEnum[];
};
export type ConversationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput | Prisma.ConversationOrderByWithRelationInput[];
    cursor?: Prisma.ConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConversationScalarFieldEnum | Prisma.ConversationScalarFieldEnum[];
};
export type ConversationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where?: Prisma.ConversationWhereInput;
    orderBy?: Prisma.ConversationOrderByWithRelationInput | Prisma.ConversationOrderByWithRelationInput[];
    cursor?: Prisma.ConversationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ConversationScalarFieldEnum | Prisma.ConversationScalarFieldEnum[];
};
export type ConversationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConversationCreateInput, Prisma.ConversationUncheckedCreateInput>;
};
export type ConversationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ConversationCreateManyInput | Prisma.ConversationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ConversationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    data: Prisma.ConversationCreateManyInput | Prisma.ConversationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ConversationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ConversationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConversationUpdateInput, Prisma.ConversationUncheckedUpdateInput>;
    where: Prisma.ConversationWhereUniqueInput;
};
export type ConversationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ConversationUpdateManyMutationInput, Prisma.ConversationUncheckedUpdateManyInput>;
    where?: Prisma.ConversationWhereInput;
    limit?: number;
};
export type ConversationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ConversationUpdateManyMutationInput, Prisma.ConversationUncheckedUpdateManyInput>;
    where?: Prisma.ConversationWhereInput;
    limit?: number;
    include?: Prisma.ConversationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ConversationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where: Prisma.ConversationWhereUniqueInput;
    create: Prisma.XOR<Prisma.ConversationCreateInput, Prisma.ConversationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ConversationUpdateInput, Prisma.ConversationUncheckedUpdateInput>;
};
export type ConversationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
    where: Prisma.ConversationWhereUniqueInput;
};
export type ConversationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ConversationWhereInput;
    limit?: number;
};
export type Conversation$assignedAgentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type Conversation$messagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MessageSelect<ExtArgs> | null;
    omit?: Prisma.MessageOmit<ExtArgs> | null;
    include?: Prisma.MessageInclude<ExtArgs> | null;
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput | Prisma.MessageOrderByWithRelationInput[];
    cursor?: Prisma.MessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MessageScalarFieldEnum | Prisma.MessageScalarFieldEnum[];
};
export type ConversationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ConversationSelect<ExtArgs> | null;
    omit?: Prisma.ConversationOmit<ExtArgs> | null;
    include?: Prisma.ConversationInclude<ExtArgs> | null;
};
