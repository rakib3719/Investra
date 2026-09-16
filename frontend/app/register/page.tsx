"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ArrowRight, Briefcase, Building2, CheckCircle2, Eye, EyeOff, GraduationCap, Lock, Mail, UserCheck } from 'lucide-react';
import Footer from '@/components/public-facing/shared/Footer';
import Navbar from '@/components/public-facing/shared/Navbar';
import { getApiError } from '@/lib/api/client';
import { useRegisterMutation } from '@/lib/auth/auth-hooks';
import { registerSchema, type RegisterFormValues } from '@/lib/auth/schemas';
import type { PublicUserRole } from '@/lib/auth/types';
import { InvestraInlineLoader, InvestraLoader } from '@/components/ui/InvestraLoader';

const roles: Array<{ value: PublicUserRole; label: string; description: string; icon: typeof Building2 }> = [
  { value: 'INVESTOR', label: 'Investor', description: 'Discover and compare vetted deals.', icon: Building2 },
  { value: 'ENTREPRENEUR', label: 'Entrepreneur', description: 'Publish pitches and raise capital.', icon: Briefcase },
  { value: 'CONSULTANT', label: 'Consultant', description: 'Offer advisory and mentoring.', icon: GraduationCap },
];

export default function RegisterPage() {
  const router = useRouter();
  const registerAccount = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'INVESTOR' },
  });
  const [selectedRole, setSelectedRole] = useState<PublicUserRole>('INVESTOR');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (values: RegisterFormValues) => {
    const { user } = await registerAccount.mutateAsync({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      role: values.role,
    });
    router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
  };

  const apiError = registerAccount.error ? getApiError(registerAccount.error) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {registerAccount.isPending && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/35 px-6 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="w-full max-w-sm rounded-3xl border border-white/30 bg-white p-8 shadow-2xl">
            <InvestraLoader label="Creating your account" description="We are creating your secure profile and preparing your email verification link." />
          </div>
        </div>
      )}
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-xl w-full bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <UserCheck className="w-10 h-10 text-[#064e3b] mx-auto" />
            <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-800">Create your Investra profile</h1>
            <p className="text-xs text-slate-500">We will send a verification link before you can sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <input type="hidden" {...register('role')} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roles.map(({ value, label, description, icon: Icon }) => (
                <button key={value} type="button" onClick={() => { setSelectedRole(value); setValue('role', value, { shouldValidate: true }); }} className={`p-4 rounded-2xl border text-left ${selectedRole === value ? 'border-[#064e3b] bg-[#064e3b]/5 ring-2 ring-[#064e3b]/20' : 'border-slate-200 bg-white'}`}>
                  <Icon className="w-5 h-5 text-[#064e3b] mb-2" />
                  <p className="font-heading font-bold text-xs text-slate-800">{label}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{description}</p>
                </button>
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5"><label htmlFor="firstName" className="text-xs font-bold text-slate-700">First name</label><input id="firstName" autoComplete="given-name" placeholder="e.g. Amina" aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? 'firstName-error' : undefined} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 transition-colors focus:border-[#064e3b]" {...register('firstName')} />{errors.firstName && <p id="firstName-error" role="alert" className="text-xs text-red-600">{errors.firstName.message}</p>}</div>
              <div className="space-y-1.5"><label htmlFor="lastName" className="text-xs font-bold text-slate-700">Last name</label><input id="lastName" autoComplete="family-name" placeholder="e.g. Rahman" aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? 'lastName-error' : undefined} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 transition-colors focus:border-[#064e3b]" {...register('lastName')} />{errors.lastName && <p id="lastName-error" role="alert" className="text-xs text-red-600">{errors.lastName.message}</p>}</div>
            </div>

            <div className="space-y-1.5"><label htmlFor="email" className="text-xs font-bold text-slate-700">Work email</label><div className="relative"><Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input id="email" type="email" autoComplete="email" placeholder="name@company.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 transition-colors focus:border-[#064e3b]" {...register('email')} /></div>{errors.email && <p id="email-error" role="alert" className="text-xs text-red-600">{errors.email.message}</p>}</div>
            <div className="space-y-1.5"><label htmlFor="password" className="text-xs font-bold text-slate-700">Password</label><div className="relative"><Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a strong password" aria-invalid={Boolean(errors.password)} aria-describedby="password-requirements" className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 transition-colors focus:border-[#064e3b]" {...register('password')} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-[#064e3b] focus-visible:outline-none" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div><p id="password-requirements" className="text-[11px] text-slate-500">Use 12+ characters with uppercase, lowercase, number, and symbol.</p>{errors.password && <p role="alert" className="text-xs text-red-600">{errors.password.message}</p>}</div>
            <div className="space-y-1.5"><label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Confirm password</label><div className="relative"><Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Re-enter your password" aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined} className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 transition-colors focus:border-[#064e3b]" {...register('confirmPassword')} /><button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-[#064e3b] focus-visible:outline-none" aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'} aria-pressed={showConfirmPassword}>{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>{errors.confirmPassword && <p id="confirmPassword-error" role="alert" className="text-xs text-red-600">{errors.confirmPassword.message}</p>}</div>

            <div className="p-4 bg-[#064e3b]/5 rounded-2xl border border-[#064e3b]/10 text-[11px] text-slate-600 flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />Your account stays inactive until you verify the email we send.</div>
            {apiError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{apiError.message}</p>}
            <button type="submit" disabled={registerAccount.isPending} className="w-full bg-[#064e3b] disabled:opacity-60 text-white font-heading font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2">{registerAccount.isPending ? <InvestraInlineLoader label="Creating account…" /> : <><span>Create account and verify email</span><ArrowRight className="w-4 h-4 text-[#10b981]" /></>}</button>
          </form>
          <p className="text-center text-xs text-slate-500">Already verified? <Link href="/login" className="font-bold text-[#064e3b] hover:underline">Sign in</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
