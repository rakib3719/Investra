"use client";

import { useEffect, useRef, useState } from 'react';
import { LocateFixed, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import {
  recordVisitorInsight,
  type VisitorLocation,
} from '@/lib/visitor-insights/visitor-insights-api';

type Consent = 'unknown' | 'granted' | 'declined';

const consentKey = 'investra-visitor-insights-consent';
const visitorKey = 'investra-anonymous-visitor-id';

function visitorId() {
  const existing = window.localStorage.getItem(visitorKey);
  if (existing) return existing;
  const id = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(visitorKey, id);
  return id;
}

function baseInsight(location?: VisitorLocation) {
  return {
    anonymousId: visitorId(),
    pagePath: window.location.pathname,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    referrer: document.referrer || undefined,
    locationConsent: Boolean(location),
    location,
  };
}

export function VisitorConsent() {
  const [consent, setConsent] = useState<Consent>('unknown');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const hasRecordedVisit = useRef(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(consentKey);
    queueMicrotask(() => {
      setConsent(saved === 'granted' || saved === 'declined' ? saved : 'unknown');
    });
  }, []);

  useEffect(() => {
    if (consent !== 'granted' || hasRecordedVisit.current) return;
    hasRecordedVisit.current = true;
    void recordVisitorInsight(baseInsight()).catch(() => {
      // Analytics must never interrupt a visitor's use of the public site.
    });
  }, [consent]);

  const setPreference = (value: Exclude<Consent, 'unknown'>) => {
    window.localStorage.setItem(consentKey, value);
    if (value === 'declined') window.localStorage.removeItem(visitorKey);
    setConsent(value);
    setSettingsOpen(false);
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Location is unavailable in this browser.');
      return;
    }

    setLocationStatus('Requesting your permission…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
        };
        void recordVisitorInsight(baseInsight(location))
          .then(() => setLocationStatus('Location shared for this visit.'))
          .catch(() => setLocationStatus('We could not save your location. Please try again later.'));
      },
      () => setLocationStatus('Location was not shared. You can continue using the site normally.'),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 0 },
    );
  };

  if (consent === 'unknown') {
    return (
      <aside className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl sm:p-5" aria-label="Privacy choices">
        <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-900">Help us understand website visits</p><p className="mt-1 text-xs leading-5 text-slate-600">With your permission, Investra records browser/device category, language, timezone, screen size, and referral source. Exact location is always a separate optional choice.</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setPreference('granted')} className="rounded-xl bg-[#064e3b] px-4 py-2.5 text-xs font-bold text-white">Allow insights</button><button type="button" onClick={() => setPreference('declined')} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700">No thanks</button></div></div></div>
      </aside>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {settingsOpen && <section className="absolute bottom-12 right-0 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-900">Privacy settings</p><p className="mt-1 text-xs leading-5 text-slate-600">You control visitor insights and optional precise location sharing.</p></div><button type="button" onClick={() => setSettingsOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close privacy settings"><X className="h-4 w-4" /></button></div>{consent === 'granted' && <button type="button" onClick={shareLocation} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"><LocateFixed className="h-4 w-4" />Share precise location</button>}{locationStatus && <p className="mt-2 text-xs text-slate-600" role="status">{locationStatus}</p>}<button type="button" onClick={() => setPreference(consent === 'granted' ? 'declined' : 'granted')} className="mt-4 block text-xs font-bold text-[#064e3b] hover:underline">{consent === 'granted' ? 'Turn off visitor insights' : 'Allow visitor insights'}</button></section>}
      <button type="button" onClick={() => setSettingsOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-full border border-emerald-200 bg-white text-emerald-800 shadow-lg" aria-label="Open privacy settings"><SlidersHorizontal className="h-4 w-4" /></button>
    </div>
  );
}
