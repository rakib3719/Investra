"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  className?: string;
  speed?: number;
}

export default function ShinyText({
  text,
  disabled = false,
  className = "",
  speed = 4
}: ShinyTextProps) {
  if (disabled) {
    return <span className={className}>{text}</span>;
  }

  return (
    <>
      {/* Self-contained styling for animation to prevent global CSS bloat */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shiny-flow {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shiny-flow {
          animation: shiny-flow var(--shiny-speed, 4s) linear infinite;
        }
      `}} />
      <span
        className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#064e3b] via-[#10b981] to-[#064e3b] bg-[length:200%_auto] animate-shiny-flow ${className}`}
        style={{
          // @ts-ignore
          "--shiny-speed": `${speed}s`
        }}
      >
        {text}
      </span>
    </>
  );
}
