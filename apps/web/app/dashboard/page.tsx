
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import type { Conversation } from "../../lib/types";
import { useSocket } from "../../lib/socket-context";

type Agent = {
  id: string;
  name: string;
  email: string;
  role: "AGENT";
};

type Ticket = {
  id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  possibleDuplicates?: {
    id: string;
    subject: string;
    status: string;
    similarity: number;
    }[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(status: Conversation["status"]) {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In progress";
    case "RESOLVED":
      return "Resolved";
  }
}

export default function DashboardPage() {
    const router = useRouter();
    const { token, user, logout } = useAuth();
    
    const { unreadCounts, totalUnread } = useSocket();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [queue, setQueue] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [queueLoading, setQueueLoading] = useState(false);
    const [error, setError] = useState("");
    const [queueError, setQueueError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [claimError, setClaimError] = useState("");

    const [subject, setSubject] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [createSuccess, setCreateSuccess] = useState("");
    const [agents, setAgents] = useState<Agent[]>([]);
    const [agentsLoading, setAgentsLoading] = useState(false);
    const [agentsError, setAgentsError] = useState("");
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [assignmentErrors, setAssignmentErrors] = useState<
        Record<string, string>
    >({});
  
    const [ticketSubject, setTicketSubject] = useState("");
    const [ticketDescription, setTicketDescription] = useState("");
    const [creatingTicket, setCreatingTicket] = useState(false);
    const [ticketError, setTicketError] = useState("");
    const [ticketSuccess, setTicketSuccess] = useState("");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const [ticketsError, setTicketsError] = useState("");
    const [agentTickets, setAgentTickets] = useState<Ticket[]>([]);
    const [agentTicketsLoading, setAgentTicketsLoading] = useState(false);
    const [agentTicketsError, setAgentTicketsError] = useState("");
    const [summarizingId, setSummarizingId] = useState<string | null>(null);

    const [ticketSummaries, setTicketSummaries] = useState<
    Record<string, string>
    >({});

    const [summaryErrors, setSummaryErrors] = useState<
    Record<string, string>
    >({});

    const [generatingReplyId, setGeneratingReplyId] = useState<string | null>(null);
    const [ticketReplyDrafts, setTicketReplyDrafts] = useState<Record<string, string>>({});
    const [replyErrors, setReplyErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token || !user) {
      router.replace("/login");
    }
  }, [token, user, router]);

  const loadConversations = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const data = await api<Conversation[]>("/conversations", {
        method: "GET",
        token,
      });
      setConversations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load conversations.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadTickets = useCallback(async () => {
    if (!token || user?.role !== "CUSTOMER") return;

    setTicketsLoading(true);
    setTicketsError("");

    try {
        const data = await api<Ticket[]>("/tickets", {
        method: "GET",
        token,
        });

        setTickets(data);
    } catch (err) {
        setTicketsError(
        err instanceof Error ? err.message : "Could not load your tickets.",
        );
    } finally {
        setTicketsLoading(false);
    }
    }, [token, user?.role]);

    const loadAgentTickets = useCallback(async () => {
        if (
            !token ||
            (user?.role !== "AGENT" && user?.role !== "ADMIN")
        ) {
            return;
        }

        setAgentTicketsLoading(true);
        setAgentTicketsError("");

        try {
            const data = await api<Ticket[]>("/tickets", {
            method: "GET",
            token,
            });

            setAgentTickets(data);
        } catch (err) {
            setAgentTicketsError(
            err instanceof Error
                ? err.message
                : "Could not load tickets.",
            );
        } finally {
            setAgentTicketsLoading(false);
        }
    }, [token, user?.role]);

  const loadAgents = useCallback(async () => {
  if (!token || user?.role !== "ADMIN") return;

  setAgentsLoading(true);
  setAgentsError("");

  try {
    const data = await api<Agent[]>("/users", {
      method: "GET",
      token,
    });

    setAgents(data.filter((item) => item.role === "AGENT"));
  } catch (err) {
    setAgentsError(
      err instanceof Error ? err.message : "Could not load agents.",
    );
  } finally {
    setAgentsLoading(false);
  }
}, [token, user?.role]);

  const loadQueue = useCallback(async () => {
    if (!token || user?.role !== "AGENT") return;

    setQueueLoading(true);
    setQueueError("");

    try {
      const data = await api<Conversation[]>(
        "/conversations/queue/unassigned",
        {
          method: "GET",
          token,
        },
      );
      setQueue(data);
    } catch (err) {
      setQueueError(
        err instanceof Error ? err.message : "Could not load the inbox queue.",
      );
    } finally {
      setQueueLoading(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    if (!token || !user) return;

    void loadConversations();

    if (user.role === "AGENT") {
      void loadQueue();
    }

    if (user.role === "ADMIN") {
        void loadAgents();
    }

    if (user.role === "CUSTOMER") {
        void loadTickets();
    }
    
    if (user.role === "AGENT" || user.role === "ADMIN") {
        void loadAgentTickets();
    }
  }, [
  token,
  user,
  refreshKey,
  loadConversations,
  loadQueue,
  loadAgents,
  loadTickets,
  loadAgentTickets,
]);

  async function handleCreateConversation(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanSubject = subject.trim();
    setCreateError("");
    setCreateSuccess("");

    if (cleanSubject.length < 3 || cleanSubject.length > 150) {
      setCreateError("Subject must be between 3 and 150 characters.");
      return;
    }

    if (!token) {
      setCreateError("Your session has expired. Please log in again.");
      return;
    }

    setCreating(true);

    try {
      await api<Conversation>("/conversations", {
        method: "POST",
        token,
        body: { subject: cleanSubject },
      });

      setSubject("");
      setCreateSuccess("Conversation created successfully.");
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setCreateError(
        err instanceof Error
          ? err.message
          : "Could not create the conversation.",
      );
    } finally {
      setCreating(false);
    }
  }

    async function handleCreateTicket(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const cleanSubject = ticketSubject.trim();
        const cleanDescription = ticketDescription.trim();

        setTicketError("");
        setTicketSuccess("");

        if (cleanSubject.length < 3 || cleanSubject.length > 150) {
            setTicketError("Subject must be between 3 and 150 characters.");
            return;
        }

        if (cleanDescription.length < 5 || cleanDescription.length > 5000) {
            setTicketError("Description must be between 5 and 5000 characters.");
            return;
        }

        if (!token) {
            setTicketError("Your session has expired. Please log in again.");
            return;
        }

        setCreatingTicket(true);

        try {
            await api<Ticket>("/tickets", {
            method: "POST",
            token,
            body: {
                subject: cleanSubject,
                description: cleanDescription,
            },
            });

            setTicketSubject("");
            setTicketDescription("");
            setTicketSuccess("Your support request has been submitted successfully.");
            setRefreshKey((value) => value + 1);
        } catch (err) {
            setTicketError(
            err instanceof Error
                ? err.message
                : "Could not submit your support request.",
            );
        } finally {
            setCreatingTicket(false);
        }
    }

    async function handleGenerateSummary(ticketId: string) {
  if (!token) return;

  setSummarizingId(ticketId);

  setSummaryErrors((current) => {
    const next = { ...current };
    delete next[ticketId];
    return next;
  });

  try {
    const result = await api<{
      ticketId: string;
      summary: string;
    }>(`/tickets/${encodeURIComponent(ticketId)}/summary`, {
      method: "POST",
      token,
    });

    setTicketSummaries((current) => ({
      ...current,
      [ticketId]: result.summary,
    }));
  } catch (err) {
    setSummaryErrors((current) => ({
      ...current,
      [ticketId]:
        err instanceof Error
          ? err.message
          : "Could not generate ticket summary.",
    }));
  } finally {
    setSummarizingId(null);
  }
}

async function handleGenerateReply(ticketId: string) {
  if (!token) return;

  setGeneratingReplyId(ticketId);

  setReplyErrors((current) => {
    const next = { ...current };
    delete next[ticketId];
    return next;
  });

  try {
    const result = await api<{
      ticketId: string;
      reply: string;
    }>(`/tickets/${encodeURIComponent(ticketId)}/suggest-reply`, {
      method: "POST",
      token,
    });

    setTicketReplyDrafts((current) => ({
      ...current,
      [ticketId]: result.reply,
    }));
  } catch (err) {
    setReplyErrors((current) => ({
      ...current,
      [ticketId]:
        err instanceof Error
          ? err.message
          : "Could not generate suggested reply.",
    }));
  } finally {
    setGeneratingReplyId(null);
  }
}

  async function handleClaim(conversationId: string) {
    if (!token) return;

    setClaimingId(conversationId);
    setClaimError("");

    try {
      await api<Conversation>(`/conversations/${conversationId}/claim`, {
        method: "POST",
        token,
      });

      // Reload both lists after a successful claim.
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setClaimError(
        err instanceof Error
          ? err.message
          : "Could not claim this conversation.",
      );

      // Another agent may have claimed it first.
      setRefreshKey((value) => value + 1);
    } finally {
      setClaimingId(null);
    }
  }

  async function handleAssign(
    conversationId: string,
    agentId: string,
    ) {
    if (!token || !agentId) return;

    setAssigningId(conversationId);

    setAssignmentErrors((current) => {
        const next = { ...current };
        delete next[conversationId];
        return next;
    });

    try {
        await api<Conversation>(
        `/conversations/${encodeURIComponent(conversationId)}/assign`,
        {
            method: "PATCH",
            token,
            body: { agentId },
        },
        );

        setRefreshKey((value) => value + 1);
    } catch (err) {
        setAssignmentErrors((current) => ({
        ...current,
        [conversationId]:
            err instanceof Error ? err.message : "Assignment failed.",
        }));
    } finally {
        setAssigningId(null);
    }
    }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!token || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-600">Checking your session...</p>
      </main>
    );
  }

  const isCustomer = user.role === "CUSTOMER";
  const isAgent = user.role === "AGENT";
  const isAdmin = user.role === "ADMIN";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">RelayAI</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {isCustomer
                ? "My conversations"
                : isAgent
                  ? "Agent inbox"
                  : "Conversation overview"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Signed in as {user.name} ({user.email}) · {user.role}
            </p>
            {totalUnread > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    {totalUnread} unread {totalUnread === 1 ? "message" : "messages"}
                </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </header>

        {isCustomer && (
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Start a new conversation
            </h2>

            <form onSubmit={handleCreateConversation} className="mt-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="conversation-subject"
                  name="subject"
                  type="text"
                  required
                  minLength={3}
                  maxLength={150}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Briefly describe your issue"
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  disabled={creating || !subject.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create conversation"}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Use 3–150 characters for your subject.
              </p>

              {createError && (
                <p role="alert" className="mt-3 text-sm text-red-700">
                  {createError}
                </p>
              )}
              {createSuccess && (
                <p role="status" className="mt-3 text-sm text-green-700">
                  {createSuccess}
                </p>
              )}
            </form>
          </section>
        )}
        {isCustomer && (
            <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                Submit a support request
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                Describe the issue you&apos;re experiencing. Our support team will review it.
                </p>

                <form onSubmit={handleCreateTicket} className="mt-5 space-y-4">
                <div>
                    <label
                    htmlFor="ticket-subject"
                    className="mb-1 block text-sm font-medium text-gray-700"
                    >
                    Subject
                    </label>

                    <input
                    id="ticket-subject"
                    name="subject"
                    type="text"
                    required
                    minLength={3}
                    maxLength={150}
                    value={ticketSubject}
                    onChange={(event) => setTicketSubject(event.target.value)}
                    placeholder="Briefly describe your issue"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                    {ticketSubject.length}/150 characters
                    </p>
                </div>

                <div>
                    <label
                    htmlFor="ticket-description"
                    className="mb-1 block text-sm font-medium text-gray-700"
                    >
                    Description
                    </label>

                    <textarea
                    id="ticket-description"
                    name="description"
                    required
                    minLength={5}
                    maxLength={5000}
                    rows={5}
                    value={ticketDescription}
                    onChange={(event) => setTicketDescription(event.target.value)}
                    placeholder="Explain what happened and what help you need..."
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                    {ticketDescription.length}/5000 characters
                    </p>
                </div>

                {ticketError && (
                    <p role="alert" className="text-sm text-red-700">
                    {ticketError}
                    </p>
                )}

                {ticketSuccess && (
                    <p role="status" className="text-sm text-green-700">
                    {ticketSuccess}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={
                    creatingTicket ||
                    !ticketSubject.trim() ||
                    !ticketDescription.trim()
                    }
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {creatingTicket ? "Submitting..." : "Submit request"}
                </button>
                </form>
            </section>
        )}

        {isCustomer && (
            <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                    My support tickets
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                    {tickets.length} ticket{tickets.length === 1 ? "" : "s"} submitted
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void loadTickets()}
                    disabled={ticketsLoading}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    {ticketsLoading ? "Loading..." : "Refresh tickets"}
                </button>
                </div>

                {ticketsLoading && (
                <p className="py-8 text-center text-sm text-gray-500">
                    Loading your tickets...
                </p>
                )}

                {!ticketsLoading && ticketsError && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">{ticketsError}</p>
                    <button
                    type="button"
                    onClick={() => void loadTickets()}
                    className="mt-3 text-sm font-semibold text-red-700 underline"
                    >
                    Try again
                    </button>
                </div>
                )}

                {!ticketsLoading && !ticketsError && tickets.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">
                    You haven&apos;t submitted any support tickets yet.
                </p>
                )}

                {!ticketsLoading && !ticketsError && tickets.length > 0 && (
                <ul className="divide-y divide-gray-100">
                    {tickets.map((ticket) => (
                    <li key={ticket.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h3 className="wrap-break-word font-semibold text-gray-900">
                            {ticket.subject}
                            </h3>

                            <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm text-gray-600">
                            {ticket.description}
                            </p>

                            

                            <p className="mt-2 text-xs text-gray-500">
                            Submitted {formatDate(ticket.createdAt)}
                            </p>
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {ticket.status.replaceAll("_", " ")}
                        </span>
                        </div>
                    </li>
                    ))}
                </ul>
                )}
            </section>
        )}

        {isAgent && (
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Unassigned queue
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Open requests waiting for an agent.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                disabled={queueLoading || loading}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Refresh inbox
              </button>
            </div>

            {claimError && (
              <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                {claimError}
              </p>
            )}

            {queueLoading && (
              <p className="py-6 text-sm text-gray-500">Loading queue...</p>
            )}

            {!queueLoading && queueError && (
              <div role="alert" className="mt-4 rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-700">{queueError}</p>
                <button
                  type="button"
                  onClick={() => setRefreshKey((value) => value + 1)}
                  className="mt-2 text-sm font-semibold text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!queueLoading && !queueError && queue.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">
                No unassigned conversations right now.
              </p>
            )}

            {!queueLoading && !queueError && queue.length > 0 && (
              <ul className="mt-4 divide-y divide-gray-100">
                {queue.map((conversation) => (
                  <li
                    key={conversation.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="wrap-break-word font-semibold text-gray-900">
                        {conversation.subject}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Customer: {conversation.customer?.name ?? "Unknown"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Created {formatDate(conversation.createdAt)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleClaim(conversation.id)}
                      disabled={claimingId !== null}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {claimingId === conversation.id ? "Claiming..." : "Claim"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {(isAgent || isAdmin) && (
            <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                    Support ticket queue
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                    {agentTickets.length} ticket
                    {agentTickets.length === 1 ? "" : "s"} submitted by customers
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void loadAgentTickets()}
                    disabled={agentTicketsLoading}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    {agentTicketsLoading ? "Loading..." : "Refresh tickets"}
                </button>
                </div>

                {agentTicketsLoading && (
                <p className="py-8 text-center text-sm text-gray-500">
                    Loading support tickets...
                </p>
                )}

                {!agentTicketsLoading && agentTicketsError && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">{agentTicketsError}</p>
                    <button
                    type="button"
                    onClick={() => void loadAgentTickets()}
                    className="mt-3 text-sm font-semibold text-red-700 underline"
                    >
                    Try again
                    </button>
                </div>
                )}

                {!agentTicketsLoading &&
                !agentTicketsError &&
                agentTickets.length === 0 && (
                    <p className="py-8 text-center text-sm text-gray-500">
                    No support tickets have been submitted yet.
                    </p>
                )}

                {!agentTicketsLoading &&
                !agentTicketsError &&
                agentTickets.length > 0 && (
                    <ul className="divide-y divide-gray-100">
                    {agentTickets.map((ticket) => (
                        <li key={ticket.id} className="py-5 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                            <h3 className="wrap-break-word font-semibold text-gray-900">
                                {ticket.subject}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Customer: {ticket.customer?.name ?? "Unknown customer"}
                            </p>

                            {ticket.customer?.email && (
                                <p className="text-xs text-gray-500">
                                {ticket.customer.email}
                                </p>
                            )}

                            <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm text-gray-700">
                                {ticket.description.length > 180
                                ? `${ticket.description.slice(0, 180)}...`
                                : ticket.description}
                            </p>

                            {ticket.possibleDuplicates &&
                            ticket.possibleDuplicates.length > 0 && (
                                <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3">
                                <p className="text-sm font-semibold text-amber-800">
                                    Possible duplicate tickets
                                </p>

                                <div className="mt-2 space-y-2">
                                    {ticket.possibleDuplicates.map((duplicate) => (
                                    <div key={duplicate.id} className="text-sm text-amber-900">
                                        <p className="font-medium">{duplicate.subject}</p>
                                        <p className="text-xs">
                                        Status: {duplicate.status} · Similarity:{" "}
                                        {Math.round(duplicate.similarity * 100)}%
                                        </p>
                                    </div>
                                    ))}
                                </div>
                                </div>
                            )}

                            <div className="mt-3">
                                <button
                                    type="button"
                                    onClick={() => handleGenerateSummary(ticket.id)}
                                    disabled={summarizingId === ticket.id}
                                    className="rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {summarizingId === ticket.id
                                    ? "Generating summary..."
                                    : "Generate AI Summary"}
                                </button>

                                {ticketSummaries[ticket.id] && (
                                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                        AI-generated summary
                                    </p>
                                    <p className="mt-1 text-sm text-gray-800">
                                        {ticketSummaries[ticket.id]}
                                    </p>
                                    </div>
                                )}

                                {summaryErrors[ticket.id] && (
                                    <p className="mt-2 text-sm text-red-600">
                                    {summaryErrors[ticket.id]}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 rounded-lg border border-purple-200 bg-white p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-gray-900">
                                    AI Suggested Reply
                                    </p>

                                    <button
                                    type="button"
                                    onClick={() => handleGenerateReply(ticket.id)}
                                    disabled={generatingReplyId === ticket.id}
                                    className="rounded-lg border border-purple-300 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                    {generatingReplyId === ticket.id
                                        ? "Generating reply..."
                                        : "Generate AI Reply"}
                                    </button>
                                </div>

                                {ticketReplyDrafts[ticket.id] !== undefined && (
                                    <div className="mt-3">
                                    <label
                                        htmlFor={`reply-draft-${ticket.id}`}
                                        className="mb-2 block text-xs font-medium text-gray-600"
                                    >
                                        Review and edit before sending
                                    </label>

                                    <textarea
                                        id={`reply-draft-${ticket.id}`}
                                        value={ticketReplyDrafts[ticket.id]}
                                        onChange={(event) =>
                                        setTicketReplyDrafts((current) => ({
                                            ...current,
                                            [ticket.id]: event.target.value,
                                        }))
                                        }
                                        rows={7}
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    />

                                    <p className="mt-2 text-xs text-gray-500">
                                        AI-generated draft. Review and edit before sending.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            void navigator.clipboard.writeText(
                                            ticketReplyDrafts[ticket.id],
                                            );
                                        }}
                                        className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                        >
                                        Copy Reply
                                    </button>
                                    </div>
                                )}

                                {replyErrors[ticket.id] && (
                                    <p className="mt-2 text-sm text-red-600">
                                    {replyErrors[ticket.id]}
                                    </p>
                                )}
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Submitted {formatDate(ticket.createdAt)}
                            </p>
                            </div>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {ticket.status.replaceAll("_", " ")}
                            </span>
                        </div>
                        </li>
                    ))}
                    </ul>
                )}
            </section>
        )}

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isCustomer
                  ? "Your support requests"
                  : isAgent
                    ? "My assigned conversations"
                    : "All conversations"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {conversations.length} conversation
                {conversations.length === 1 ? "" : "s"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading && (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading conversations...
            </p>
          )}

          {!loading && error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                className="mt-3 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && conversations.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              {isAgent
                ? "You have no assigned conversations yet. Claim one from the queue above."
                : isCustomer
                  ? "No conversations yet. Create a support request above."
                  : "There are no conversations to display."}
            </p>
          )}

          {!loading && !error && conversations.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {conversations.map((conversation) => (
                <li key={conversation.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="wrap-break-word font-semibold text-gray-900">
                        <Link
                          href={`/conversations/${conversation.id}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {conversation.subject}
                        </Link>
                      </h3>
                      {isAdmin && (
                        <p className="mt-1 text-sm text-gray-500">
                          Customer: {conversation.customer?.name ?? "Unknown"}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Created {formatDate(conversation.createdAt)}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {conversation._count?.messages ?? 0} messages
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {formatStatus(conversation.status)}
                    </span>

                    {(unreadCounts[conversation.id] ?? 0) > 0 && (
                        <span
                        className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white"
                        aria-label={`${unreadCounts[conversation.id]} unread messages`}
                        >
                        {unreadCounts[conversation.id]}
                        </span>
                    )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="mt-3 w-full">
                        <label
                        htmlFor={`agent-${conversation.id}`}
                        className="mb-1 block text-xs font-medium text-gray-600"
                        >
                        Assign agent
                        </label>

                        <select
                        id={`agent-${conversation.id}`}
                        value={conversation.assignedAgentId ?? ""}
                        disabled={assigningId === conversation.id || agentsLoading}
                        onChange={(event) => {
                            const agentId = event.target.value;
                            if (agentId) {
                            void handleAssign(conversation.id, agentId);
                            }
                        }}
                        className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:opacity-50"
                        >
                        <option value="" disabled>
                            Select an agent
                        </option>

                        {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                            {agent.name} ({agent.email})
                            </option>
                        ))}
                        </select>

                        {assigningId === conversation.id && (
                        <p className="mt-1 text-xs text-gray-500">Assigning...</p>
                        )}

                        {assignmentErrors[conversation.id] && (
                        <p role="alert" className="mt-1 text-xs text-red-700">
                            {assignmentErrors[conversation.id]}
                        </p>
                        )}
                    </div>
                    )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
