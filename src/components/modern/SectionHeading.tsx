"use client";

import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: ReactNode;
  align?: "left" | "center";
  isVisible: boolean;
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  index,
  label,
  title,
  align = "left",
  isVisible,
  className = "",
  children,
}: SectionHeadingProps) {
  const alignClass =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div
      className={`flex flex-col ${alignClass} transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      <div className="flex items-center gap-3 font-mono text-sm">
        <span className="text-cyan-400/70">{index}</span>
        <span className="h-px w-10 bg-linear-to-r from-cyan-400/60 to-transparent" />
        <span className="font-semibold tracking-[0.25em] text-cyan-300 uppercase">
          {label}
        </span>
      </div>
      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        {title}
      </h2>
      {children}
    </div>
  );
}
