'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { BootStep } from '@/lib/terminal/types';
import { VERSION } from '@/lib/version';

interface BootSequenceProps {
  onComplete: () => void;
  skipable?: boolean;
}

const bootSteps: BootStep[] = [
  // BIOS POST sequence
  { text: 'AMIBIOS (C) 1991 American Megatrends, Inc.', delay: 0, type: 'info' },
  { text: 'BIOS Date: 08/12/92  Ver: 1.00', delay: 100, type: 'info' },
  { text: 'CPU: Intel 486DX2-66', delay: 200, type: 'info' },
  { text: 'Memory Test: 4096 KB OK', delay: 400, type: 'success' },
  { text: 'Detecting IDE drives...', delay: 500, type: 'loading' },
  { text: 'IDE0: Conner CP30104 104MB', delay: 600, type: 'info' },
  { text: 'Press DEL to enter SETUP', delay: 800, type: 'info' },
  { text: '', delay: 1000, type: 'info' },
  // GRUB-like bootloader
  { text: 'Loading Portfolio OS...', delay: 1100, type: 'loading' },
  { text: '', delay: 1250, type: 'info' },
  // ASCII art - "NEXT.JS"
  { text: '    ███╗   ██╗███████╗██╗  ██╗████████╗     ██╗███████╗', delay: 1350, type: 'ascii' },
  { text: '    ████╗  ██║██╔════╝╚██╗██╔╝╚══██╔══╝     ██║██╔════╝', delay: 1380, type: 'ascii' },
  { text: '    ██╔██╗ ██║█████╗   ╚███╔╝    ██║        ██║███████╗', delay: 1410, type: 'ascii' },
  { text: '    ██║╚██╗██║██╔══╝   ██╔██╗    ██║   ██   ██║╚════██║', delay: 1440, type: 'ascii' },
  { text: '    ██║ ╚████║███████╗██╔╝ ██╗   ██║██╗╚█████╔╝███████║', delay: 1470, type: 'ascii' },
  { text: '    ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝╚═╝ ╚════╝ ╚══════╝', delay: 1500, type: 'ascii' },
  { text: '', delay: 1600, type: 'info' },
  // Linux-style kernel boot messages (quick scrolling)
  { text: '[    0.000000] Linux version 0.99pl14 (gcc 2.3.3)', delay: 1650, type: 'info' },
  { text: '[    0.000432] CPU: Intel 486DX2-66', delay: 1680, type: 'info' },
  { text: '[    0.001028] Checking 386/486 paging... OK', delay: 1710, type: 'info' },
  { text: '[    0.002314] Calibrating delay loop... 49.15 BogoMIPS', delay: 1740, type: 'info' },
  { text: '[    0.004876] Memory: 4096k available', delay: 1780, type: 'info' },
  { text: '[    0.006241] Buffer cache: 256k', delay: 1810, type: 'info' },
  { text: '[    0.007903] Real-time clock detected', delay: 1840, type: 'info' },
  { text: '[    0.010214] IDE driver v0.9 initialized', delay: 1870, type: 'info' },
  { text: '[    0.011892] hda: Conner CP30104, 104MB, CHS=203/16/63', delay: 1900, type: 'info' },
  { text: '[    0.013477] hda1: ext filesystem', delay: 1930, type: 'info' },
  { text: '[    0.015902] Floppy drive(s): fd0 is 1.44MB', delay: 1960, type: 'info' },
  { text: '[    0.017364] Serial driver version 3.94', delay: 1990, type: 'info' },
  { text: '[    0.018921] tty00 at 0x03f8 (irq = 4)', delay: 2020, type: 'info' },
  { text: '[    0.021338] ISA bus initialized', delay: 2050, type: 'info' },
  { text: '[    0.023775] Sound Blaster at 0x220 irq 5 dma 1', delay: 2080, type: 'info' },
  { text: '[    0.026491] VFS: Mounted root (ext) filesystem readonly', delay: 2110, type: 'info' },
  { text: '[    0.028834] Freeing unused kernel memory: 128k freed', delay: 2140, type: 'info' },
  { text: '[    0.031502] INIT: version 1.3 booting', delay: 2170, type: 'info' },
  { text: '', delay: 2050, type: 'info' },
  // systemd-style service startup
  { text: `Starting Portfolio OS v${VERSION}...`, delay: 2100, type: 'loading' },
  { text: '[  OK  ] Started udev Kernel Device Manager', delay: 2200, type: 'success' },
  { text: '[  OK  ] Reached target Local File Systems', delay: 2280, type: 'success' },
  { text: '[  OK  ] Started Network Manager', delay: 2360, type: 'success' },
  { text: '', delay: 2440, type: 'info' },
  { text: 'Loading experience data...', delay: 2500, type: 'loading', progress: 25 },
  { text: 'Compiling skills matrix...', delay: 2600, type: 'loading', progress: 50 },
  { text: 'Initializing portfolio services...', delay: 2700, type: 'loading', progress: 75 },
  { text: 'Starting terminal services...', delay: 2800, type: 'loading', progress: 100 },
  { text: '', delay: 2900, type: 'info' },
  { text: '[  OK  ] Reached target Multi-User System', delay: 2950, type: 'success' },
  { text: '', delay: 3050, type: 'info' },
  { text: 'Welcome to the Portfolio Terminal.', delay: 3100, type: 'complete' },
  { text: 'Type "help" to get started.', delay: 3200, type: 'complete' },
];

export function BootSequence({ onComplete, skipable = true }: BootSequenceProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [skipped, setSkipped] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const skip = useCallback(() => {
    if (skipable && !skipped) {
      setSkipped(true);
      onComplete();
    }
  }, [skipable, skipped, onComplete]);

  // Auto-scroll to bottom when new steps appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleSteps]);

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
    <div
      ref={scrollRef}
      className="fixed inset-0 z-200 bg-black p-2 overflow-y-auto terminal-scrollbar"
    >
      <div className="w-full font-mono terminal-text text-green-500">
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

  // ASCII art lines render without icon prefix for proper alignment
  if (step.type === 'ascii') {
    return (
      <div className="text-green-500 font-bold whitespace-pre">{step.text}</div>
    );
  }

  return (
    <div className="flex items-center">
      <span className="w-4 text-center">{getIcon()}</span>
      <span className={getTextClass()}>{step.text}</span>
    </div>
  );
}

