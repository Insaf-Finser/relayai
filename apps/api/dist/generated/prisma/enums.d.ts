export declare const TicketStatus: {
    readonly OPEN: "OPEN";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly RESOLVED: "RESOLVED";
};
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];
export declare const UserRole: {
    readonly CUSTOMER: "CUSTOMER";
    readonly AGENT: "AGENT";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const ConversationStatus: {
    readonly OPEN: "OPEN";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly RESOLVED: "RESOLVED";
};
export type ConversationStatus = (typeof ConversationStatus)[keyof typeof ConversationStatus];
