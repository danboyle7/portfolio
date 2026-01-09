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
import { SnakeGame } from './SnakeGame';
import { InteractiveEcho } from './InteractiveEcho';
import { InteractivePortfolio } from './InteractivePortfolio';
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
  createLine('<span class="term-cyan">  ┌───────────────────────────────────────────────────────────────────────┐</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  │</span>     <span class="term-white font-bold">Welcome to Daniel Boyle\'s Interactive Portfolio Terminal</span>          <span class="term-cyan">│</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  │</span>     <span class="term-dim">Full-Stack Developer | Open Source Enthusiast | Problem Solver</span>   <span class="term-cyan"> │</span>', 'output', { isHtml: true }),
  createLine('<span class="term-cyan">  └───────────────────────────────────────────────────────────────────────┘</span>', 'output', { isHtml: true }),
  createLine('', 'output'),
  createLine('<span class="term-dim">  Navigate this terminal like you would any Unix system.</span>', 'output', { isHtml: true }),
  createLine('<span class="term-dim">  Explore the filesystem and run commands.</span>', 'output', { isHtml: true }),
  createLine('', 'output'),
  createLine('  <span class="term-yellow">[Quick Start]</span>', 'output', { isHtml: true }),
  createLine('    <span class="term-green">help</span>        <span class="term-dim">-</span> List available commands', 'output', { isHtml: true }),
  createLine('    <span class="term-green">profile</span>     <span class="term-dim">-</span> View my profile', 'output', { isHtml: true }),
  createLine('    <span class="term-green">skills</span>      <span class="term-dim">-</span> See my technical skills', 'output', { isHtml: true }),
  createLine('    <span class="term-green">experience</span>  <span class="term-dim">-</span> Work history', 'output', { isHtml: true }),
  createLine('    <span class="term-green">education</span>   <span class="term-dim">-</span> Education background', 'output', { isHtml: true }),
  createLine('    <span class="term-green">projects</span>    <span class="term-dim">-</span> Browse my portfolio', 'output', { isHtml: true }),
  createLine('    <span class="term-green">blog</span>        <span class="term-dim">-</span> Read my articles', 'output', { isHtml: true }),
  createLine('    <span class="term-green">contact</span>     <span class="term-dim">-</span> Get in touch', 'output', { isHtml: true }),
  createLine('', 'output'),
  createLine('<span class="term-dim">  Hint: Try</span> <span class="term-green">ls</span><span class="term-dim">,</span> <span class="term-green">cd</span><span class="term-dim">, and</span> <span class="term-green">cat</span> <span class="term-dim">to explore - there might be secrets...</span>', 'output', { isHtml: true }),
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
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [env, setEnv] = useState<Record<string, string>>({
    USER,
    HOME: HOME_PATH,
    HOSTNAME,
    PATH: '/usr/bin:/bin',
    SHELL: '/bin/zsh',
    TERM: 'xterm-256color',
    PORTFOLIO_VERSION: '1.0.0',
    '0': 'zsh',
    '?': '0',
    '$': '1337', // Fake PID
  });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputLineRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const lastHistoryLengthRef = useRef(0);

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

      // Handle Ctrl+C - show whatever was typed + ^C and create new prompt
      if (trimmedCommand.endsWith('^C')) {
        const entry: HistoryEntry = {
          id: generateId(),
          command: trimmedCommand, // Shows "sometext^C"
          path: state.currentPath,
          output: [],
        };
        setHistory((prev) => [...prev, entry]);
        return;
      }

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

      // Handle CRT toggle command
      if (trimmedCommand === 'crt' || trimmedCommand === 'effects') {
        const newState = !crtEnabled;
        setCrtEnabled(newState);
        const entry: HistoryEntry = {
          id: generateId(),
          command: trimmedCommand,
          path: state.currentPath,
          output: [
            createLine('', 'output'),
            createLine(
              `<span class="term-cyan">CRT effects ${newState ? '<span class="term-green">enabled</span>' : '<span class="term-red">disabled</span>'}</span>`,
              'output',
              { isHtml: true }
            ),
            createLine('<span class="term-dim">Toggle with: crt | effects</span>', 'output', { isHtml: true }),
            createLine('', 'output'),
          ],
        };
        setHistory((prev) => [...prev, entry]);
        setState((prev) => ({ ...prev, commandHistory: [...prev.commandHistory, trimmedCommand] }));
        return;
      }

      // Map executable names to commands
      const execMap: Record<string, string> = {
        'send_message': 'message',
        'timeline': 'experience --timeline',
        'fortune': 'fortune',
        'snake': 'snake',
        'cowsay': 'cowsay',
      };

      // Handle ./command syntax for executables in current directory
      let actualCommand = trimmedCommand;
      if (trimmedCommand.startsWith('./')) {
        const parts = trimmedCommand.slice(2).split(' ');
        const execName = parts[0];
        const execArgs = parts.slice(1).join(' ');
        const execPath = resolvePath(state.currentPath, execName ?? '');
        const node = navigateToPath(fileSystem, execPath);

        if (node && node.type === 'executable') {
          const mappedCmd = execMap[execName ?? ''];
          if (mappedCmd) {
            actualCommand = execArgs ? `${mappedCmd} ${execArgs}` : mappedCmd;
          }
        }
      } else {
        // Check if command matches an executable in current directory
        const parts = trimmedCommand.split(' ');
        const cmdName = parts[0];
        const cmdArgs = parts.slice(1).join(' ');
        const execPath = resolvePath(state.currentPath, cmdName ?? '');
        const node = navigateToPath(fileSystem, execPath);

        if (node && node.type === 'executable') {
          const mappedCmd = execMap[cmdName ?? ''];
          if (mappedCmd) {
            actualCommand = cmdArgs ? `${mappedCmd} ${cmdArgs}` : mappedCmd;
          }
        }
      }

      // Add to command history (store original command for display)
      const newCommandHistory = [...state.commandHistory, trimmedCommand];

      // Check for variable assignment (VAR=value or export VAR=value)
      const exportMatch = actualCommand.match(/^export\s+(\w+)=(.*)$/);
      const assignMatch = actualCommand.match(/^(\w+)=(.*)$/);

      if (exportMatch || assignMatch) {
        const [, varName, varValue] = (exportMatch || assignMatch)!;
        setEnv(prev => ({ ...prev, [varName!]: varValue ?? '' }));
        const entry: HistoryEntry = {
          id: generateId(),
          command: trimmedCommand,
          path: state.currentPath,
          output: [],
        };
        setHistory((prev) => [...prev, entry]);
        setState((prev) => ({
          ...prev,
          commandHistory: newCommandHistory,
        }));
        return;
      }

      // Check for unset command
      const unsetMatch = actualCommand.match(/^unset\s+(\w+)$/);
      if (unsetMatch) {
        const [, varName] = unsetMatch;
        setEnv(prev => {
          const newEnv = { ...prev };
          delete newEnv[varName!];
          return newEnv;
        });
        const entry: HistoryEntry = {
          id: generateId(),
          command: trimmedCommand,
          path: state.currentPath,
          output: [],
        };
        setHistory((prev) => [...prev, entry]);
        setState((prev) => ({
          ...prev,
          commandHistory: newCommandHistory,
        }));
        return;
      }

      // Execute command
      const context = {
        currentPath: state.currentPath,
        fileSystem,
        history: newCommandHistory,
        env,
        user: USER,
        hostname: HOSTNAME,
      };

      const result = await executeCommand(actualCommand, context);

      // Update $? based on command result (0 for success, 1 for error)
      const exitCode = result.output.some(line => line.type === 'error') ? '1' : '0';
      setEnv(prev => ({ ...prev, '?': exitCode }));

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
          }, totalDelay);
        }

        // Re-enable input after animation completes
        setTimeout(() => {
          setState((prev) => ({ ...prev, inputEnabled: true }));
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
    [state.currentPath, state.commandHistory, fileSystem, env]
  );

  // Handle exiting interactive mode
  const handleExitInteractive = useCallback(() => {
    setInteractiveMode(null);
  }, []);

  // Handle snake game over
  const handleSnakeGameOver = useCallback((score: number) => {
    const entry: HistoryEntry = {
      id: generateId(),
      command: '',
      path: state.currentPath,
      output: [
        createLine('', 'output'),
        createLine(`<span class="term-yellow">Game Over! Final Score: ${score}</span>`, 'output', { isHtml: true }),
        createLine('', 'output'),
      ],
    };
    setHistory((prev) => [...prev, entry]);
  }, [state.currentPath]);

  // Handle blog post selection
  const handleBlogSelect = useCallback(
    async (slug: string) => {
      setInteractiveMode(null);
      // Execute blog command with slug
      const context = {
        currentPath: state.currentPath,
        fileSystem,
        history: state.commandHistory,
        env,
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
    [state.currentPath, state.commandHistory, fileSystem, env]
  );

  // Scroll input into view when NEW history entries are added
  useEffect(() => {
    // Only scroll if history grew (new command was added by user)
    if (history.length > lastHistoryLengthRef.current) {
      // Use setTimeout to ensure DOM has fully updated after React render
      const timer = setTimeout(() => {
        if (!scrollAnchorRef.current || !terminalRef.current) return;

        const anchor = scrollAnchorRef.current;
        const container = terminalRef.current;

        // Check if container is scrollable at all
        const isScrollable = container.scrollHeight > container.clientHeight;
        if (!isScrollable) {
          // Not scrollable = all content fits on screen, nothing to do
          return;
        }

        const anchorRect = anchor.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Check if anchor is below visible area - need to scroll
        if (anchorRect.bottom > containerRect.bottom) {
          const scrollNeeded = anchorRect.bottom - containerRect.bottom + 8;
          container.scrollTop += scrollNeeded;
        }
      }, 16);

      lastHistoryLengthRef.current = history.length;
      return () => clearTimeout(timer);
    }

    lastHistoryLengthRef.current = history.length;
  }, [history.length]);

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
        {crtEnabled && <CRTEffect />}
        {crtEnabled && <MatrixRain opacity={0.03} />}
        <BootSequence onComplete={handleBootComplete} />
      </>
    );
  }

  return (
    <>
      {crtEnabled && <CRTEffect />}
      {crtEnabled && <GlitchEffect active={glitchActive} />}
      {crtEnabled && <MatrixRain opacity={matrixIntense ? 0.15 : 0.03} speed={matrixIntense ? 2 : 1} />}

      <div className="min-h-screen bg-black text-green-500 font-mono">
        <TerminalHeader
          hostname={HOSTNAME}
          user={USER}
          currentPath={state.currentPath}
        />

        <main
          ref={terminalRef}
          className={`mx-auto p-4 md:p-6 h-[calc(100vh-60px)] overflow-y-auto ${
            interactiveMode?.type === 'snake' ? 'max-w-none px-2' : 'max-w-5xl'
          }`}
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

          {interactiveMode?.type === 'snake' && (
            <div className="mt-4 mb-4 flex justify-center">
              <SnakeGame
                onExit={handleExitInteractive}
                onGameOver={handleSnakeGameOver}
              />
            </div>
          )}

          {interactiveMode?.type === 'echo' && (
            <div className="mt-4 mb-4">
              <InteractiveEcho
                onExit={handleExitInteractive}
              />
            </div>
          )}

          {interactiveMode?.type === 'portfolio' && interactiveMode.section && (
            <div className="fixed inset-0 z-50 bg-black">
              <InteractivePortfolio
                section={interactiveMode.section}
                onExit={handleExitInteractive}
              />
            </div>
          )}

          {/* Input line - only show when not in interactive mode */}
          {!interactiveMode && (
            <div ref={inputLineRef} className="mt-2">
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

          {/* Scroll anchor - this is what we scroll to, positioned just below input with small gap */}
          <div ref={scrollAnchorRef} className="h-4" aria-hidden="true" />
        </main>
      </div>
    </>
  );
}
