"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import Footer from '@/components/public-facing/shared/Footer';
import Navbar from '@/components/public-facing/shared/Navbar';
import { handleFormApiError } from '@/lib/api/client';
import { toast } from '@/lib/toast';
import { useRegisterMutation } from '@/lib/auth/auth-hooks';
import { registerSchema, type RegisterFormValues } from '@/lib/auth/schemas';
import type { PublicUserRole } from '@/lib/auth/types';
import { InvestraInlineLoader } from '@/components/ui/InvestraLoader';
import { InputError, getFieldStateClass } from '@/components/ui/InputError';
import { FileUploadDropzone } from '@/components/ui/FileUploadDropzone';

const roleOptions: Array<{
  value: PublicUserRole;
  label: string;
  tagline: string;
  description: string;
  icon: typeof Building2;
}> = [
  {
    value: 'INVESTOR',
    label: 'Investor',
    tagline: 'Institutional & Angel',
    description: 'Access curated deals, portfolio analytics, and secure deal rooms.',
    icon: Building2,
  },
  {
    value: 'ENTREPRENEUR',
    label: 'Entrepreneur',
    tagline: 'Founders & Companies',
    description: 'Publish verified funding campaigns and raise growth capital.',
    icon: Briefcase,
  },
  {
    value: 'CONSULTANT',
    label: 'Consultant',
    tagline: 'Advisors & Mentors',
    description: 'Provide strategic advisory services to vetted businesses.',
    icon: GraduationCap,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const registerAccount = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'INVESTOR' },
  });

  const [selectedRole, setSelectedRole] = useState<PublicUserRole>('INVESTOR');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMediaSection, setShowMediaSection] = useState(false);
  const [avatarMedia, setAvatarMedia] = useState<{ id: string; url: string | null } | null>(null);
  const [coverMedia, setCoverMedia] = useState<{ id: string; url: string | null } | null>(null);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const { user } = await registerAccount.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
        avatarMediaId: avatarMedia?.id,
        image: avatarMedia?.url || undefined,
        coverMediaId: coverMedia?.id,
        coverImage: coverMedia?.url || undefined,
      });

      toast.success('Your profile is created! Please verify your email to continue.', {
        title: 'Registration Successful',
      });
      router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
    } catch (err) {
      handleFormApiError(err, setError, 'Unable to create account');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between selection:bg-[#064e3b] selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-2xl w-full">
          {/* Institutional Card Container */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10 space-y-8">
            {/* Header with Investra Brand Anchor */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182b45]/5 border border-[#263f6a]/20 text-[#182b45] text-xs font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#064e3b]" />
                <span>Investra Capital Ecosystem</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Choose your primary role. After email verification and identity compliance (KYC), full marketplace capabilities will unlock.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <input type="hidden" {...register('role')} />

              {/* 1. ROLE SELECTION */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Select Your Platform Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {roleOptions.map(({ value, label, tagline, description, icon: Icon }) => {
                    const isSelected = selectedRole === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSelectedRole(value);
                          setValue('role', value, { shouldValidate: true });
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#064e3b] bg-gradient-to-b from-white to-[#064e3b]/5 ring-2 ring-[#064e3b]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-[#064e3b] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#064e3b] animate-pulse" />
                            )}
                          </div>
                          <p className="font-heading font-black text-xs text-slate-900">{label}</p>
                          <p className="text-[10px] font-semibold text-emerald-700">{tagline}</p>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                            {description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <InputError message={errors.role?.message} />
              </div>

              {/* 2. PERSONAL PARTICULARS */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-xs font-bold text-slate-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      autoComplete="given-name"
                      placeholder="e.g. Amina"
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-medium border transition-colors outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] ${getFieldStateClass(
                        errors.firstName
                      )}`}
                      {...register('firstName')}
                    />
                    <InputError message={errors.firstName?.message} id="firstName-error" />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-xs font-bold text-slate-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      autoComplete="family-name"
                      placeholder="e.g. Rahman"
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-medium border transition-colors outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] ${getFieldStateClass(
                        errors.lastName
                      )}`}
                      {...register('lastName')}
                    />
                    <InputError message={errors.lastName?.message} id="lastName-error" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-700">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-medium border transition-colors outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] ${getFieldStateClass(
                        errors.email
                      )}`}
                      {...register('email')}
                    />
                  </div>
                  <InputError message={errors.email?.message} id="email-error" />
                </div>

                {/* PASSWORDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Create strong password"
                        aria-invalid={Boolean(errors.password)}
                        className={`w-full pl-10 pr-10 py-3 rounded-xl text-xs font-medium border transition-colors outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] ${getFieldStateClass(
                          errors.password
                        )}`}
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <InputError message={errors.password?.message} />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Re-enter password"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        className={`w-full pl-10 pr-10 py-3 rounded-xl text-xs font-medium border transition-colors outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] ${getFieldStateClass(
                          errors.confirmPassword
                        )}`}
                        {...register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <InputError message={errors.confirmPassword?.message} />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Password must contain at least 12 characters, including upper and lower case letters, numbers, and symbols.
                </p>
              </div>

              {/* 3. OPTIONAL PROFILE MEDIA (R2 Public Upload) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all">
                <button
                  type="button"
                  onClick={() => setShowMediaSection((prev) => !prev)}
                  className="flex w-full items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#064e3b] shadow-xs group-hover:border-[#064e3b]/40 transition-colors">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-bold text-xs text-slate-800">
                          Profile Avatar & Cover Photos
                        </p>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Upload your public branding now or easily add later from your dashboard
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400 p-1 rounded-lg group-hover:text-slate-600 transition-colors">
                    {showMediaSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {showMediaSection && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-5 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 block">
                          Profile Avatar Photo
                        </label>
                        <span className="text-[10px] font-semibold text-slate-500">Max 5MB</span>
                      </div>
                      <FileUploadDropzone
                        category="AVATAR"
                        isPublic={true}
                        label="Upload Avatar Photo"
                        description="Accepted formats: JPEG, PNG or WebP"
                        currentMedia={avatarMedia ? { id: avatarMedia.id, url: avatarMedia.url, status: 'UPLOADED' } : undefined}
                        onUploadSuccess={(media) => setAvatarMedia({ id: media.id, url: media.url })}
                        onRemove={() => setAvatarMedia(null)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 block">
                          Cover Banner Photo
                        </label>
                        <span className="text-[10px] font-semibold text-slate-500">Max 10MB</span>
                      </div>
                      <FileUploadDropzone
                        category="CAMPAIGN_COVER"
                        isPublic={true}
                        label="Upload Cover Banner"
                        description="Accepted formats: JPEG, PNG or WebP"
                        currentMedia={coverMedia ? { id: coverMedia.id, url: coverMedia.url, status: 'UPLOADED' } : undefined}
                        onUploadSuccess={(media) => setCoverMedia({ id: media.id, url: media.url })}
                        onRemove={() => setCoverMedia(null)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Informational Compliance Badge */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-[11px] text-slate-700 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">Compliance & Activation Process</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    1. Verify your email link. 2. Complete identity verification (KYC) inside your dashboard. 3. Once approved by Investra compliance, full access is granted.
                  </p>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={registerAccount.isPending}
                className="w-full bg-[#064e3b] hover:bg-[#053d2e] disabled:opacity-60 text-white font-heading font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-[#064e3b]/15"
              >
                {registerAccount.isPending ? (
                  <InvestraInlineLoader label="Registering profile…" />
                ) : (
                  <>
                    <span>Create Account & Send Verification Email</span>
                    <ArrowRight className="w-4 h-4 text-emerald-300" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#064e3b] hover:underline">
                Sign in to your workspace
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
