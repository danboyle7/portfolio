"use client";

import type { ReactNode } from "react";

interface SectionHeadingProps {
  label: string;
  title: ReactNode;
  align?: "left" | "center";
  isVisible: boolean;
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
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
      <span className="text-sm font-semibold tracking-[0.2em] text-sky-400 uppercase">
        {label}
      </span>
      <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
        {title}
      </h2>
      {children}
    </div>
  );
}
