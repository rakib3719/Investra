"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getApiError } from '@/lib/api/client';
import { useForgotPasswordMutation } from '@/lib/auth/auth-hooks';
import { emailSchema, type EmailFormValues } from '@/lib/auth/schemas';

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });
  const error = forgotPassword.error ? getApiError(forgotPassword.error).message : null;

  return <main className="min-h-screen bg-slate-50 grid place-items-center p-6"><section className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5"><h1 className="text-2xl font-black">Reset your password</h1><p className="text-sm text-slate-500">Enter your email and we will send a secure reset link.</p><form onSubmit={handleSubmit((values) => forgotPassword.mutate(values.email))} className="space-y-3"><input type="email" autoComplete="email" placeholder="name@company.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" {...register('email')} />{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}{error && <p role="alert" className="text-xs text-red-600">{error}</p>}{forgotPassword.isSuccess && <p className="text-xs text-emerald-700">If the account exists, a reset email has been sent.</p>}<button disabled={forgotPassword.isPending} className="w-full bg-[#064e3b] text-white py-3 rounded-xl text-sm font-bold disabled:opacity-60">{forgotPassword.isPending ? 'Sending…' : 'Send reset link'}</button></form><Link href="/login" className="text-sm font-bold text-[#064e3b] hover:underline">Back to sign in</Link></section></main>;
}
