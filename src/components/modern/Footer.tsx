"use client";

import type { About } from "@/lib/terminal/types";

interface FooterProps {
  about: About;
}

export function Footer({ about }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-800/50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <div className="text-sm text-slate-500">
            &copy; {currentYear} {about.name}. All rights reserved.
          </div>

          {/* Built with */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Built with</span>
            <span className="text-blue-400">Next.js</span>
            <span>&</span>
            <span className="text-blue-400">TailwindCSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
