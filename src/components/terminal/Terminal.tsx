'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { TerminalLine, TerminalState } from '@/lib/terminal/types';
import { createFileSystem } from '@/lib/terminal/file-system';
import { executeCommand } from '@/lib/terminal/commands';
import { createLine, generateId } from '@/lib/terminal/utils';
import { initializeContent } from '@/lib/terminal/content-loader';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput, CommandLine } from './TerminalOutput';
import { BootSequence } from './BootSequence';
import { CRTEffect, GlitchEffect } from './CRTEffect';
import { MatrixRain } from './MatrixRain';
import { TerminalHeader } from './TerminalHeader';

// Initialize content on module load
initializeContent();

const HOSTNAME = 'portfolio';
const USER = 'guest';
const HOME_PATH = '/home/guest';

// Welcome message
const welcomeLines: TerminalLine[] = [
  createLine('', 'output'),
  createLine('╔══════════════════════════════════════════════════════════════╗', 'system'),
  createLine('║                                                              ║', 'system'),
  createLine('║   Welcome to the Portfolio Terminal                          ║', 'system'),
  createLine('║                                                              ║', 'system'),
  createLine('║   Type "help" to see available commands                      ║', 'system'),
  createLine('║   Type "profile" for system/profile info                     ║', 'system'),
  createLine('║                                                              ║', 'system'),
  createLine('╚══════════════════════════════════════════════════════════════╝', 'system'),
  createLine('', 'output'),
];

interface HistoryEntry {
  id: string;
  command: string;
  path: string;
  output: TerminalLine[];
}

export function Terminal() {
  const [isBooting, setIsBooting] = useState(true);
  const [state, setState] = useState<TerminalState>({
    lines: [],
    currentPath: HOME_PATH,
    commandHistory: [],
    historyIndex: -1,
    isBooting: true,
    currentEffect: null,
    inputEnabled: true,
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [fileSystem] = useState(() => createFileSystem());
  const [glitchActive, setGlitchActive] = useState(false);
  const [matrixIntense, setMatrixIntense] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    setState((prev) => ({
      ...prev,
      isBooting: false,
      lines: welcomeLines,
    }));
  }, []);

  const handleCommand = useCallback(
    async (command: string) => {
      const trimmedCommand = command.trim();
      if (!trimmedCommand) return;

      // Add to command history
      const newCommandHistory = [...state.commandHistory, trimmedCommand];

      // Execute command
      const context = {
        currentPath: state.currentPath,
        fileSystem,
        history: newCommandHistory,
        env: {
          USER,
          HOME: HOME_PATH,
          HOSTNAME,
          PATH: '/usr/bin:/bin',
          SHELL: '/bin/zsh',
          PORTFOLIO_VERSION: '1.0.0',
        },
        user: USER,
        hostname: HOSTNAME,
      };

      const result = await executeCommand(trimmedCommand, context);

      // Handle effects
      if (result.triggerEffect) {
        switch (result.triggerEffect) {
          case 'matrix':
            setMatrixIntense(true);
            setTimeout(() => setMatrixIntense(false), 5000);
            break;
          case 'glitch':
          case 'destroy':
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 2000);
            break;
          case 'hacker':
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 500);
            break;
          case 'reboot':
            setTimeout(() => {
              setIsBooting(true);
              setState((prev) => ({
                ...prev,
                lines: [],
                currentPath: HOME_PATH,
              }));
            }, 1500);
            break;
        }
      }

      // Create history entry
      const entry: HistoryEntry = {
        id: generateId(),
        command: trimmedCommand,
        path: state.currentPath,
        output: result.output,
      };

      setHistory((prev) => [...prev, entry]);

      // Update state
      setState((prev) => {
        let newLines = result.clearScreen ? [] : prev.lines;
        const newPath = result.changeDirectory ?? prev.currentPath;

        return {
          ...prev,
          lines: newLines,
          currentPath: newPath,
          commandHistory: newCommandHistory,
        };
      });
    },
    [state.currentPath, state.commandHistory, fileSystem]
  );

  // Scroll to bottom on new content
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, state.lines]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Konami code detection could go here
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isBooting) {
    return (
      <>
        <CRTEffect />
        <MatrixRain opacity={0.03} />
        <BootSequence onComplete={handleBootComplete} />
      </>
    );
  }

  return (
    <>
      <CRTEffect />
      <GlitchEffect active={glitchActive} />
      <MatrixRain opacity={matrixIntense ? 0.15 : 0.03} speed={matrixIntense ? 2 : 1} />

      <div className="min-h-screen bg-black text-green-500 font-mono">
        <TerminalHeader
          hostname={HOSTNAME}
          user={USER}
          currentPath={state.currentPath}
        />

        <main
          ref={terminalRef}
          className="max-w-5xl mx-auto p-4 md:p-6 pb-32 min-h-[calc(100vh-60px)] overflow-y-auto"
        >
          {/* Initial welcome message */}
          <TerminalOutput lines={state.lines} />

          {/* Command history */}
          {history.map((entry) => (
            <div key={entry.id} className="mb-4">
              <CommandLine
                command={entry.command}
                path={entry.path}
                user={USER}
                hostname={HOSTNAME}
              />
              <div className="mt-1">
                <TerminalOutput lines={entry.output} />
              </div>
            </div>
          ))}

          {/* Input line */}
          <div className="mt-2">
            <TerminalInput
              currentPath={state.currentPath}
              hostname={HOSTNAME}
              user={USER}
              onSubmit={handleCommand}
              commandHistory={state.commandHistory}
              fileSystem={fileSystem}
              disabled={!state.inputEnabled}
            />
          </div>
        </main>
      </div>
    </>
  );
}

