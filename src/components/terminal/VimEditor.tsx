"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import type { VimState, VimEditorProps } from "@/lib/terminal/vim/types";
import {
  createInitialVimState,
  getContent,
  createUndoEntry,
} from "@/lib/terminal/vim/types";
import {
  enterInsertMode,
  enterInsertModeAppend,
  enterInsertModeAtEnd,
  enterInsertModeAtStart,
  openLineBelow,
  openLineAbove,
  exitToNormalMode,
  enterCommandMode,
  deleteChar,
  deleteLine,
  yankLine,
  pasteBelow,
  pasteAbove,
  undo,
  redo,
  startForwardSearch,
  startBackwardSearch,
  executeSearch,
  nextSearchMatch,
  prevSearchMatch,
  executeVimCommand,
  handleMotion,
} from "@/lib/terminal/vim/commands";

// Default line height - will be measured dynamically
const DEFAULT_LINE_HEIGHT = 24;

// VIM splash screen content (centered horizontally)
const VIM_SPLASH = [
  "~",
  "~",
  "~",
  "~",
  "~                                     VIM - Vi IMproved",
  "~",
  "~                                        version 9.0",
  "~                                  by Bram Moolenaar et al.",
  "~",
  "~                        Vim is open source and freely distributable",
  "~",
  "~                              type  :q<Enter>          to exit",
  "~                              type  :help<Enter>       for help",
  "~                              type  :w <file><Enter>   to save",
  "~",
  "~                         Help poor stranded strays in the Outback!",
  "~                         type  :help iccf<Enter>     for information",
  "~",
  "~",
  "~",
  "~",
];

export function VimEditor({
  filePath,
  initialContent,
  isReadOnly,
  showSplash,
  onSave,
  onExit,
}: VimEditorProps) {
  const [state, setState] = useState<VimState>(() => {
    // If showing splash (no file), use splash content
    if (showSplash && !filePath) {
      const splashState = createInitialVimState("", "", false);
      splashState.lines = VIM_SPLASH;
      return splashState;
    }
    return createInitialVimState(filePath, initialContent, isReadOnly);
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const linesContainerRef = useRef<HTMLDivElement>(null);
  const measureLineRef = useRef<HTMLDivElement>(null);

  // Track container height for dynamic line calculation
  const [visibleLineCount, setVisibleLineCount] = useState(20); // Default fallback

  // Measure container and calculate visible lines
  useEffect(() => {
    const updateVisibleLines = () => {
      if (linesContainerRef.current && measureLineRef.current) {
        const containerHeight = linesContainerRef.current.clientHeight;
        const lineHeight =
          measureLineRef.current.offsetHeight || DEFAULT_LINE_HEIGHT;
        // Calculate how many lines fit
        const lines = Math.max(1, Math.floor(containerHeight / lineHeight));
        setVisibleLineCount(lines);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateVisibleLines, 0);
    window.addEventListener("resize", updateVisibleLines);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateVisibleLines);
    };
  }, []);

  // Track pending 'g' key for gg command
  const [pendingG, setPendingG] = useState(false);
  // Track pending 'd' key for dd command
  const [pendingD, setPendingD] = useState(false);
  // Track pending 'y' key for yy command
  const [pendingY, setPendingY] = useState(false);
  // Track number buffer for repeat counts
  const [numberBuffer, setNumberBuffer] = useState("");

  // Focus input on mount and when clicking editor
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep input focused
  const handleEditorClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Apply a command result to state
  const applyResult = useCallback(
    (result: ReturnType<typeof enterInsertMode>) => {
      if (result.saveUndo) {
        setState((prev) => ({
          ...prev,
          undoStack: [...prev.undoStack, createUndoEntry(prev)],
          redoStack: [], // Clear redo stack on new change
        }));
      }

      if (result.state) {
        setState((prev) => {
          // When entering insert mode while showing splash screen, clear the content
          if (
            showSplash &&
            result.state?.mode === "insert" &&
            prev.lines === VIM_SPLASH
          ) {
            return {
              ...prev,
              ...result.state,
              lines: [""],
              cursorRow: 0,
              cursorCol: 0,
            };
          }
          return { ...prev, ...result.state };
        });
      }

      if (result.statusMessage !== undefined) {
        setState((prev) => ({
          ...prev,
          statusMessage: result.statusMessage ?? "",
          statusType: result.statusType ?? "info",
        }));
      }

      if (result.save) {
        setState((prev) => {
          // Clear splash screen content when saving
          let lines = prev.lines;
          if (showSplash && lines === VIM_SPLASH) {
            lines = [""];
          }

          const content = getContent({ ...prev, lines });
          const targetPath = result.saveAs ?? prev.filePath;
          const saveResult = onSave(content, result.saveAs);

          if (saveResult === true) {
            return {
              ...prev,
              lines,
              filePath: targetPath,
              isDirty: false,
              statusMessage: `"${targetPath}" written`,
              statusType: "info" as const,
            };
          } else {
            return {
              ...prev,
              statusMessage:
                typeof saveResult === "string"
                  ? saveResult
                  : "Error saving file",
              statusType: "error" as const,
            };
          }
        });
      }

      if (result.exit) {
        // Small delay to show save message if also saving
        if (result.save) {
          setTimeout(onExit, 100);
        } else {
          onExit();
        }
      }
    },
    [onSave, onExit, showSplash],
  );

  // Get repeat count from number buffer
  const getCount = useCallback(() => {
    const count = numberBuffer ? parseInt(numberBuffer, 10) : 1;
    setNumberBuffer("");
    return count;
  }, [numberBuffer]);

  // Handle insert mode
  const handleInsertMode = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;

      // Let browser handle normal text input
      if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        return; // Will be handled by onChange
      }

      e.preventDefault();

      if (key === "Backspace") {
        setState((prev) => {
          const line = prev.lines[prev.cursorRow] ?? "";
          if (prev.cursorCol > 0) {
            // Delete character before cursor
            const newLine =
              line.slice(0, prev.cursorCol - 1) + line.slice(prev.cursorCol);
            const newLines = [...prev.lines];
            newLines[prev.cursorRow] = newLine;
            return {
              ...prev,
              lines: newLines,
              cursorCol: prev.cursorCol - 1,
              isDirty: true,
            };
          } else if (prev.cursorRow > 0) {
            // Join with previous line
            const prevLine = prev.lines[prev.cursorRow - 1] ?? "";
            const newLines = [...prev.lines];
            newLines[prev.cursorRow - 1] = prevLine + line;
            newLines.splice(prev.cursorRow, 1);
            return {
              ...prev,
              lines: newLines,
              cursorRow: prev.cursorRow - 1,
              cursorCol: prevLine.length,
              isDirty: true,
            };
          }
          return prev;
        });
      } else if (key === "Enter") {
        setState((prev) => {
          const line = prev.lines[prev.cursorRow] ?? "";
          const before = line.slice(0, prev.cursorCol);
          const after = line.slice(prev.cursorCol);
          const newLines = [...prev.lines];
          newLines[prev.cursorRow] = before;
          newLines.splice(prev.cursorRow + 1, 0, after);
          return {
            ...prev,
            lines: newLines,
            cursorRow: prev.cursorRow + 1,
            cursorCol: 0,
            isDirty: true,
          };
        });
      } else if (key === "Delete") {
        setState((prev) => {
          const line = prev.lines[prev.cursorRow] ?? "";
          if (prev.cursorCol < line.length) {
            const newLine =
              line.slice(0, prev.cursorCol) + line.slice(prev.cursorCol + 1);
            const newLines = [...prev.lines];
            newLines[prev.cursorRow] = newLine;
            return { ...prev, lines: newLines, isDirty: true };
          } else if (prev.cursorRow < prev.lines.length - 1) {
            // Join with next line
            const nextLine = prev.lines[prev.cursorRow + 1] ?? "";
            const newLines = [...prev.lines];
            newLines[prev.cursorRow] = line + nextLine;
            newLines.splice(prev.cursorRow + 1, 1);
            return { ...prev, lines: newLines, isDirty: true };
          }
          return prev;
        });
      } else if (key === "ArrowLeft") {
        setState((prev) => ({
          ...prev,
          cursorCol: Math.max(0, prev.cursorCol - 1),
        }));
      } else if (key === "ArrowRight") {
        setState((prev) => {
          const lineLength = prev.lines[prev.cursorRow]?.length ?? 0;
          return {
            ...prev,
            cursorCol: Math.min(lineLength, prev.cursorCol + 1),
          };
        });
      } else if (key === "ArrowUp") {
        setState((prev) => {
          if (prev.cursorRow > 0) {
            const newRow = prev.cursorRow - 1;
            const lineLength = prev.lines[newRow]?.length ?? 0;
            return {
              ...prev,
              cursorRow: newRow,
              cursorCol: Math.min(prev.cursorCol, lineLength),
            };
          }
          return prev;
        });
      } else if (key === "ArrowDown") {
        setState((prev) => {
          if (prev.cursorRow < prev.lines.length - 1) {
            const newRow = prev.cursorRow + 1;
            const lineLength = prev.lines[newRow]?.length ?? 0;
            return {
              ...prev,
              cursorRow: newRow,
              cursorCol: Math.min(prev.cursorCol, lineLength),
            };
          }
          return prev;
        });
      }
    },
    [],
  );

  // Handle text input in insert mode
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (state.mode === "insert" && value) {
        setState((prev) => {
          const line = prev.lines[prev.cursorRow] ?? "";
          const newLine =
            line.slice(0, prev.cursorCol) + value + line.slice(prev.cursorCol);
          const newLines = [...prev.lines];
          newLines[prev.cursorRow] = newLine;
          return {
            ...prev,
            lines: newLines,
            cursorCol: prev.cursorCol + value.length,
            isDirty: true,
          };
        });
      }
      // Clear input for next character
      e.target.value = "";
    },
    [state.mode],
  );

  // Handle command mode (:)
  const handleCommandMode = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;
      e.preventDefault();

      if (key === "Enter") {
        applyResult(executeVimCommand(state, state.commandBuffer));
      } else if (key === "Backspace") {
        if (state.commandBuffer.length > 0) {
          setState((prev) => ({
            ...prev,
            commandBuffer: prev.commandBuffer.slice(0, -1),
          }));
        } else {
          // Exit command mode
          setState((prev) => ({ ...prev, mode: "normal", commandBuffer: "" }));
        }
      } else if (key.length === 1) {
        setState((prev) => ({
          ...prev,
          commandBuffer: prev.commandBuffer + key,
        }));
      }
    },
    [state, applyResult],
  );

  // Handle search mode (/ or ?)
  const handleSearchMode = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;
      e.preventDefault();

      if (key === "Enter") {
        applyResult(executeSearch(state, state.commandBuffer));
      } else if (key === "Backspace") {
        if (state.commandBuffer.length > 0) {
          setState((prev) => ({
            ...prev,
            commandBuffer: prev.commandBuffer.slice(0, -1),
          }));
        } else {
          setState((prev) => ({ ...prev, mode: "normal", commandBuffer: "" }));
        }
      } else if (key.length === 1) {
        setState((prev) => ({
          ...prev,
          commandBuffer: prev.commandBuffer + key,
        }));
      }
    },
    [state, applyResult],
  );

  // Handle normal mode
  const handleNormalMode = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;
      e.preventDefault();

      // Handle number keys for repeat count
      if (/^[1-9]$/.test(key) || (numberBuffer && key === "0")) {
        setNumberBuffer((prev) => prev + key);
        return;
      }

      const count = getCount();

      // Handle pending operators
      if (pendingG) {
        setPendingG(false);
        if (key === "g") {
          // gg - go to first line
          applyResult(handleMotion(state, "gg", count));
        }
        return;
      }

      if (pendingD) {
        setPendingD(false);
        if (key === "d") {
          // dd - delete line
          applyResult(deleteLine(state, count));
        }
        return;
      }

      if (pendingY) {
        setPendingY(false);
        if (key === "y") {
          // yy - yank line
          applyResult(yankLine(state, count));
        }
        return;
      }

      // Regular commands
      switch (key) {
        // Mode switching
        case "i":
          applyResult(enterInsertMode(state));
          break;
        case "a":
          applyResult(enterInsertModeAppend(state));
          break;
        case "A":
          applyResult(enterInsertModeAtEnd(state));
          break;
        case "I":
          applyResult(enterInsertModeAtStart(state));
          break;
        case "o":
          applyResult(openLineBelow(state));
          break;
        case "O":
          applyResult(openLineAbove(state));
          break;
        case ":":
          applyResult(enterCommandMode());
          break;

        // Basic motions
        case "h":
        case "ArrowLeft":
          applyResult(handleMotion(state, "h", count));
          break;
        case "j":
        case "ArrowDown":
          applyResult(handleMotion(state, "j", count));
          break;
        case "k":
        case "ArrowUp":
          applyResult(handleMotion(state, "k", count));
          break;
        case "l":
        case "ArrowRight":
          applyResult(handleMotion(state, "l", count));
          break;

        // Word motions
        case "w":
          applyResult(handleMotion(state, "w", count));
          break;
        case "b":
          applyResult(handleMotion(state, "b", count));
          break;
        case "e":
          applyResult(handleMotion(state, "e", count));
          break;

        // Line motions
        case "0":
          applyResult(handleMotion(state, "0"));
          break;
        case "^":
          applyResult(handleMotion(state, "^"));
          break;
        case "$":
          applyResult(handleMotion(state, "$"));
          break;

        // Document motions
        case "g":
          setPendingG(true);
          break;
        case "G":
          applyResult(handleMotion(state, "G", count));
          break;

        // Editing
        case "x":
          applyResult(deleteChar(state, count));
          break;
        case "d":
          setPendingD(true);
          break;
        case "y":
          setPendingY(true);
          break;
        case "p":
          applyResult(pasteBelow(state));
          break;
        case "P":
          applyResult(pasteAbove(state));
          break;

        // Undo/Redo
        case "u":
          applyResult(undo(state));
          break;
        case "r":
          if (e.ctrlKey) {
            applyResult(redo(state));
          }
          break;

        // Search
        case "/":
          applyResult(startForwardSearch());
          break;
        case "?":
          applyResult(startBackwardSearch());
          break;
        case "n":
          applyResult(nextSearchMatch(state));
          break;
        case "N":
          applyResult(prevSearchMatch(state));
          break;
      }
    },
    [state, pendingG, pendingD, pendingY, numberBuffer, applyResult, getCount],
  );

  // Handle keyboard input - must be after mode handlers
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;

      // Always allow Escape
      if (key === "Escape") {
        e.preventDefault();
        setPendingG(false);
        setPendingD(false);
        setPendingY(false);
        setNumberBuffer("");
        applyResult(exitToNormalMode(state));
        return;
      }

      // Handle based on mode
      if (state.mode === "insert") {
        handleInsertMode(e);
      } else if (state.mode === "command") {
        handleCommandMode(e);
      } else if (state.mode === "search") {
        handleSearchMode(e);
      } else {
        handleNormalMode(e);
      }
    },
    [
      state,
      applyResult,
      handleInsertMode,
      handleCommandMode,
      handleSearchMode,
      handleNormalMode,
    ],
  );

  // Calculate scroll position to keep cursor visible
  // Status bar is now outside the lines container, so all visible lines are editable
  const editableLines = visibleLineCount;
  const scrollTop = Math.max(
    0,
    Math.min(
      state.cursorRow - Math.floor(editableLines / 2),
      state.lines.length - editableLines,
    ),
  );

  // Get visible lines (excluding status line)
  const visibleLines = state.lines.slice(scrollTop, scrollTop + editableLines);
  const lineNumberWidth = state.showLineNumbers
    ? Math.max(3, state.lines.length.toString().length)
    : 0;

  // Get mode display string
  const getModeDisplay = () => {
    switch (state.mode) {
      case "insert":
        return "-- INSERT --";
      case "command":
        return `:${state.commandBuffer}`;
      case "search":
        return `${state.searchDirection === "forward" ? "/" : "?"}${state.commandBuffer}`;
      default:
        return "";
    }
  };

  // Calculate cursor position percentage
  const cursorPercent =
    state.lines.length > 1
      ? Math.round((state.cursorRow / (state.lines.length - 1)) * 100)
      : 100;

  return (
    <div
      ref={editorRef}
      className="flex h-full w-full flex-col bg-black font-mono text-green-500"
      onClick={handleEditorClick}
    >
      {/* Editor area - uses flex to push status line to bottom */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Hidden input for capturing keyboard events */}
        <input
          ref={inputRef}
          type="text"
          className="absolute h-0 w-0 opacity-0"
          onKeyDown={handleKeyDown}
          onChange={handleInput}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        {/* Lines - flex-1 to take remaining space, pushing status to bottom */}
        <div ref={linesContainerRef} className="flex-1 overflow-hidden px-1">
          {/* Hidden div to measure line height */}
          <div
            ref={measureLineRef}
            className="invisible absolute flex leading-normal whitespace-pre"
            aria-hidden="true"
          >
            X
          </div>

          {visibleLines.map((line, idx) => {
            const actualRow = scrollTop + idx;
            const isCursorLine = actualRow === state.cursorRow;

            return (
              <div
                key={actualRow}
                className={`flex leading-normal whitespace-pre ${isCursorLine ? "bg-green-900/20" : ""}`}
              >
                {/* Line number */}
                {state.showLineNumbers && (
                  <span
                    className="mr-2 text-right text-green-700 select-none"
                    style={{ width: `${lineNumberWidth}ch` }}
                  >
                    {actualRow + 1}
                  </span>
                )}

                {/* Line content with cursor */}
                <span className="flex-1">
                  {isCursorLine ? (
                    <>
                      {line.slice(0, state.cursorCol)}
                      <span
                        className={`${
                          state.mode === "insert"
                            ? "border-l-2 border-green-500"
                            : "bg-green-500 text-black"
                        }`}
                      >
                        {state.mode === "insert"
                          ? ""
                          : (line[state.cursorCol] ?? " ")}
                      </span>
                      {state.mode === "insert"
                        ? line.slice(state.cursorCol)
                        : line.slice(state.cursorCol + 1)}
                    </>
                  ) : (
                    line || " "
                  )}
                </span>
              </div>
            );
          })}

          {/* Empty line indicators (~) */}
          {visibleLines.length < editableLines &&
            Array.from({
              length: editableLines - visibleLines.length,
            }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="leading-normal text-green-700"
              >
                {state.showLineNumbers && (
                  <span
                    style={{ width: `${lineNumberWidth}ch` }}
                    className="mr-2 inline-block"
                  />
                )}
                <span>~</span>
              </div>
            ))}
        </div>

        {/* Status/command line - fixed at bottom of editor area */}
        <div className="flex justify-between px-2 leading-normal whitespace-pre">
          <span
            className={
              state.statusType === "error" ? "text-red-500" : "text-green-500"
            }
          >
            {getModeDisplay() || state.statusMessage}
          </span>
          <span className="text-green-600">
            {state.cursorRow + 1},{state.cursorCol + 1}
            {"    "}
            {cursorPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
