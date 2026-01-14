'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { BootStep } from '@/lib/terminal/types';
import { VERSION } from '@/lib/version';

interface BootSequenceProps {
  onComplete: () => void;
  skipable?: boolean;
}

const bootSteps: BootStep[] = [
  // BIOS POST sequence
  { text: 'AMIBIOS (C) 2024 American Megatrends, Inc.', delay: 0, type: 'info' },
  { text: 'BIOS Date: 01/13/26  Ver: 08.00.15', delay: 100, type: 'info' },
  { text: 'CPU: Intel(R) Core(TM) i7-13700K @ 5.40GHz', delay: 200, type: 'info' },
  { text: 'Memory Test: 32768 MB OK', delay: 400, type: 'success' },
  { text: 'Detecting drives...', delay: 500, type: 'loading' },
  { text: 'IDE0: Western Digital Caviar WD400BB 40GB', delay: 600, type: 'info' },
  { text: 'Press DEL to enter SETUP, F12 for Boot Menu', delay: 800, type: 'info' },
  { text: '', delay: 1000, type: 'info' },
  // GRUB-like bootloader
  { text: 'Loading Portfolio OS...', delay: 1100, type: 'loading' },
  { text: '', delay: 1250, type: 'info' },
  // ASCII art - "SHELL"
  { text: '    ███████╗██╗  ██╗███████╗██╗     ██╗     ', delay: 1350, type: 'ascii' },
  { text: '    ██╔════╝██║  ██║██╔════╝██║     ██║     ', delay: 1380, type: 'ascii' },
  { text: '    ███████╗███████║█████╗  ██║     ██║     ', delay: 1410, type: 'ascii' },
  { text: '    ╚════██║██╔══██║██╔══╝  ██║     ██║     ', delay: 1440, type: 'ascii' },
  { text: '    ███████║██║  ██║███████╗███████╗███████╗', delay: 1470, type: 'ascii' },
  { text: '    ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝', delay: 1500, type: 'ascii' },
  { text: '', delay: 1600, type: 'info' },
  // Linux-style kernel boot messages (quick scrolling)
  { text: '[    0.000000] Linux version 6.1.0-portfolio (gcc 12.2.0)', delay: 1650, type: 'info' },
  { text: '[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/sda1', delay: 1680, type: 'info' },
  { text: '[    0.000012] x86/fpu: Supporting XSAVE feature 0x001', delay: 1710, type: 'info' },
  { text: '[    0.000012] x86/fpu: Supporting XSAVE feature 0x002', delay: 1730, type: 'info' },
  { text: '[    0.000021] BIOS-provided physical RAM map:', delay: 1750, type: 'info' },
  { text: '[    0.000023] BIOS-e820: [mem 0x0000000000000000-0x000000000009ffff] usable', delay: 1770, type: 'info' },
  { text: '[    0.000024] BIOS-e820: [mem 0x0000000100000000-0x00000007ffffffff] usable', delay: 1790, type: 'info' },
  { text: '[    0.004523] ACPI: Early table checksum verification disabled', delay: 1810, type: 'info' },
  { text: '[    0.004891] ACPI: RSDP 0x00000000000F0490 000024 (v02 PTLTD )', delay: 1830, type: 'info' },
  { text: '[    0.012834] Zone ranges:', delay: 1850, type: 'info' },
  { text: '[    0.012835]   DMA      [mem 0x0000000000001000-0x0000000000ffffff]', delay: 1865, type: 'info' },
  { text: '[    0.012836]   DMA32    [mem 0x0000000001000000-0x00000000ffffffff]', delay: 1880, type: 'info' },
  { text: '[    0.012837]   Normal   [mem 0x0000000100000000-0x00000007ffffffff]', delay: 1895, type: 'info' },
  { text: '[    0.052891] Initializing cgroup subsys cpuset', delay: 1910, type: 'info' },
  { text: '[    0.052893] Initializing cgroup subsys cpu', delay: 1925, type: 'info' },
  { text: '[    0.089234] PCI: Using configuration type 1 for base access', delay: 1940, type: 'info' },
  { text: '[    0.123456] Freeing SMP alternatives memory: 40K', delay: 1955, type: 'info' },
  { text: '[    0.234567] smpboot: CPU0: Intel(R) Core(TM) i7-13700K', delay: 1970, type: 'info' },
  { text: '[    0.345678] Performance Events: PEBS fmt4+-baseline', delay: 1985, type: 'info' },
  { text: '[    0.456789] NMI watchdog: Enabled. Paranoid=1, x86_watchdog', delay: 2000, type: 'info' },
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
    <div className="fixed inset-0 z-200 bg-black p-2 overflow-hidden">
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
    <div className="flex items-center gap-2">
      <span className="w-4 text-center">{getIcon()}</span>
      <span className={getTextClass()}>{step.text}</span>
    </div>
  );
}

