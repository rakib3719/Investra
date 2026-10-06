"use client";

import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Cloud,
  Eye,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { useMyProfileQuery, useUpdateMyProfileMutation } from "@/lib/profile/profile-hooks";
import { FileUploadDropzone } from "@/components/ui/FileUploadDropzone";
import { toast } from "@/lib/toast";
import { showApiErrorToast } from "@/lib/api/client";
import { InvestraInlineLoader, InvestraLoader } from "@/components/ui/InvestraLoader";
import { Panel, SectionHeading } from "@/components/dashboard/investor/InvestorUI";

interface ProfileWorkspaceCardProps {
  user: AuthUser;
  className?: string;
}

export function ProfileWorkspaceCard({
  user,
  className = "",
}: ProfileWorkspaceCardProps) {
  const profileQuery = useMyProfileQuery();
  const updateProfile = useUpdateMyProfileMutation();

  const [activeMediaTab, setActiveMediaTab] = useState<"avatar" | "cover">("avatar");
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [isRemovingCover, setIsRemovingCover] = useState(false);

  // Form edit state
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    country: "Bangladesh",
    city: "Dhaka",
    bio: "",
    website: "",
  });
  const [formInitialized, setFormInitialized] = useState(false);

  // Initialize from live profile query once ready
  React.useEffect(() => {
    if (profileQuery.data?.account && !formInitialized) {
      const acc = profileQuery.data.account;
      setFormData({
        firstName: acc.firstName || user.firstName || "",
        lastName: acc.lastName || user.lastName || "",
        phone: acc.phone || user.phone || "",
        country: acc.country || "Bangladesh",
        city: acc.city || "Dhaka",
        bio: acc.bio || "",
        website: acc.website || "",
      });
      setFormInitialized(true);
    }
  }, [profileQuery.data, user, formInitialized]);

  const liveAccount = profileQuery.data?.account;
  const currentAvatarUrl = liveAccount?.image || user.image;
  const currentCoverUrl = liveAccount?.coverImage || user.coverImage;

  const initials = `${(liveAccount?.firstName || user.firstName)?.[0] ?? user.email[0]}${
    (liveAccount?.lastName || user.lastName)?.[0] ?? ""
  }`.toUpperCase();

  const handleAvatarSuccess = async (media: { id: string; url: string | null }) => {
    try {
      await updateProfile.mutateAsync({
        avatarMediaId: media.id,
        image: media.url || undefined,
      });
      toast.success("Profile avatar uploaded and synced with Cloudflare R2!", {
        title: "Avatar Updated",
      });
    } catch (err) {
      showApiErrorToast(err, "Failed to link photo with your profile");
    }
  };

  const handleCoverSuccess = async (media: { id: string; url: string | null }) => {
    try {
      await updateProfile.mutateAsync({
        coverMediaId: media.id,
        coverImage: media.url || undefined,
      });
      toast.success("Cover banner uploaded and synced with Cloudflare R2!", {
        title: "Cover Updated",
      });
    } catch (err) {
      showApiErrorToast(err, "Failed to link cover with your profile");
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;
    setIsRemovingAvatar(true);
    try {
      await updateProfile.mutateAsync({
        avatarMediaId: null,
        image: null,
      });
      toast.info("Profile photo removed.");
    } catch (err) {
      showApiErrorToast(err, "Failed to remove profile photo");
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  const handleRemoveCover = async () => {
    if (!confirm("Are you sure you want to remove your cover banner?")) return;
    setIsRemovingCover(true);
    try {
      await updateProfile.mutateAsync({
        coverMediaId: null,
        coverImage: null,
      });
      toast.info("Cover banner removed.");
    } catch (err) {
      showApiErrorToast(err, "Failed to remove cover banner");
    } finally {
      setIsRemovingCover(false);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        country: formData.country.trim() || undefined,
        city: formData.city.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        website: formData.website.trim() || undefined,
      });
      toast.success("Personal details updated successfully!", { title: "Profile Saved" });
    } catch (err) {
      showApiErrorToast(err, "Failed to update profile information");
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. SOCIAL / FB STYLE COVER & AVATAR PROFILE BANNER */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all">
        {/* Cover Canvas */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden group">
          {currentCoverUrl ? (
            <img
              src={currentCoverUrl}
              alt="Profile Cover Banner"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#182b45] via-[#263f6a] to-[#064e3b] flex items-center justify-center">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 bg-black/30 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                <ImageIcon className="w-4 h-4 text-emerald-300" />
                Custom Cover Banner Preview (Cloudflare R2)
              </span>
            </div>
          )}

          {/* Quick R2 Badge & Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              Public Edge CDN
            </span>
            {currentCoverUrl && (
              <button
                type="button"
                onClick={handleRemoveCover}
                disabled={isRemovingCover || updateProfile.isPending}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-200 bg-rose-950/70 hover:bg-rose-900 px-3 py-1 rounded-full border border-rose-500/30 transition-colors backdrop-blur-md cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                <span>{isRemovingCover ? "Removing…" : "Remove Cover"}</span>
              </button>
            )}
          </div>

          {/* Floating Avatar Overlap (FB Style) */}
          <div className="absolute -bottom-10 sm:-bottom-12 left-6 sm:left-10">
            <div className="relative group/avatar">
              {currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt="Profile Avatar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-emerald-500/30"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#064e3b] to-[#10b981] border-4 border-white shadow-xl grid place-items-center text-white font-extrabold text-2xl sm:text-3xl">
                  {initials}
                </div>
              )}
              <div className="absolute bottom-1 right-1 p-2 bg-[#064e3b] text-white rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-[#053d2e] transition-colors" title="Change Avatar">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details & Tab Selector */}
        <div className="pt-14 sm:pt-16 px-6 sm:px-10 pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
                {formData.firstName || user.firstName || "Investra"} {formData.lastName || user.lastName || "Member"}
              </h2>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 capitalize">
                {user.role.toLowerCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {formData.city}, {formData.country}
              </span>
            </p>
          </div>

          {/* Media Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveMediaTab("avatar")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMediaTab === "avatar"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Update Avatar
            </button>
            <button
              type="button"
              onClick={() => setActiveMediaTab("cover")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMediaTab === "cover"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Update Cover Banner
            </button>
          </div>
        </div>

        {/* Media Uploader Area */}
        <div className="p-6 sm:p-10 bg-slate-50/50">
          {activeMediaTab === "avatar" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Profile Avatar Photo (Public CDN)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Displayed on your investor/founder card, proposals, and header. Recommended square format (up to 5MB).
                  </p>
                </div>
                {currentAvatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={isRemovingAvatar}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Delete current avatar
                  </button>
                )}
              </div>

              <FileUploadDropzone
                category="AVATAR"
                isPublic={true}
                label="Upload new profile avatar"
                description="Accepted formats: JPG, PNG, or WebP (max 5MB)"
                currentMedia={
                  currentAvatarUrl
                    ? {
                        url: currentAvatarUrl,
                        fileName: `${user.firstName || "Profile"} Avatar`,
                        status: "ACTIVE",
                      }
                    : undefined
                }
                onUploadSuccess={handleAvatarSuccess}
                onRemove={handleRemoveAvatar}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Cover Banner Photo (Public CDN)
                  </h4>
                  <p className="text-xs text-slate-500">
                    High-resolution horizontal cover banner for your platform page. Recommended 1200×400 (up to 10MB).
                  </p>
                </div>
                {currentCoverUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    disabled={isRemovingCover}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Delete current banner
                  </button>
                )}
              </div>

              <FileUploadDropzone
                category="CAMPAIGN_COVER"
                isPublic={true}
                label="Upload new profile cover banner"
                description="Accepted formats: JPG, PNG, or WebP (max 10MB)"
                currentMedia={
                  currentCoverUrl
                    ? {
                        url: currentCoverUrl,
                        fileName: `${user.firstName || "Profile"} Cover Banner`,
                        status: "ACTIVE",
                      }
                    : undefined
                }
                onUploadSuccess={handleCoverSuccess}
                onRemove={handleRemoveCover}
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. EDITABLE PERSONAL & CONTACT PARTICULARS */}
      <Panel className="p-6 sm:p-8">
        <SectionHeading
          title="Personal Details & Bio"
          description="Update your display identity and contact information across the Investra ecosystem"
        />

        <form onSubmit={handleSaveInfo} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-700">First Name</span>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-700">Last Name</span>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-700">Email Address (Verified)</span>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-700">Phone Number</span>
              <input
                type="text"
                placeholder="+880 1700-000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-700">Personal / Company Website</span>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-700">Country of Residence</span>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
              />
            </label>

            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-700">City</span>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
              />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-xs font-bold text-slate-700">Professional Bio / Overview</span>
            <textarea
              rows={3}
              placeholder="Brief introduction about your investment mandate, startup track record, or consulting background..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b]"
            />
          </label>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="px-6 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] disabled:opacity-60 text-white font-heading font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              {updateProfile.isPending ? (
                <InvestraInlineLoader label="Saving changes…" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
