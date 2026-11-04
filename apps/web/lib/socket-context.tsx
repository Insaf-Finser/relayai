
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./auth-context";
import { api } from "./api";

type UnreadCount = {
  conversationId: string;
  unreadCount: number;
};

type IncomingMessage = {
  id: string;
  conversationId: string;
  senderId: string;
};

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
  unreadCounts: Record<string, number>;
  totalUnread: number;
  setActiveConversationId: (id: string | null) => void;
  markConversationRead: (id: string) => Promise<void>;
  refreshUnreadCounts: () => Promise<void>;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  unreadCounts: {},
  totalUnread: 0,
  setActiveConversationId: () => {},
  markConversationRead: async () => {},
  refreshUnreadCounts: async () => {},
});

export function SocketProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { token, user } = useAuth();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<
    Record<string, number>
  >({});

  // A ref lets socket callbacks access the latest active conversation.
  const activeConversationRef = useRef<string | null>(null);

  const refreshUnreadCounts = useCallback(async () => {
    if (!token || !user || !["CUSTOMER", "AGENT"].includes(user.role)) {
      setUnreadCounts({});
      return;
    }

    try {
      const data = await api<UnreadCount[]>(
        "/conversations/unread-counts",
        { token },
      );

      const counts: Record<string, number> = {};

      for (const item of data) {
        counts[item.conversationId] = item.unreadCount;
      }

      setUnreadCounts(counts);
    } catch (error) {
      console.error("Could not refresh unread counts:", error);
    }
  }, [token, user]);

  const markConversationRead = useCallback(
    async (conversationId: string) => {
      if (!token || !conversationId) return;

      try {
        await api(
          `/conversations/${encodeURIComponent(conversationId)}/read`,
          {
            method: "POST",
            token,
          },
        );

        setUnreadCounts((current) => ({
          ...current,
          [conversationId]: 0,
        }));
      } catch (error) {
        console.error("Could not mark conversation as read:", error);
      }
    },
    [token],
  );

  const setActiveConversationId = useCallback(
    (conversationId: string | null) => {
      activeConversationRef.current = conversationId;

      if (conversationId) {
        void markConversationRead(conversationId);
      }
    },
    [markConversationRead],
  );

  useEffect(() => {
    if (!token || !user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(null);
      setConnected(false);
      setUnreadCounts({});
      activeConversationRef.current = null;
      return;
    }

    const newSocket = io(
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
      {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      },
    );

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setConnected(true);
      void refreshUnreadCounts();
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on("connect_error", () => {
      setConnected(false);
    });

    // Global message listener: works on every authenticated page.
    newSocket.on("message:new", (message: IncomingMessage) => {
      if (
        !message?.conversationId ||
        !message.id ||
        !message.senderId
      ) {
        return;
      }

      // Do not count messages sent by the current user.
      if (message.senderId === user.id) return;

      // If this conversation is open, mark it as read immediately.
      if (
        activeConversationRef.current === message.conversationId
      ) {
        void markConversationRead(message.conversationId);
        return;
      }

      // Otherwise increment its unread count.
      // Only customers and agents track unread counts.
        if (user.role !== "CUSTOMER" && user.role !== "AGENT") {
        return;
        }

        // Otherwise increment its unread count.
        setUnreadCounts((current) => ({
        ...current,
        [message.conversationId]:
          (current[message.conversationId] ?? 0) + 1,
      }));
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [
    token,
    user,
    refreshUnreadCounts,
    markConversationRead,
  ]);

  const totalUnread = Object.values(unreadCounts).reduce(
    (total, count) => total + count,
    0,
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        unreadCounts,
        totalUnread,
        setActiveConversationId,
        markConversationRead,
        refreshUnreadCounts,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
