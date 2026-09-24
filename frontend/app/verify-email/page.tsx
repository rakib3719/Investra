"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { getApiError, handleFormApiError } from '@/lib/api/client';
import { toast } from '@/lib/toast';
import { useResendVerificationMutation, useVerifyEmailMutation } from '@/lib/auth/auth-hooks';
import { emailSchema, type EmailFormValues } from '@/lib/auth/schemas';
import { InvestraInlineLoader, InvestraLoader } from '@/components/ui/InvestraLoader';
import { InputError, getFieldStateClass } from '@/components/ui/InputError';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email') ?? '';
  const verify = useVerifyEmailMutation();
  const resend = useResendVerificationMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  });

  useEffect(() => {
    if (token && verify.isIdle) {
      verify.mutate(token, {
        onSuccess: () => {
          toast.success('Your email has been verified! You can now sign in.', {
            title: 'Email Verified',
          });
        },
        onError: (err) => {
          toast.apiError(err, 'Failed to verify email. The link may be expired.');
        },
      });
    }
  }, [token, verify]);

  const onResend = async (values: EmailFormValues) => {
    try {
      await resend.mutateAsync(values.email);
      toast.success('A new verification email has been sent to your inbox.', {
        title: 'Verification Link Sent',
      });
    } catch (err) {
      handleFormApiError(err, setError, 'Unable to resend verification email');
    }
  };

  const verifyError = verify.error ? getApiError(verify.error).message : null;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <section className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#064e3b] text-white flex items-center justify-center mx-auto shadow-md">
          <Mail className="w-6 h-6 text-[#10b981]" />
        </div>

        {token && verify.isPending && (
          <InvestraLoader
            label="Verifying your email"
            description="Confirming your secure Investra account."
          />
        )}

        {token && verify.isSuccess && (
          <div className="space-y-3">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
            <h1 className="font-heading font-black text-2xl text-slate-800">Email verified!</h1>
            <p className="text-xs text-slate-500">Your account is fully activated. You can now sign in to your dashboard.</p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex w-full justify-center bg-[#064e3b] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#053d2e] transition-colors"
              >
                Go to sign in
              </Link>
            </div>
          </div>
        )}

        {token && verifyError && (
          <div className="space-y-2">
            <h1 className="font-heading font-black text-xl text-slate-800">Verification link unavailable</h1>
            <p role="alert" className="text-xs text-red-600 font-medium">{verifyError}</p>
          </div>
        )}

        {!token && (
          <div className="space-y-2">
            <h1 className="font-heading font-black text-2xl text-slate-800">Check your inbox</h1>
            <p className="text-xs text-slate-500">
              We sent a secure verification link to your email. Click the link to activate your Investra profile.
            </p>
          </div>
        )}

        {(!token || verifyError) && (
          <form onSubmit={handleSubmit(onResend)} className="space-y-3 text-left pt-2" noValidate>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="email">Need another link?</label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby="email-error"
                className={`w-full px-4 py-3 rounded-xl text-xs border transition-colors ${getFieldStateClass(errors.email)}`}
                {...register('email')}
              />
              <InputError message={errors.email?.message} id="email-error" />
            </div>

            {resend.isSuccess && (
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                A new verification email has been sent. Please check your inbox.
              </p>
            )}

            <button
              type="submit"
              disabled={resend.isPending}
              className="w-full border-2 border-[#064e3b] text-[#064e3b] py-3 rounded-xl text-xs font-bold disabled:opacity-60 cursor-pointer hover:bg-[#064e3b]/5 transition-colors flex items-center justify-center gap-2"
            >
              {resend.isPending ? (
                <InvestraInlineLoader label="Sending…" />
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend verification email</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-2">
          <Link href="/login" className="text-xs font-bold text-[#064e3b] hover:underline">
            Already verified? Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen grid place-items-center bg-slate-50 px-6"><InvestraLoader label="Preparing verification" /></main>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
