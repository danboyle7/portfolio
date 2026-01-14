'use client';

import type { About } from '@/lib/terminal/types';

interface FooterProps {
  about: About;
}

export function Footer({ about }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-slate-500 text-sm">
            &copy; {currentYear} {about.name}. All rights reserved.
          </div>

          {/* Built with */}
          <div className="flex items-center gap-2 text-slate-500 text-sm">
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
