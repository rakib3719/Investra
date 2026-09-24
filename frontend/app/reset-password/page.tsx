"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { handleFormApiError } from '@/lib/api/client';
import { toast } from '@/lib/toast';
import { useResetPasswordMutation } from '@/lib/auth/auth-hooks';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/auth/schemas';
import { InvestraInlineLoader, InvestraLoader } from '@/components/ui/InvestraLoader';
import { InputError, getFieldStateClass } from '@/components/ui/InputError';

function ResetPasswordContent() {
  const token = useSearchParams().get('token') ?? '';
  const resetPassword = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword.mutateAsync({
        token: values.token,
        newPassword: values.newPassword,
      });
      toast.success('Your password has been reset successfully! You can now sign in.', {
        title: 'Password Updated',
      });
    } catch (err) {
      handleFormApiError(err, setError, 'Unable to reset password');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 grid place-items-center p-6">
      <section className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#064e3b] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6 text-[#10b981]" />
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-800">Choose a new password</h1>
          <p className="text-xs text-slate-500">
            Create a secure password with 12+ characters including letters, numbers, and symbols.
          </p>
        </div>

        {!token && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            This reset link is invalid or missing its security token. Please request a new reset link.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input type="hidden" {...register('token')} />

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-xs font-bold text-slate-700">New password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter new secure password"
                aria-invalid={Boolean(errors.newPassword)}
                aria-describedby="newPassword-error"
                className={`w-full pl-10 pr-11 py-3 rounded-xl text-xs border transition-colors ${getFieldStateClass(errors.newPassword)}`}
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-[#064e3b] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <InputError message={errors.newPassword?.message} id="newPassword-error" />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Confirm new password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby="confirmPassword-error"
                className={`w-full pl-10 pr-11 py-3 rounded-xl text-xs border transition-colors ${getFieldStateClass(errors.confirmPassword)}`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-[#064e3b] cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <InputError message={errors.confirmPassword?.message} id="confirmPassword-error" />
          </div>

          {resetPassword.isSuccess ? (
            <Link
              href="/login"
              className="inline-flex w-full justify-center items-center gap-2 bg-[#064e3b] text-white py-3.5 rounded-xl text-xs font-extrabold hover:bg-[#053d2e] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              Password reset — Sign in now
            </Link>
          ) : (
            <button
              type="submit"
              disabled={resetPassword.isPending || !token}
              className="w-full bg-[#064e3b] disabled:opacity-60 text-white font-heading font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#053d2e]"
            >
              {resetPassword.isPending ? (
                <InvestraInlineLoader label="Saving new password…" />
              ) : (
                'Set new password'
              )}
            </button>
          )}
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs font-bold text-[#064e3b] hover:underline">
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen grid place-items-center bg-slate-50 px-6"><InvestraLoader label="Preparing password reset" /></main>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
