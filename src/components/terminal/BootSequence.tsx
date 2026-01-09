'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { BootStep } from '@/lib/terminal/types';

interface BootSequenceProps {
  onComplete: () => void;
  skipable?: boolean;
}

const bootSteps: BootStep[] = [
  { text: 'BIOS v3.14.159 - Portfolio System', delay: 0, type: 'info' },
  { text: 'Initializing hardware...', delay: 300, type: 'loading' },
  { text: 'Memory check: 8192 MB OK', delay: 600, type: 'success' },
  { text: 'Loading kernel modules...', delay: 900, type: 'loading' },
  { text: '', delay: 1100, type: 'info' },
  { text: '███████╗ ██████╗  ██████╗ ██╗     ███████╗', delay: 1200, type: 'info' },
  { text: '██╔════╝██╔═══██╗██╔════╝ ██║     ██╔════╝', delay: 1250, type: 'info' },
  { text: '█████╗  ██║   ██║██║  ███╗██║     █████╗  ', delay: 1300, type: 'info' },
  { text: '██╔══╝  ██║   ██║██║   ██║██║     ██╔══╝  ', delay: 1350, type: 'info' },
  { text: '██████╗╚██████╔╝╚██████╔╝███████╗███████╗', delay: 1400, type: 'info' },
  { text: '╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝', delay: 1450, type: 'info' },
  { text: '', delay: 1500, type: 'info' },
  { text: 'Starting Portfolio OS v1.0.0...', delay: 1700, type: 'loading' },
  { text: 'Mounting filesystems...', delay: 2000, type: 'loading', progress: 20 },
  { text: 'Loading experience data...', delay: 2300, type: 'loading', progress: 40 },
  { text: 'Compiling skills matrix...', delay: 2600, type: 'loading', progress: 60 },
  { text: 'Initializing neural networks... jk, just React', delay: 2900, type: 'loading', progress: 80 },
  { text: 'Starting terminal services...', delay: 3200, type: 'loading', progress: 100 },
  { text: '', delay: 3400, type: 'info' },
  { text: 'All systems operational.', delay: 3500, type: 'success' },
  { text: '', delay: 3600, type: 'info' },
  { text: 'Welcome to the Portfolio Terminal.', delay: 3700, type: 'complete' },
  { text: 'Type "help" to get started.', delay: 3900, type: 'complete' },
];

export function BootSequence({ onComplete, skipable = true }: BootSequenceProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [skipped, setSkipped] = useState(false);

  const skip = useCallback(() => {
    if (skipable && !skipped) {
      setSkipped(true);
      onComplete();
    }
  }, [skipable, skipped, onComplete]);

  useEffect(() => {
    if (skipped) return;

    const timers: NodeJS.Timeout[] = [];

    bootSteps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setVisibleSteps(index + 1);
        if (step.progress !== undefined) {
          setCurrentProgress(step.progress);
        }

        if (index === bootSteps.length - 1) {
          setTimeout(() => {
            onComplete();
          }, 800);
        }
      }, step.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete, skipped]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        skip();
      }
    };

    const handleClick = () => skip();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [skip]);

  if (skipped) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-2xl font-mono text-sm">
        {/* Boot lines */}
        <div className="space-y-0.5">
          {bootSteps.slice(0, visibleSteps).map((step, index) => (
            <BootLine key={index} step={step} />
          ))}
        </div>

        {/* Progress bar */}
        {currentProgress > 0 && currentProgress < 100 && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-green-500">[</span>
              <div className="flex-1 h-2 bg-green-900/30 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <span className="text-green-500">]</span>
              <span className="text-green-600 text-xs w-10">{currentProgress}%</span>
            </div>
          </div>
        )}

        {/* Skip hint */}
        {skipable && visibleSteps < bootSteps.length && (
          <div className="mt-8 text-center">
            <span className="text-green-700 text-xs animate-pulse">
              Press any key or click to skip...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function BootLine({ step }: { step: BootStep }) {
  const getIcon = () => {
    switch (step.type) {
      case 'success':
        return <span className="text-green-400">✓</span>;
      case 'warning':
        return <span className="text-yellow-400">⚠</span>;
      case 'loading':
        return <span className="text-green-600">›</span>;
      case 'complete':
        return <span className="text-green-400">»</span>;
      default:
        return <span className="text-green-700"> </span>;
    }
  };

  const getTextClass = () => {
    switch (step.type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'complete':
        return 'text-green-300 font-bold';
      case 'loading':
        return 'text-green-500';
      default:
        return 'text-green-600';
    }
  };

  if (!step.text) {
    return <div className="h-4" />;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-center">{getIcon()}</span>
      <span className={getTextClass()}>{step.text}</span>
    </div>
  );
}

