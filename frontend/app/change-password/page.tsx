"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type UseFormRegister } from 'react-hook-form';
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { InvestraInlineLoader } from '@/components/ui/InvestraLoader';
import { handleFormApiError } from '@/lib/api/client';
import { toast } from '@/lib/toast';
import { useChangePasswordMutation } from '@/lib/auth/auth-hooks';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/lib/auth/schemas';
import { InputError, getFieldStateClass } from '@/components/ui/InputError';

function PasswordInput({
  id,
  label,
  register,
  error,
}: {
  id: 'currentPassword' | 'newPassword' | 'confirmPassword';
  label: string;
  register: UseFormRegister<ChangePasswordFormValues>;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={id === 'currentPassword' ? 'current-password' : 'new-password'}
          className={`w-full rounded-xl border px-4 py-3 pr-11 text-xs transition-colors ${getFieldStateClass(error)}`}
          {...register(id)}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-[#064e3b] cursor-pointer"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <InputError message={error} id={`${id}-error`} />
    </div>
  );
}

function ChangePasswordWorkspace() {
  const router = useRouter();
  const changePassword = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Your password has been successfully changed. Please sign in with your new password.', {
        title: 'Password Changed',
      });
      router.replace('/login?passwordChanged=1');
    } catch (err) {
      handleFormApiError(err, setError, 'Unable to change password');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 grid place-items-center p-6">
      <section className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#064e3b] text-emerald-300 shadow-md">
            <KeyRound className="h-6 w-6" />
          </span>
          <h1 className="font-heading font-black text-2xl text-slate-900">Change your password</h1>
          <p className="text-xs leading-relaxed text-slate-500">
            For your security, this updates your credentials and signs you out of any existing sessions.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <PasswordInput id="currentPassword" label="Current password" register={register} error={errors.currentPassword?.message} />
          <PasswordInput id="newPassword" label="New password" register={register} error={errors.newPassword?.message} />
          <p className="text-[11px] text-slate-500">Use 12+ characters with uppercase, lowercase, number, and symbol.</p>
          <PasswordInput id="confirmPassword" label="Confirm new password" register={register} error={errors.confirmPassword?.message} />

          <button
            type="submit"
            disabled={changePassword.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#064e3b] py-3.5 text-xs font-heading font-extrabold text-white disabled:opacity-60 cursor-pointer hover:bg-[#053d2e] transition-colors"
          >
            {changePassword.isPending ? (
              <InvestraInlineLoader label="Changing password…" />
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Change password securely
              </>
            )}
          </button>
        </form>
        <Link href="/profile" className="block text-center text-xs font-bold text-[#064e3b] hover:underline">
          Back to profile
        </Link>
      </section>
    </main>
  );
}

export default function ChangePasswordPage() {
  return (
    <RequireAuth>
      <ChangePasswordWorkspace />
    </RequireAuth>
  );
}
