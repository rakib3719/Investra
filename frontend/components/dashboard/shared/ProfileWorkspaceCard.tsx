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
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all">
        {/* Cover Canvas Container */}
        <div className="relative">
          <div className="relative h-44 sm:h-60 w-full bg-slate-900 overflow-hidden">
            {currentCoverUrl ? (
              <img
                src={currentCoverUrl}
                alt="Profile Cover Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  Cover Photo Preview
                </span>
              </div>
            )}

            {/* Quick Actions on Cover */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setActiveMediaTab("cover")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-xl border border-white/20 transition-colors backdrop-blur-sm cursor-pointer shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-300" />
                <span>Edit Cover</span>
              </button>
              {currentCoverUrl && (
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  disabled={isRemovingCover || updateProfile.isPending}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-200 bg-rose-950/80 hover:bg-rose-900 px-3 py-1.5 rounded-xl border border-rose-500/30 transition-colors backdrop-blur-sm cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                  <span>{isRemovingCover ? "Removing…" : "Remove"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Avatar Positioned Reliably Overlapping Cover & Content */}
          <div className="absolute -bottom-12 left-6 sm:left-10 z-20">
            <div className="relative group/avatar">
              {currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt="Profile Avatar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white bg-white shadow-xl ring-2 ring-emerald-500/20"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#064e3b] to-[#10b981] border-4 border-white shadow-xl grid place-items-center text-white font-extrabold text-2xl sm:text-3xl">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => setActiveMediaTab("avatar")}
                className="absolute bottom-0 right-0 p-2 bg-[#064e3b] text-white rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-[#053d2e] transition-colors"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details & Media Selector */}
        <div className="pt-16 sm:pt-16 px-6 sm:px-10 pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-4">
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

          {/* Media Switcher Tab */}
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
              Upload Avatar Photo
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
              Upload Cover Banner
            </button>
          </div>
        </div>

        {/* Media Uploader Area */}
        <div className="p-6 sm:p-8 bg-slate-50/60">
          {activeMediaTab === "avatar" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Profile Avatar Photo
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Recommended square photo (JPEG, PNG or WebP, up to 5MB).
                  </p>
                </div>
                {currentAvatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={isRemovingAvatar}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Delete photo
                  </button>
                )}
              </div>

              <FileUploadDropzone
                category="AVATAR"
                isPublic={true}
                hidePreview={true}
                label="Click or drag to upload avatar photo"
                description="JPEG, PNG or WebP (max 5MB)"
                onUploadSuccess={handleAvatarSuccess}
                onRemove={handleRemoveAvatar}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Cover Banner Photo
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Horizontal banner image for your platform profile (JPEG, PNG or WebP, up to 10MB).
                  </p>
                </div>
                {currentCoverUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    disabled={isRemovingCover}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Delete banner
                  </button>
                )}
              </div>

              <FileUploadDropzone
                category="CAMPAIGN_COVER"
                isPublic={true}
                hidePreview={true}
                label="Click or drag to upload cover banner"
                description="JPEG, PNG or WebP (max 10MB)"
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
