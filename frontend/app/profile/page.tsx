"use client";

import type { InputHTMLAttributes } from 'react';
import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Globe2,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Footer from '@/components/public-facing/shared/Footer';
import Navbar from '@/components/public-facing/shared/Navbar';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { getApiError } from '@/lib/api/client';
import { useMyProfileQuery, useUpdateMyProfileMutation } from '@/lib/profile/profile-hooks';
import type { MyProfile, UpdateProfileInput } from '@/lib/profile/types';

const numberFields = new Set([
  'yearsOfExperience',
  'investmentRangeMin',
  'investmentRangeMax',
  'consultationFee',
  'sessionFee',
  'workshopFee',
  'courseFee',
]);

function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="space-y-1 block">
      <span className="text-[11px] font-bold text-slate-700">{label}</span>
      <input {...props} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#064e3b]" />
    </label>
  );
}

function Completion({ profile }: { profile: MyProfile }) {
  const roleFields = profile.account.role === 'INVESTOR'
    ? [profile.profile?.headline, profile.profile?.investmentRangeMin, profile.profile?.businessIndustry]
    : profile.account.role === 'ENTREPRENEUR'
      ? [profile.profile?.headline, profile.profile?.companyName, profile.profile?.linkedin]
      : [profile.profile?.headline, profile.profile?.specialization, profile.profile?.consultantLevel];
  const values = [profile.account.phone, profile.account.country, profile.account.city, profile.account.bio, ...roleFields];
  const percent = Math.round((values.filter(Boolean).length / values.length) * 100);

  return <div className="space-y-2"><div className="flex items-center justify-between text-xs"><span className="font-bold text-slate-700">Profile completion</span><span className="font-black text-[#064e3b]">{percent}%</span></div><div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#064e3b] to-[#10b981] transition-all" style={{ width: `${percent}%` }} /></div><p className="text-[11px] text-slate-500">A complete profile makes matching and verification easier.</p></div>;
}

function ProfileWorkspace() {
  const profileQuery = useMyProfileQuery();
  const updateProfile = useUpdateMyProfileMutation();
  const [step, setStep] = useState(0);

  if (profileQuery.isLoading) return <div className="min-h-screen grid place-items-center text-sm text-slate-500">Loading your secure profile…</div>;
  if (!profileQuery.data) return <div className="min-h-screen grid place-items-center text-sm text-red-600">{getApiError(profileQuery.error).message}</div>;

  const { account, profile } = profileQuery.data;
  const roleLabel = account.role === 'ENTREPRENEUR' ? 'Uddokta' : account.role[0] + account.role.slice(1).toLowerCase();
  const apiError = updateProfile.error ? getApiError(updateProfile.error).message : null;

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string | number | boolean> = {};

    formData.forEach((value, key) => {
      const normalized = String(value).trim();
      if (!normalized || key === 'profileVisibility' || key === 'accreditedInvestor') return;
      payload[key] = numberFields.has(key) ? Number(normalized) : normalized;
    });
    if (formData.has('profileVisibility')) {
      payload.profileVisibility = formData.get('profileVisibility') === 'on';
    }
    if (account.role === 'INVESTOR' && formData.has('accreditedInvestor')) {
      payload.accreditedInvestor = formData.get('accreditedInvestor') === 'on';
    }

    await updateProfile.mutateAsync(payload as UpdateProfileInput);
    if (step < 2) setStep((current) => current + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16">
        <section className="bg-[#064e3b] text-white"><div className="max-w-7xl mx-auto px-6 py-10 md:py-14 flex flex-col md:flex-row md:items-end justify-between gap-6"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 grid place-items-center text-emerald-300"><CircleUserRound className="w-9 h-9" /></div><div><p className="text-[11px] uppercase tracking-widest font-bold text-emerald-300">{roleLabel} profile</p><h1 className="font-heading font-black text-3xl">{account.firstName ?? 'Complete your profile'}</h1><p className="text-sm text-white/70 mt-1">A private workspace for your Investra identity and matching information.</p></div></div><span className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 border border-white/15 px-4 py-2 rounded-full"><ShieldCheck className="w-4 h-4 text-emerald-300" />Verified email</span></div></section>

        <section className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-[#064e3b]/10 grid place-items-center text-[#064e3b]"><CircleUserRound className="w-7 h-7" /></div><div><h2 className="font-heading font-black text-slate-800">{account.firstName} {account.lastName}</h2><p className="text-xs text-slate-500">{roleLabel}</p></div></div><div className="space-y-3 text-xs text-slate-600"><p className="flex gap-2"><Mail className="w-4 h-4 text-[#064e3b]" />{account.email}</p><p className="flex gap-2"><MapPin className="w-4 h-4 text-[#064e3b]" />{[account.city, account.country].filter(Boolean).join(', ') || 'Location not added'}</p><p className="flex gap-2"><Globe2 className="w-4 h-4 text-[#064e3b]" />{account.website || 'Website not added'}</p></div><Completion profile={profileQuery.data} /></div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 space-y-2"><Sparkles className="w-5 h-5 text-emerald-700" /><h3 className="font-heading font-black text-sm text-slate-800">Why these details matter</h3><p className="text-xs leading-relaxed text-slate-600">Your role-specific information is used for better investor, founder, and consultant discovery. Documents stay in a separate verification flow.</p></div>
          </aside>

          <section className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-8">{['Identity & location', `${roleLabel} details`, 'Visibility & review'].map((title, index) => <button key={title} type="button" onClick={() => setStep(index)} className={`px-3.5 py-2 rounded-xl text-xs font-bold ${step === index ? 'bg-[#064e3b] text-white' : 'bg-slate-100 text-slate-500'}`}>{index + 1}. {title}</button>)}</div>
            <form key={account.updatedAt} onSubmit={saveProfile} className="space-y-6">
              {step === 0 && <><div><p className="text-[11px] font-bold text-[#064e3b] uppercase tracking-widest">Step 1</p><h2 className="font-heading text-2xl font-black text-slate-800">Your identity</h2><p className="text-sm text-slate-500 mt-1">Keep the details that partners and the platform need accurate.</p></div><div className="grid md:grid-cols-2 gap-4"><Field name="firstName" label="First name" defaultValue={account.firstName ?? ''} /><Field name="lastName" label="Last name" defaultValue={account.lastName ?? ''} /><Field name="phone" label="Phone number" defaultValue={account.phone ?? ''} /><Field name="image" label="Profile image URL (optional)" defaultValue={account.image ?? ''} /><Field name="country" label="Country" defaultValue={account.country ?? ''} /><Field name="city" label="City" defaultValue={account.city ?? ''} /><Field name="dateOfBirth" type="date" label="Date of birth" defaultValue={account.dateOfBirth?.slice(0, 10) ?? ''} /><Field name="website" type="url" label="Website" defaultValue={account.website ?? ''} /></div><div className="grid md:grid-cols-2 gap-4"><label className="space-y-1"><span className="text-[11px] font-bold text-slate-700">Gender</span><select name="gender" defaultValue={account.gender ?? ''} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"><option value="">Prefer not to say</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option><option value="PREFER_NOT_TO_SAY">Prefer not to say</option></select></label><label className="space-y-1"><span className="text-[11px] font-bold text-slate-700">Professional type</span><select name="professionalType" defaultValue={account.professionalType ?? ''} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"><option value="">Select type</option><option value="EMPLOYEE">Employee</option><option value="BUSINESS_OWNER">Business owner</option><option value="FREELANCER">Freelancer</option><option value="SELF_EMPLOYED">Self-employed</option><option value="STUDENT">Student</option><option value="OTHER">Other</option></select></label></div><label className="space-y-1 block"><span className="text-[11px] font-bold text-slate-700">Short bio</span><textarea name="bio" defaultValue={account.bio ?? ''} rows={4} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" placeholder="Tell the community about your experience and focus." /></label></>}

              {step === 1 && <RoleDetails role={account.role} profile={profile} />}
              {step === 2 && <><div><p className="text-[11px] font-bold text-[#064e3b] uppercase tracking-widest">Step 3</p><h2 className="font-heading text-2xl font-black text-slate-800">Visibility & review</h2><p className="text-sm text-slate-500 mt-1">Choose whether your completed role profile may appear in discovery.</p></div><label className="flex items-start gap-3 p-4 border border-slate-200 rounded-2xl"><input name="profileVisibility" type="checkbox" defaultChecked={profile?.profileVisibility ?? false} className="mt-0.5 accent-[#064e3b]" /><span><span className="block text-sm font-bold text-slate-800">Show my profile in discovery</span><span className="block text-xs text-slate-500 mt-1">Your profile remains subject to Investra verification and platform rules.</span></span></label><div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600"><p className="font-bold text-slate-800">Next: verification documents</p><p className="mt-1">NID/passport and identity documents are intentionally kept out of this page. Add them later in a dedicated encrypted verification experience.</p></div></>}

              {apiError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{apiError}</p>}
              {updateProfile.isSuccess && <p className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">Profile saved securely.</p>}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100"><button type="button" disabled={step === 0} onClick={() => setStep((current) => current - 1)} className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 disabled:opacity-40"><ChevronLeft className="w-4 h-4" />Back</button><button type="submit" disabled={updateProfile.isPending} className="inline-flex items-center gap-2 bg-[#064e3b] text-white text-xs font-bold px-5 py-3 rounded-xl disabled:opacity-60">{updateProfile.isPending ? 'Saving…' : step === 2 ? 'Save profile' : 'Save and continue'}{step < 2 && <ChevronRight className="w-4 h-4 text-emerald-300" />}</button></div>
            </form>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function RoleDetails({ role, profile }: { role: string; profile: MyProfile['profile'] }) {
  return <><div><p className="text-[11px] font-bold text-[#064e3b] uppercase tracking-widest">Step 2</p><h2 className="font-heading text-2xl font-black text-slate-800">{role === 'ENTREPRENEUR' ? 'Uddokta' : role[0] + role.slice(1).toLowerCase()} details</h2><p className="text-sm text-slate-500 mt-1">These fields are tailored to your role in the venture ecosystem.</p></div><div className="grid md:grid-cols-2 gap-4"><Field name="headline" label="Professional headline" defaultValue={profile?.headline ?? ''} /><Field name="companyName" label="Company / organization" defaultValue={profile?.companyName ?? ''} /><Field name="designation" label="Designation" defaultValue={profile?.designation ?? ''} /><Field name="yearsOfExperience" type="number" min="0" label="Years of experience" defaultValue={profile?.yearsOfExperience ?? ''} />{role === 'INVESTOR' && <><Field name="investmentRangeMin" type="number" min="0" label="Minimum investment amount" defaultValue={profile?.investmentRangeMin ?? ''} /><Field name="investmentRangeMax" type="number" min="0" label="Maximum investment amount" defaultValue={profile?.investmentRangeMax ?? ''} /><Field name="preferredCurrency" label="Preferred currency" defaultValue={profile?.preferredCurrency ?? ''} placeholder="BDT, USD" /><Field name="businessIndustry" label="Preferred industry" defaultValue={profile?.businessIndustry ?? ''} /><label className="space-y-1"><span className="text-[11px] font-bold text-slate-700">Preferred stage</span><select name="preferredStage" defaultValue={profile?.preferredStage ?? ''} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"><option value="">Select stage</option><option value="IDEA">Idea</option><option value="MVP">MVP</option><option value="EARLY_STAGE">Early stage</option><option value="GROWTH">Growth</option><option value="SCALING">Scaling</option></select></label><label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input name="accreditedInvestor" type="checkbox" defaultChecked={profile?.accreditedInvestor ?? false} className="accent-[#064e3b]" />Accredited investor</label></>}{role === 'ENTREPRENEUR' && <><Field name="linkedin" type="url" label="LinkedIn URL" defaultValue={profile?.linkedin ?? ''} /><Field name="facebook" type="url" label="Facebook URL" defaultValue={profile?.facebook ?? ''} /><Field name="twitter" type="url" label="X / Twitter URL" defaultValue={profile?.twitter ?? ''} /></>}{role === 'CONSULTANT' && <><Field name="specialization" label="Specialization" defaultValue={profile?.specialization ?? ''} /><label className="space-y-1"><span className="text-[11px] font-bold text-slate-700">Consultant level</span><select name="consultantLevel" defaultValue={profile?.consultantLevel ?? ''} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm"><option value="">Select level</option><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="EXPERT">Expert</option></select></label><Field name="consultationFee" type="number" min="0" label="Consultation fee" defaultValue={profile?.consultationFee ?? ''} /><Field name="sessionFee" type="number" min="0" label="Session fee" defaultValue={profile?.sessionFee ?? ''} /><Field name="workshopFee" type="number" min="0" label="Workshop fee" defaultValue={profile?.workshopFee ?? ''} /><Field name="courseFee" type="number" min="0" label="Course fee" defaultValue={profile?.courseFee ?? ''} /></>}</div></>;
}

export default function ProfilePage() {
  return <RequireAuth><ProfileWorkspace /></RequireAuth>;
}
