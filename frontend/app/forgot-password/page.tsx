"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { KeyRound, Mail, ArrowLeft, Send } from 'lucide-react';
import { handleFormApiError } from '@/lib/api/client';
import { toast } from '@/lib/toast';
import { useForgotPasswordMutation } from '@/lib/auth/auth-hooks';
import { emailSchema, type EmailFormValues } from '@/lib/auth/schemas';
import { InvestraInlineLoader } from '@/components/ui/InvestraLoader';
import { InputError, getFieldStateClass } from '@/components/ui/InputError';

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) });

  const onSubmit = async (values: EmailFormValues) => {
    try {
      await forgotPassword.mutateAsync(values.email);
      toast.success('If an account matches that email, a password reset link has been dispatched.', {
        title: 'Reset Link Sent',
      });
    } catch (err) {
      handleFormApiError(err, setError, 'Failed to send password reset link');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 grid place-items-center p-6">
      <section className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#064e3b] text-white flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-6 h-6 text-[#10b981]" />
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-800">Reset your password</h1>
          <p className="text-xs text-slate-500">
            Enter your registered email and we will send you a secure link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-700">Account email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs border transition-colors ${getFieldStateClass(errors.email)}`}
                {...register('email')}
              />
            </div>
            <InputError message={errors.email?.message} id="email-error" />
          </div>

          {forgotPassword.isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
              If an account with that email exists, we have sent instructions to reset your password. Please check your inbox.
            </div>
          )}

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="w-full bg-[#064e3b] disabled:opacity-60 text-white font-heading font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#053d2e]"
          >
            {forgotPassword.isPending ? (
              <InvestraInlineLoader label="Sending reset link…" />
            ) : (
              <>
                <span>Send reset link</span>
                <Send className="w-3.5 h-3.5 text-[#10b981]" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064e3b] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
