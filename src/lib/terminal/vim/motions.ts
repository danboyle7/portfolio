// Vim cursor motions and navigation

import type { VimState } from "./types";

/**
 * Move cursor left (h)
 */
export function moveLeft(state: VimState, count = 1): { col: number } {
  const newCol = Math.max(0, state.cursorCol - count);
  return { col: newCol };
}

/**
 * Move cursor right (l)
 */
export function moveRight(state: VimState, count = 1): { col: number } {
  const lineLength = state.lines[state.cursorRow]?.length ?? 0;
  const maxCol =
    state.mode === "insert" ? lineLength : Math.max(0, lineLength - 1);
  const newCol = Math.min(maxCol, state.cursorCol + count);
  return { col: newCol };
}

/**
 * Move cursor up (k)
 */
export function moveUp(
  state: VimState,
  count = 1,
): { row: number; col: number } {
  const newRow = Math.max(0, state.cursorRow - count);
  const lineLength = state.lines[newRow]?.length ?? 0;
  const maxCol =
    state.mode === "insert" ? lineLength : Math.max(0, lineLength - 1);
  const newCol = Math.min(state.cursorCol, maxCol);
  return { row: newRow, col: newCol };
}

/**
 * Move cursor down (j)
 */
export function moveDown(
  state: VimState,
  count = 1,
): { row: number; col: number } {
  const newRow = Math.min(state.lines.length - 1, state.cursorRow + count);
  const lineLength = state.lines[newRow]?.length ?? 0;
  const maxCol =
    state.mode === "insert" ? lineLength : Math.max(0, lineLength - 1);
  const newCol = Math.min(state.cursorCol, maxCol);
  return { row: newRow, col: newCol };
}

/**
 * Move to start of line (0)
 */
export function moveToLineStart(): { col: number } {
  return { col: 0 };
}

/**
 * Move to first non-whitespace character (^)
 */
export function moveToFirstNonWhitespace(state: VimState): { col: number } {
  const line = state.lines[state.cursorRow] ?? "";
  const match = /^\s*/.exec(line);
  const col = match ? match[0].length : 0;
  return { col: Math.min(col, Math.max(0, line.length - 1)) };
}

/**
 * Move to end of line ($)
 */
export function moveToLineEnd(state: VimState): { col: number } {
  const lineLength = state.lines[state.cursorRow]?.length ?? 0;
  const col =
    state.mode === "insert" ? lineLength : Math.max(0, lineLength - 1);
  return { col };
}

/**
 * Move to first line (gg)
 */
export function moveToFirstLine(state: VimState): { row: number; col: number } {
  const lineLength = state.lines[0]?.length ?? 0;
  const maxCol =
    state.mode === "insert" ? lineLength : Math.max(0, lineLength - 1);
  return { row: 0, col: Math.min(state.cursorCol, maxCol) };
}

/**
 * Move to last line (G)
 */
export function moveToLastLine(state: VimState): { row: number; col: number } {
  const lastRow = state.lines.length - 1;
  const lineLength = state.lines[lastRow]?.length ?? 0;
  const maxCol =
    state.mode === "insert" ? lineLength : Math.max(0, lineLength - 1);
  return { row: lastRow, col: Math.min(state.cursorCol, maxCol) };
}

/**
 * Move to specific line number ({n}G or :{n})
 */
export function moveToLine(
  state: VimState,
  lineNumber: number,
): { row: number; col: number } {
  // Line numbers are 1-indexed in vim
  const targetRow = Math.max(
    0,
    Math.min(lineNumber - 1, state.lines.length - 1),
  );
  const lineLength = state.lines[targetRow]?.length ?? 0;
  const maxCol =
    state.mode === "insert" ? lineLength : Math.max(0, lineLength - 1);
  return { row: targetRow, col: Math.min(state.cursorCol, maxCol) };
}

/**
 * Check if character is a word character
 */
function isWordChar(char: string): boolean {
  return /\w/.test(char);
}

/**
 * Check if character is whitespace
 */
function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

/**
 * Move to next word start (w)
 */
export function moveToNextWordStart(
  state: VimState,
  count = 1,
): { row: number; col: number } {
  let row = state.cursorRow;
  let col = state.cursorCol;

  for (let i = 0; i < count; i++) {
    const line = state.lines[row] ?? "";

    // If at end of line, move to next line
    if (col >= line.length - 1) {
      if (row < state.lines.length - 1) {
        row++;
        col = 0;
        // Skip leading whitespace on new line
        const newLine = state.lines[row] ?? "";
        while (col < newLine.length && isWhitespace(newLine[col]!)) {
          col++;
        }
      }
      continue;
    }

    // Move past current word
    const startChar = line[col] ?? "";
    const startIsWord = isWordChar(startChar);
    const startIsWhitespace = isWhitespace(startChar);

    if (startIsWhitespace) {
      // Skip whitespace
      while (col < line.length && isWhitespace(line[col]!)) {
        col++;
      }
    } else if (startIsWord) {
      // Skip word characters
      while (col < line.length && isWordChar(line[col]!)) {
        col++;
      }
      // Skip whitespace after word
      while (col < line.length && isWhitespace(line[col]!)) {
        col++;
      }
    } else {
      // Skip non-word, non-whitespace characters (punctuation)
      while (
        col < line.length &&
        !isWordChar(line[col]!) &&
        !isWhitespace(line[col]!)
      ) {
        col++;
      }
      // Skip whitespace after punctuation
      while (col < line.length && isWhitespace(line[col]!)) {
        col++;
      }
    }

    // If we reached end of line, move to next line
    if (col >= line.length && row < state.lines.length - 1) {
      row++;
      col = 0;
      const newLine = state.lines[row] ?? "";
      while (col < newLine.length && isWhitespace(newLine[col]!)) {
        col++;
      }
    }
  }

  // Clamp column
  const finalLineLength = state.lines[row]?.length ?? 0;
  col = Math.min(col, Math.max(0, finalLineLength - 1));

  return { row, col };
}

/**
 * Move to previous word start (b)
 */
export function moveToPrevWordStart(
  state: VimState,
  count = 1,
): { row: number; col: number } {
  let row = state.cursorRow;
  let col = state.cursorCol;

  for (let i = 0; i < count; i++) {
    // If at start of line, move to previous line
    if (col === 0) {
      if (row > 0) {
        row--;
        col = Math.max(0, (state.lines[row]?.length ?? 1) - 1);
      }
      continue;
    }

    const line = state.lines[row] ?? "";
    col--;

    // Skip whitespace backwards
    while (col > 0 && isWhitespace(line[col]!)) {
      col--;
    }

    if (col === 0) continue;

    // Move to start of current word
    const charAtCol = line[col] ?? "";
    if (isWordChar(charAtCol)) {
      while (col > 0 && isWordChar(line[col - 1]!)) {
        col--;
      }
    } else if (!isWhitespace(charAtCol)) {
      // Non-word, non-whitespace (punctuation)
      while (
        col > 0 &&
        !isWordChar(line[col - 1]!) &&
        !isWhitespace(line[col - 1]!)
      ) {
        col--;
      }
    }
  }

  return { row, col };
}

/**
 * Move to end of word (e)
 */
export function moveToWordEnd(
  state: VimState,
  count = 1,
): { row: number; col: number } {
  let row = state.cursorRow;
  let col = state.cursorCol;

  for (let i = 0; i < count; i++) {
    const line = state.lines[row] ?? "";

    // Move forward at least one character
    if (col < line.length - 1) {
      col++;
    } else if (row < state.lines.length - 1) {
      row++;
      col = 0;
    }

    const currentLine = state.lines[row] ?? "";

    // Skip whitespace
    while (col < currentLine.length && isWhitespace(currentLine[col]!)) {
      col++;
    }

    // If we hit end of line, continue to next
    if (col >= currentLine.length && row < state.lines.length - 1) {
      row++;
      col = 0;
      const newLine = state.lines[row] ?? "";
      while (col < newLine.length && isWhitespace(newLine[col]!)) {
        col++;
      }
    }

    const finalLine = state.lines[row] ?? "";

    // Move to end of current word
    const charAtCol = finalLine[col] ?? "";
    if (isWordChar(charAtCol)) {
      while (col < finalLine.length - 1 && isWordChar(finalLine[col + 1]!)) {
        col++;
      }
    } else if (!isWhitespace(charAtCol)) {
      while (
        col < finalLine.length - 1 &&
        !isWordChar(finalLine[col + 1]!) &&
        !isWhitespace(finalLine[col + 1]!)
      ) {
        col++;
      }
    }
  }

  return { row, col };
}
