"use client";

import React, { useState } from "react";
import { Camera, CheckCircle2, Cloud, Image as ImageIcon, Sparkles, Trash2, User } from "lucide-react";
import type { AuthUser } from "@/lib/auth/types";
import { useUpdateMyProfileMutation } from "@/lib/profile/profile-hooks";
import { FileUploadDropzone } from "@/components/ui/FileUploadDropzone";
import { toast } from "@/lib/toast";
import { showApiErrorToast } from "@/lib/api/client";

interface ProfileAvatarCardProps {
  user: AuthUser;
  className?: string;
}

export function ProfileAvatarCard({ user, className = "" }: ProfileAvatarCardProps) {
  const updateProfile = useUpdateMyProfileMutation();
  const [activeTab, setActiveTab] = useState<"avatar" | "cover">("avatar");
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [isRemovingCover, setIsRemovingCover] = useState(false);

  const currentAvatarUrl = user.image;
  const currentCoverUrl = user.coverImage;

  const initials = `${user.firstName?.[0] ?? user.email[0]}${
    user.lastName?.[0] ?? ""
  }`.toUpperCase();

  const handleAvatarSuccess = async (media: { id: string; url: string | null }) => {
    try {
      await updateProfile.mutateAsync({
        avatarMediaId: media.id,
        image: media.url || undefined,
      });
      toast.success("Profile photo uploaded to Cloudflare R2!", {
        title: "Photo Updated",
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
      toast.success("Cover banner uploaded to Cloudflare R2!", {
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

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all ${className}`}
    >
      {/* Cover Banner Preview */}
      <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden">
        {currentCoverUrl ? (
          <img
            src={currentCoverUrl}
            alt="Profile Cover Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] flex items-center justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-300" />
              Default cover banner active
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            Cloudflare R2 Public Media
          </span>
          {currentCoverUrl && (
            <button
              type="button"
              onClick={handleRemoveCover}
              disabled={isRemovingCover || updateProfile.isPending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-200 bg-rose-950/70 hover:bg-rose-900 px-3 py-1 rounded-full border border-rose-500/30 transition-colors backdrop-blur-md cursor-pointer"
            >
              <Trash2 className="w-3 h-3 text-rose-300" />
              <span>{isRemovingCover ? "Removing…" : "Remove cover"}</span>
            </button>
          )}
        </div>

        {/* Floating Avatar Overlap */}
        <div className="absolute -bottom-8 left-6 sm:left-8">
          <div className="relative">
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt="Profile Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-emerald-500/20"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 border-4 border-white shadow-lg grid place-items-center text-emerald-800 font-extrabold text-2xl">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 p-1.5 bg-[#064e3b] text-white rounded-full shadow-md border-2 border-white">
              <Camera className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Profile Bar & Tabs */}
      <div className="pt-10 px-6 sm:px-8 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-black text-lg text-slate-800">
            {user.firstName || "Investra"} {user.lastName || "Member"}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span>{user.email}</span>
            <span>•</span>
            <span className="font-semibold text-emerald-700 capitalize">{user.role.toLowerCase()}</span>
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("avatar")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "avatar"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Avatar Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cover")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "cover"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Cover Banner
          </button>
        </div>
      </div>

      {/* Active Tab Panel */}
      <div className="p-6 sm:p-8">
        {activeTab === "avatar" ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Profile Avatar (Public)
                </h4>
                <p className="text-xs text-slate-500">
                  Appears in platform deal feeds, comment threads, and headers. Max 5 MB.
                </p>
              </div>
              {currentAvatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isRemovingAvatar || updateProfile.isPending}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isRemovingAvatar ? "Removing…" : "Remove avatar"}</span>
                </button>
              )}
            </div>

            <FileUploadDropzone
              category="AVATAR"
              label="Upload new profile avatar"
              description="Drop a square JPG, PNG, or WebP headshot (up to 5 MB)."
              currentMedia={
                currentAvatarUrl
                  ? {
                      url: currentAvatarUrl,
                      fileName: `${user.firstName || "User"} Avatar`,
                      status: "ACTIVE",
                      mimeType: "image/jpeg",
                    }
                  : undefined
              }
              onUploadSuccess={handleAvatarSuccess}
              onRemove={handleRemoveAvatar}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Profile Cover Banner (Public)
                </h4>
                <p className="text-xs text-slate-500">
                  Appears across your public investor/founder profile and pitch rooms. Recommended 1200x400. Max 10 MB.
                </p>
              </div>
              {currentCoverUrl && (
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  disabled={isRemovingCover || updateProfile.isPending}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isRemovingCover ? "Removing…" : "Remove cover"}</span>
                </button>
              )}
            </div>

            <FileUploadDropzone
              category="CAMPAIGN_COVER"
              label="Upload profile cover banner"
              description="Drop a horizontal landscape JPG, PNG, or WebP image (up to 10 MB)."
              currentMedia={
                currentCoverUrl
                  ? {
                      url: currentCoverUrl,
                      fileName: `${user.firstName || "User"} Cover Banner`,
                      status: "ACTIVE",
                      mimeType: "image/jpeg",
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
  );
}

// Keep export alias so existing imports work seamlessly
export const ProfileMediaCard = ProfileAvatarCard;
