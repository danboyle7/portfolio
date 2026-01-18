// Vim editor types and interfaces

/**
 * Vim modes
 * - normal: Default mode for navigation and commands
 * - insert: Text input mode
 * - command: Command-line mode (after pressing :)
 * - search: Search mode (after pressing / or ?)
 *
 * Visual mode can be added later by extending this type
 */
export type VimMode = "normal" | "insert" | "command" | "search";

/**
 * Search direction
 */
export type SearchDirection = "forward" | "backward";

/**
 * Vim editor state
 */
export interface VimState {
  // Mode
  mode: VimMode;

  // Document content (array of lines)
  lines: string[];

  // Cursor position
  cursorRow: number;
  cursorCol: number;

  // Scroll position (for viewport)
  scrollTop: number;

  // Command buffer (for : commands)
  commandBuffer: string;

  // Search state
  searchPattern: string;
  searchDirection: SearchDirection;
  searchMatches: SearchMatch[];
  currentMatchIndex: number;

  // Settings
  showLineNumbers: boolean;

  // Registers (clipboard)
  yankRegister: string;
  yankType: "line" | "char"; // Whether yanked content is a full line or characters

  // Undo/Redo stacks
  undoStack: UndoEntry[];
  redoStack: UndoEntry[];

  // File state
  filePath: string;
  isDirty: boolean; // Has unsaved changes
  isReadOnly: boolean;

  // Status message (shown in status bar)
  statusMessage: string;
  statusType: "info" | "error" | "warning";

  // Pending operator (for commands like d, y, c that wait for a motion)
  pendingOperator: string | null;

  // Repeat count (for commands like 5j, 3dd)
  repeatCount: number;
}

/**
 * Search match location
 */
export interface SearchMatch {
  row: number;
  col: number;
  length: number;
}

/**
 * Undo/Redo entry
 */
export interface UndoEntry {
  lines: string[];
  cursorRow: number;
  cursorCol: number;
}

/**
 * Result of a vim command/motion
 */
export interface VimCommandResult {
  // New state (partial, will be merged)
  state?: Partial<VimState>;

  // Whether to save undo state before applying
  saveUndo?: boolean;

  // Status message to show
  statusMessage?: string;
  statusType?: "info" | "error" | "warning";

  // Exit vim
  exit?: boolean;

  // Save file
  save?: boolean;

  // Save to a specific filename (for :w filename)
  saveAs?: string;
}

/**
 * Vim command handler function
 */
export type VimCommandHandler = (
  state: VimState,
  key: string,
  count: number,
) => VimCommandResult;

/**
 * Props for the VimEditor component
 */
export interface VimEditorProps {
  filePath: string;
  initialContent: string;
  isReadOnly?: boolean;
  showSplash?: boolean;
  onSave: (content: string, newFilePath?: string) => boolean | string; // Returns true on success, error message on failure
  onExit: () => void;
}

/**
 * Create initial vim state
 */
export function createInitialVimState(
  filePath: string,
  content: string,
  isReadOnly = false,
): VimState {
  const lines = content ? content.split("\n") : [""];

  return {
    mode: "normal",
    lines,
    cursorRow: 0,
    cursorCol: 0,
    scrollTop: 0,
    commandBuffer: "",
    searchPattern: "",
    searchDirection: "forward",
    searchMatches: [],
    currentMatchIndex: -1,
    showLineNumbers: false,
    yankRegister: "",
    yankType: "line",
    undoStack: [],
    redoStack: [],
    filePath,
    isDirty: false,
    isReadOnly,
    statusMessage: isReadOnly ? "[readonly]" : "",
    statusType: "info",
    pendingOperator: null,
    repeatCount: 0,
  };
}

/**
 * Get content as a single string from lines
 */
export function getContent(state: VimState): string {
  return state.lines.join("\n");
}

/**
 * Clamp cursor position to valid range
 */
export function clampCursor(state: VimState): { row: number; col: number } {
  const row = Math.max(0, Math.min(state.cursorRow, state.lines.length - 1));
  const lineLength = state.lines[row]?.length ?? 0;

  // In normal mode, cursor can't be past the last character
  // In insert mode, cursor can be one position past (for appending)
  const maxCol =
    state.mode === "insert" ? lineLength : Math.max(0, lineLength - 1);
  const col = Math.max(0, Math.min(state.cursorCol, maxCol));

  return { row, col };
}

/**
 * Create an undo entry from current state
 */
export function createUndoEntry(state: VimState): UndoEntry {
  return {
    lines: [...state.lines],
    cursorRow: state.cursorRow,
    cursorCol: state.cursorCol,
  };
}
