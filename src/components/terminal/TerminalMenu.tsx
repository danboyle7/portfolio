"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface TerminalMenuProps {
  onClose: () => void;
  onBackToSplash: () => void;
}

export function TerminalMenu({ onClose, onBackToSplash }: TerminalMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current?.focus({ preventScroll: true });
  }, []);

  // Global keyboard listener for ESC (works even when not focused)
  // Use capture phase to handle before other listeners (like zoom)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "h" || e.key === "H") {
        e.preventDefault();
        e.stopPropagation(); // Prevent zoom from also handling ESC
        onClose();
      }
      if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        e.stopPropagation();
        onBackToSplash();
      }
    };

    // Use capture phase (true) to handle before bubble phase listeners
    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () =>
      window.removeEventListener("keydown", handleGlobalKeyDown, true);
  }, [onClose, onBackToSplash]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "h" || e.key === "H") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        onBackToSplash();
      }
    },
    [onClose, onBackToSplash],
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Only close if clicking the backdrop itself, not the modal content
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={menuRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="terminal-scrollbar mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-green-500 bg-black font-mono outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-green-600 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg text-green-500">┌─</span>
            <span className="text-lg font-bold tracking-wider text-green-400">
              HELP MENU
            </span>
            <span className="text-lg text-green-500">─┐</span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-sm text-gray-400 transition-colors hover:text-green-400"
          >
            [esc] close
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 p-6 text-green-500">
          {/* Welcome section */}
          <div className="border border-green-800 bg-green-950/20 p-4">
            <div className="mb-2 text-base font-bold text-green-400">
              Welcome to the Terminal Portfolio
            </div>
            <div className="text-sm leading-relaxed text-green-600">
              This is an interactive terminal experience. You can navigate using
              commands or explore the various sections through the portfolio
              hub. Type commands just like you would in a real terminal!
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Computer Controls */}
            <div className="border border-green-900/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-base font-bold text-green-400">
                <span className="text-green-500">▸</span> Computer Controls
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">
                    Power Button (bottom-left of monitor)
                  </span>
                  <span className="text-green-500">CRT on/off</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">
                    Zoom Button (bottom-right of monitor)
                  </span>
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
              <div className="mb-3 flex items-center gap-2 text-base font-bold text-green-400">
                <span className="text-green-500">▸</span> Essential Commands
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="font-mono text-cyan-400">help</span>
                  <span className="text-gray-400">List common commands</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-mono text-cyan-400">portfolio</span>
                  <span className="text-gray-400">Portfolio hub</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-mono text-cyan-400">clear</span>
                  <span className="text-gray-400">Clear terminal screen</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-mono text-cyan-400">ls / cd / cat</span>
                  <span className="text-gray-400">Browse files</span>
                </div>
              </div>
              <div className="mt-3 border-t border-green-900/30 pt-3 text-xs text-gray-500">
                <span className="text-green-600">[Tab]</span> Auto-complete
                commands & paths
              </div>
            </div>

            {/* Portfolio Sections */}
            <div className="border border-green-900/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-base font-bold text-green-400">
                <span className="text-green-500">▸</span> Quick Access Commands
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="font-mono text-cyan-400">skills</span>
                  <span className="text-gray-400">Skills & proficiencies</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-mono text-cyan-400">experience</span>
                  <span className="text-gray-400">Work history timeline</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-mono text-cyan-400">projects</span>
                  <span className="text-gray-400">Featured projects</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="font-mono text-cyan-400">contact</span>
                  <span className="text-gray-400">Contact information</span>
                </div>
              </div>
            </div>

            {/* Easter Eggs Hint */}
            <div className="border border-yellow-800/50 bg-yellow-950/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-base font-bold text-yellow-500">
                <span className="text-yellow-600">★</span> Secret Hints
              </div>
              <div className="text-sm leading-relaxed text-yellow-600/80">
                Try some classic unix commands for hidden surprises...
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["fortune", "cowsay", "snake", "matrix", "sl"].map((cmd) => (
                  <span
                    key={cmd}
                    className="border border-yellow-900/50 bg-yellow-950/30 px-2 py-0.5 text-xs text-yellow-700"
                  >
                    {cmd}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CRT Toggle */}
          <div className="text-center text-sm text-gray-500">
            Tip: Type <span className="font-mono text-cyan-500">crt</span> or{" "}
            <span className="font-mono text-cyan-500">effects</span> to toggle
            CRT visual effects
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-green-700 bg-green-950/30 px-4 py-3">
          <div className="flex gap-4 text-sm text-gray-500">
            <span>
              <span className="text-green-600">[esc]</span> close
            </span>
          </div>
          <button
            onClick={onBackToSplash}
            className="cursor-pointer border-2 border-green-700 px-4 py-2 font-bold text-green-400 transition-all hover:border-green-500 hover:bg-green-900/40"
          >
            [b] Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
