'use client';

import { useState } from 'react';
import { Terminal, PortfolioSplash } from '@/components/terminal';

type PortfolioMode = 'splash' | 'terminal' | 'modern';

export default function Home() {
  const [mode, setMode] = useState<PortfolioMode>('splash');

  if (mode === 'splash') {
    return (
      <PortfolioSplash
        onSelectTerminal={() => setMode('terminal')}
        onSelectModern={() => setMode('modern')}
      />
    );
  }

  if (mode === 'modern') {
    // Placeholder for modern portfolio - will be implemented later
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-white/80 text-2xl font-light">Modern Portfolio</div>
          <div className="text-white/40 text-sm">Coming soon...</div>
          <button
            onClick={() => setMode('splash')}
            className="mt-4 px-4 py-2 border border-white/20 text-white/60 rounded hover:bg-white/10 hover:text-white/80 transition-colors cursor-pointer"
          >
            ← Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return <Terminal onBackToSplash={() => setMode('splash')} />;
}
