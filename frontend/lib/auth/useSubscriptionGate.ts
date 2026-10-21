"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useMySubscriptionQuery } from "@/lib/admin/admin-subscription-hooks";

export interface SubscriptionGateOptions {
  actionName?: string;
  title?: string;
  description?: string;
  targetRole?: "investor" | "entrepreneur" | "consultant";
}

export function useSubscriptionGate() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: subscription, isLoading: isSubLoading } = useMySubscriptionQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gateContext, setGateContext] = useState<SubscriptionGateOptions>({});

  const userRole = user?.role?.toUpperCase();
  const isAdmin = userRole === "ADMIN" || userRole === "SUB_ADMIN";

  // Check if current user has an active paid subscription
  const isSubscribed = Boolean(
    isAdmin || (subscription && subscription.status === "ACTIVE")
  );

  const executeWithSubscriptionGate = useCallback(
    (action: () => void, options?: SubscriptionGateOptions) => {
      if (!isAuthenticated) {
        // If not logged in, direct them to login
        router.push(`/login?returnUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/funds")}`);
        return;
      }

      if (isSubscribed) {
        action();
      } else {
        setGateContext(options || {});
        setIsModalOpen(true);
      }
    },
    [isAuthenticated, isSubscribed, router]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isAuthenticated,
    isSubscribed,
    isLoading: isAuthLoading || isSubLoading,
    isModalOpen,
    gateContext,
    executeWithSubscriptionGate,
    closeModal,
  };
}
