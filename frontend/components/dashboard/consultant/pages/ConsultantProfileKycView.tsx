"use client";

import React, { useState } from "react";
import { ShieldCheck, User, Sparkles, AlertCircle } from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { ProfileWorkspaceCard } from "@/components/dashboard/shared/ProfileWorkspaceCard";
import { KycVerificationCard } from "@/components/dashboard/shared/KycVerificationCard";

interface ConsultantProfileKycViewProps {
  user: AuthUser;
  initialTab?: "profile" | "kyc";
}

export function ConsultantProfileKycView({
  user,
  initialTab = "profile",
}: ConsultantProfileKycViewProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "kyc">(initialTab);

  return (
    <div className="space-y-6">
      {/* Consultant Identity & Compliance Header Hub */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Advisor Command Center</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {user.email}
              </span>
            </div>
            <h2 className="font-heading font-black text-2xl text-slate-900 mt-2">
              Advisor Profile & KYC Compliance Vault
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Manage your public advisory branding, social cover photo, and private regulatory identity verification in one centralized workspace.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#064e3b]" />
              <span>Public Profile & Banner</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("kyc")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "kyc"
                  ? "bg-[#064e3b] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === "kyc" ? "text-emerald-300" : "text-emerald-600"}`} />
              <span>Identity & KYC Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "profile" ? (
        <div className="space-y-6">
          <ProfileWorkspaceCard user={user} />
        </div>
      ) : (
        <div className="space-y-6">
          <KycVerificationCard user={user} />
        </div>
      )}
    </div>
  );
}
