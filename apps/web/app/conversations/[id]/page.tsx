
import { Suspense } from "react";
import { connection } from "next/server";
import ConversationClient from "./conversation-client";

async function ConversationRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  return <ConversationClient conversationId={id} />;
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-600">
            Loading conversation...
          </p>
        </main>
      }
    >
      <ConversationRoute params={params} />
    </Suspense>
  );
}
