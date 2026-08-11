"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ArrowRight, Briefcase, Building2, CheckCircle2, GraduationCap, Mail, UserCheck } from 'lucide-react';
import Footer from '@/components/public-facing/shared/Footer';
import Navbar from '@/components/public-facing/shared/Navbar';
import { getApiError } from '@/lib/api/client';
import { useRegisterMutation } from '@/lib/auth/auth-hooks';
import { registerSchema, type RegisterFormValues } from '@/lib/auth/schemas';
import type { PublicUserRole } from '@/lib/auth/types';

const roles: Array<{ value: PublicUserRole; label: string; description: string; icon: typeof Building2 }> = [
  { value: 'INVESTOR', label: 'Investor', description: 'Discover and compare vetted deals.', icon: Building2 },
  { value: 'ENTREPRENEUR', label: 'Uddokta', description: 'Publish pitches and raise capital.', icon: Briefcase },
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

  const onSubmit = async (values: RegisterFormValues) => {
    const { user } = await registerAccount.mutateAsync(values);
    router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
  };

  const apiError = registerAccount.error ? getApiError(registerAccount.error) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
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
              <div className="space-y-1"><label htmlFor="firstName" className="text-xs font-bold text-slate-700">First name</label><input id="firstName" autoComplete="given-name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" {...register('firstName')} />{errors.firstName && <p className="text-xs text-red-600">{errors.firstName.message}</p>}</div>
              <div className="space-y-1"><label htmlFor="lastName" className="text-xs font-bold text-slate-700">Last name</label><input id="lastName" autoComplete="family-name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" {...register('lastName')} />{errors.lastName && <p className="text-xs text-red-600">{errors.lastName.message}</p>}</div>
            </div>

            <div className="space-y-1"><label htmlFor="email" className="text-xs font-bold text-slate-700">Work email</label><div className="relative"><Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /><input id="email" type="email" autoComplete="email" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" {...register('email')} /></div>{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}</div>
            <div className="space-y-1"><label htmlFor="password" className="text-xs font-bold text-slate-700">Password</label><input id="password" type="password" autoComplete="new-password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" {...register('password')} />{errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}</div>

            <div className="p-4 bg-[#064e3b]/5 rounded-2xl border border-[#064e3b]/10 text-[11px] text-slate-600 flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />Your account stays inactive until you verify the email we send.</div>
            {apiError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{apiError.message}</p>}
            <button type="submit" disabled={registerAccount.isPending} className="w-full bg-[#064e3b] disabled:opacity-60 text-white font-heading font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"><span>{registerAccount.isPending ? 'Creating account…' : 'Create account and verify email'}</span><ArrowRight className="w-4 h-4 text-[#10b981]" /></button>
          </form>
          <p className="text-center text-xs text-slate-500">Already verified? <Link href="/login" className="font-bold text-[#064e3b] hover:underline">Sign in</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
