// Vim command handlers for normal mode operations

import type { VimState, VimCommandResult, SearchMatch } from "./types";
import { createUndoEntry } from "./types";
import {
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  moveToLineStart,
  moveToFirstNonWhitespace,
  moveToLineEnd,
  moveToFirstLine,
  moveToLastLine,
  moveToLine,
  moveToNextWordStart,
  moveToPrevWordStart,
  moveToWordEnd,
} from "./motions";

// ============ Mode Switching ============

/**
 * Enter insert mode (i - insert before cursor)
 */
export function enterInsertMode(_state: VimState): VimCommandResult {
  return {
    state: { mode: "insert" },
    statusMessage: "-- INSERT --",
    statusType: "info",
  };
}

/**
 * Enter insert mode after cursor (a - append)
 */
export function enterInsertModeAppend(state: VimState): VimCommandResult {
  const lineLength = state.lines[state.cursorRow]?.length ?? 0;
  const newCol = Math.min(state.cursorCol + 1, lineLength);
  return {
    state: { mode: "insert", cursorCol: newCol },
    statusMessage: "-- INSERT --",
    statusType: "info",
  };
}

/**
 * Enter insert mode at end of line (A)
 */
export function enterInsertModeAtEnd(state: VimState): VimCommandResult {
  const lineLength = state.lines[state.cursorRow]?.length ?? 0;
  return {
    state: { mode: "insert", cursorCol: lineLength },
    statusMessage: "-- INSERT --",
    statusType: "info",
  };
}

/**
 * Enter insert mode at start of line (I)
 */
export function enterInsertModeAtStart(state: VimState): VimCommandResult {
  const { col } = moveToFirstNonWhitespace(state);
  return {
    state: { mode: "insert", cursorCol: col },
    statusMessage: "-- INSERT --",
    statusType: "info",
  };
}

/**
 * Open new line below (o)
 */
export function openLineBelow(state: VimState): VimCommandResult {
  const newLines = [...state.lines];
  newLines.splice(state.cursorRow + 1, 0, "");
  return {
    state: {
      mode: "insert",
      lines: newLines,
      cursorRow: state.cursorRow + 1,
      cursorCol: 0,
      isDirty: true,
    },
    saveUndo: true,
    statusMessage: "-- INSERT --",
    statusType: "info",
  };
}

/**
 * Open new line above (O)
 */
export function openLineAbove(state: VimState): VimCommandResult {
  const newLines = [...state.lines];
  newLines.splice(state.cursorRow, 0, "");
  return {
    state: {
      mode: "insert",
      lines: newLines,
      cursorCol: 0,
      isDirty: true,
    },
    saveUndo: true,
    statusMessage: "-- INSERT --",
    statusType: "info",
  };
}

/**
 * Exit to normal mode (Escape)
 */
export function exitToNormalMode(state: VimState): VimCommandResult {
  // When exiting insert mode, move cursor back one if not at start
  const newCol =
    state.mode === "insert" && state.cursorCol > 0
      ? state.cursorCol - 1
      : state.cursorCol;

  // Clamp to line length
  const lineLength = state.lines[state.cursorRow]?.length ?? 0;
  const clampedCol = Math.min(newCol, Math.max(0, lineLength - 1));

  return {
    state: {
      mode: "normal",
      cursorCol: clampedCol,
      commandBuffer: "",
      pendingOperator: null,
      repeatCount: 0,
    },
    statusMessage: "",
    statusType: "info",
  };
}

/**
 * Enter command mode (:)
 */
export function enterCommandMode(): VimCommandResult {
  return {
    state: { mode: "command", commandBuffer: "" },
  };
}

// ============ Editing Commands ============

/**
 * Delete character under cursor (x)
 */
export function deleteChar(state: VimState, count = 1): VimCommandResult {
  if (state.isReadOnly) {
    return {
      statusMessage: "E45: 'readonly' option is set",
      statusType: "error",
    };
  }

  const line = state.lines[state.cursorRow] ?? "";
  if (line.length === 0) {
    return {};
  }

  const newLines = [...state.lines];
  const deleteCount = Math.min(count, line.length - state.cursorCol);
  const deleted = line.slice(state.cursorCol, state.cursorCol + deleteCount);
  newLines[state.cursorRow] =
    line.slice(0, state.cursorCol) + line.slice(state.cursorCol + deleteCount);

  // Adjust cursor if at end of line
  const newLineLength = newLines[state.cursorRow]?.length ?? 0;
  const newCol = Math.min(state.cursorCol, Math.max(0, newLineLength - 1));

  return {
    state: {
      lines: newLines,
      cursorCol: newCol,
      isDirty: true,
      yankRegister: deleted,
      yankType: "char",
    },
    saveUndo: true,
  };
}

/**
 * Delete line (dd)
 */
export function deleteLine(state: VimState, count = 1): VimCommandResult {
  if (state.isReadOnly) {
    return {
      statusMessage: "E45: 'readonly' option is set",
      statusType: "error",
    };
  }

  const deleteCount = Math.min(count, state.lines.length - state.cursorRow);
  const deleted = state.lines.slice(
    state.cursorRow,
    state.cursorRow + deleteCount,
  );

  const newLines = [...state.lines];
  newLines.splice(state.cursorRow, deleteCount);

  // Ensure at least one empty line
  if (newLines.length === 0) {
    newLines.push("");
  }

  // Adjust cursor row
  const newRow = Math.min(state.cursorRow, newLines.length - 1);
  const newLineLength = newLines[newRow]?.length ?? 0;
  const newCol = Math.min(state.cursorCol, Math.max(0, newLineLength - 1));

  return {
    state: {
      lines: newLines,
      cursorRow: newRow,
      cursorCol: newCol,
      isDirty: true,
      yankRegister: deleted.join("\n"),
      yankType: "line",
    },
    saveUndo: true,
    statusMessage: deleteCount > 1 ? `${deleteCount} lines deleted` : "",
    statusType: "info",
  };
}

/**
 * Yank (copy) line (yy)
 */
export function yankLine(state: VimState, count = 1): VimCommandResult {
  const yankCount = Math.min(count, state.lines.length - state.cursorRow);
  const yanked = state.lines.slice(
    state.cursorRow,
    state.cursorRow + yankCount,
  );

  return {
    state: {
      yankRegister: yanked.join("\n"),
      yankType: "line",
    },
    statusMessage:
      yankCount > 1 ? `${yankCount} lines yanked` : "1 line yanked",
    statusType: "info",
  };
}

/**
 * Paste below (p)
 */
export function pasteBelow(state: VimState): VimCommandResult {
  if (state.isReadOnly) {
    return {
      statusMessage: "E45: 'readonly' option is set",
      statusType: "error",
    };
  }

  if (!state.yankRegister) {
    return {};
  }

  const newLines = [...state.lines];

  if (state.yankType === "line") {
    const pasteLines = state.yankRegister.split("\n");
    newLines.splice(state.cursorRow + 1, 0, ...pasteLines);
    return {
      state: {
        lines: newLines,
        cursorRow: state.cursorRow + 1,
        cursorCol: 0,
        isDirty: true,
      },
      saveUndo: true,
    };
  } else {
    // Character paste - insert after cursor
    const line = newLines[state.cursorRow] ?? "";
    const insertPos = state.cursorCol + 1;
    newLines[state.cursorRow] =
      line.slice(0, insertPos) + state.yankRegister + line.slice(insertPos);
    return {
      state: {
        lines: newLines,
        cursorCol: insertPos + state.yankRegister.length - 1,
        isDirty: true,
      },
      saveUndo: true,
    };
  }
}

/**
 * Paste above (P)
 */
export function pasteAbove(state: VimState): VimCommandResult {
  if (state.isReadOnly) {
    return {
      statusMessage: "E45: 'readonly' option is set",
      statusType: "error",
    };
  }

  if (!state.yankRegister) {
    return {};
  }

  const newLines = [...state.lines];

  if (state.yankType === "line") {
    const pasteLines = state.yankRegister.split("\n");
    newLines.splice(state.cursorRow, 0, ...pasteLines);
    return {
      state: {
        lines: newLines,
        cursorCol: 0,
        isDirty: true,
      },
      saveUndo: true,
    };
  } else {
    // Character paste - insert before cursor
    const line = newLines[state.cursorRow] ?? "";
    newLines[state.cursorRow] =
      line.slice(0, state.cursorCol) +
      state.yankRegister +
      line.slice(state.cursorCol);
    return {
      state: {
        lines: newLines,
        cursorCol: state.cursorCol + state.yankRegister.length - 1,
        isDirty: true,
      },
      saveUndo: true,
    };
  }
}

// ============ Undo/Redo ============

/**
 * Undo (u)
 */
export function undo(state: VimState): VimCommandResult {
  if (state.undoStack.length === 0) {
    return { statusMessage: "Already at oldest change", statusType: "warning" };
  }

  const undoEntry = state.undoStack[state.undoStack.length - 1]!;
  const newUndoStack = state.undoStack.slice(0, -1);

  // Push current state to redo stack
  const redoEntry = createUndoEntry(state);
  const newRedoStack = [...state.redoStack, redoEntry];

  return {
    state: {
      lines: undoEntry.lines,
      cursorRow: undoEntry.cursorRow,
      cursorCol: undoEntry.cursorCol,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
      isDirty: newUndoStack.length > 0,
    },
    statusMessage: "1 change undone",
    statusType: "info",
  };
}

/**
 * Redo (Ctrl+r)
 */
export function redo(state: VimState): VimCommandResult {
  if (state.redoStack.length === 0) {
    return { statusMessage: "Already at newest change", statusType: "warning" };
  }

  const redoEntry = state.redoStack[state.redoStack.length - 1]!;
  const newRedoStack = state.redoStack.slice(0, -1);

  // Push current state to undo stack
  const undoEntry = createUndoEntry(state);
  const newUndoStack = [...state.undoStack, undoEntry];

  return {
    state: {
      lines: redoEntry.lines,
      cursorRow: redoEntry.cursorRow,
      cursorCol: redoEntry.cursorCol,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
      isDirty: true,
    },
    statusMessage: "1 change redone",
    statusType: "info",
  };
}

// ============ Search ============

/**
 * Find all matches of a pattern in the document
 */
export function findMatches(lines: string[], pattern: string): SearchMatch[] {
  if (!pattern) return [];

  const matches: SearchMatch[] = [];

  try {
    const regex = new RegExp(pattern, "gi");

    for (let row = 0; row < lines.length; row++) {
      const line = lines[row] ?? "";
      let match;
      while ((match = regex.exec(line)) !== null) {
        matches.push({
          row,
          col: match.index,
          length: match[0].length,
        });
        // Prevent infinite loop on zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    }
  } catch {
    // Invalid regex - return empty
  }

  return matches;
}

/**
 * Start forward search (/)
 */
export function startForwardSearch(): VimCommandResult {
  return {
    state: {
      mode: "search",
      searchDirection: "forward",
      commandBuffer: "",
    },
  };
}

/**
 * Start backward search (?)
 */
export function startBackwardSearch(): VimCommandResult {
  return {
    state: {
      mode: "search",
      searchDirection: "backward",
      commandBuffer: "",
    },
  };
}

/**
 * Execute search
 */
export function executeSearch(
  state: VimState,
  pattern: string,
): VimCommandResult {
  const matches = findMatches(state.lines, pattern);

  if (matches.length === 0) {
    return {
      state: {
        mode: "normal",
        searchPattern: pattern,
        searchMatches: [],
        currentMatchIndex: -1,
        commandBuffer: "",
      },
      statusMessage: `Pattern not found: ${pattern}`,
      statusType: "error",
    };
  }

  // Find the first match after cursor (for forward) or before cursor (for backward)
  let matchIndex = 0;

  if (state.searchDirection === "forward") {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]!;
      if (
        match.row > state.cursorRow ||
        (match.row === state.cursorRow && match.col > state.cursorCol)
      ) {
        matchIndex = i;
        break;
      }
    }
  } else {
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i]!;
      if (
        match.row < state.cursorRow ||
        (match.row === state.cursorRow && match.col < state.cursorCol)
      ) {
        matchIndex = i;
        break;
      }
    }
  }

  const targetMatch = matches[matchIndex]!;

  return {
    state: {
      mode: "normal",
      searchPattern: pattern,
      searchMatches: matches,
      currentMatchIndex: matchIndex,
      cursorRow: targetMatch.row,
      cursorCol: targetMatch.col,
      commandBuffer: "",
    },
    statusMessage: `/${pattern}`,
    statusType: "info",
  };
}

/**
 * Go to next search match (n)
 */
export function nextSearchMatch(state: VimState): VimCommandResult {
  if (state.searchMatches.length === 0) {
    if (state.searchPattern) {
      return {
        statusMessage: `Pattern not found: ${state.searchPattern}`,
        statusType: "error",
      };
    }
    return { statusMessage: "No previous search", statusType: "error" };
  }

  const direction = state.searchDirection === "forward" ? 1 : -1;
  let newIndex = state.currentMatchIndex + direction;

  // Wrap around
  if (newIndex >= state.searchMatches.length) {
    newIndex = 0;
  } else if (newIndex < 0) {
    newIndex = state.searchMatches.length - 1;
  }

  const match = state.searchMatches[newIndex]!;

  return {
    state: {
      currentMatchIndex: newIndex,
      cursorRow: match.row,
      cursorCol: match.col,
    },
  };
}

/**
 * Go to previous search match (N)
 */
export function prevSearchMatch(state: VimState): VimCommandResult {
  if (state.searchMatches.length === 0) {
    if (state.searchPattern) {
      return {
        statusMessage: `Pattern not found: ${state.searchPattern}`,
        statusType: "error",
      };
    }
    return { statusMessage: "No previous search", statusType: "error" };
  }

  // N goes in opposite direction of current search direction
  const direction = state.searchDirection === "forward" ? -1 : 1;
  let newIndex = state.currentMatchIndex + direction;

  // Wrap around
  if (newIndex >= state.searchMatches.length) {
    newIndex = 0;
  } else if (newIndex < 0) {
    newIndex = state.searchMatches.length - 1;
  }

  const match = state.searchMatches[newIndex]!;

  return {
    state: {
      currentMatchIndex: newIndex,
      cursorRow: match.row,
      cursorCol: match.col,
    },
  };
}

// ============ Command Mode ============

/**
 * Execute a command-mode command
 */
export function executeVimCommand(
  state: VimState,
  command: string,
): VimCommandResult {
  const trimmed = command.trim();

  // :w - save or :w filename - save as
  if (trimmed === "w") {
    if (!state.filePath) {
      return {
        state: { mode: "normal", commandBuffer: "" },
        statusMessage: "E32: No file name",
        statusType: "error",
      };
    }
    return { save: true, state: { mode: "normal", commandBuffer: "" } };
  }

  // :w filename - save as new file
  const saveAsMatch = /^w\s+(.+)$/.exec(trimmed);
  if (saveAsMatch) {
    const newFilePath = saveAsMatch[1]!.trim();
    return {
      save: true,
      saveAs: newFilePath,
      state: { mode: "normal", commandBuffer: "", filePath: newFilePath },
    };
  }

  // :q - quit
  if (trimmed === "q") {
    if (state.isDirty) {
      return {
        state: { mode: "normal", commandBuffer: "" },
        statusMessage: "E37: No write since last change (add ! to override)",
        statusType: "error",
      };
    }
    return { exit: true };
  }

  // :q! - force quit
  if (trimmed === "q!") {
    return { exit: true };
  }

  // :wq or :x - save and quit
  if (trimmed === "wq" || trimmed === "x") {
    if (!state.filePath) {
      return {
        state: { mode: "normal", commandBuffer: "" },
        statusMessage: "E32: No file name",
        statusType: "error",
      };
    }
    return { save: true, exit: true };
  }

  // :wq filename - save as and quit
  const wqMatch = /^wq\s+(.+)$/.exec(trimmed);
  if (wqMatch) {
    const newFilePath = wqMatch[1]!.trim();
    return {
      save: true,
      saveAs: newFilePath,
      exit: true,
      state: { mode: "normal", commandBuffer: "", filePath: newFilePath },
    };
  }

  // :set number
  if (trimmed === "set number" || trimmed === "set nu") {
    return {
      state: { mode: "normal", showLineNumbers: true, commandBuffer: "" },
      statusMessage: "",
      statusType: "info",
    };
  }

  // :set nonumber
  if (trimmed === "set nonumber" || trimmed === "set nonu") {
    return {
      state: { mode: "normal", showLineNumbers: false, commandBuffer: "" },
      statusMessage: "",
      statusType: "info",
    };
  }

  // :{n} - go to line
  const lineMatch = /^(\d+)$/.exec(trimmed);
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1]!, 10);
    const { row, col } = moveToLine(state, lineNum);
    return {
      state: {
        mode: "normal",
        cursorRow: row,
        cursorCol: col,
        commandBuffer: "",
      },
    };
  }

  // :s/old/new/g - substitute on current line
  // :%s/old/new/g - substitute on all lines
  const subMatch = /^(%)?s\/(.+?)\/(.*)\/([g]?)$/.exec(trimmed);
  if (subMatch) {
    const [, allLines, pattern, replacement, flags] = subMatch;
    return executeSubstitute(
      state,
      pattern!,
      replacement ?? "",
      !!allLines,
      flags?.includes("g") ?? false,
    );
  }

  // :help - show help
  if (trimmed === "help" || trimmed.startsWith("help ")) {
    const helpLines = [
      "VIM - Vi IMproved - Help",
      "========================",
      "",
      "MODES:",
      "  Normal mode    - Default mode for navigation",
      "  Insert mode    - For typing text (press i, a, o, etc.)",
      "  Command mode   - For commands (press :)",
      "  Search mode    - For searching (press / or ?)",
      "",
      "ENTERING INSERT MODE:",
      "  i     Insert before cursor",
      "  a     Append after cursor",
      "  I     Insert at beginning of line",
      "  A     Append at end of line",
      "  o     Open new line below",
      "  O     Open new line above",
      "",
      "NAVIGATION:",
      "  h/j/k/l   Left/Down/Up/Right",
      "  w         Next word start",
      "  b         Previous word start",
      "  e         Word end",
      "  0         Start of line",
      "  $         End of line",
      "  ^         First non-whitespace",
      "  gg        Go to first line",
      "  G         Go to last line",
      "  :n        Go to line n",
      "",
      "EDITING:",
      "  x         Delete character",
      "  dd        Delete line",
      "  yy        Yank (copy) line",
      "  p         Paste below",
      "  P         Paste above",
      "  u         Undo",
      "  Ctrl+r    Redo",
      "",
      "SEARCH:",
      "  /pattern  Search forward",
      "  ?pattern  Search backward",
      "  n         Next match",
      "  N         Previous match",
      "",
      "COMMANDS:",
      "  :w            Save file",
      "  :w <file>     Save as file",
      "  :q            Quit",
      "  :q!           Force quit (discard changes)",
      "  :wq           Save and quit",
      "  :wq <file>    Save as file and quit",
      "  :set number   Show line numbers",
      "  :set nonu     Hide line numbers",
      "  :%s/old/new/g Replace all occurrences",
      "",
      "Press :q to close this help",
    ];

    return {
      state: {
        mode: "normal",
        commandBuffer: "",
        lines: helpLines,
        cursorRow: 0,
        cursorCol: 0,
        isDirty: false,
        isReadOnly: true,
        filePath: "[Help]",
      },
      statusMessage: "Type :q to close help",
      statusType: "info",
    };
  }

  return {
    state: { mode: "normal", commandBuffer: "" },
    statusMessage: `E492: Not an editor command: ${trimmed}`,
    statusType: "error",
  };
}

/**
 * Execute search and replace
 */
function executeSubstitute(
  state: VimState,
  pattern: string,
  replacement: string,
  allLines: boolean,
  global: boolean,
): VimCommandResult {
  if (state.isReadOnly) {
    return {
      state: { mode: "normal", commandBuffer: "" },
      statusMessage: "E45: 'readonly' option is set",
      statusType: "error",
    };
  }

  const newLines = [...state.lines];
  let count = 0;

  try {
    const regex = new RegExp(pattern, global ? "g" : "");

    if (allLines) {
      // :%s - all lines
      for (let i = 0; i < newLines.length; i++) {
        const before = newLines[i]!;
        newLines[i] = before.replace(regex, replacement);
        if (newLines[i] !== before) {
          count += (before.match(regex) ?? []).length || 1;
        }
      }
    } else {
      // :s - current line only
      const before = newLines[state.cursorRow]!;
      newLines[state.cursorRow] = before.replace(regex, replacement);
      if (newLines[state.cursorRow] !== before) {
        count = (before.match(regex) ?? []).length || 1;
      }
    }
  } catch {
    return {
      state: { mode: "normal", commandBuffer: "" },
      statusMessage: `E486: Invalid pattern: ${pattern}`,
      statusType: "error",
    };
  }

  if (count === 0) {
    return {
      state: { mode: "normal", commandBuffer: "" },
      statusMessage: `E486: Pattern not found: ${pattern}`,
      statusType: "error",
    };
  }

  return {
    state: {
      mode: "normal",
      lines: newLines,
      isDirty: true,
      commandBuffer: "",
    },
    saveUndo: true,
    statusMessage: `${count} substitution${count > 1 ? "s" : ""}`,
    statusType: "info",
  };
}

// ============ Motion Wrappers ============

export function handleMotion(
  state: VimState,
  motion:
    | "h"
    | "j"
    | "k"
    | "l"
    | "w"
    | "b"
    | "e"
    | "0"
    | "^"
    | "$"
    | "gg"
    | "G",
  count = 1,
): VimCommandResult {
  let newPos: { row?: number; col?: number };

  switch (motion) {
    case "h":
      newPos = moveLeft(state, count);
      break;
    case "l":
      newPos = moveRight(state, count);
      break;
    case "j":
      newPos = moveDown(state, count);
      break;
    case "k":
      newPos = moveUp(state, count);
      break;
    case "w":
      newPos = moveToNextWordStart(state, count);
      break;
    case "b":
      newPos = moveToPrevWordStart(state, count);
      break;
    case "e":
      newPos = moveToWordEnd(state, count);
      break;
    case "0":
      newPos = moveToLineStart();
      break;
    case "^":
      newPos = moveToFirstNonWhitespace(state);
      break;
    case "$":
      newPos = moveToLineEnd(state);
      break;
    case "gg":
      newPos = moveToFirstLine(state);
      break;
    case "G":
      newPos = count > 1 ? moveToLine(state, count) : moveToLastLine(state);
      break;
    default:
      return {};
  }

  return {
    state: {
      cursorRow: newPos.row ?? state.cursorRow,
      cursorCol: newPos.col ?? state.cursorCol,
    },
  };
}
