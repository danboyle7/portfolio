'use client';

import React, { useState, useEffect } from 'react';
import { formatPath } from '@/lib/terminal/utils';

interface TerminalHeaderProps {
  hostname: string;
  user: string;
  currentPath: string;
}

export function TerminalHeader({ hostname, user, currentPath }: TerminalHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [uptime, setUptime] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(() => {
      updateTime();
      setUptime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const displayPath = formatPath(currentPath);

  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-green-900/50">
      {/* Top bar with window controls and system info */}
      <div className="flex items-center justify-between px-4 py-2 text-xs border-b border-green-900/30">
        {/* Window controls */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer transition-colors" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 cursor-pointer transition-colors" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 cursor-pointer transition-colors" />
          </div>
          <span className="text-green-600 hidden sm:inline">
            {user}@{hostname}: {displayPath}
          </span>
        </div>

        {/* System stats */}
        <div className="flex items-center gap-4 md:gap-6 text-green-700">
          <span className="hidden md:inline">
            PID: <span className="text-green-500">1337</span>
          </span>
          <span className="hidden lg:inline">
            MEM: <span className="text-green-500">42.0MB</span>
          </span>
          <span className="hidden lg:inline">
            UPTIME: <span className="text-green-500">{formatUptime(uptime)}</span>
          </span>
          <span className="text-green-400 font-mono">{currentTime}</span>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="flex items-center justify-between px-4 py-2">
        {/* Logo/Title */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-500">&gt;</span>
          <span className="text-green-300 font-bold">PORTFOLIO</span>
          <span className="text-green-700">//</span>
          <span className="text-green-600">TERMINAL</span>
          <span className="text-green-800 hidden sm:inline ml-2">v1.0.0</span>
        </div>

        {/* Quick navigation hints */}
        <div className="flex items-center gap-2 text-xs text-green-700">
          <span className="hidden md:inline px-2 py-1 border border-green-900/50 rounded">
            <kbd className="text-green-500">↑↓</kbd> history
          </span>
          <span className="hidden md:inline px-2 py-1 border border-green-900/50 rounded">
            <kbd className="text-green-500">Tab</kbd> complete
          </span>
          <span className="px-2 py-1 border border-green-900/50 rounded">
            <kbd className="text-green-500">help</kbd>
          </span>
        </div>
      </nav>
    </header>
  );
}

/**
 * Footer component for the terminal
 */
export function TerminalFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur border-t border-green-900/50">
      <div className="flex items-center justify-between px-4 py-2 text-xs">
        <div className="text-green-700">
          <span className="text-green-500">&gt;</span> SESSION: portfolio_terminal_v1.0
        </div>
        <div className="flex gap-4 text-green-700">
          <span className="hidden sm:inline">CONNECTION: <span className="text-green-500">SECURE</span></span>
          <span>STATUS: <span className="text-green-400">ONLINE</span></span>
        </div>
      </div>
    </footer>
  );
}

