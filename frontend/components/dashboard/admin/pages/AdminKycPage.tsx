"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import {
  Panel,
  SectionHeading,
  StatusPill,
} from "@/components/dashboard/investor/InvestorUI";
import {
  useAdminKycListQuery,
  useAdminKycDetailQuery,
  useReviewAdminKycMutation,
} from "@/lib/kyc/kyc-hooks";
import type {
  AdminKycListItem,
  VerificationStatus,
} from "@/lib/kyc/kyc-api";
import type { AuthenticatedUserRole } from "@/lib/auth/types";
import { InvestraInlineLoader, InvestraLoader } from "@/components/ui/InvestraLoader";
import { toast } from "@/lib/toast";

const ROLES: { label: string; value: string }[] = [
  { label: "All Roles", value: "ALL" },
  { label: "Investors", value: "INVESTOR" },
  { label: "Entrepreneurs", value: "ENTREPRENEUR" },
  { label: "Consultants", value: "CONSULTANT" },
];

const STATUSES: { label: string; value: string }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
];

export function AdminKycPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  // Detail Modal / Drawer state
  const [selectedVerificationId, setSelectedVerificationId] = useState<string | null>(null);

  // Review Confirmation state
  const [reviewAction, setReviewAction] = useState<{
    verificationId: string;
    userName: string;
    action: "VERIFIED" | "REJECTED";
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const listQuery = useAdminKycListQuery({
    search: searchTerm.trim() || undefined,
    role: selectedRole === "ALL" ? undefined : (selectedRole as AuthenticatedUserRole),
    status: selectedStatus === "ALL" ? undefined : (selectedStatus as VerificationStatus),
    page,
    limit: 15,
  });

  const detailQuery = useAdminKycDetailQuery(selectedVerificationId || "");
  const reviewMutation = useReviewAdminKycMutation();

  const items = listQuery.data?.items || [];
  const meta = listQuery.data?.meta;

  const handleExecuteReview = async () => {
    if (!reviewAction) return;

    try {
      await reviewMutation.mutateAsync({
        id: reviewAction.verificationId,
        status: reviewAction.action,
        rejectionReason: reviewAction.action === "REJECTED" ? rejectionReason : undefined,
      });

      toast.success(
        `Application for ${reviewAction.userName} has been ${
          reviewAction.action === "VERIFIED" ? "Approved & Verified" : "Rejected"
        }.`,
        { title: "KYC Audit Completed" }
      );

      setReviewAction(null);
      setRejectionReason("");
      listQuery.refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Failed to submit review.";
      toast.error(msg, { title: "Audit Error" });
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Under Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Pending Audit
          </span>
        );
    }
  };

  const getRoleBadge = (role: AuthenticatedUserRole) => {
    switch (role) {
      case "INVESTOR":
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Investor
          </span>
        );
      case "ENTREPRENEUR":
        return (
          <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-600/20">
            Entrepreneur
          </span>
        );
      case "CONSULTANT":
        return (
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/20">
            Consultant
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview & Security Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#064e3b]" />
              <h2 className="font-heading font-black text-xl text-slate-800">
                Identity & KYC Moderation Vault
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
              Compliance officers review private NID documents, passports, and liveness selfies stored in encrypted Cloudflare R2 private bucket (<code className="text-[#064e3b] font-mono font-bold">investra-private</code>). Files are rendered on-demand with cryptographically signed 15-minute access tickets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => listQuery.refetch()}
              disabled={listQuery.isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${listQuery.isFetching ? "animate-spin" : ""}`} />
              Refresh Queue
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search applicant name, email, or NID/Passport number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b]"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#064e3b]"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Panel>

      {/* Verification Queue Table */}
      <Panel className="overflow-hidden">
        {listQuery.isLoading ? (
          <div className="p-12">
            <InvestraLoader label="Loading KYC submissions" description="Retrieving compliance queue..." />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="font-heading font-bold text-slate-700 text-sm">No KYC submissions found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || selectedRole !== "ALL" || selectedStatus !== "ALL"
                ? "Try clearing filters to view more records."
                : "No applications are currently pending moderation."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Doc Type & ID Number</th>
                  <th className="py-3 px-4">Vault Files</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-right">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const applicantName = `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim() || item.user.email;
                  const docDisplay = item.nidNumber
                    ? `NID: ${item.nidNumber}`
                    : item.passportNumber
                      ? `Passport: ${item.passportNumber}`
                      : "Document Attached";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.user.image ? (
                            <img
                              src={item.user.image}
                              alt={applicantName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold grid place-items-center">
                              {applicantName[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-800">{applicantName}</p>
                            <p className="text-[11px] text-slate-400">{item.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getRoleBadge(item.user.role)}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] font-medium text-slate-700">
                          {docDisplay}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              item.frontMedia ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                            title={item.frontMedia ? "Front doc present" : "No front doc"}
                          />
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              item.backMedia ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                            title={item.backMedia ? "Back doc present" : "No back doc"}
                          />
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              item.selfieMedia ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                            title={item.selfieMedia ? "Selfie check present" : "No selfie"}
                          />
                          <span className="text-[10px] text-slate-500 ml-1">
                            {[item.frontMedia, item.backMedia, item.selfieMedia].filter(Boolean).length}/3 files
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(item.verificationStatus)}</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedVerificationId(item.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#064e3b]" />
                            <span>Inspect</span>
                          </button>

                          {item.verificationStatus !== "VERIFIED" && (
                            <button
                              type="button"
                              onClick={() =>
                                setReviewAction({
                                  verificationId: item.id,
                                  userName: applicantName,
                                  action: "VERIFIED",
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-[#064e3b] hover:bg-[#053d2e] text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                            >
                              <CheckCircle className="w-3 h-3 text-emerald-300" />
                              <span>Approve</span>
                            </button>
                          )}

                          {item.verificationStatus !== "REJECTED" && (
                            <button
                              type="button"
                              onClick={() =>
                                setReviewAction({
                                  verificationId: item.id,
                                  userName: applicantName,
                                  action: "REJECTED",
                                })
                              }
                              className="px-2 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing page {meta.page} of {meta.totalPages} ({meta.total} records)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 font-semibold"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Panel>

      {/* DETAIL INSPECTION MODAL */}
      {selectedVerificationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#064e3b]" />
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-800">
                    KYC Document Audit Dossier
                  </h3>
                  <p className="text-xs text-slate-400">
                    Encrypted Cloudflare R2 Private Bucket Access
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVerificationId(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailQuery.isLoading ? (
              <div className="py-12">
                <InvestraLoader label="Decrypting audit files" description="Generating 15-minute temporary secure tickets..." />
              </div>
            ) : detailQuery.data ? (
              <div className="space-y-6">
                {/* Applicant Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicant</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {detailQuery.data.user.firstName} {detailQuery.data.user.lastName}
                    </p>
                    <p className="text-slate-500 text-[11px]">{detailQuery.data.user.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Role & Status</span>
                    <div className="mt-1 flex items-center gap-2">
                      {getRoleBadge(detailQuery.data.user.role)}
                      {getStatusBadge(detailQuery.data.verificationStatus)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Declared ID</span>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">
                      {detailQuery.data.nidNumber
                        ? `NID: ${detailQuery.data.nidNumber}`
                        : detailQuery.data.passportNumber
                          ? `Passport: ${detailQuery.data.passportNumber}`
                          : "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Secure Document Previews */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#064e3b]" />
                    <span>Private Documents (Decrypted via Presigned Token)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Front Document */}
                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#064e3b]" />
                          Front Doc
                        </span>
                        {detailQuery.data.frontMedia?.accessUrl && (
                          <a
                            href={detailQuery.data.frontMedia.accessUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-[#064e3b] font-bold hover:underline inline-flex items-center gap-0.5"
                          >
                            Full <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {detailQuery.data.frontMedia?.accessUrl ? (
                        detailQuery.data.frontMedia.mimeType?.includes("pdf") ? (
                          <div className="h-40 rounded-xl bg-slate-100 flex flex-col items-center justify-center p-3 text-center border border-slate-200">
                            <FileText className="w-8 h-8 text-slate-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-700 truncate max-w-full">
                              {detailQuery.data.frontMedia.originalName}
                            </p>
                            <span className="text-[10px] text-slate-400">PDF Document</span>
                          </div>
                        ) : (
                          <div className="h-40 rounded-xl overflow-hidden border border-slate-200 bg-black/5">
                            <img
                              src={detailQuery.data.frontMedia.accessUrl}
                              alt="Document Front"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        )
                      ) : (
                        <div className="h-40 rounded-xl bg-slate-100 grid place-items-center text-slate-400 text-xs">
                          Not Provided
                        </div>
                      )}
                    </div>

                    {/* Back Document */}
                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <FileCheck2 className="w-3.5 h-3.5 text-[#064e3b]" />
                          Back Doc
                        </span>
                        {detailQuery.data.backMedia?.accessUrl && (
                          <a
                            href={detailQuery.data.backMedia.accessUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-[#064e3b] font-bold hover:underline inline-flex items-center gap-0.5"
                          >
                            Full <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {detailQuery.data.backMedia?.accessUrl ? (
                        detailQuery.data.backMedia.mimeType?.includes("pdf") ? (
                          <div className="h-40 rounded-xl bg-slate-100 flex flex-col items-center justify-center p-3 text-center border border-slate-200">
                            <FileText className="w-8 h-8 text-slate-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-700 truncate max-w-full">
                              {detailQuery.data.backMedia.originalName}
                            </p>
                            <span className="text-[10px] text-slate-400">PDF Document</span>
                          </div>
                        ) : (
                          <div className="h-40 rounded-xl overflow-hidden border border-slate-200 bg-black/5">
                            <img
                              src={detailQuery.data.backMedia.accessUrl}
                              alt="Document Back"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        )
                      ) : (
                        <div className="h-40 rounded-xl bg-slate-100 grid place-items-center text-slate-400 text-xs">
                          Optional / None
                        </div>
                      )}
                    </div>

                    {/* Selfie / Liveness */}
                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[#064e3b]" />
                          Liveness Selfie
                        </span>
                        {detailQuery.data.selfieMedia?.accessUrl && (
                          <a
                            href={detailQuery.data.selfieMedia.accessUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-[#064e3b] font-bold hover:underline inline-flex items-center gap-0.5"
                          >
                            Full <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {detailQuery.data.selfieMedia?.accessUrl ? (
                        <div className="h-40 rounded-xl overflow-hidden border border-slate-200 bg-black/5">
                          <img
                            src={detailQuery.data.selfieMedia.accessUrl}
                            alt="Selfie Check"
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="h-40 rounded-xl bg-slate-100 grid place-items-center text-slate-400 text-xs">
                          Not Provided
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audit Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Audit decision will immediately update user platform permissions.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const applicantName = `${detailQuery.data.user.firstName || ""} ${detailQuery.data.user.lastName || ""}`.trim() || detailQuery.data.user.email;
                        setReviewAction({
                          verificationId: detailQuery.data.id,
                          userName: applicantName,
                          action: "REJECTED",
                        });
                      }}
                      className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Reject Application
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const applicantName = `${detailQuery.data.user.firstName || ""} ${detailQuery.data.user.lastName || ""}`.trim() || detailQuery.data.user.email;
                        setReviewAction({
                          verificationId: detailQuery.data.id,
                          userName: applicantName,
                          action: "VERIFIED",
                        });
                      }}
                      className="px-5 py-2 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] text-white font-bold text-xs transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* CONFIRM REVIEW MODAL */}
      {reviewAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl grid place-items-center ${
                  reviewAction.action === "VERIFIED"
                    ? "bg-emerald-100 text-[#064e3b]"
                    : "bg-rose-100 text-rose-600"
                }`}
              >
                {reviewAction.action === "VERIFIED" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-heading font-black text-slate-800 text-base">
                  {reviewAction.action === "VERIFIED" ? "Approve Verification" : "Reject Verification"}
                </h3>
                <p className="text-xs text-slate-500">{reviewAction.userName}</p>
              </div>
            </div>

            {reviewAction.action === "VERIFIED" ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to approve this applicant? Their status will be updated to <strong>VERIFIED</strong> and full role-based marketplace privileges will be unlocked.
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Please provide a reason for rejecting this verification application so the applicant can correct their submission.
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g. Identity document expired or illegible front photo..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setReviewAction(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={reviewMutation.isPending}
                onClick={handleExecuteReview}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm ${
                  reviewAction.action === "VERIFIED"
                    ? "bg-[#064e3b] hover:bg-[#053d2e]"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {reviewMutation.isPending ? (
                  <InvestraInlineLoader label="Processing..." />
                ) : reviewAction.action === "VERIFIED" ? (
                  "Confirm Approval"
                ) : (
                  "Confirm Rejection"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
