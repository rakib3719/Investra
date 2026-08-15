import type { HTMLAttributes } from "react";

type LoaderSize = "sm" | "md" | "lg";

const markSizes: Record<LoaderSize, string> = {
  sm: "h-5 w-5",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

/**
 * Shared Investra loading mark. The rotating orbit and ascending bars echo
 * the platform's investment-growth focus while staying subtle in compact UI.
 */
export function InvestraMark({ size = "md" }: { size?: LoaderSize }) {
  return (
    <span className={`investra-loader-mark ${markSizes[size]}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
        <circle className="investra-loader-track" cx="32" cy="32" r="27" />
        <circle className="investra-loader-orbit" cx="32" cy="32" r="27" pathLength="100" />
        <path className="investra-loader-leaf" d="M43.6 17.4c-7.3.1-12.1 3.2-13.9 9.9 6.6 1.5 11.5-1.1 13.9-9.9Z" />
        <path className="investra-loader-stem" d="M29.1 30.1c3.8-3 7.2-5.4 11.4-8.1" />
        <rect className="investra-loader-bar investra-loader-bar-one" x="18" y="35" width="6" height="11" rx="2" />
        <rect className="investra-loader-bar investra-loader-bar-two" x="29" y="29" width="6" height="17" rx="2" />
        <rect className="investra-loader-bar investra-loader-bar-three" x="40" y="23" width="6" height="23" rx="2" />
      </svg>
    </span>
  );
}

export function InvestraLoader({
  label = "Preparing your workspace",
  description,
  size = "md",
  className = "",
  ...props
}: {
  label?: string;
  description?: string;
  size?: LoaderSize;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col items-center text-center ${className}`}
      role="status"
      aria-live="polite"
      {...props}
    >
      <span className="investra-loader-halo mb-4 grid place-items-center rounded-3xl bg-white shadow-[0_12px_32px_rgba(6,78,59,0.12)] ring-1 ring-[#064e3b]/10">
        <InvestraMark size={size} />
      </span>
      <p className="font-heading text-sm font-extrabold tracking-tight text-slate-800">{label}</p>
      {description && <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">{description}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function InvestraInlineLoader({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center justify-center gap-2 ${className}`} role="status" aria-live="polite">
      <InvestraMark size="sm" />
      {label && <span>{label}</span>}
      <span className="sr-only">Loading</span>
    </span>
  );
}
