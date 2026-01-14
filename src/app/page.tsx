'use client';

import { useState } from 'react';
import { Terminal, PortfolioSplash } from '@/components/terminal';
import { ModernPortfolio } from '@/components/modern/ModernPortfolio';

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
    return <ModernPortfolio onBack={() => setMode('splash')} />;
  }

  return <Terminal onBackToSplash={() => setMode('splash')} />;
}
