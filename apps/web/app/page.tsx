
"use client";

import { FormEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";

const API =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
};

type Conversation = {
  id: string;
  subject: string;
  status: string;
  messages: Message[];
};

export default function Home() {
  const [conversationId, setConversationId] = useState("");
  const [senderId, setSenderId] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!conversationId.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConversation(null);
      setMessages([]);
      setConnected(false);
      return;
    }

    let cancelled = false;

    setConversation(null);
    setMessages([]);
    setConnected(false);
    setError("");

    async function loadConversation() {
      try {
        const response = await fetch(
          `${API}/api/conversations/${encodeURIComponent(conversationId)}`,
        );

        if (!response.ok) {
          throw new Error("Could not load conversation.");
        }

        const data: Conversation = await response.json();

        if (!cancelled) {
          setConversation(data);
          setMessages(data.messages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Request failed.",
          );
        }
      }
    }

    const socket = io(API, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      if (cancelled) return;

      socket.emit("conversation:join", {
        conversationId: conversationId.trim(),
      });      
      setConnected(true);

    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("conversation:error", (data: { message: string }) => {
      if (!cancelled) setError(data.message);
    });

    socket.on("message:new", (message: Message) => {
      if (cancelled) return;

      setMessages((current) =>
        current.some((item) => item.id === message.id)
          ? current
          : [...current, message],
      );
    });

    void loadConversation();

    return () => {
      cancelled = true;
      socket.disconnect();
    };
  }, [conversationId]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!conversation || !senderId.trim() || !content.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/api/conversations/${encodeURIComponent(conversation.id)}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content.trim(),
            senderId: senderId.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message ?? "Could not send message.",
        );
      }

      // The REST response and socket event may both arrive.
      // Deduplicate by message ID.
      setMessages((current) =>
        current.some((item) => item.id === data.id)
          ? current
          : [...current, data],
      );

      setContent("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Request failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">RelayAI Support</h1>
        <p className="mt-2 text-sm text-gray-500">
          Real-time customer support prototype
        </p>
      </header>

      <section className="space-y-4 rounded-xl border p-4">
        <label className="block text-sm font-medium">
          Conversation ID
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            placeholder="Paste an existing conversation ID"
          />
        </label>

        <label className="block text-sm font-medium">
          Sender user ID
          <input
            className="mt-1 w-full rounded-lg border p-2"
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            placeholder="Paste the conversation customer's ID"
          />
        </label>

        <p className="text-sm">
          Connection:{" "}
          <span className={connected ? "text-green-600" : "text-gray-500"}>
            {connected ? "Connected" : "Disconnected"}
          </span>
        </p>
      </section>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {conversation && (
        <section className="flex min-h-96 flex-1 flex-col rounded-xl border">
          <div className="border-b p-4">
            <h2 className="font-semibold">{conversation.subject}</h2>
            <p className="text-sm text-gray-500">
              Status: {conversation.status}
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500">
                No messages yet. Start the conversation.
              </p>
            )}

            {messages.map((message) => (
              <article
                key={message.id}
                className="rounded-lg bg-gray-100 p-3 text-gray-900"
              >
                <p className="text-xs font-semibold">
                  {message.sender.name} · {message.sender.role}
                </p>
                <p className="mt-1 whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </article>
            ))}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t p-3">
            <input
              className="min-w-0 flex-1 rounded-lg border p-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
              maxLength={5000}
              required
            />
            <button
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
              disabled={loading || !connected}
              type="submit"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      )}

      <p className="text-xs text-gray-500">
        Development prototype. Use only test accounts and data.
      </p>
    </main>
  );
}
