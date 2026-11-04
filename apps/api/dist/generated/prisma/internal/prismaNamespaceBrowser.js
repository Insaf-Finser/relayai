import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    SystemCheck: 'SystemCheck',
    Ticket: 'Ticket',
    User: 'User',
    Conversation: 'Conversation',
    Message: 'Message',
    MessageRead: 'MessageRead'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const SystemCheckScalarFieldEnum = {
    id: 'id',
    createdAt: 'createdAt'
};
export const TicketScalarFieldEnum = {
    id: 'id',
    subject: 'subject',
    description: 'description',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const UserScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt'
};
export const ConversationScalarFieldEnum = {
    id: 'id',
    subject: 'subject',
    status: 'status',
    customerId: 'customerId',
    assignedAgentId: 'assignedAgentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    reopenRequestedAt: 'reopenRequestedAt',
    reopenRequestMessage: 'reopenRequestMessage'
};
export const MessageScalarFieldEnum = {
    id: 'id',
    conversationId: 'conversationId',
    senderId: 'senderId',
    content: 'content',
    createdAt: 'createdAt'
};
export const MessageReadScalarFieldEnum = {
    id: 'id',
    messageId: 'messageId',
    userId: 'userId',
    readAt: 'readAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map