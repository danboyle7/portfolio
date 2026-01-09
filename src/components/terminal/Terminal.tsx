'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { TerminalLine, TerminalState } from '@/lib/terminal/types';
import { createFileSystem } from '@/lib/terminal/file-system';
import { executeCommand } from '@/lib/terminal/commands';
import { createLine, generateId, resolvePath } from '@/lib/terminal/utils';
import { navigateToPath } from '@/lib/terminal/file-system';
import { initializeContent } from '@/lib/terminal/content-loader';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput, CommandLine } from './TerminalOutput';
import { BootSequence } from './BootSequence';
import { CRTEffect, GlitchEffect } from './CRTEffect';
import { MatrixRain } from './MatrixRain';
import { TerminalHeader } from './TerminalHeader';
import { InteractiveBlog } from './InteractiveBlog';
import type { InteractiveMode } from '@/lib/terminal/types';

// Initialize content on module load
initializeContent();

const HOSTNAME = 'portfolio';
const USER = 'guest';
const HOME_PATH = '/home/guest';

// Grand welcome message with ASCII art
const welcomeLines: TerminalLine[] = [
  createLine('', 'output'),
  createLine('<span class="term-green">  ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ </span>', 'output', { isHtml: true }),
  createLine('<span class="term-green">  ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗</span>', 'output', { isHtml: true }),
  createLine('<span class="term-green">  ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║</span>', 'output', { isHtml: true }),
  createLine('<span class="term-green">  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║</span>', 'output', { isHtml: true }),
  createLine('<span class="term-green">  ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝</span>', 'output', { isHtml: true }),
  createLine('<span class="term-green">  ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ </span>', 'output', { isHtml: true }),
  createLine('', 'output'),
  createLine('<span class="term-cyan">  ┌─────────────────────────────────────────────────────────────────────┐</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  │</span>                                                                     <span class="term-cyan">│</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  │</span>   <span class="term-white font-bold">Welcome to Daniel Boyle\'s Interactive Portfolio Terminal</span>         <span class="term-cyan">│</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  │</span>                                                                     <span class="term-cyan">│</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  │</span>   <span class="term-dim">Full-Stack Developer | Open Source Enthusiast | Problem Solver</span>   <span class="term-cyan">│</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  │</span>                                                                     <span class="term-cyan">│</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  └─────────────────────────────────────────────────────────────────────┘</span>', 'output', { isHtml: true }),
  createLine('', 'output'),
  createLine('<span class="term-dim">  Navigate this terminal like you would any Unix system.</span>', 'output', { isHtml: true }),
  createLine('<span class="term-dim">  Explore the filesystem, run commands, discover easter eggs.</span>', 'output', { isHtml: true }),
  createLine('', 'output'),
  createLine('  <span class="term-yellow">[Quick Start]</span>', 'output', { isHtml: true }),
  createLine('    <span class="term-green">help</span>        <span class="term-dim">-</span> List available commands', 'output', { isHtml: true }),
  createLine('    <span class="term-green">profile</span>     <span class="term-dim">-</span> View my profile and skills', 'output', { isHtml: true }),
  createLine('    <span class="term-green">experience</span>  <span class="term-dim">-</span> See my work history', 'output', { isHtml: true }),
  createLine('    <span class="term-green">projects</span>    <span class="term-dim">-</span> Browse my portfolio', 'output', { isHtml: true }),
  createLine('    <span class="term-green">contact</span>     <span class="term-dim">-</span> Get in touch', 'output', { isHtml: true }),
  createLine('', 'output'),
  createLine('<span class="term-dim">  Hint: Try exploring with</span> <span class="term-green">ls</span><span class="term-dim">,</span> <span class="term-green">cd</span><span class="term-dim">, and</span> <span class="term-green">cat</span> <span class="term-dim">- there might be secrets...</span>', 'output', { isHtml: true }),
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
  const [interactiveMode, setInteractiveMode] = useState<InteractiveMode | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    // Clear history on reboot
    setHistory([]);
    setState((prev) => ({
      ...prev,
      isBooting: false,
      lines: welcomeLines,
      commandHistory: [],
    }));
  }, []);

  const handleCommand = useCallback(
    async (command: string) => {
      const trimmedCommand = command.trim();

      // Always scroll to bottom when Enter is pressed
      scrollToBottom();

      // Empty command - just show a new prompt line
      if (!trimmedCommand) {
        const entry: HistoryEntry = {
          id: generateId(),
          command: '',
          path: state.currentPath,
          output: [],
        };
        setHistory((prev) => [...prev, entry]);
        return;
      }

      // Handle ./command syntax for executables in current directory
      let actualCommand = trimmedCommand;
      if (trimmedCommand.startsWith('./')) {
        const execName = trimmedCommand.slice(2).split(' ')[0];
        const execPath = resolvePath(state.currentPath, execName ?? '');
        const node = navigateToPath(fileSystem, execPath);

        if (node && node.type === 'executable') {
          // Map executable names to commands
          const execMap: Record<string, string> = {
            'send_message': 'message',
            'timeline': 'experience --timeline',
          };
          const mappedCmd = execMap[execName ?? ''];
          if (mappedCmd) {
            actualCommand = mappedCmd;
          }
        }
      }

      // Add to command history (store original command for display)
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

      const result = await executeCommand(actualCommand, context);

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
                commandHistory: [],
              }));
              setHistory([]);
            }, 1500);
            break;
        }
      }

      // Handle animated output
      if (result.animatedOutput && result.animatedOutput.length > 0) {
        // Create initial entry with command shown
        const entryId = generateId();
        const entry: HistoryEntry = {
          id: entryId,
          command: trimmedCommand,
          path: state.currentPath,
          output: [],
        };
        setHistory((prev) => [...prev, entry]);

        // Disable input during animation
        setState((prev) => ({ ...prev, inputEnabled: false }));

        // Animate lines one at a time
        let totalDelay = 0;
        for (const animatedLine of result.animatedOutput) {
          totalDelay += animatedLine.delay;
          setTimeout(() => {
            setHistory((prev) => {
              const newHistory = [...prev];
              const entryIndex = newHistory.findIndex(e => e.id === entryId);
              if (entryIndex !== -1) {
                newHistory[entryIndex] = {
                  ...newHistory[entryIndex]!,
                  output: [...newHistory[entryIndex]!.output, animatedLine.line],
                };
              }
              return newHistory;
            });
            scrollToBottom();
          }, totalDelay);
        }

        // Re-enable input after animation completes
        setTimeout(() => {
          setState((prev) => ({ ...prev, inputEnabled: true }));
          scrollToBottom();
        }, totalDelay + 100);
      } else {
        // Create history entry (show original command, not mapped)
        const entry: HistoryEntry = {
          id: generateId(),
          command: trimmedCommand,
          path: state.currentPath,
          output: result.output,
        };

        setHistory((prev) => [...prev, entry]);
      }

      // Handle clear screen - also clear history
      if (result.clearScreen) {
        setHistory([]);
      }

      // Handle entering interactive mode
      if (result.enterInteractiveMode) {
        setInteractiveMode(result.enterInteractiveMode);
      }

      // Update state
      setState((prev) => {
        const newLines = result.clearScreen ? [] : prev.lines;
        const newPath = result.changeDirectory ?? prev.currentPath;

        return {
          ...prev,
          lines: newLines,
          currentPath: newPath,
          commandHistory: newCommandHistory,
        };
      });
    },
    [state.currentPath, state.commandHistory, fileSystem, scrollToBottom]
  );

  // Handle exiting interactive mode
  const handleExitInteractive = useCallback(() => {
    setInteractiveMode(null);
  }, []);

  // Handle blog post selection
  const handleBlogSelect = useCallback(
    async (slug: string) => {
      setInteractiveMode(null);
      // Execute blog command with slug
      const context = {
        currentPath: state.currentPath,
        fileSystem,
        history: state.commandHistory,
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
      const result = await executeCommand(`blog ${slug}`, context);
      const entry: HistoryEntry = {
        id: generateId(),
        command: `blog ${slug}`,
        path: state.currentPath,
        output: result.output,
      };
      setHistory((prev) => [...prev, entry]);
    },
    [state.currentPath, state.commandHistory, fileSystem]
  );

  // Scroll to bottom on new content
  useEffect(() => {
    scrollToBottom();
  }, [history, state.lines, scrollToBottom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (_e: KeyboardEvent) => {
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
            <div key={entry.id} className="mb-2">
              <CommandLine
                command={entry.command}
                path={entry.path}
                user={USER}
                hostname={HOSTNAME}
              />
              {entry.output.length > 0 && (
                <div className="mt-1">
                  <TerminalOutput lines={entry.output} />
                </div>
              )}
            </div>
          ))}

          {/* Interactive mode components */}
          {interactiveMode?.type === 'blog' && (
            <div className="mt-4 mb-4">
              <InteractiveBlog
                onExit={handleExitInteractive}
                onSelectPost={handleBlogSelect}
              />
            </div>
          )}

          {/* Input line - only show when not in interactive mode */}
          {!interactiveMode && (
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
          )}
        </main>
      </div>
    </>
  );
}
