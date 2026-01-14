"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import type { TerminalLine, TerminalState } from "@/lib/terminal/types";
import { createFileSystem } from "@/lib/terminal/file-system";
import { executeCommand } from "@/lib/terminal/commands";
import { createLine, generateId, resolvePath } from "@/lib/terminal/utils";
import { navigateToPath } from "@/lib/terminal/file-system";
import { initializeContent } from "@/lib/terminal/content-loader";
import { TerminalInput } from "./TerminalInput";
import { TerminalOutput, CommandLine } from "./TerminalOutput";
import { BootSequence } from "./BootSequence";
import { CRTEffect, GlitchEffect } from "./CRTEffect";
import { MatrixRain } from "./MatrixRain";
import { TerminalHeader } from "./TerminalHeader";
import { InteractiveBlog } from "./InteractiveBlog";
import { SnakeGame } from "./SnakeGame";
import { InteractiveEcho } from "./InteractiveEcho";
import { InteractivePortfolio } from "./InteractivePortfolio";
import { PortfolioHub } from "./PortfolioHub";
import { WelcomeMessage } from "./WelcomeMessage";
import { ComputerBackground } from "./ComputerBackground";
import { ContactApp } from "./ContactApp";
import { SkillsSection } from "./SkillsSection";
import { EducationSection } from "./EducationSection";
import { HobbiesSection } from "./HobbiesSection";
import { TerminalMenu } from "./TerminalMenu";
import { useZoom } from "./ZoomContext";
import { VERSION } from "@/lib/version";
import type { InteractiveMode } from "@/lib/terminal/types";

// Initialize content on module load
initializeContent();

const HOSTNAME = "portfolio";
const USER = "guest";
const HOME_PATH = "/home/guest";

interface TerminalProps {
  onBackToSplash?: () => void;
}

interface HistoryEntry {
  id: string;
  command: string;
  path: string;
  output: TerminalLine[];
}

// Track if boot has completed this session (persists across mobile/desktop switches)
const hasBootedRef = { current: false };

export function Terminal({ onBackToSplash }: TerminalProps) {
  const { zoomScale } = useZoom();
  const [isBooting, setIsBooting] = useState(() => !hasBootedRef.current);
  const [showMenu, setShowMenu] = useState(false);
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
  const [interactiveMode, setInteractiveMode] =
    useState<InteractiveMode | null>(null);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [env, setEnv] = useState<Record<string, string>>({
    USER,
    HOME: HOME_PATH,
    HOSTNAME,
    PATH: "/usr/bin:/bin",
    SHELL: "/bin/zsh",
    TERM: "xterm-256color",
    PORTFOLIO_VERSION: VERSION,
    "0": "zsh",
    "?": "0",
    $: "1337", // Fake PID
  });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputLineRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const lastHistoryLengthRef = useRef(0);
  const zoomScaleRef = useRef(zoomScale);

  // Keep ref in sync with context value
  useEffect(() => {
    zoomScaleRef.current = zoomScale;
  }, [zoomScale]);

  const handleBootComplete = useCallback(() => {
    hasBootedRef.current = true;
    setIsBooting(false);
    // Clear history on reboot
    setHistory([]);
    setState((prev) => ({
      ...prev,
      isBooting: false,
      lines: [],
      commandHistory: [],
    }));
  }, []);

  const handleCommand = useCallback(
    async (command: string) => {
      const trimmedCommand = command.trim();

      // Handle Ctrl+C - show whatever was typed + ^C and create new prompt
      if (trimmedCommand.endsWith("^C")) {
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
          command: "",
          path: state.currentPath,
          output: [],
        };
        setHistory((prev) => [...prev, entry]);
        return;
      }

      // Handle CRT toggle command
      if (trimmedCommand === "crt" || trimmedCommand === "effects") {
        const newState = !crtEnabled;
        setCrtEnabled(newState);
        const entry: HistoryEntry = {
          id: generateId(),
          command: trimmedCommand,
          path: state.currentPath,
          output: [
            createLine("", "output"),
            createLine(
              `<span class="term-cyan">CRT effects ${newState ? '<span class="term-green">enabled</span>' : '<span class="term-red">disabled</span>'}</span>`,
              "output",
              { isHtml: true },
            ),
            createLine(
              '<span class="term-dim">Toggle with: crt | effects</span>',
              "output",
              { isHtml: true },
            ),
            createLine("", "output"),
          ],
        };
        setHistory((prev) => [...prev, entry]);
        setState((prev) => ({
          ...prev,
          commandHistory: [...prev.commandHistory, trimmedCommand],
        }));
        return;
      }

      // Map executable names to commands
      const execMap: Record<string, string> = {
        send_message: "message",
        timeline: "experience --timeline",
        fortune: "fortune",
        snake: "snake",
        cowsay: "cowsay",
      };

      // Handle ./command syntax for executables in current directory
      let actualCommand = trimmedCommand;
      if (trimmedCommand.startsWith("./")) {
        const parts = trimmedCommand.slice(2).split(" ");
        const execName = parts[0];
        const execArgs = parts.slice(1).join(" ");
        const execPath = resolvePath(state.currentPath, execName ?? "");
        const node = navigateToPath(fileSystem, execPath);

        if (node?.type === "executable") {
          const mappedCmd = execMap[execName ?? ""];
          if (mappedCmd) {
            actualCommand = execArgs ? `${mappedCmd} ${execArgs}` : mappedCmd;
          }
        }
      } else {
        // Check if command matches an executable in current directory
        const parts = trimmedCommand.split(" ");
        const cmdName = parts[0];
        const cmdArgs = parts.slice(1).join(" ");
        const execPath = resolvePath(state.currentPath, cmdName ?? "");
        const node = navigateToPath(fileSystem, execPath);

        if (node?.type === "executable") {
          const mappedCmd = execMap[cmdName ?? ""];
          if (mappedCmd) {
            actualCommand = cmdArgs ? `${mappedCmd} ${cmdArgs}` : mappedCmd;
          }
        }
      }

      // Add to command history (store original command for display)
      const newCommandHistory = [...state.commandHistory, trimmedCommand];

      // Check for variable assignment (VAR=value or export VAR=value)
      const exportMatch = /^export\s+(\w+)=(.*)$/.exec(actualCommand);
      const assignMatch = /^(\w+)=(.*)$/.exec(actualCommand);

      if (exportMatch ?? assignMatch) {
        const [, varName, varValue] = (exportMatch ?? assignMatch)!;
        setEnv((prev) => ({ ...prev, [varName!]: varValue ?? "" }));
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
      const unsetMatch = /^unset\s+(\w+)$/.exec(actualCommand);
      if (unsetMatch) {
        const [, varName] = unsetMatch;
        setEnv((prev) => {
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
      const exitCode = result.output.some((line) => line.type === "error")
        ? "1"
        : "0";
      setEnv((prev) => ({ ...prev, "?": exitCode }));

      // Handle effects
      if (result.triggerEffect) {
        switch (result.triggerEffect) {
          case "matrix":
            setMatrixIntense(true);
            setTimeout(() => setMatrixIntense(false), 5000);
            break;
          case "glitch":
          case "destroy":
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 2000);
            break;
          case "hacker":
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 500);
            break;
          case "reboot":
            setTimeout(() => {
              hasBootedRef.current = false; // Reset boot state for reboot
              setIsBooting(true);
              setShowWelcome(true); // Show welcome message again after reboot
              setState((prev) => ({
                ...prev,
                lines: [],
                currentPath: HOME_PATH,
                commandHistory: [],
              }));
              setHistory([]);
            }, 1500);
            break;
          case "exit":
            // Go back to main menu instead of rebooting
            setTimeout(() => {
              onBackToSplash?.();
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
              const entryIndex = newHistory.findIndex((e) => e.id === entryId);
              if (entryIndex !== -1) {
                newHistory[entryIndex] = {
                  ...newHistory[entryIndex]!,
                  output: [
                    ...newHistory[entryIndex]!.output,
                    animatedLine.line,
                  ],
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

      // Handle clear screen - also clear history and hide welcome
      if (result.clearScreen) {
        setHistory([]);
        setShowWelcome(false);
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
    [state.currentPath, state.commandHistory, fileSystem, env, crtEnabled, onBackToSplash],
  );

  // Handle exiting interactive mode
  const handleExitInteractive = useCallback(() => {
    setInteractiveMode(null);
  }, []);

  // Handle snake game over
  const handleSnakeGameOver = useCallback(
    (score: number) => {
      const entry: HistoryEntry = {
        id: generateId(),
        command: "",
        path: state.currentPath,
        output: [
          createLine("", "output"),
          createLine(
            `<span class="term-yellow">Game Over! Final Score: ${score}</span>`,
            "output",
            { isHtml: true },
          ),
          createLine("", "output"),
        ],
      };
      setHistory((prev) => [...prev, entry]);
    },
    [state.currentPath],
  );

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
    [state.currentPath, state.commandHistory, fileSystem, env],
  );

  // Scroll input into view when NEW history entries are added
  useEffect(() => {
    // Only scroll if history grew (new command was added by user)
    if (history.length > lastHistoryLengthRef.current) {
      lastHistoryLengthRef.current = history.length;

      // Skip ALL scrolling when zoomed - prevents transform container shift
      const currentZoomScale = zoomScaleRef.current;
      if (currentZoomScale > 1) {
        return;
      }

      // Use setTimeout to ensure DOM has fully updated after React render
      const timer = setTimeout(() => {
        if (!scrollAnchorRef.current || !terminalRef.current) return;

        const anchor = scrollAnchorRef.current;
        const container = terminalRef.current;

        // Check if container is scrollable at all
        const isScrollable = container.scrollHeight > container.clientHeight;
        if (!isScrollable) {
          return;
        }

        const anchorRect = anchor.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (anchorRect.bottom > containerRect.bottom) {
          const scrollNeeded = anchorRect.bottom - containerRect.bottom + 8;
          container.scrollTop += scrollNeeded;
        }
      }, 16);

      return () => clearTimeout(timer);
    }

    lastHistoryLengthRef.current = history.length;
  }, [history.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open menu with 'h' key when not in interactive mode and not typing
      if ((e.key === "h" || e.key === "H") && e.ctrlKey) {
        e.preventDefault();
        setShowMenu((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isBooting) {
    return (
      <>
        <ComputerBackground>
          <div className="relative h-full w-full overflow-hidden">
            {crtEnabled && <CRTEffect />}
            {crtEnabled && <MatrixRain opacity={0.03} />}
            <BootSequence onComplete={handleBootComplete} />
          </div>
        </ComputerBackground>

        {/* Back button - OUTSIDE computer, visible during boot */}
        <button
          onClick={() => onBackToSplash?.()}
          className="fixed top-4 left-4 z-200 hidden cursor-pointer border-2 border-green-700 bg-black/90 px-4 py-2 font-mono text-sm text-green-500 shadow-lg shadow-green-900/30 transition-all hover:border-green-500 hover:bg-black hover:text-green-400 hover:shadow-green-500/20 sm:block"
          title="Back to Main Menu"
        >
          ← Back
        </button>

        {/* Help button - OUTSIDE computer, visible during boot */}
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="fixed top-4 right-4 z-200 hidden cursor-pointer border-2 border-green-700 bg-black/90 px-4 py-2 font-mono text-sm text-green-500 shadow-lg shadow-green-900/30 transition-all hover:border-green-500 hover:bg-black hover:text-green-400 hover:shadow-green-500/20 sm:block"
          title="Help Menu (Ctrl+H)"
        >
          Help
        </button>

        {/* Help Menu overlay during boot */}
        {showMenu && (
          <TerminalMenu
            onClose={() => setShowMenu(false)}
            onBackToSplash={() => {
              setShowMenu(false);
              onBackToSplash?.();
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <ComputerBackground>
        {/* Main terminal container - flex column to allow scrollable content */}
        <div className="terminal-text relative flex h-full w-full flex-col bg-black font-mono text-green-500">
          {/* CRT effects layer - absolute positioned, doesn't affect layout */}
          {crtEnabled && <CRTEffect />}
          {crtEnabled && <GlitchEffect active={glitchActive} />}
          {crtEnabled && (
            <MatrixRain
              opacity={matrixIntense ? 0.15 : 0.03}
              speed={matrixIntense ? 2 : 1}
            />
          )}

          <TerminalHeader
            hostname={HOSTNAME}
            user={USER}
            currentPath={state.currentPath}
          />

          <main
            ref={terminalRef}
            className="terminal-scrollbar relative flex-1 overflow-y-auto px-2 py-1 md:px-4 md:py-2"
          >
            {/* Initial welcome message - responsive (hidden after clear) */}
            {showWelcome && <WelcomeMessage />}

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
                  <TerminalOutput lines={entry.output} />
                )}
              </div>
            ))}

            {/* Interactive mode components */}
            {interactiveMode?.type === "blog" && (
              <div className="mt-4 mb-4">
                <InteractiveBlog
                  onExit={handleExitInteractive}
                  onSelectPost={handleBlogSelect}
                />
              </div>
            )}

            {interactiveMode?.type === "snake" && (
              <div className="absolute inset-0 z-50">
                <SnakeGame
                  onExit={handleExitInteractive}
                  onGameOver={handleSnakeGameOver}
                />
              </div>
            )}

            {interactiveMode?.type === "echo" && (
              <div className="mt-4 mb-4">
                <InteractiveEcho onExit={handleExitInteractive} />
              </div>
            )}

            {interactiveMode?.type === "hub" && (
              <div className="fixed inset-0 z-50 bg-black">
                <PortfolioHub
                  onSelect={(section) =>
                    setInteractiveMode({ type: "portfolio", section })
                  }
                  onExit={handleExitInteractive}
                />
              </div>
            )}

            {/* Section-specific portfolio views */}
            {interactiveMode?.type === "portfolio" &&
              interactiveMode.section === "experience" && (
                <div className="fixed inset-0 z-50 bg-black">
                  <InteractivePortfolio
                    section="experience"
                    onExit={handleExitInteractive}
                    onBack={() => setInteractiveMode({ type: "hub" })}
                  />
                </div>
              )}

            {interactiveMode?.type === "portfolio" &&
              interactiveMode.section === "skills" && (
                <div className="fixed inset-0 z-50 bg-black">
                  <SkillsSection
                    onExit={handleExitInteractive}
                    onBack={() => setInteractiveMode({ type: "hub" })}
                  />
                </div>
              )}

            {interactiveMode?.type === "portfolio" &&
              interactiveMode.section === "education" && (
                <div className="fixed inset-0 z-50 bg-black">
                  <EducationSection
                    onExit={handleExitInteractive}
                    onBack={() => setInteractiveMode({ type: "hub" })}
                  />
                </div>
              )}

            {interactiveMode?.type === "portfolio" &&
              interactiveMode.section === "projects" && (
                <div className="fixed inset-0 z-50 bg-black">
                  <InteractivePortfolio
                    section="projects"
                    onExit={handleExitInteractive}
                    onBack={() => setInteractiveMode({ type: "hub" })}
                  />
                </div>
              )}

            {interactiveMode?.type === "portfolio" &&
              interactiveMode.section === "hobbies" && (
                <div className="fixed inset-0 z-50 bg-black">
                  <HobbiesSection
                    onExit={handleExitInteractive}
                    onBack={() => setInteractiveMode({ type: "hub" })}
                  />
                </div>
              )}

            {interactiveMode?.type === "contact" && (
              <ContactApp onClose={handleExitInteractive} />
            )}

            {/* Input line - only show when not in interactive mode */}
            {!interactiveMode && (
              <div ref={inputLineRef}>
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
      </ComputerBackground>

      {/* Back button - OUTSIDE computer, fixed to browser window, hidden on mobile */}
      <button
        onClick={() => onBackToSplash?.()}
        className="fixed top-4 left-4 z-200 hidden cursor-pointer border-2 border-green-700 bg-black/90 px-4 py-2 font-mono text-sm text-green-500 shadow-lg shadow-green-900/30 transition-all hover:border-green-500 hover:bg-black hover:text-green-400 hover:shadow-green-500/20 sm:block"
        title="Back to Main Menu"
      >
        ← Back
      </button>

      {/* Menu button - OUTSIDE computer, fixed to browser window, hidden on mobile */}
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="fixed top-4 right-4 z-200 hidden cursor-pointer border-2 border-green-700 bg-black/90 px-4 py-2 font-mono text-sm text-green-500 shadow-lg shadow-green-900/30 transition-all hover:border-green-500 hover:bg-black hover:text-green-400 hover:shadow-green-500/20 sm:block"
        title="Help Menu (Ctrl+H)"
      >
        Help
      </button>

      {/* Help Menu overlay - OUTSIDE computer, covers entire browser window */}
      {showMenu && (
        <TerminalMenu
          onClose={() => setShowMenu(false)}
          onBackToSplash={() => {
            setShowMenu(false);
            onBackToSplash?.();
          }}
        />
      )}
    </>
  );
}
