
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import type { ConversationDetail, Message } from "../../../lib/types";
import { useSocket } from "../../../lib/socket-context";

type ConversationClientProps = {
  conversationId: string;
};

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ConversationClient({
  conversationId,
}: ConversationClientProps) {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const {
    socket,
    connected,
    setActiveConversationId,
  } = useSocket();

  const [conversation, setConversation] =
    useState<ConversationDetail | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");
  const [realtimeStatus, setRealtimeStatus] = useState<
    "connecting" | "connected" | "disconnected"
    >("connecting");
  const [realtimeError, setRealtimeError] = useState("");
  const [presenceByUserId, setPresenceByUserId] = useState<
    Record<string, boolean>
    >({});

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastScrolledConversationRef = useRef<string | null>(null);
  const isNearBottomRef = useRef(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [reopenMessage, setReopenMessage] = useState("");
  const [requestingReopen, setRequestingReopen] = useState(false);
  const [reopenError, setReopenError] = useState("");

    
    useEffect(() => {
        if (!token || !user) return;

        setActiveConversationId(conversationId);

        return () => {
            setActiveConversationId(null);

            // Reset initial scroll tracking when leaving the conversation.
            lastScrolledConversationRef.current = null;
            isNearBottomRef.current = true;
            setHasNewMessages(false);
        };
        }, [
        token,
        user,
        conversationId,
        setActiveConversationId,
    ]);

 useEffect(() => {
    if (token && user) return;

    // Temporary diagnostic: don't redirect immediately.
    console.warn("Conversation page has no in-memory session.");
    }, [token, user]);

  const loadConversation = useCallback(async () => {
    if (!token || !conversationId) return;

    setLoading(true);
    setError("");

    // Reset chat state before loading, so initial scrolling runs again.
    setConversation(null);
    lastScrolledConversationRef.current = null;
    isNearBottomRef.current = true;
    setHasNewMessages(false);

    try {
      const data = await api<ConversationDetail>(
        `/conversations/${encodeURIComponent(conversationId)}`,
        { token },
      );

      setConversation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load this conversation.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, conversationId]);

  useEffect(() => {
    if (token && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadConversation();
    }
  }, [token, user, loadConversation]);

  

useEffect(() => {
  if (!socket || !token || !user || !conversationId) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRealtimeStatus("disconnected");
    return;
  }

  if (!connected) {
    setRealtimeStatus("disconnected");
    setPresenceByUserId({});
    return;
  }

  let joined = false;

  setRealtimeStatus("connecting");
  setRealtimeError("");
  setPresenceByUserId({});

  const handleJoined = () => {
    joined = true;
    setRealtimeStatus("connected");
    setRealtimeError("");
  };

  const handleDisconnect = () => {
    joined = false;
    setRealtimeStatus("disconnected");
    setPresenceByUserId({});
  };

  const handleConversationError = (payload: {
    message?: string;
  }) => {
    joined = false;
    setRealtimeStatus("disconnected");
    setRealtimeError(
      payload.message ?? "Could not join the conversation room.",
    );
  };

  const handlePresence = (payload: {
    userId?: string;
    online?: boolean;
  }) => {
    if (
      typeof payload.userId !== "string" ||
      typeof payload.online !== "boolean"
    ) {
      return;
    }

    setPresenceByUserId((current) => ({
      ...current,
      [payload.userId!]: payload.online!,
    }));
  };

  const handleNewMessage = (message: Message) => {
  if (!joined) return;

  const container = messagesContainerRef.current;

  // Capture the reading position before React updates the messages.
  const wasNearBottom = container
    ? container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
      100
    : true;

  isNearBottomRef.current = wasNearBottom;

  setConversation((current) => {
    if (!current) return current;

    if (current.messages.some((item) => item.id === message.id)) {
      return current;
    }

    return {
      ...current,
      messages: [...current.messages, message].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      ),
    };
  });
};

  socket.on("conversation:joined", handleJoined);
  socket.on("disconnect", handleDisconnect);
  socket.on("conversation:error", handleConversationError);
  socket.on("user:presence", handlePresence);
  socket.on("message:new", handleNewMessage);

  socket.emit("conversation:join", { conversationId });

    
    return () => {
    // Leave the conversation room before removing listeners.
    if (socket.connected && joined) {
        socket.emit("conversation:leave", { conversationId });
    }

    socket.off("conversation:joined", handleJoined);
    socket.off("disconnect", handleDisconnect);
    socket.off("conversation:error", handleConversationError);
    socket.off("user:presence", handlePresence);
    socket.off("message:new", handleNewMessage);
    };

}, [socket, connected, token, user, conversationId]);

    useEffect(() => {
  const container = messagesContainerRef.current;

  if (!container || !conversation) return;

  const isFirstLoad =
    lastScrolledConversationRef.current !== conversation.id;

  if (isFirstLoad) {
    const frameId = requestAnimationFrame(() => {
      const currentContainer = messagesContainerRef.current;
      if (!currentContainer) return;

      currentContainer.scrollTop = currentContainer.scrollHeight;

      lastScrolledConversationRef.current = conversation.id;
      isNearBottomRef.current = true;
      setHasNewMessages(false);
    });

    return () => cancelAnimationFrame(frameId);
  }

  if (isNearBottomRef.current) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });

    setHasNewMessages(false);
  } else {
    setHasNewMessages(true);
  }
}, [conversation?.id, conversation?.messages?.length]);

const handleMessagesScroll = () => {
  const container = messagesContainerRef.current;
  if (!container) return;

  const distanceFromBottom =
    container.scrollHeight -
    container.scrollTop -
    container.clientHeight;

  const nearBottom = distanceFromBottom < 100;

  isNearBottomRef.current = nearBottom;

  if (nearBottom) {
    setHasNewMessages(false);
  }
};

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanContent = content.trim();

    if (!cleanContent || !token || sending) return;

    if (cleanContent.length > 5000) {
      setSendError("Messages cannot exceed 5000 characters.");
      return;
    }

    setSending(true);
    setSendError("");

    try {
      const message = await api<Message>(
        `/conversations/${encodeURIComponent(conversationId)}/messages`,
        {
          method: "POST",
          token,
          body: { content: cleanContent },
        },
      );

      setConversation((current) => {
        if (!current) return current;

        // Avoid inserting the same message twice.
        if (current.messages.some((item) => item.id === message.id)) {
          return current;
        }

        return {
          ...current,
          messages: [...current.messages, message],
        };
      });

      setContent("");

      isNearBottomRef.current = true;
        setHasNewMessages(false);

        requestAnimationFrame(() => {
        const container = messagesContainerRef.current;

        container?.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
        });
    } catch (err) {
      setSendError(
        err instanceof Error
          ? err.message
          : "Could not send your message.",
      );
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(
    newStatus: ConversationDetail["status"],
    ) {
    if (!token || !conversation || updatingStatus) return;

    setUpdatingStatus(true);
    setStatusError("");

    try {
        const updated = await api<ConversationDetail>(
        `/conversations/${encodeURIComponent(conversationId)}/status`,
        {
            method: "PATCH",
            token,
            body: { status: newStatus },
        },
        );

        setConversation((current) =>
        current ? { ...current, status: updated.status } : current,
        );
    } catch (err) {
        setStatusError(
        err instanceof Error
            ? err.message
            : "Could not update conversation status.",
        );
    } finally {
        setUpdatingStatus(false);
    }
    }

    async function handleRequestReopen(
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  const cleanMessage = reopenMessage.trim();

  if (!token || !conversation || requestingReopen) return;

  if (!cleanMessage) {
    setReopenError("Please explain why you need this conversation reopened.");
    return;
  }

  if (cleanMessage.length > 1000) {
    setReopenError("The reason cannot exceed 1000 characters.");
    return;
  }

  setRequestingReopen(true);
  setReopenError("");

  try {
    const updated = await api<
    Pick<ConversationDetail, "reopenRequestedAt" | "reopenRequestMessage">
    >(
      `/conversations/${encodeURIComponent(conversationId)}/reopen-request`,
      {
        method: "POST",
        token,
        body: { message: cleanMessage },
      },
    );

    setConversation((current) =>
        current
            ? {
                ...current,
                reopenRequestedAt: updated.reopenRequestedAt,
                reopenRequestMessage: updated.reopenRequestMessage,
            }
            : current,
    );

    setReopenMessage("");
  } catch (err) {
    setReopenError(
      err instanceof Error
        ? err.message
        : "Could not submit your reopening request.",
    );
  } finally {
    setRequestingReopen(false);
  }
}

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!token || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-600">Checking your session...</p>
      </main>
    );
  }

  return (
    <main className="h-dvh overflow-hidden bg-gray-50 px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <header className="mb-6 flex shrink-0 items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← My conversations
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </header>

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading conversation...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-white p-6">
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadConversation()}
              className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && conversation && (
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <header className="shrink-0 border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
              <h1 className="wrap-break-word text-xl font-bold text-gray-900">
                {conversation.subject}
              </h1>
              <p className="mt-2 text-xs text-gray-500" role="status">
                Real-time connection: {realtimeStatus}
                {realtimeError ? ` — ${realtimeError}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">
                        Status: <strong>{conversation.status.replace("_", " ")}</strong>
                    </span>

                    {(user.role === "ADMIN" ||
                        (user.role === "AGENT" &&
                        conversation.assignedAgentId === user.id)) && (
                        <>
                        {conversation.status === "OPEN" && (
                            <>
                            <button
                                type="button"
                                disabled={updatingStatus}
                                onClick={() => void handleStatusChange("IN_PROGRESS")}
                                className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                            >
                                Start working
                            </button>

                            <button
                                type="button"
                                disabled={updatingStatus}
                                onClick={() => void handleStatusChange("RESOLVED")}
                                className="rounded-lg border border-green-300 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50"
                            >
                                Resolve
                            </button>
                            </>
                        )}

                        {conversation.status === "IN_PROGRESS" && (
                            <button
                            type="button"
                            disabled={updatingStatus}
                            onClick={() => void handleStatusChange("RESOLVED")}
                            className="rounded-lg border border-green-300 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50"
                            >
                            Resolve conversation
                            </button>
                        )}

                        {conversation.status === "RESOLVED" && (
                            <>
                            <button
                                type="button"
                                disabled={updatingStatus}
                                onClick={() => void handleStatusChange("OPEN")}
                                className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                            >
                                Reopen
                            </button>

                            <button
                                type="button"
                                disabled={updatingStatus}
                                onClick={() => void handleStatusChange("IN_PROGRESS")}
                                className="rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                            >
                                Reopen and work
                            </button>
                            </>
                        )}

                        {updatingStatus && (
                            <span className="text-xs text-gray-500">Updating...</span>
                        )}
                        </>
                    )}
                    </div>

                    {statusError && (
                    <p role="alert" className="mt-2 text-sm text-red-700">
                        {statusError}
                    </p>
                    )}

                    {conversation.reopenRequestedAt &&
                        (user.role === "ADMIN" ||
                            (user.role === "AGENT" &&
                            conversation.assignedAgentId === user.id)) && (
                            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-amber-800">
                                Customer requested reopening
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                                {conversation.reopenRequestMessage}
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                Submitted: {formatMessageTime(conversation.reopenRequestedAt)}
                            </p>
                            </div>
                        )}

                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {user.role === "CUSTOMER" && (
                    <p>
                    Agent:{" "}
                    {!conversation.assignedAgentId
                        ? "Waiting for an agent"
                        : presenceByUserId[conversation.assignedAgentId] === true
                        ? "Online"
                        : presenceByUserId[conversation.assignedAgentId] === false
                            ? "Offline"
                            : "Checking status…"}
                    </p>
                )}

                {user.role === "AGENT" && (
                    <p>
                    Customer:{" "}
                    {presenceByUserId[conversation.customerId] === true
                        ? "Online"
                        : presenceByUserId[conversation.customerId] === false
                        ? "Offline"
                        : "Checking status…"}
                    </p>
                )}

                {user.role === "ADMIN" && (
                    <>
                    <p>
                        Customer:{" "}
                        {presenceByUserId[conversation.customerId] === true
                        ? "Online"
                        : presenceByUserId[conversation.customerId] === false
                            ? "Offline"
                            : "Checking status…"}
                    </p>

                    {conversation.assignedAgentId && (
                        <p>
                        Agent:{" "}
                        {presenceByUserId[conversation.assignedAgentId] === true
                            ? "Online"
                            : presenceByUserId[conversation.assignedAgentId] === false
                            ? "Offline"
                            : "Checking status…"}
                        </p>
                    )}
                    </>
                )}
                </div>
            </header>

            <div
                ref={messagesContainerRef}
                onScroll={handleMessagesScroll}
                className="relative min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6"
                aria-label="Message history"
                aria-live="polite"
            >
              {conversation.messages.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-500">
                  No messages yet. Send the first message below.
                </p>
              )}

              {conversation.messages.map((message) => {
                const isOwnMessage = message.senderId === user.id;

                return (
                    <div
                        key={message.id}
                        className={`flex items-end ${
                            isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                    >
                    <article
                        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
                            isOwnMessage
                            ? "rounded-br-md bg-blue-600 text-white"
                            : "rounded-bl-md bg-gray-100 text-gray-900"
                        }`}
                    >
                      <p className="mb-1 text-xs font-semibold opacity-80">
                        {isOwnMessage ? "You" : message.sender.name}
                      </p>

                      <p className="whitespace-pre-wrap wrap-break-word text-sm">
                        {message.content}
                      </p>

                      <p className="mt-2 text-right text-xs opacity-70">
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </article>
                  </div>
                );
              })}

              {hasNewMessages && (
                <div className="sticky bottom-2 z-10 flex justify-center">
                    <button
                    type="button"
                    onClick={() => {
                        const container = messagesContainerRef.current;
                        if (!container) return;

                        container.scrollTo({
                        top: container.scrollHeight,
                        behavior: "smooth",
                        });

                        isNearBottomRef.current = true;
                        setHasNewMessages(false);
                    }}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
                    >
                    ↓ New messages
                    </button>
                </div>
                )}
            </div>

            {conversation.status === "RESOLVED" &&
                user.role === "CUSTOMER" ? (
                <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
                    {conversation.reopenRequestedAt ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="font-semibold text-amber-800">
                        Reopening request pending
                        </p>
                        <p className="mt-1 text-sm text-amber-700">
                        Your request has been submitted. An agent will review it.
                        </p>
                        {conversation.reopenRequestMessage && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                            {conversation.reopenRequestMessage}
                        </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                        Submitted: {formatMessageTime(conversation.reopenRequestedAt)}
                        </p>
                    </div>
                    ) : (
                    <form onSubmit={handleRequestReopen}>
                        <label
                        htmlFor="reopen-message"
                        className="mb-2 block text-sm font-medium text-gray-700"
                        >
                        Why do you need this conversation reopened?
                        </label>

                        <textarea
                        id="reopen-message"
                        required
                        maxLength={1000}
                        rows={3}
                        value={reopenMessage}
                        onChange={(event) => setReopenMessage(event.target.value)}
                        placeholder="Explain why you need further assistance..."
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        {reopenError && (
                        <p role="alert" className="mt-2 text-sm text-red-700">
                            {reopenError}
                        </p>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xs text-gray-500">
                            {reopenMessage.length}/1000 characters
                        </p>
                        <button
                            type="submit"
                            disabled={requestingReopen || !reopenMessage.trim()}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {requestingReopen ? "Submitting..." : "Request reopening"}
                        </button>
                        </div>
                    </form>
                    )}
                </div>
                ) : conversation.status === "RESOLVED" ? (
                <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4 text-center">
                    <p className="text-sm text-gray-600">
                    This conversation has been resolved. Reopen it to send new messages.
                    </p>
                </div>
                ) : (
                /* Keep your existing message form unchanged here */
                <form
                    onSubmit={handleSendMessage}
                    className="shrink-0 border-t border-gray-200 bg-white p-4 sm:px-5"
                >
                    <label
                    htmlFor="message-content"
                    className="mb-2 block text-sm font-medium text-gray-700"
                    >
                    Your message
                    </label>

                    <textarea
                    id="message-content"
                    name="content"
                    required
                    maxLength={5000}
                    rows={3}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Type your message..."
                    className="max-h-32 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {sendError && (
                    <p role="alert" className="mt-2 text-sm text-red-700">
                        {sendError}
                    </p>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        {content.length}/5000 characters
                    </p>

                    <button
                        type="submit"
                        disabled={sending || !content.trim()}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {sending ? "Sending..." : "Send message"}
                    </button>
                    </div>
                </form>
                )}
          </section>
        )}
        
      </div>
    </main>
  );
}


