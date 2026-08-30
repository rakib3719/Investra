"use client";

import { useEffect, useRef } from 'react';
import { recordVisitorInsight } from '@/lib/visitor-insights/visitor-insights-api';

const visitorKey = 'investra-anonymous-visitor-id';
const recordedVisitKey = 'investra-homepage-insight-recorded';

function visitorId() {
  try {
    const existing = window.localStorage.getItem(visitorKey);
    if (existing) return existing;

    const id = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(visitorKey, id);
    return id;
  } catch {
    return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Records anonymous homepage analytics for the testing environment. This
 * component intentionally renders nothing, so visitors never see a prompt.
 * Precise geolocation is never requested or sent automatically.
 */
export function VisitorConsent() {
  const hasRecordedVisit = useRef(false);

  useEffect(() => {
    if (hasRecordedVisit.current) return;
    hasRecordedVisit.current = true;

    try {
      if (window.sessionStorage.getItem(recordedVisitKey)) return;
      window.sessionStorage.setItem(recordedVisitKey, 'true');
    } catch {
      // Continue without session storage; the in-memory guard still prevents duplicates in this mount.
    }

    void recordVisitorInsight({
      anonymousId: visitorId(),
      pagePath: window.location.pathname,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      referrer: document.referrer || undefined,
      locationConsent: false,
    }).catch(() => {
      try {
        window.sessionStorage.removeItem(recordedVisitKey);
      } catch {
        // Analytics must never interrupt a visitor's use of the public site.
      }
    });
  }, []);

  return null;
}
