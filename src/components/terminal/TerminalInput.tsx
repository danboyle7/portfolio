"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { formatPath, resolvePath } from "@/lib/terminal/utils";
import { getCommandSuggestions } from "@/lib/terminal/commands";
import { listDirectory } from "@/lib/terminal/file-system";
import type { FileSystemNode } from "@/lib/terminal/types";

interface TerminalInputProps {
  currentPath: string;
  hostname: string;
  user: string;
  onSubmit: (command: string) => void;
  commandHistory: string[];
  fileSystem: FileSystemNode;
  disabled?: boolean;
}

export function TerminalInput({
  currentPath,
  hostname,
  user,
  onSubmit,
  commandHistory,
  fileSystem,
  disabled = false,
}: TerminalInputProps) {
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayPath = formatPath(currentPath);

  // Focus input on mount and when clicked anywhere
  useEffect(() => {
    const focusInput = () => {
      if (!disabled && inputRef.current) {
        // preventScroll: true prevents browser from scrolling transformed containers
        inputRef.current.focus({ preventScroll: true });
        // Move cursor to end of input
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    };

    focusInput();
    window.addEventListener("click", focusInput);

    return () => window.removeEventListener("click", focusInput);
  }, [disabled]);

  // Re-focus when input value changes (for backspace to work properly)
  useEffect(() => {
    if (
      !disabled &&
      inputRef.current &&
      document.activeElement !== inputRef.current
    ) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [input, disabled]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!disabled) {
        // Submit even if empty (for new line behavior)
        onSubmit(input);
        setInput("");
        setHistoryIndex(-1);
        setSavedInput("");
      }
    },
    [input, disabled, onSubmit],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // History navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        if (historyIndex === -1) {
          setSavedInput(input);
        }

        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] ?? "");
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex <= 0) {
          setHistoryIndex(-1);
          setInput(savedInput);
          return;
        }

        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] ?? "");
      }

      // Tab completion
      if (e.key === "Tab") {
        e.preventDefault();
        const parts = input.split(" ");
        const lastPart = parts[parts.length - 1] ?? "";

        if (
          parts.length === 1 &&
          !lastPart.includes("/") &&
          !lastPart.startsWith(".")
        ) {
          // Command completion
          const suggestions = getCommandSuggestions(lastPart);
          if (suggestions.length === 1) {
            setInput(suggestions[0]! + " ");
          } else if (suggestions.length > 1) {
            const commonPrefix = findCommonPrefix(suggestions);
            if (commonPrefix.length > lastPart.length) {
              setInput(commonPrefix);
            }
          }
        } else {
          // Path completion
          const pathToComplete = lastPart;
          const basePath = pathToComplete.includes("/")
            ? pathToComplete.substring(0, pathToComplete.lastIndexOf("/") + 1)
            : "";
          const partial = pathToComplete.includes("/")
            ? pathToComplete.substring(pathToComplete.lastIndexOf("/") + 1)
            : pathToComplete.replace("./", "");

          const searchPath = resolvePath(currentPath, basePath || ".");
          const entries = listDirectory(fileSystem, searchPath);

          if (entries) {
            const matches = entries
              .filter((e) =>
                e.name.toLowerCase().startsWith(partial.toLowerCase()),
              )
              .map((e) => (e.type === "directory" ? e.name + "/" : e.name));

            if (matches.length === 1) {
              const prefix = parts.slice(0, -1).join(" ");
              const newPath = basePath + matches[0];
              setInput(prefix ? prefix + " " + newPath : newPath);
            } else if (matches.length > 1) {
              const commonPrefix = findCommonPrefix(matches);
              if (commonPrefix.length > partial.length) {
                const prefix = parts.slice(0, -1).join(" ");
                const newPath = basePath + commonPrefix;
                setInput(prefix ? prefix + " " + newPath : newPath);
              }
            }
          }
        }
      }

      // Clear line with Ctrl+U
      if (e.key === "u" && e.ctrlKey) {
        e.preventDefault();
        setInput("");
      }

      // Clear screen with Ctrl+L
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        onSubmit("clear");
        setInput("");
      }

      // Cancel current line with Ctrl+C or Cmd+C
      if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Submit current text + ^C indicator, then clear
        const cancelledLine = input + "^C";
        setInput("");
        setHistoryIndex(-1);
        setSavedInput("");
        onSubmit(cancelledLine);
      }
    },
    [
      input,
      commandHistory,
      historyIndex,
      savedInput,
      onSubmit,
      currentPath,
      fileSystem,
    ],
  );

  return (
    <form onSubmit={handleSubmit} className="outline-none" tabIndex={-1}>
      {/* Text that wraps to the left edge */}
      <div className="break-all">
        <span className="font-bold text-green-400">
          {user}@{hostname}
        </span>
        <span className="text-green-600">:</span>
        <span className="font-bold text-blue-400">{displayPath}</span>
        <span className="text-green-600">$ </span>
        <span className="text-green-300">{input}</span>
        <span className="relative">
          <span className="animate-blink absolute top-0 left-0 h-[1.1em] w-[0.6em] bg-green-400" />
        </span>
      </div>
      {/* Hidden input for capturing keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="terminal-input absolute inset-0 h-full w-full cursor-text border-none opacity-0 outline-none focus:border-none focus:ring-0 focus:outline-none"
        style={{
          WebkitAppearance: "none",
          boxShadow: "none",
        }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </form>
  );
}

function findCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  if (strings.length === 1) return strings[0]!;

  let prefix = strings[0]!;
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i]!.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}
