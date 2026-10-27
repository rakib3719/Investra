"use client";

import { useSearchParams } from "next/navigation";
import { DealMessagesWorkspace } from "../../shared/DealMessagesWorkspace";

export function EntrepreneurMessagesPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Investor Deal Rooms & Messages
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Direct deal conversations with accredited investors who accepted your pitch introductions.
        </p>
      </div>

      <DealMessagesWorkspace
        userRole="ENTREPRENEUR"
        initialConversationId={conversationId}
      />
    </div>
  );
}
