"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/public-facing/shared/Footer';
import Navbar from '@/components/public-facing/shared/Navbar';
import { getApiError } from '@/lib/api/client';
import { useLoginMutation } from '@/lib/auth/auth-hooks';
import { loginSchema, type LoginFormValues } from '@/lib/auth/schemas';
import { getDashboardPath } from '@/lib/auth/role';

export default function LoginPage() {
  const router = useRouter();
  const login = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    const { user } = await login.mutateAsync(values);
    router.replace(getDashboardPath(user.role));
  };

  const apiError = login.error ? getApiError(login.error) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#064e3b] text-white flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-[#10b981]" />
            </div>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-800">Sign in to Investra</h1>
            <p className="text-xs text-slate-500">Your verified account role determines your workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="email">Work email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input id="email" type="email" autoComplete="email" placeholder="name@company.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" {...register('email')} />
              </div>
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-[#064e3b] font-bold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs" {...register('password')} />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {apiError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{apiError.message}</p>}

            <button type="submit" disabled={login.isPending} className="w-full bg-[#064e3b] disabled:opacity-60 text-white font-heading font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2">
              <span>{login.isPending ? 'Signing in…' : 'Sign in securely'}</span>
              <ArrowRight className="w-4 h-4 text-[#10b981]" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">Don&apos;t have an account? <Link href="/register" className="font-bold text-[#064e3b] hover:underline">Create one</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
