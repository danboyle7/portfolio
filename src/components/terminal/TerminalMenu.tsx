'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface TerminalMenuProps {
  onClose: () => void;
  onBackToSplash: () => void;
}

export function TerminalMenu({ onClose, onBackToSplash }: TerminalMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current?.focus({ preventScroll: true });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      onClose();
    }
    if (e.key === 'b' || e.key === 'B') {
      e.preventDefault();
      onBackToSplash();
    }
  }, [onClose, onBackToSplash]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={menuRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full max-w-2xl mx-4 bg-black border-2 border-green-500 outline-none font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-green-600">
          <div className="flex items-center gap-3">
            <span className="text-green-500 text-lg">┌─</span>
            <span className="text-green-400 font-bold text-lg tracking-wider">HELP MENU</span>
            <span className="text-green-500 text-lg">─┐</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-green-400 cursor-pointer transition-colors text-sm"
          >
            [esc] close
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-green-500 space-y-5">
          {/* Welcome section */}
          <div className="border border-green-800 p-4 bg-green-950/20">
            <div className="text-green-400 font-bold text-base mb-2">Welcome to the Terminal Portfolio</div>
            <div className="text-green-600 text-sm leading-relaxed">
              This is an interactive terminal experience. You can navigate using commands
              or explore the various sections through the portfolio hub. Type commands just like
              you would in a real terminal!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Computer Controls */}
            <div className="border border-green-900/50 p-4">
              <div className="text-green-400 font-bold mb-3 flex items-center gap-2 text-base">
                <span className="text-green-500">▸</span> Computer Controls
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Power Button (bottom-left of monitor)</span>
                  <span className="text-green-500">CRT on/off</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Zoom Button (bottom-right of monitor)</span>
                  <span className="text-green-500">Zoom in/out</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">[ESC] when zoomed</span>
                  <span className="text-green-500">Zoom out</span>
                </div>
              </div>
            </div>

            {/* Essential Commands */}
            <div className="border border-green-900/50 p-4">
              <div className="text-green-400 font-bold mb-3 flex items-center gap-2 text-base">
                <span className="text-green-500">▸</span> Essential Commands
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-cyan-400 font-mono">help</span>
                  <span className="text-gray-400">Common commands</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-cyan-400 font-mono">portfolio</span>
                  <span className="text-gray-400">Portfolio hub</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-cyan-400 font-mono">clear</span>
                  <span className="text-gray-400">Clear terminal screen</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-cyan-400 font-mono">ls / cat</span>
                  <span className="text-gray-400">Browse files</span>
                </div>
              </div>
            </div>

            {/* Portfolio Sections */}
            <div className="border border-green-900/50 p-4">
              <div className="text-green-400 font-bold mb-3 flex items-center gap-2 text-base">
                <span className="text-green-500">▸</span> Quick Access Commands
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-cyan-400 font-mono">skills</span>
                  <span className="text-gray-400">Skills & proficiencies</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-cyan-400 font-mono">experience</span>
                  <span className="text-gray-400">Work history timeline</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-cyan-400 font-mono">projects</span>
                  <span className="text-gray-400">Featured projects</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-cyan-400 font-mono">contact</span>
                  <span className="text-gray-400">Contact information</span>
                </div>
              </div>
            </div>

            {/* Easter Eggs Hint */}
            <div className="border border-yellow-800/50 bg-yellow-950/20 p-4">
              <div className="text-yellow-500 font-bold mb-2 flex items-center gap-2 text-base">
                <span className="text-yellow-600">★</span> Secret Hints
              </div>
              <div className="text-yellow-600/80 text-sm leading-relaxed">
                Try some classic unix commands for hidden surprises...
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {['fortune', 'cowsay', 'snake', 'matrix', 'sl'].map(cmd => (
                  <span key={cmd} className="text-yellow-700 text-xs px-2 py-0.5 border border-yellow-900/50 bg-yellow-950/30">
                    {cmd}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CRT Toggle */}
          <div className="text-sm text-gray-500 text-center">
            Tip: Type <span className="text-cyan-500 font-mono">crt</span> or <span className="text-cyan-500 font-mono">effects</span> to toggle CRT visual effects
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-green-700 bg-green-950/30 flex justify-between items-center">
          <div className="flex gap-4 text-gray-500 text-sm">
            <span><span className="text-green-600">[h]</span> close</span>
            <span><span className="text-green-600">[esc]</span> close</span>
          </div>
          <button
            onClick={onBackToSplash}
            className="px-4 py-2 border-2 border-green-700 text-green-400 hover:bg-green-900/40 hover:border-green-500 transition-all cursor-pointer font-bold"
          >
            [b] Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

