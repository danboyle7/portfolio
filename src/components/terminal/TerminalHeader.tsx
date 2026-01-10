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
      {/* Compact single-line header */}
      <div className="flex items-center justify-between px-2 md:px-4 py-1 md:py-1.5 text-xs">
        {/* Left: Window controls + path */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mac-OS style window controls */}
          {/* <div className="flex gap-1">
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500/80" />
          </div> */}
          <span className="text-green-500">&gt;</span>
          <span className="text-green-300 font-bold text-[10px] md:text-xs">PORTFOLIO</span>
          <span className="text-green-600 hidden sm:inline text-[10px] md:text-xs">
            {user}@{hostname}:{displayPath}
          </span>
        </div>

        {/* Right: Time + uptime */}
        <div className="flex items-center gap-2 md:gap-4 text-green-700 text-[10px] md:text-xs">
          <span className="hidden md:inline">
            <span className="text-green-500">{formatUptime(uptime)}</span>
          </span>
          <span className="text-green-400 font-mono">{currentTime}</span>
        </div>
      </div>
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

