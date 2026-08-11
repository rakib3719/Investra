"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Mail } from 'lucide-react';
import { getApiError } from '@/lib/api/client';
import { useResendVerificationMutation, useVerifyEmailMutation } from '@/lib/auth/auth-hooks';
import { emailSchema, type EmailFormValues } from '@/lib/auth/schemas';
import { InvestraInlineLoader, InvestraLoader } from '@/components/ui/InvestraLoader';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email') ?? '';
  const verify = useVerifyEmailMutation();
  const resend = useResendVerificationMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema), defaultValues: { email } });

  useEffect(() => {
    if (token && verify.isIdle) {
      verify.mutate(token);
    }
  }, [token, verify]);

  const onResend = async (values: EmailFormValues) => {
    await resend.mutateAsync(values.email);
  };

  const verifyError = verify.error ? getApiError(verify.error).message : null;
  const resendError = resend.error ? getApiError(resend.error).message : null;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <section className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5 text-center">
        <Mail className="w-12 h-12 mx-auto text-[#064e3b]" />
        {token && verify.isPending && <InvestraLoader label="Verifying your email" description="Confirming your secure Investra account." />}
        {token && verify.isSuccess && <><CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" /><h1 className="text-2xl font-black">Email verified</h1><p className="text-sm text-slate-500">Your account is active. You can sign in now.</p><Link href="/login" className="inline-flex bg-[#064e3b] text-white px-5 py-3 rounded-xl text-sm font-bold">Go to sign in</Link></>}
        {token && verifyError && <><h1 className="text-2xl font-black">Verification link unavailable</h1><p role="alert" className="text-sm text-red-600">{verifyError}</p></>}
        {!token && <><h1 className="text-2xl font-black">Check your inbox</h1><p className="text-sm text-slate-500">We sent your secure verification link. Open it before signing in.</p></>}

        {(!token || verifyError) && <form onSubmit={handleSubmit(onResend)} className="space-y-3 text-left"><label className="text-xs font-bold text-slate-700" htmlFor="email">Need another link?</label><input id="email" type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" {...register('email')} />{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}{resendError && <p role="alert" className="text-xs text-red-600">{resendError}</p>}{resend.isSuccess && <p className="text-xs text-emerald-700">If needed, a new verification email has been sent.</p>}<button type="submit" disabled={resend.isPending} className="w-full border border-[#064e3b] text-[#064e3b] py-3 rounded-xl text-sm font-bold disabled:opacity-60">{resend.isPending ? <InvestraInlineLoader label="Sending…" /> : 'Resend verification email'}</button></form>}
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
