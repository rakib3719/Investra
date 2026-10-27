"use client";

import { useSearchParams } from "next/navigation";
import { DealMessagesWorkspace } from "../../shared/DealMessagesWorkspace";

export function MessagesPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Deal Rooms & Founder Messaging
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Conduct due diligence, exchange confidential pitch memos, and negotiate term sheets directly with verified founders.
        </p>
      </div>

      <DealMessagesWorkspace
        userRole="INVESTOR"
        initialConversationId={conversationId}
      />
    </div>
  );
}
