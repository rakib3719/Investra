import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Info } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.035)] ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-bold tracking-tight text-slate-900">{title}</h3>
        {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  change,
  trend = "up",
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
}) {
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-3 text-[28px] font-bold tracking-[-0.035em] text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      {change && (
        <div className="mt-5 border-t border-slate-100 pt-3">
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold ${
              trend === "down"
                ? "text-rose-600"
                : trend === "neutral"
                  ? "text-slate-500"
                  : "text-emerald-700"
            }`}
          >
            {trend !== "neutral" && <TrendIcon className="h-3.5 w-3.5" />}
            {change}
          </span>
        </div>
      )}
    </Panel>
  );
}

export function StatusPill({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: "green" | "amber" | "blue" | "slate" | "rose";
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    amber: "bg-amber-50 text-amber-700 ring-amber-600/10",
    blue: "bg-sky-50 text-sky-700 ring-sky-600/10",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/10",
    rose: "bg-rose-50 text-rose-700 ring-rose-600/10",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#065f46] to-emerald-400"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function InfoLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
      {children}
      <Info className="h-3.5 w-3.5" />
    </span>
  );
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#065f46] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#044c38]"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/50"
    >
      {children}
    </button>
  );
}

export function InvestorLineChart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${compact ? "h-24" : "h-64"}`}>
      {!compact && (
        <div className="absolute inset-0 flex flex-col justify-between py-3">
          {[0, 1, 2, 3, 4].map((line) => (
            <span key={line} className="border-t border-dashed border-slate-100" />
          ))}
        </div>
      )}
      <svg viewBox="0 0 600 220" preserveAspectRatio="none" className="relative z-10 h-full w-full" aria-label="Portfolio value trend">
        <defs>
          <linearGradient id={compact ? "compact-investor-fill" : "investor-fill"} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#10b981" stopOpacity=".24" />
            <stop offset="1" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 188 C28 176 34 163 62 168 C90 173 103 137 128 145 C158 155 166 113 198 124 C221 132 235 98 263 102 C294 106 302 75 331 88 C357 99 370 61 398 70 C426 79 439 44 470 54 C498 64 512 30 541 40 C565 47 580 18 600 22 L600 220 L0 220 Z" fill={`url(#${compact ? "compact-investor-fill" : "investor-fill"})`} />
        <path d="M0 188 C28 176 34 163 62 168 C90 173 103 137 128 145 C158 155 166 113 198 124 C221 132 235 98 263 102 C294 106 302 75 331 88 C357 99 370 61 398 70 C426 79 439 44 470 54 C498 64 512 30 541 40 C565 47 580 18 600 22" fill="none" stroke="#078457" strokeLinecap="round" strokeWidth="3" />
      </svg>
    </div>
  );
}
