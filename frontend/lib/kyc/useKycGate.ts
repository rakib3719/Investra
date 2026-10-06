"use client";

import { useState, useCallback } from "react";
import { useMyKycQuery } from "@/lib/kyc/kyc-hooks";

export function useKycGate() {
  const { data: kycData, isLoading } = useMyKycQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gateContext, setGateContext] = useState<{
    actionName?: string;
    title?: string;
    description?: string;
  }>({});

  const isVerified = kycData?.status === "VERIFIED";

  const executeWithGate = useCallback(
    (
      action: () => void,
      options?: { actionName?: string; title?: string; description?: string }
    ) => {
      if (isVerified) {
        action();
      } else {
        setGateContext(options || {});
        setIsModalOpen(true);
      }
    },
    [isVerified]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isVerified,
    isLoading,
    isModalOpen,
    gateContext,
    executeWithGate,
    closeModal,
  };
}
