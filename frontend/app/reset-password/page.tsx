"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { getApiError } from '@/lib/api/client';
import { useResetPasswordMutation } from '@/lib/auth/auth-hooks';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/auth/schemas';

function ResetPasswordContent() {
  const token = useSearchParams().get('token') ?? '';
  const resetPassword = useResetPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { token } });
  const error = resetPassword.error ? getApiError(resetPassword.error).message : null;

  return <main className="min-h-screen bg-slate-50 grid place-items-center p-6"><section className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5"><h1 className="text-2xl font-black">Choose a new password</h1><form onSubmit={handleSubmit((values) => resetPassword.mutate(values))} className="space-y-3"><input type="hidden" {...register('token')} /><input type="password" autoComplete="new-password" placeholder="At least 8 characters" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" {...register('newPassword')} />{errors.newPassword && <p className="text-xs text-red-600">{errors.newPassword.message}</p>}{error && <p role="alert" className="text-xs text-red-600">{error}</p>}{resetPassword.isSuccess ? <Link href="/login" className="inline-flex w-full justify-center bg-[#064e3b] text-white py-3 rounded-xl text-sm font-bold">Password reset — sign in</Link> : <button disabled={resetPassword.isPending || !token} className="w-full bg-[#064e3b] text-white py-3 rounded-xl text-sm font-bold disabled:opacity-60">{resetPassword.isPending ? 'Saving…' : 'Reset password'}</button>}</form>{!token && <p className="text-xs text-red-600">This reset link is missing its token. Request a new one.</p>}</section></main>;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen grid place-items-center text-sm text-slate-500">Loading…</main>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
