"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  HelpCircle,
  Info,
  Layers,
  Lock,
  PieChart,
  Play,
  Plus,
  RefreshCw,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  UploadCloud,
  Video,
  X,
  Zap,
} from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  createPortfolioItem,
  deletePortfolioItem,
  getMyPortfolio,
  type CreatePortfolioItemPayload,
  type InvestorPortfolioItem,
  type InvestorProfileData,
  type InvestorPortfolioStats,
  type PortfolioItemType,
  updateMyPortfolioMeta,
  updatePortfolioItem,
  type UpdatePortfolioMetaPayload,
} from "@/lib/api/portfolio";
import { uploadMediaPipeline } from "@/lib/api/media";
import { toast } from "@/lib/toast";

const COMMON_SECTORS = [
  "FinTech",
  "AI & Automation",
  "CleanTech",
  "SaaS",
  "AgriTech",
  "HealthTech",
  "E-Commerce",
  "EdTech",
  "Logistics",
  "DeepTech",
];

const INVESTMENT_STAGES = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B+",
  "Growth",
];

export function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<InvestorProfileData | null>(null);
  const [items, setItems] = useState<InvestorPortfolioItem[]>([]);
  const [stats, setStats] = useState<InvestorPortfolioStats>({
    totalInvestments: 0,
    totalCapitalDeployed: 0,
    totalExits: 0,
    certificationsCount: 0,
    experienceCount: 0,
    videosCount: 0,
  });

  const [activeTab, setActiveTab] = useState<
    "ALL" | "INVESTMENT" | "CERTIFICATION" | "EXPERIENCE" | "VIDEO_PRESENTATION"
  >("ALL");

  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InvestorPortfolioItem | null>(null);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [metaActiveTab, setMetaActiveTab] = useState<"thesis" | "checks" | "links" | "video">("thesis");
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Form states for Portfolio Item Modal
  const [itemFormType, setItemFormType] = useState<PortfolioItemType>("INVESTMENT");
  const [itemTitle, setItemTitle] = useState("");
  const [itemSubtitle, setItemSubtitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemSector, setItemSector] = useState("");
  const [itemStage, setItemStage] = useState("Seed");
  const [itemAmount, setItemAmount] = useState<number | "">("");
  const [itemValuation, setItemValuation] = useState<number | "">("");
  const [itemReturnMultiple, setItemReturnMultiple] = useState("");
  const [itemStatus, setItemStatus] = useState("ACTIVE");
  const [itemYear, setItemYear] = useState<number | "">(new Date().getFullYear());
  const [itemIssuer, setItemIssuer] = useState("");
  const [itemCredentialId, setItemCredentialId] = useState("");
  const [itemCredentialUrl, setItemCredentialUrl] = useState("");
  const [itemVideoProvider, setItemVideoProvider] = useState("R2_PRIVATE");
  const [itemVideoUrl, setItemVideoUrl] = useState("");
  const [itemExternalUrl, setItemExternalUrl] = useState("");
  const [itemMediaFileId, setItemMediaFileId] = useState<string | null>(null);
  const [itemUploadedFileName, setItemUploadedFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Form states for Meta Modal
  const [metaHeadline, setMetaHeadline] = useState("");
  const [metaCompanyName, setMetaCompanyName] = useState("");
  const [metaDesignation, setMetaDesignation] = useState("");
  const [metaExperience, setMetaExperience] = useState<number | "">("");
  const [metaMinCheck, setMetaMinCheck] = useState<number | "">("");
  const [metaMaxCheck, setMetaMaxCheck] = useState<number | "">("");
  const [metaStage, setMetaStage] = useState("GROWTH");
  const [metaThesis, setMetaThesis] = useState("");
  const [metaBio, setMetaBio] = useState("");
  const [metaLinkedin, setMetaLinkedin] = useState("");
  const [metaTwitter, setMetaTwitter] = useState("");
  const [metaCrunchbase, setMetaCrunchbase] = useState("");
  const [metaWebsite, setMetaWebsite] = useState("");
  const [metaVideoIntroUrl, setMetaVideoIntroUrl] = useState("");
  const [metaSectors, setMetaSectors] = useState<string[]>([]);
  const [newSectorInput, setNewSectorInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch portfolio on mount
  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    try {
      setLoading(true);
      const res = await getMyPortfolio();
      setProfile(res.investor);
      setItems(res.portfolioItems);
      setStats(res.stats);

      // Populate meta modal initial values
      if (res.investor) {
        setMetaHeadline(res.investor.headline || "");
        setMetaCompanyName(res.investor.companyName || "");
        setMetaDesignation(res.investor.designation || "");
        setMetaExperience(res.investor.yearsOfExperience || "");
        setMetaMinCheck(res.investor.investmentRangeMin || "");
        setMetaMaxCheck(res.investor.investmentRangeMax || "");
        setMetaStage(res.investor.preferredStage || "GROWTH");
        setMetaThesis(res.investor.investmentThesis || "");
        setMetaBio(res.investor.bio || "");
        setMetaLinkedin(res.investor.linkedinUrl || "");
        setMetaTwitter(res.investor.twitterUrl || "");
        setMetaCrunchbase(res.investor.crunchbaseUrl || "");
        setMetaWebsite(res.investor.websiteUrl || "");
        setMetaVideoIntroUrl(res.investor.videoIntroUrl || "");
        setMetaSectors(res.investor.sectors || []);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load investor portfolio."
      );
    } finally {
      setLoading(false);
    }
  }

  // Open Add/Edit Item modal
  const handleOpenItemModal = (item?: InvestorPortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setItemFormType(item.type);
      setItemTitle(item.title || "");
      setItemSubtitle(item.subtitle || "");
      setItemDescription(item.description || "");
      setItemSector(item.sector || "");
      setItemStage(item.stage || "Seed");
      setItemAmount(item.amountInvested !== null && item.amountInvested !== undefined ? item.amountInvested : "");
      setItemValuation(item.valuation !== null && item.valuation !== undefined ? item.valuation : "");
      setItemReturnMultiple(item.returnMultiple || "");
      setItemStatus(item.status || "ACTIVE");
      setItemYear(item.year || new Date().getFullYear());
      setItemIssuer(item.issuer || "");
      setItemCredentialId(item.credentialId || "");
      setItemCredentialUrl(item.credentialUrl || "");
      setItemVideoProvider(item.videoProvider || "R2_PRIVATE");
      setItemVideoUrl(item.videoUrl || "");
      setItemExternalUrl(item.externalUrl || "");
      setItemMediaFileId(item.mediaFileId || null);
      setItemUploadedFileName(item.signedDocumentUrl ? "Verified Document on File" : null);
    } else {
      setEditingItem(null);
      setItemFormType("INVESTMENT");
      setItemTitle("");
      setItemSubtitle("");
      setItemDescription("");
      setItemSector("");
      setItemStage("Seed");
      setItemAmount("");
      setItemValuation("");
      setItemReturnMultiple("");
      setItemStatus("ACTIVE");
      setItemYear(new Date().getFullYear());
      setItemIssuer("");
      setItemCredentialId("");
      setItemCredentialUrl("");
      setItemVideoProvider("R2_PRIVATE");
      setItemVideoUrl("");
      setItemExternalUrl("");
      setItemMediaFileId(null);
      setItemUploadedFileName(null);
    }
    setUploadProgress(null);
    setIsItemModalOpen(true);
  };

  // Cloudflare R2 Upload handler
  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);
      setItemUploadedFileName(file.name);

      let category: any = "PORTFOLIO_DOCUMENT";
      if (itemFormType === "CERTIFICATION") category = "PORTFOLIO_CERTIFICATE";
      if (itemFormType === "VIDEO_PRESENTATION") category = "PORTFOLIO_VIDEO";

      const uploadedMedia = await uploadMediaPipeline(
        file,
        category,
        (progress) => {
          setUploadProgress(Math.min(95, progress));
        }
      );

      setUploadProgress(100);
      setItemMediaFileId(uploadedMedia.id);
      toast.success("File securely uploaded to Private Vault!");
    } catch (err: any) {
      toast.error(err?.message || "File upload failed. Please try again.");
      setItemUploadedFileName(null);
      setItemMediaFileId(null);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 1200);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) {
      toast.error("Please provide an entry title or startup name.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: CreatePortfolioItemPayload = {
        type: itemFormType,
        title: itemTitle.trim(),
        subtitle: itemSubtitle.trim() || undefined,
        description: itemDescription.trim() || undefined,
        sector: itemSector.trim() || undefined,
        stage: itemStage || undefined,
        amountInvested: itemAmount !== "" ? Number(itemAmount) : undefined,
        valuation: itemValuation !== "" ? Number(itemValuation) : undefined,
        returnMultiple: itemReturnMultiple.trim() || undefined,
        status: itemStatus || undefined,
        year: itemYear !== "" ? Number(itemYear) : undefined,
        issuer: itemIssuer.trim() || undefined,
        credentialId: itemCredentialId.trim() || undefined,
        credentialUrl: itemCredentialUrl.trim() || undefined,
        videoProvider: itemVideoProvider || undefined,
        videoUrl: itemVideoUrl.trim() || undefined,
        externalUrl: itemExternalUrl.trim() || undefined,
        mediaFileId: itemMediaFileId || undefined,
      };

      if (editingItem) {
        await updatePortfolioItem(editingItem.id, payload);
        toast.success("Portfolio entry updated successfully!");
      } else {
        await createPortfolioItem(payload);
        toast.success("New portfolio entry added to your vault!");
      }

      setIsItemModalOpen(false);
      fetchPortfolio();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save portfolio entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to remove this item from your portfolio?")) return;
    try {
      setDeletingItemId(id);
      await deletePortfolioItem(id);
      toast.success("Portfolio entry deleted.");
      fetchPortfolio();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete item.");
    } finally {
      setDeletingItemId(null);
    }
  };

  // Save Meta / Thesis
  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload: UpdatePortfolioMetaPayload = {
        headline: metaHeadline.trim() || undefined,
        companyName: metaCompanyName.trim() || undefined,
        designation: metaDesignation.trim() || undefined,
        yearsOfExperience: metaExperience !== "" ? Number(metaExperience) : undefined,
        investmentRangeMin: metaMinCheck !== "" ? Number(metaMinCheck) : undefined,
        investmentRangeMax: metaMaxCheck !== "" ? Number(metaMaxCheck) : undefined,
        preferredStage: metaStage || undefined,
        investmentThesis: metaThesis.trim() || undefined,
        bio: metaBio.trim() || undefined,
        linkedinUrl: metaLinkedin.trim() || undefined,
        twitterUrl: metaTwitter.trim() || undefined,
        crunchbaseUrl: metaCrunchbase.trim() || undefined,
        websiteUrl: metaWebsite.trim() || undefined,
        videoIntroUrl: metaVideoIntroUrl.trim() || undefined,
        sectors: metaSectors,
      };

      await updateMyPortfolioMeta(payload);
      toast.success("Portfolio parameters & thesis saved successfully!");
      setIsMetaModalOpen(false);
      fetchPortfolio();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile parameters.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSector = () => {
    if (!newSectorInput.trim()) return;
    if (!metaSectors.includes(newSectorInput.trim())) {
      setMetaSectors([...metaSectors, newSectorInput.trim()]);
    }
    setNewSectorInput("");
  };

  const removeSector = (sec: string) => {
    setMetaSectors(metaSectors.filter((s) => s !== sec));
  };

  // Calculate completeness score
  const completenessChecks = [
    { label: "Profile Headline", done: Boolean(profile?.headline), action: () => { setMetaActiveTab("thesis"); setIsMetaModalOpen(true); } },
    { label: "Investment Thesis", done: Boolean(profile?.investmentThesis), action: () => { setMetaActiveTab("thesis"); setIsMetaModalOpen(true); } },
    { label: "Check Range Set", done: Boolean(profile?.investmentRangeMin && profile?.investmentRangeMax), action: () => { setMetaActiveTab("checks"); setIsMetaModalOpen(true); } },
    { label: "Backed Companies", done: items.some((i) => i.type === "INVESTMENT"), action: () => { setItemFormType("INVESTMENT"); handleOpenItemModal(); } },
    { label: "Verified Certificates", done: items.some((i) => i.type === "CERTIFICATION"), action: () => { setItemFormType("CERTIFICATION"); handleOpenItemModal(); } },
    { label: "Video Pitch Intro", done: Boolean(profile?.videoIntroUrl || items.some((i) => i.type === "VIDEO_PRESENTATION")), action: () => { setItemFormType("VIDEO_PRESENTATION"); handleOpenItemModal(); } },
  ];
  const completedCount = completenessChecks.filter((c) => c.done).length;
  const completenessPercent = Math.round((completedCount / completenessChecks.length) * 100);

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "ALL" || item.type === activeTab;
    const matchesQuery =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sector && item.sector.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.issuer && item.issuer.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-16 font-body text-slate-800">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER & PORTFOLIO CONTROL CENTER                       */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#032e24] via-[#064e3b] to-[#182b45] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-bold font-heading text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Accredited Investor Portfolio Dossier</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
              {profile?.companyName || profile?.user?.firstName
                ? `${profile?.companyName || profile?.user?.firstName + "'s"} Track Record & Vault`
                : "Investment Portfolio & Vault"}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl font-body">
              Manage your backed startups, upload verified accreditations to Private Vault,
              and articulate your investment thesis. Founders inspect this portfolio during diligence.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            {profile?.userId && (
              <Link
                href={`/investors/${profile.userId}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold font-heading text-white transition-all backdrop-blur-md"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Public View</span>
                <ArrowUpRight className="h-3 w-3 opacity-70" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMetaModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold font-heading text-white transition-all backdrop-blur-md cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Thesis & Parameters</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenItemModal()}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 px-5 py-2.5 text-xs font-black font-heading shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Entry</span>
            </button>
          </div>

        </div>

        {/* Quick Social & Bio Pills */}
        <div className="relative z-10 mt-6 pt-5 border-t border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-100">
          <div className="flex flex-wrap items-center gap-3">
            {profile?.headline && (
              <span className="font-medium text-emerald-100/90 italic">
                &ldquo;{profile.headline}&rdquo;
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <FaLinkedin className="h-4 w-4 text-emerald-300" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile?.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4 text-emerald-300" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* ============================================================== */}
      {/* 2. GUIDED DOSSIER COMPLETENESS METER                           */}
      {/* ============================================================== */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-heading font-black text-slate-900">
                  Investor Profile Strength
                </h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 font-heading">
                  {completenessPercent}% Complete
                </span>
              </div>
              <p className="text-xs text-slate-500 font-body">
                Profiles with 100% completed dossiers receive 4x more relevant founder dealflow.
              </p>
            </div>
          </div>

          <span className="text-xs font-heading font-bold text-slate-400">
            {completedCount} of {completenessChecks.length} Steps Completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${completenessPercent}%` }}
          />
        </div>

        {/* Checklist Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {completenessChecks.map((chk, idx) => (
            <button
              key={idx}
              type="button"
              onClick={chk.action}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold font-heading transition-all cursor-pointer text-left ${
                chk.done
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {chk.done ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Plus className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate">{chk.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. KPI METRICS TELEMETRY STRIP                                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Active Startups</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Building2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-slate-900 font-heading">
              {stats.totalInvestments}
            </h4>
            <p className="text-[11px] text-slate-400 font-body mt-0.5">
              Recorded portfolio holdings
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Capital Deployed</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <CircleDollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-slate-900 font-heading">
              ${stats.totalCapitalDeployed?.toLocaleString() || "0"}
            </h4>
            <p className="text-[11px] text-slate-400 font-body mt-0.5">
              Aggregated syndicated commitments
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Realized Exits</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-purple-700 font-heading">
              {stats.totalExits}
            </h4>
            <p className="text-[11px] text-slate-400 font-body mt-0.5">
              Acquisitions and IPOs
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider font-heading">Verified Vault Files</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-slate-900 font-heading">
              {stats.certificationsCount}
            </h4>
            <p className="text-[11px] text-slate-400 font-body mt-0.5">
              Private Vault certificates
            </p>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. FILTER TABS & SEARCH BAR                                    */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "ALL", label: `All Entries (${items.length})` },
            { key: "INVESTMENT", label: `Holdings (${items.filter((i) => i.type === "INVESTMENT").length})` },
            { key: "CERTIFICATION", label: `Certifications (${items.filter((i) => i.type === "CERTIFICATION").length})` },
            { key: "EXPERIENCE", label: `Advisory (${items.filter((i) => i.type === "EXPERIENCE").length})` },
            { key: "VIDEO_PRESENTATION", label: `Videos (${items.filter((i) => i.type === "VIDEO_PRESENTATION").length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`rounded-2xl px-3.5 py-2 text-xs font-bold font-heading transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#064e3b] text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, sector, or issuer..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all font-body"
          />
        </div>

      </div>

      {/* ============================================================== */}
      {/* 5. ITEM CARDS GRID ROSTER                                      */}
      {/* ============================================================== */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50 text-emerald-700">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-heading font-black text-slate-900">
              No entries found in this section
            </h4>
            <p className="text-xs text-slate-500 font-body max-w-sm mx-auto">
              Add your backed startups, accredited licenses, or advisory positions to start building your verified portfolio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenItemModal()}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#064e3b] hover:bg-[#043d2e] px-5 py-2.5 text-xs font-bold font-heading text-white shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Entry</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-emerald-300 transition-all hover:shadow-md"
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-2xl text-xs font-bold ${
                        item.type === "INVESTMENT"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.type === "CERTIFICATION"
                          ? "bg-purple-50 text-purple-700"
                          : item.type === "VIDEO_PRESENTATION"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.type === "INVESTMENT" && <Building2 className="h-5 w-5" />}
                      {item.type === "CERTIFICATION" && <Award className="h-5 w-5" />}
                      {item.type === "VIDEO_PRESENTATION" && <Video className="h-5 w-5" />}
                      {item.type === "EXPERIENCE" && <Briefcase className="h-5 w-5" />}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading block">
                        {item.type.replace("_", " ")}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 font-heading line-clamp-1">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {item.status && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold font-heading ${
                        item.status.includes("EXIT")
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  )}
                </div>

                {/* Subtitle / Issuer */}
                {(item.subtitle || item.issuer) && (
                  <p className="text-xs font-bold text-slate-700 font-heading">
                    {item.subtitle || `Issuer: ${item.issuer}`}
                  </p>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-slate-600 font-body line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Investment Stats */}
                {item.type === "INVESTMENT" && (
                  <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3 text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">Invested</span>
                      <p className="font-black text-slate-900 font-heading">
                        {item.amountInvested ? `$${item.amountInvested.toLocaleString()}` : "Undisclosed"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">Return Multiple</span>
                      <p className="font-black text-emerald-600 font-heading">
                        {item.returnMultiple || "Active"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {item.sector && (
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 font-heading">
                      {item.sector}
                    </span>
                  )}
                  {item.stage && (
                    <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 font-heading">
                      {item.stage}
                    </span>
                  )}
                  {item.year && (
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 font-body">
                      {item.year}
                    </span>
                  )}
                </div>

                {/* Attached Private File Badge */}
                {item.signedDocumentUrl && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/70 rounded-2xl p-2.5 border border-emerald-200/60 font-heading">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Verified Vault Attached</span>
                    <a
                      href={item.signedDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto text-[11px] underline font-black shrink-0 hover:text-emerald-950"
                    >
                      View
                    </a>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  {item.externalUrl ? (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-bold font-heading"
                    >
                      <span>Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-body">Vault Entry</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenItemModal(item)}
                    className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={deletingItemId === item.id}
                    className="p-2 text-rose-400 hover:text-rose-700 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. MODAL: ADD / EDIT PORTFOLIO ENTRY (INTUITIVE & GUIDED)      */}
      {/* ============================================================== */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-heading">
                  Portfolio Vault Manager
                </span>
                <h3 className="text-xl font-heading font-black text-slate-900 mt-1">
                  {editingItem ? "Edit Portfolio Holding" : "Add Portfolio Entry"}
                </h3>
                <p className="text-xs text-slate-500 font-body">
                  Select the entry type and complete the verified dossier parameters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-5">
              
              {/* Category Picker Cards */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-2">
                  1. What would you like to add?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      { key: "INVESTMENT", label: "Past Investment", icon: Building2, desc: "Startup backed" },
                      { key: "CERTIFICATION", label: "Accreditation", icon: Award, desc: "CFA, SEC License" },
                      { key: "EXPERIENCE", label: "Advisory / Role", icon: Briefcase, desc: "Fund or Board" },
                      { key: "VIDEO_PRESENTATION", label: "Video Intro", icon: Video, desc: "Pitch guidelines" },
                    ] as const
                  ).map((t) => {
                    const Icon = t.icon;
                    const isSelected = itemFormType === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setItemFormType(t.key)}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-sm ring-1 ring-emerald-600"
                            : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? "text-emerald-700" : "text-slate-400"}`} />
                        <span className="text-xs font-black font-heading">{t.label}</span>
                        <span className="text-[10px] text-slate-400 font-body">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1.5">
                  {itemFormType === "INVESTMENT"
                    ? "Company / Startup Name *"
                    : itemFormType === "CERTIFICATION"
                    ? "Certification or License Name *"
                    : itemFormType === "VIDEO_PRESENTATION"
                    ? "Video Title / Topic *"
                    : "Position / Role Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder={
                    itemFormType === "INVESTMENT"
                      ? "e.g. Solstice Clean Energy, Apex FinTech"
                      : itemFormType === "CERTIFICATION"
                      ? "e.g. Chartered Financial Analyst (CFA)"
                      : itemFormType === "VIDEO_PRESENTATION"
                      ? "e.g. 2025 Deal Selection Criteria & Founder Masterclass"
                      : "e.g. Managing Partner at Northstar Ventures"
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-body"
                />
              </div>

              {/* TYPE-SPECIFIC FIELDS */}

              {/* A. If Investment */}
              {itemFormType === "INVESTMENT" && (
                <div className="space-y-4 rounded-3xl bg-slate-50/60 p-4 border border-slate-100">
                  
                  {/* Quick Sector Chips */}
                  <div>
                    <label className="block text-xs font-bold font-heading text-slate-700 mb-1.5">
                      Sector / Industry
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {COMMON_SECTORS.map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setItemSector(sec)}
                          className={`rounded-xl px-2.5 py-1 text-[11px] font-bold font-heading transition-all cursor-pointer ${
                            itemSector === sec
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          {sec}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={itemSector}
                      onChange={(e) => setItemSector(e.target.value)}
                      placeholder="Or enter custom sector..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Stage and Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Round Stage Backed
                      </label>
                      <select
                        value={itemStage}
                        onChange={(e) => setItemStage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-heading"
                      >
                        {INVESTMENT_STAGES.map((stg) => (
                          <option key={stg} value={stg}>{stg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Holding Status
                      </label>
                      <select
                        value={itemStatus}
                        onChange={(e) => setItemStatus(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-heading"
                      >
                        <option value="ACTIVE">Active Holding</option>
                        <option value="EXITED_ACQUISITION">Exited (M&A Acquisition)</option>
                        <option value="EXITED_IPO">Exited (IPO)</option>
                        <option value="WRITTEN_OFF">Written Off</option>
                      </select>
                    </div>
                  </div>

                  {/* Financial Multiples */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Capital Invested ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={itemAmount}
                        onChange={(e) =>
                          setItemAmount(e.target.value ? Number(e.target.value) : "")
                        }
                        placeholder="e.g. 150000"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">🔒 Pro diligence only</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Return Multiple (MOIC)
                      </label>
                      <input
                        type="text"
                        value={itemReturnMultiple}
                        onChange={(e) => setItemReturnMultiple(e.target.value)}
                        placeholder="e.g. 4.2x or Active"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-heading font-bold text-emerald-700"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">e.g. 3.5x MOIC</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Investment Year
                      </label>
                      <input
                        type="number"
                        value={itemYear}
                        onChange={(e) =>
                          setItemYear(e.target.value ? Number(e.target.value) : "")
                        }
                        placeholder="2023"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* B. If Certification */}
              {itemFormType === "CERTIFICATION" && (
                <div className="space-y-4 rounded-3xl bg-slate-50/60 p-4 border border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Issuing Authority / Body
                      </label>
                      <input
                        type="text"
                        value={itemIssuer}
                        onChange={(e) => setItemIssuer(e.target.value)}
                        placeholder="e.g. CFA Institute, Stanford, SEC"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        License ID / Credential #
                      </label>
                      <input
                        type="text"
                        value={itemCredentialId}
                        onChange={(e) => setItemCredentialId(e.target.value)}
                        placeholder="e.g. CFA-892147"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* C. If Video */}
              {itemFormType === "VIDEO_PRESENTATION" && (
                <div className="space-y-3 rounded-3xl bg-slate-50/60 p-4 border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                      Video Storage Mode
                    </label>
                    <select
                      value={itemVideoProvider}
                      onChange={(e) => setItemVideoProvider(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-heading"
                    >
                      <option value="R2_PRIVATE">Direct Video Upload (Encrypted)</option>
                      <option value="YOUTUBE">YouTube Video Link</option>
                      <option value="VIMEO">Vimeo Link</option>
                      <option value="LOOM">Loom Link</option>
                    </select>
                  </div>
                  {itemVideoProvider !== "R2_PRIVATE" && (
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Video Web URL
                      </label>
                      <input
                        type="url"
                        value={itemVideoUrl}
                        onChange={(e) => setItemVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* CLOUDFLARE PRIVATE R2 FILE UPLOAD DROPZONE */}
              {(itemFormType === "CERTIFICATION" ||
                (itemFormType === "VIDEO_PRESENTATION" && itemVideoProvider === "R2_PRIVATE")) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold font-heading text-slate-800 flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-emerald-700" />
                      <span>Secure Private Storage Upload</span>
                    </label>
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">
                      Dual-Bucket Encrypted Vault
                    </span>
                  </div>

                  {/* Drop area */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative rounded-3xl border-2 border-dashed p-6 text-center transition-all ${
                      dragOver
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm border border-slate-200">
                      <UploadCloud className="h-6 w-6" />
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-bold font-heading text-slate-800">
                        {isUploading ? "Uploading file securely..." : "Drag & drop file here, or browse"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-body">
                        PDF, JPG, PNG, MP4 up to 50MB. Files are strictly protected and never publicly accessible.
                      </p>
                    </div>

                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold font-heading text-slate-700 hover:bg-slate-100 shadow-xs">
                      <span>Choose File</span>
                      <input
                        type="file"
                        onChange={handleFileInputChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    {itemUploadedFileName && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-100/70 border border-emerald-300/60 px-3.5 py-1.5 text-xs font-bold text-emerald-900 font-heading">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                        <span>{itemUploadedFileName}</span>
                      </div>
                    )}

                    {uploadProgress !== null && (
                      <div className="w-full max-w-xs mx-auto bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                  Description & Context
                </label>
                <textarea
                  rows={3}
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Summarize key milestones, unit economics, or reasons for backing this team..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                />
              </div>

              {/* External Website */}
              <div>
                <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                  External URL / Website Link
                </label>
                <input
                  type="url"
                  value={itemExternalUrl}
                  onChange={(e) => setItemExternalUrl(e.target.value)}
                  placeholder="https://company.com or verified registry page"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-bold font-heading text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="rounded-2xl bg-[#064e3b] hover:bg-[#043d2e] px-6 py-2.5 text-xs font-black font-heading text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Publishing..." : editingItem ? "Update Entry" : "Save to Vault"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. MODAL: EDIT THESIS & INVESTMENT PARAMETERS                  */}
      {/* ============================================================== */}
      {isMetaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-heading">
                  Investment Strategy
                </span>
                <h3 className="text-xl font-heading font-black text-slate-900 mt-1">
                  Investor Mandate & Professional Links
                </h3>
                <p className="text-xs text-slate-500 font-body">
                  Update the parameters and investment philosophy visible on your public dossier.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMetaModalOpen(false)}
                className="rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Inner Tabs for Meta */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              {[
                { key: "thesis", label: "Thesis & Philosophy" },
                { key: "checks", label: "Check Sizes & Sectors" },
                { key: "links", label: "Social & Presence" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMetaActiveTab(tab.key as any)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold font-heading transition-all cursor-pointer ${
                    metaActiveTab === tab.key
                      ? "bg-[#064e3b] text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveMeta} className="space-y-4">
              
              {/* TAB 1: THESIS */}
              {metaActiveTab === "thesis" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                      Professional Headline / Tagline
                    </label>
                    <input
                      type="text"
                      value={metaHeadline}
                      onChange={(e) => setMetaHeadline(e.target.value)}
                      placeholder="e.g. Venture Partner & Angel Syndicate Lead • FinTech & CleanTech"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Syndicate / Firm Name
                      </label>
                      <input
                        type="text"
                        value={metaCompanyName}
                        onChange={(e) => setMetaCompanyName(e.target.value)}
                        placeholder="e.g. Northstar Horizon Ventures"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        value={metaDesignation}
                        onChange={(e) => setMetaDesignation(e.target.value)}
                        placeholder="e.g. Managing Partner"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold font-heading text-slate-700">
                        Investment Thesis & Philosophy
                      </label>
                      <span className="text-[10px] text-slate-400 font-body">Visible to all founders</span>
                    </div>
                    <textarea
                      rows={5}
                      value={metaThesis}
                      onChange={(e) => setMetaThesis(e.target.value)}
                      placeholder="Describe what markets you back, unit economics criteria, what excites you in founder meetings, and how you support post-investment..."
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs text-slate-800 outline-none focus:border-emerald-600 font-body leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CHECKS & SECTORS */}
              {metaActiveTab === "checks" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Min Check Size ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={metaMinCheck}
                        onChange={(e) => setMetaMinCheck(e.target.value ? Number(e.target.value) : "")}
                        placeholder="e.g. 25000"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                        Max Check Size ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={metaMaxCheck}
                        onChange={(e) => setMetaMaxCheck(e.target.value ? Number(e.target.value) : "")}
                        placeholder="e.g. 250000"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                      Preferred Stage
                    </label>
                    <select
                      value={metaStage}
                      onChange={(e) => setMetaStage(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-heading"
                    >
                      <option value="PRE_SEED">Pre-Seed</option>
                      <option value="SEED">Seed</option>
                      <option value="GROWTH">Early Stage & Growth (Seed – Series A)</option>
                      <option value="SERIES_B_PLUS">Series B and Above</option>
                    </select>
                  </div>

                  {/* Sectors Tags */}
                  <div>
                    <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                      Focus Sectors
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newSectorInput}
                        onChange={(e) => setNewSectorInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSector();
                          }
                        }}
                        placeholder="Add industry sector (e.g. AI, CleanTech)..."
                        className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={addSector}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold font-heading text-white hover:bg-slate-800"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {metaSectors.map((sec) => (
                        <span
                          key={sec}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 font-heading"
                        >
                          <span>{sec}</span>
                          <button
                            type="button"
                            onClick={() => removeSector(sec)}
                            className="text-emerald-600 hover:text-emerald-950"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LINKS */}
              {metaActiveTab === "links" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={metaLinkedin}
                      onChange={(e) => setMetaLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                      Crunchbase Profile URL
                    </label>
                    <input
                      type="url"
                      value={metaCrunchbase}
                      onChange={(e) => setMetaCrunchbase(e.target.value)}
                      placeholder="https://crunchbase.com/person/..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold font-heading text-slate-700 mb-1">
                      Fund / Angel Syndicate Website
                    </label>
                    <input
                      type="url"
                      value={metaWebsite}
                      onChange={(e) => setMetaWebsite(e.target.value)}
                      placeholder="https://fund.vc"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMetaModalOpen(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-bold font-heading text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-[#064e3b] hover:bg-[#043d2e] px-6 py-2.5 text-xs font-black font-heading text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Parameters"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
