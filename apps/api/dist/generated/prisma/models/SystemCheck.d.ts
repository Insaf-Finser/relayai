import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SystemCheckModel = runtime.Types.Result.DefaultSelection<Prisma.$SystemCheckPayload>;
export type AggregateSystemCheck = {
    _count: SystemCheckCountAggregateOutputType | null;
    _min: SystemCheckMinAggregateOutputType | null;
    _max: SystemCheckMaxAggregateOutputType | null;
};
export type SystemCheckMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
};
export type SystemCheckMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
};
export type SystemCheckCountAggregateOutputType = {
    id: number;
    createdAt: number;
    _all: number;
};
export type SystemCheckMinAggregateInputType = {
    id?: true;
    createdAt?: true;
};
export type SystemCheckMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
};
export type SystemCheckCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    _all?: true;
};
export type SystemCheckAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SystemCheckWhereInput;
    orderBy?: Prisma.SystemCheckOrderByWithRelationInput | Prisma.SystemCheckOrderByWithRelationInput[];
    cursor?: Prisma.SystemCheckWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SystemCheckCountAggregateInputType;
    _min?: SystemCheckMinAggregateInputType;
    _max?: SystemCheckMaxAggregateInputType;
};
export type GetSystemCheckAggregateType<T extends SystemCheckAggregateArgs> = {
    [P in keyof T & keyof AggregateSystemCheck]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSystemCheck[P]> : Prisma.GetScalarType<T[P], AggregateSystemCheck[P]>;
};
export type SystemCheckGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SystemCheckWhereInput;
    orderBy?: Prisma.SystemCheckOrderByWithAggregationInput | Prisma.SystemCheckOrderByWithAggregationInput[];
    by: Prisma.SystemCheckScalarFieldEnum[] | Prisma.SystemCheckScalarFieldEnum;
    having?: Prisma.SystemCheckScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SystemCheckCountAggregateInputType | true;
    _min?: SystemCheckMinAggregateInputType;
    _max?: SystemCheckMaxAggregateInputType;
};
export type SystemCheckGroupByOutputType = {
    id: string;
    createdAt: Date;
    _count: SystemCheckCountAggregateOutputType | null;
    _min: SystemCheckMinAggregateOutputType | null;
    _max: SystemCheckMaxAggregateOutputType | null;
};
export type GetSystemCheckGroupByPayload<T extends SystemCheckGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SystemCheckGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SystemCheckGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SystemCheckGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SystemCheckGroupByOutputType[P]>;
}>>;
export type SystemCheckWhereInput = {
    AND?: Prisma.SystemCheckWhereInput | Prisma.SystemCheckWhereInput[];
    OR?: Prisma.SystemCheckWhereInput[];
    NOT?: Prisma.SystemCheckWhereInput | Prisma.SystemCheckWhereInput[];
    id?: Prisma.StringFilter<"SystemCheck"> | string;
    createdAt?: Prisma.DateTimeFilter<"SystemCheck"> | Date | string;
};
export type SystemCheckOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SystemCheckWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SystemCheckWhereInput | Prisma.SystemCheckWhereInput[];
    OR?: Prisma.SystemCheckWhereInput[];
    NOT?: Prisma.SystemCheckWhereInput | Prisma.SystemCheckWhereInput[];
    createdAt?: Prisma.DateTimeFilter<"SystemCheck"> | Date | string;
}, "id">;
export type SystemCheckOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SystemCheckCountOrderByAggregateInput;
    _max?: Prisma.SystemCheckMaxOrderByAggregateInput;
    _min?: Prisma.SystemCheckMinOrderByAggregateInput;
};
export type SystemCheckScalarWhereWithAggregatesInput = {
    AND?: Prisma.SystemCheckScalarWhereWithAggregatesInput | Prisma.SystemCheckScalarWhereWithAggregatesInput[];
    OR?: Prisma.SystemCheckScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SystemCheckScalarWhereWithAggregatesInput | Prisma.SystemCheckScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SystemCheck"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SystemCheck"> | Date | string;
};
export type SystemCheckCreateInput = {
    id?: string;
    createdAt?: Date | string;
};
export type SystemCheckUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
};
export type SystemCheckUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SystemCheckUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SystemCheckCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
};
export type SystemCheckUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SystemCheckUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SystemCheckCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SystemCheckMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SystemCheckMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type SystemCheckSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["systemCheck"]>;
export type SystemCheckSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["systemCheck"]>;
export type SystemCheckSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["systemCheck"]>;
export type SystemCheckSelectScalar = {
    id?: boolean;
    createdAt?: boolean;
};
export type SystemCheckOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "createdAt", ExtArgs["result"]["systemCheck"]>;
export type $SystemCheckPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SystemCheck";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        createdAt: Date;
    }, ExtArgs["result"]["systemCheck"]>;
    composites: {};
};
export type SystemCheckGetPayload<S extends boolean | null | undefined | SystemCheckDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload, S>;
export type SystemCheckCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SystemCheckFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SystemCheckCountAggregateInputType | true;
};
export interface SystemCheckDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SystemCheck'];
        meta: {
            name: 'SystemCheck';
        };
    };
    findUnique<T extends SystemCheckFindUniqueArgs>(args: Prisma.SelectSubset<T, SystemCheckFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SystemCheckClient<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SystemCheckFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SystemCheckFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SystemCheckClient<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SystemCheckFindFirstArgs>(args?: Prisma.SelectSubset<T, SystemCheckFindFirstArgs<ExtArgs>>): Prisma.Prisma__SystemCheckClient<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SystemCheckFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SystemCheckFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SystemCheckClient<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SystemCheckFindManyArgs>(args?: Prisma.SelectSubset<T, SystemCheckFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SystemCheckCreateArgs>(args: Prisma.SelectSubset<T, SystemCheckCreateArgs<ExtArgs>>): Prisma.Prisma__SystemCheckClient<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SystemCheckCreateManyArgs>(args?: Prisma.SelectSubset<T, SystemCheckCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SystemCheckCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SystemCheckCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SystemCheckDeleteArgs>(args: Prisma.SelectSubset<T, SystemCheckDeleteArgs<ExtArgs>>): Prisma.Prisma__SystemCheckClient<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SystemCheckUpdateArgs>(args: Prisma.SelectSubset<T, SystemCheckUpdateArgs<ExtArgs>>): Prisma.Prisma__SystemCheckClient<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SystemCheckDeleteManyArgs>(args?: Prisma.SelectSubset<T, SystemCheckDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SystemCheckUpdateManyArgs>(args: Prisma.SelectSubset<T, SystemCheckUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SystemCheckUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SystemCheckUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SystemCheckUpsertArgs>(args: Prisma.SelectSubset<T, SystemCheckUpsertArgs<ExtArgs>>): Prisma.Prisma__SystemCheckClient<runtime.Types.Result.GetResult<Prisma.$SystemCheckPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SystemCheckCountArgs>(args?: Prisma.Subset<T, SystemCheckCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SystemCheckCountAggregateOutputType> : number>;
    aggregate<T extends SystemCheckAggregateArgs>(args: Prisma.Subset<T, SystemCheckAggregateArgs>): Prisma.PrismaPromise<GetSystemCheckAggregateType<T>>;
    groupBy<T extends SystemCheckGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SystemCheckGroupByArgs['orderBy'];
    } : {
        orderBy?: SystemCheckGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SystemCheckGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemCheckGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SystemCheckFieldRefs;
}
export interface Prisma__SystemCheckClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SystemCheckFieldRefs {
    readonly id: Prisma.FieldRef<"SystemCheck", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SystemCheck", 'DateTime'>;
}
export type SystemCheckFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    where: Prisma.SystemCheckWhereUniqueInput;
};
export type SystemCheckFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    where: Prisma.SystemCheckWhereUniqueInput;
};
export type SystemCheckFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    where?: Prisma.SystemCheckWhereInput;
    orderBy?: Prisma.SystemCheckOrderByWithRelationInput | Prisma.SystemCheckOrderByWithRelationInput[];
    cursor?: Prisma.SystemCheckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SystemCheckScalarFieldEnum | Prisma.SystemCheckScalarFieldEnum[];
};
export type SystemCheckFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    where?: Prisma.SystemCheckWhereInput;
    orderBy?: Prisma.SystemCheckOrderByWithRelationInput | Prisma.SystemCheckOrderByWithRelationInput[];
    cursor?: Prisma.SystemCheckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SystemCheckScalarFieldEnum | Prisma.SystemCheckScalarFieldEnum[];
};
export type SystemCheckFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    where?: Prisma.SystemCheckWhereInput;
    orderBy?: Prisma.SystemCheckOrderByWithRelationInput | Prisma.SystemCheckOrderByWithRelationInput[];
    cursor?: Prisma.SystemCheckWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SystemCheckScalarFieldEnum | Prisma.SystemCheckScalarFieldEnum[];
};
export type SystemCheckCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    data?: Prisma.XOR<Prisma.SystemCheckCreateInput, Prisma.SystemCheckUncheckedCreateInput>;
};
export type SystemCheckCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SystemCheckCreateManyInput | Prisma.SystemCheckCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SystemCheckCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    data: Prisma.SystemCheckCreateManyInput | Prisma.SystemCheckCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SystemCheckUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SystemCheckUpdateInput, Prisma.SystemCheckUncheckedUpdateInput>;
    where: Prisma.SystemCheckWhereUniqueInput;
};
export type SystemCheckUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SystemCheckUpdateManyMutationInput, Prisma.SystemCheckUncheckedUpdateManyInput>;
    where?: Prisma.SystemCheckWhereInput;
    limit?: number;
};
export type SystemCheckUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SystemCheckUpdateManyMutationInput, Prisma.SystemCheckUncheckedUpdateManyInput>;
    where?: Prisma.SystemCheckWhereInput;
    limit?: number;
};
export type SystemCheckUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    where: Prisma.SystemCheckWhereUniqueInput;
    create: Prisma.XOR<Prisma.SystemCheckCreateInput, Prisma.SystemCheckUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SystemCheckUpdateInput, Prisma.SystemCheckUncheckedUpdateInput>;
};
export type SystemCheckDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
    where: Prisma.SystemCheckWhereUniqueInput;
};
export type SystemCheckDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SystemCheckWhereInput;
    limit?: number;
};
export type SystemCheckDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SystemCheckSelect<ExtArgs> | null;
    omit?: Prisma.SystemCheckOmit<ExtArgs> | null;
};
