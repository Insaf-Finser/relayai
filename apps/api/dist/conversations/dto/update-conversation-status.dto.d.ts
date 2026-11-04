export declare enum ConversationStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}
export declare class UpdateConversationStatusDto {
    status: ConversationStatus;
}
