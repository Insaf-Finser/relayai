export type ConversationStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED";

export type Conversation = {
  id: string;
  subject: string;
  status: ConversationStatus;
  customerId: string;
  assignedAgentId: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    messages: number;
  };
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email?: string;
    role?: "CUSTOMER" | "AGENT" | "ADMIN";
  };
};

export type ConversationDetail = Conversation & {
  messages: Message[];
  reopenRequestedAt: string | null;
  reopenRequestMessage: string | null;
  assignedAgent?: {
    id: string;
    name: string;
    email?: string;
  } | null;
};