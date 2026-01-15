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
  const [cursorPos, setCursorPos] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedInput, setSavedInput] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultIndex, setSearchResultIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayPath = formatPath(currentPath);

  // Search history for matching entries (reverse search)
  const searchHistory = useCallback(
    (query: string, startIndex = -1): { result: string; index: number } => {
      if (!query || commandHistory.length === 0) {
        return { result: "", index: -1 };
      }
      // Search from the end of history (most recent first)
      // startIndex is used to continue searching from a specific position
      const searchFrom =
        startIndex === -1 ? commandHistory.length - 1 : startIndex;
      for (let i = searchFrom; i >= 0; i--) {
        const historyItem = commandHistory[i];
        if (historyItem?.toLowerCase().includes(query.toLowerCase())) {
          return { result: historyItem, index: i };
        }
      }
      return { result: "", index: -1 };
    },
    [commandHistory],
  );

  // Focus input on mount and when clicked anywhere
  useEffect(() => {
    const focusInput = () => {
      if (!disabled && inputRef.current) {
        // preventScroll: true prevents browser from scrolling transformed containers
        inputRef.current.focus({ preventScroll: true });
        // Move cursor to end of input
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
        setCursorPos(len);
      }
    };

    focusInput();
    window.addEventListener("click", focusInput);

    return () => window.removeEventListener("click", focusInput);
  }, [disabled]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!disabled) {
        // Exit search mode if active and submit the found command
        if (searchMode) {
          setSearchMode(false);
          setSearchQuery("");
          setSearchResultIndex(-1);
        }
        // Submit even if empty (for new line behavior)
        onSubmit(input);
        setInput("");
        setCursorPos(0);
        setHistoryIndex(-1);
        setSavedInput("");
      }
    },
    [input, disabled, onSubmit, searchMode],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Exit search mode with Escape
      if (e.key === "Escape" && searchMode) {
        e.preventDefault();
        setSearchMode(false);
        setSearchQuery("");
        setSearchResultIndex(-1);
        // Restore the original input before search started
        setInput(savedInput);
        setCursorPos(savedInput.length);
        return;
      }

      // History navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        if (historyIndex === -1) {
          setSavedInput(input);
        }

        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        const newInput =
          commandHistory[commandHistory.length - 1 - newIndex] ?? "";
        setInput(newInput);
        setCursorPos(newInput.length);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex <= 0) {
          setHistoryIndex(-1);
          setInput(savedInput);
          setCursorPos(savedInput.length);
          return;
        }

        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const newInput =
          commandHistory[commandHistory.length - 1 - newIndex] ?? "";
        setInput(newInput);
        setCursorPos(newInput.length);
      }

      // Tab completion (or cycle through search results in search mode)
      if (e.key === "Tab") {
        e.preventDefault();

        // In search mode, Tab cycles through matching history entries
        if (searchMode && searchQuery) {
          const nextSearchFrom =
            searchResultIndex > 0 ? searchResultIndex - 1 : -1;
          if (nextSearchFrom >= 0) {
            const { result, index } = searchHistory(
              searchQuery,
              nextSearchFrom,
            );
            if (result) {
              setSearchResultIndex(index);
              setInput(result);
              setCursorPos(result.length);
            }
            // If no result found, keep the current one (already at oldest match)
          }
          return;
        }

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
            const newInput = suggestions[0]! + " ";
            setInput(newInput);
            setCursorPos(newInput.length);
          } else if (suggestions.length > 1) {
            const commonPrefix = findCommonPrefix(suggestions);
            if (commonPrefix.length > lastPart.length) {
              setInput(commonPrefix);
              setCursorPos(commonPrefix.length);
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
              const newInput = prefix ? prefix + " " + newPath : newPath;
              setInput(newInput);
              setCursorPos(newInput.length);
            } else if (matches.length > 1) {
              const commonPrefix = findCommonPrefix(matches);
              if (commonPrefix.length > partial.length) {
                const prefix = parts.slice(0, -1).join(" ");
                const newPath = basePath + commonPrefix;
                const newInput = prefix ? prefix + " " + newPath : newPath;
                setInput(newInput);
                setCursorPos(newInput.length);
              }
            }
          }
        }
      }

      // Clear line with Ctrl+U
      if (e.key === "u" && e.ctrlKey) {
        e.preventDefault();
        setInput("");
        setCursorPos(0);
      }

      // Clear screen with Ctrl+L
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        onSubmit("clear");
        setInput("");
        setCursorPos(0);
      }

      // Cancel current line with Ctrl+C or Cmd+C
      if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Exit search mode if active
        if (searchMode) {
          setSearchMode(false);
          setSearchQuery("");
          setSearchResultIndex(-1);
          return;
        }
        // Submit current text + ^C indicator, then clear
        const cancelledLine = input + "^C";
        setInput("");
        setCursorPos(0);
        setHistoryIndex(-1);
        setSavedInput("");
        onSubmit(cancelledLine);
      }

      // Reverse history search with Ctrl+R
      if (e.key === "r" && e.ctrlKey) {
        e.preventDefault();
        if (!searchMode) {
          // Enter search mode
          setSavedInput(input);
          setSearchMode(true);
          setSearchQuery("");
          setSearchResultIndex(-1);
        }
        // Note: Tab is used to cycle through matches, not Ctrl+R
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
      searchMode,
      searchQuery,
      searchResultIndex,
      searchHistory,
    ],
  );

  // Track cursor position changes (arrow keys, mouse clicks, etc.)
  const handleSelect = useCallback(() => {
    if (inputRef.current) {
      setCursorPos(inputRef.current.selectionStart ?? input.length);
    }
  }, [input.length]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (searchMode) {
        // In search mode, the input value becomes the search query
        setSearchQuery(newValue);
        // Search for matching history item
        const { result, index } = searchHistory(newValue);
        if (result) {
          setSearchResultIndex(index);
          setInput(result);
          setCursorPos(result.length);
        } else if (newValue === "") {
          // Empty query, clear results but stay in search mode
          setSearchResultIndex(-1);
          setInput("");
          setCursorPos(0);
        }
        // If no match and non-empty query, keep the last result
      } else {
        setInput(newValue);
        // Update cursor position after the change
        setCursorPos(e.target.selectionStart ?? newValue.length);
      }
    },
    [searchMode, searchHistory],
  );

  // Split input around cursor for display
  const textBeforeCursor = input.slice(0, cursorPos);
  const textAfterCursor = input.slice(cursorPos);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative outline-none"
      tabIndex={-1}
    >
      {/* Text that wraps to the left edge */}
      <div className="break-all">
        <span className="font-bold text-green-400">
          {user}@{hostname}
        </span>
        <span className="text-green-600">:</span>
        <span className="font-bold text-blue-400">{displayPath}</span>
        <span className="whitespace-pre text-green-600">$ </span>
        <span className="whitespace-pre text-green-300">
          {textBeforeCursor}
        </span>
        {!searchMode && (
          <span className="relative">
            <span className="animate-blink absolute top-0 left-0 h-[1.1em] w-[0.6em] bg-green-400" />
          </span>
        )}
        <span className="whitespace-pre text-green-300">{textAfterCursor}</span>
      </div>
      {/* Search mode indicator */}
      {searchMode && (
        <div className="break-all text-yellow-400">
          <span className="text-yellow-600">(reverse-i-search): </span>
          <span className="text-yellow-300">{searchQuery}</span>
          <span className="relative">
            <span className="animate-blink absolute top-0 left-0 h-[1.1em] w-[0.6em] bg-yellow-400" />
          </span>
        </div>
      )}
      {/* Hidden input for capturing keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={searchMode ? searchQuery : input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
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
