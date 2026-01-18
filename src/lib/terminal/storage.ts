// Terminal localStorage persistence utilities

import type { FileSystemNode } from "./types";

// Storage keys
const STORAGE_KEYS = {
  COMMAND_HISTORY: "terminal_command_history",
  USER_FILES: "terminal_user_files",
} as const;

// Configuration constants
export const TERMINAL_CONFIG = {
  MAX_HISTORY_LENGTH: 1000,
  MAX_FILE_SIZE: 8192, // 8KB max file size
  MAX_USER_FILES: 100, // Maximum number of user-created files/directories
} as const;

// ============ Command History ============

/**
 * Load command history from localStorage
 */
export function loadCommandHistory(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMAND_HISTORY);
    if (!stored) return [];

    const history = JSON.parse(stored) as unknown;
    if (!Array.isArray(history)) return [];

    // Validate and filter to strings only
    return history.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/**
 * Save command history to localStorage (with truncation)
 */
export function saveCommandHistory(history: string[]): void {
  if (typeof window === "undefined") return;

  try {
    // Truncate to max length (keep most recent)
    const truncated = history.slice(-TERMINAL_CONFIG.MAX_HISTORY_LENGTH);
    localStorage.setItem(
      STORAGE_KEYS.COMMAND_HISTORY,
      JSON.stringify(truncated),
    );
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

/**
 * Add a command to history and save
 */
export function addToCommandHistory(
  currentHistory: string[],
  command: string,
): string[] {
  const newHistory = [...currentHistory, command];
  // Truncate if over limit
  const truncated = newHistory.slice(-TERMINAL_CONFIG.MAX_HISTORY_LENGTH);
  saveCommandHistory(truncated);
  return truncated;
}

/**
 * Clear command history from localStorage
 */
export function clearCommandHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.COMMAND_HISTORY);
  } catch {
    // Ignore errors
  }
}

// ============ User Files/Directories ============

export interface UserFileEntry {
  path: string; // Full path like "/home/guest/mydir"
  type: "directory" | "file";
  content?: string; // For files
  createdAt: number;
}

/**
 * Load user-created files/directories from localStorage
 */
export function loadUserFiles(): UserFileEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_FILES);
    if (!stored) return [];

    const files = JSON.parse(stored) as unknown;
    if (!Array.isArray(files)) return [];

    // Validate entries
    return files.filter(
      (entry: unknown): entry is UserFileEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as UserFileEntry).path === "string" &&
        ((entry as UserFileEntry).type === "directory" ||
          (entry as UserFileEntry).type === "file") &&
        typeof (entry as UserFileEntry).createdAt === "number",
    );
  } catch {
    return [];
  }
}

/**
 * Save user files to localStorage
 */
export function saveUserFiles(files: UserFileEntry[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.USER_FILES, JSON.stringify(files));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Add a user-created file/directory
 */
export function addUserFile(entry: Omit<UserFileEntry, "createdAt">): void {
  const files = loadUserFiles();
  // Check if already exists
  if (files.some((f) => f.path === entry.path)) {
    return;
  }
  files.push({ ...entry, createdAt: Date.now() });
  saveUserFiles(files);
}

/**
 * Update content of an existing user file
 */
export function updateUserFileContent(path: string, content: string): boolean {
  const files = loadUserFiles();
  const fileIndex = files.findIndex(
    (f) => f.path === path && f.type === "file",
  );
  if (fileIndex === -1) {
    return false;
  }
  files[fileIndex] = { ...files[fileIndex]!, content };
  saveUserFiles(files);
  return true;
}

/**
 * Get user file entry by path
 */
export function getUserFile(path: string): UserFileEntry | undefined {
  const files = loadUserFiles();
  return files.find((f) => f.path === path);
}

/**
 * Check if we've reached the max file limit
 */
export function isAtFileLimit(): boolean {
  const files = loadUserFiles();
  return files.length >= TERMINAL_CONFIG.MAX_USER_FILES;
}

/**
 * Remove a user-created file/directory (and children if directory)
 */
export function removeUserFile(path: string): void {
  const files = loadUserFiles();
  // Remove the path and any children (for directories)
  const filtered = files.filter(
    (f) => f.path !== path && !f.path.startsWith(path + "/"),
  );
  saveUserFiles(filtered);
}

/**
 * Check if a path is user-created
 */
export function isUserCreated(path: string): boolean {
  const files = loadUserFiles();
  return files.some((f) => f.path === path);
}

/**
 * Clear all user files from localStorage
 */
export function clearUserFiles(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.USER_FILES);
  } catch {
    // Ignore errors
  }
}

/**
 * Remove all user-created files/directories from the in-memory file system
 * Call this along with clearUserFiles() to fully reset
 */
export function removeUserFilesFromFileSystem(
  fileSystem: FileSystemNode,
): void {
  const userFiles = loadUserFiles();

  // Sort by path length descending so we remove children before parents
  const sortedFiles = [...userFiles].sort(
    (a, b) => b.path.length - a.path.length,
  );

  for (const entry of sortedFiles) {
    const segments = entry.path.split("/").filter(Boolean);
    const name = segments.pop();
    if (!name) continue;

    // Navigate to parent directory
    let current = fileSystem;
    let found = true;

    for (const segment of segments) {
      if (current.type !== "directory" || !current.children) {
        found = false;
        break;
      }
      const next = current.children[segment];
      if (!next) {
        found = false;
        break;
      }
      current = next;
    }

    // Remove the node if we found the parent
    if (found && current.type === "directory" && current.children) {
      delete current.children[name];
    }
  }
}

// ============ File System Integration ============

/**
 * Apply user files to the file system (call after creating fileSystem)
 */
export function applyUserFilesToFileSystem(fileSystem: FileSystemNode): void {
  const userFiles = loadUserFiles();
  const now = new Date();
  const dateStr = `${now.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  for (const entry of userFiles) {
    const segments = entry.path.split("/").filter(Boolean);
    const name = segments.pop();
    if (!name) continue;

    // Navigate to parent directory
    let current = fileSystem;
    for (const segment of segments) {
      if (current.type !== "directory" || !current.children) break;
      const next = current.children[segment];
      if (next?.type !== "directory") break;
      current = next;
    }

    // Add the node if parent exists and is a directory
    if (current.type === "directory" && current.children) {
      if (entry.type === "directory") {
        current.children[name] = {
          name,
          type: "directory",
          permissions: "drwxr-xr-x",
          owner: "guest",
          size: "4.0K",
          modified: dateStr,
          children: {},
          // Mark as user-created (we'll use this for permission checks)
        };
      } else {
        current.children[name] = {
          name,
          type: "file",
          permissions: "-rw-r--r--",
          owner: "guest",
          size: entry.content ? `${entry.content.length}` : "0",
          modified: dateStr,
          content: entry.content ?? "",
        };
      }
    }
  }
}

/**
 * Create a directory in the file system and persist to localStorage
 * Returns true on success, error message on failure
 */
export function createDirectory(
  fileSystem: FileSystemNode,
  fullPath: string,
): true | string {
  const segments = fullPath.split("/").filter(Boolean);
  const name = segments.pop();

  if (!name) {
    return "mkdir: invalid directory name";
  }

  // Validate name (no slashes, not . or ..)
  if (name === "." || name === "..") {
    return `mkdir: cannot create directory '${name}': Invalid argument`;
  }

  // Navigate to parent
  let current = fileSystem;

  for (const segment of segments) {
    if (current.type !== "directory" || !current.children) {
      return `mkdir: cannot create directory '${fullPath}': No such file or directory`;
    }
    const next = current.children[segment];
    if (!next) {
      return `mkdir: cannot create directory '${fullPath}': No such file or directory`;
    }
    current = next;
  }

  if (current.type !== "directory" || !current.children) {
    return `mkdir: cannot create directory '${fullPath}': Not a directory`;
  }

  // Check if already exists
  if (current.children[name]) {
    return `mkdir: cannot create directory '${name}': File exists`;
  }

  // Check write permission (must be in /home/guest or /tmp)
  if (!fullPath.startsWith("/home/guest") && !fullPath.startsWith("/tmp")) {
    return `mkdir: cannot create directory '${fullPath}': Permission denied`;
  }

  const now = new Date();
  const dateStr = `${now.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  // Create the directory
  current.children[name] = {
    name,
    type: "directory",
    permissions: "drwxr-xr-x",
    owner: "guest",
    size: "4.0K",
    modified: dateStr,
    children: {},
  };

  // Persist to localStorage
  addUserFile({ path: fullPath, type: "directory" });

  return true;
}

/**
 * Remove a directory from the file system
 * Returns true on success, error message on failure
 */
export function removeDirectory(
  fileSystem: FileSystemNode,
  fullPath: string,
  force = false,
): true | string {
  // Cannot remove root
  if (fullPath === "/" || fullPath === "") {
    return "rmdir: failed to remove '/': Permission denied";
  }

  const segments = fullPath.split("/").filter(Boolean);
  const name = segments.pop();

  if (!name) {
    return "rmdir: invalid path";
  }

  // Navigate to parent
  let current = fileSystem;
  for (const segment of segments) {
    if (current.type !== "directory" || !current.children) {
      return `rmdir: failed to remove '${fullPath}': No such file or directory`;
    }
    const next = current.children[segment];
    if (!next) {
      return `rmdir: failed to remove '${fullPath}': No such file or directory`;
    }
    current = next;
  }

  if (current.type !== "directory" || !current.children) {
    return `rmdir: failed to remove '${fullPath}': Not a directory`;
  }

  const target = current.children[name];
  if (!target) {
    return `rmdir: failed to remove '${fullPath}': No such file or directory`;
  }

  if (target.type !== "directory") {
    return `rmdir: failed to remove '${name}': Not a directory`;
  }

  // Check if user-created
  if (!isUserCreated(fullPath)) {
    return `rmdir: failed to remove '${name}': Permission denied`;
  }

  // Check if empty (unless force)
  if (!force && target.children && Object.keys(target.children).length > 0) {
    return `rmdir: failed to remove '${name}': Directory not empty`;
  }

  // Remove from file system
  delete current.children[name];

  // Remove from localStorage
  removeUserFile(fullPath);

  return true;
}

/**
 * Remove a file or directory (rm command)
 * Returns true on success, error message on failure
 */
export function removeFile(
  fileSystem: FileSystemNode,
  fullPath: string,
  options: { recursive?: boolean; force?: boolean } = {},
): true | string {
  // Cannot remove root
  if (fullPath === "/" || fullPath === "") {
    return "rm: cannot remove '/': Permission denied";
  }

  const segments = fullPath.split("/").filter(Boolean);
  const name = segments.pop();

  if (!name) {
    return "rm: invalid path";
  }

  // Navigate to parent
  let current = fileSystem;
  for (const segment of segments) {
    if (current.type !== "directory" || !current.children) {
      if (options.force) return true;
      return `rm: cannot remove '${fullPath}': No such file or directory`;
    }
    const next = current.children[segment];
    if (!next) {
      if (options.force) return true;
      return `rm: cannot remove '${fullPath}': No such file or directory`;
    }
    current = next;
  }

  if (current.type !== "directory" || !current.children) {
    if (options.force) return true;
    return `rm: cannot remove '${fullPath}': No such file or directory`;
  }

  const target = current.children[name];
  if (!target) {
    if (options.force) return true;
    return `rm: cannot remove '${fullPath}': No such file or directory`;
  }

  // Check if directory
  if (target.type === "directory") {
    if (!options.recursive) {
      return `rm: cannot remove '${name}': Is a directory`;
    }
  }

  // Check if user-created
  if (!isUserCreated(fullPath)) {
    return `rm: cannot remove '${name}': Permission denied`;
  }

  // Remove from file system
  delete current.children[name];

  // Remove from localStorage (including children)
  removeUserFile(fullPath);

  return true;
}

/**
 * Create a file in the file system and persist to localStorage
 * Returns true on success, error message on failure
 */
export function createFile(
  fileSystem: FileSystemNode,
  fullPath: string,
  content = "",
): true | string {
  const segments = fullPath.split("/").filter(Boolean);
  const name = segments.pop();

  if (!name) {
    return "touch: invalid file name";
  }

  // Validate name
  if (name === "." || name === "..") {
    return `touch: cannot create file '${name}': Invalid argument`;
  }

  // Check content size
  if (content.length > TERMINAL_CONFIG.MAX_FILE_SIZE) {
    return `touch: file too large (max ${TERMINAL_CONFIG.MAX_FILE_SIZE} bytes)`;
  }

  // Check write permission (must be in /home/guest or /tmp)
  if (!fullPath.startsWith("/home/guest") && !fullPath.startsWith("/tmp")) {
    return `touch: cannot create '${fullPath}': Permission denied`;
  }

  // Navigate to parent
  let current = fileSystem;
  for (const segment of segments) {
    if (current.type !== "directory" || !current.children) {
      return `touch: cannot create '${fullPath}': No such file or directory`;
    }
    const next = current.children[segment];
    if (!next) {
      return `touch: cannot create '${fullPath}': No such file or directory`;
    }
    current = next;
  }

  if (current.type !== "directory" || !current.children) {
    return `touch: cannot create '${fullPath}': Not a directory`;
  }

  const now = new Date();
  const dateStr = `${now.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  // Check if file already exists
  const existing = current.children[name];
  if (existing) {
    // If it's a user-created file, update timestamp (and optionally content)
    if (existing.type === "file" && isUserCreated(fullPath)) {
      existing.modified = dateStr;
      if (content) {
        existing.content = content;
        existing.size = `${content.length}`;
        updateUserFileContent(fullPath, content);
      }
      return true;
    }
    // Can't touch system files or directories
    if (existing.type === "directory") {
      return `touch: cannot create '${name}': Is a directory`;
    }
    return `touch: cannot modify '${name}': Permission denied`;
  }

  // Check file limit before creating new file
  if (isAtFileLimit()) {
    return `touch: cannot create '${name}': Too many user files (max ${TERMINAL_CONFIG.MAX_USER_FILES})`;
  }

  // Create the file
  current.children[name] = {
    name,
    type: "file",
    permissions: "-rw-r--r--",
    owner: "guest",
    size: content ? `${content.length}` : "0",
    modified: dateStr,
    content,
  };

  // Persist to localStorage
  addUserFile({ path: fullPath, type: "file", content });

  return true;
}

/**
 * Write content to a file (overwrite)
 * Creates the file if it doesn't exist
 */
export function writeFile(
  fileSystem: FileSystemNode,
  fullPath: string,
  content: string,
): true | string {
  // Check content size
  if (content.length > TERMINAL_CONFIG.MAX_FILE_SIZE) {
    return `write: file too large (max ${TERMINAL_CONFIG.MAX_FILE_SIZE} bytes)`;
  }

  // Check write permission
  if (!fullPath.startsWith("/home/guest") && !fullPath.startsWith("/tmp")) {
    return `write: cannot write to '${fullPath}': Permission denied`;
  }

  const segments = fullPath.split("/").filter(Boolean);
  const name = segments.pop();

  if (!name) {
    return "write: invalid file name";
  }

  // Navigate to parent
  let current = fileSystem;
  for (const segment of segments) {
    if (current.type !== "directory" || !current.children) {
      return `write: cannot write to '${fullPath}': No such file or directory`;
    }
    const next = current.children[segment];
    if (!next) {
      return `write: cannot write to '${fullPath}': No such file or directory`;
    }
    current = next;
  }

  if (current.type !== "directory" || !current.children) {
    return `write: cannot write to '${fullPath}': Not a directory`;
  }

  const now = new Date();
  const dateStr = `${now.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  const existing = current.children[name];

  if (existing) {
    // Update existing file
    if (existing.type === "directory") {
      return `write: '${name}': Is a directory`;
    }
    if (!isUserCreated(fullPath)) {
      return `write: cannot modify '${name}': Permission denied`;
    }
    existing.content = content;
    existing.size = `${content.length}`;
    existing.modified = dateStr;
    updateUserFileContent(fullPath, content);
    return true;
  }

  // Create new file
  if (isAtFileLimit()) {
    return `write: cannot create '${name}': Too many user files (max ${TERMINAL_CONFIG.MAX_USER_FILES})`;
  }

  current.children[name] = {
    name,
    type: "file",
    permissions: "-rw-r--r--",
    owner: "guest",
    size: `${content.length}`,
    modified: dateStr,
    content,
  };

  addUserFile({ path: fullPath, type: "file", content });
  return true;
}

/**
 * Append content to a file
 * Creates the file if it doesn't exist
 */
export function appendFile(
  fileSystem: FileSystemNode,
  fullPath: string,
  content: string,
): true | string {
  // Check write permission
  if (!fullPath.startsWith("/home/guest") && !fullPath.startsWith("/tmp")) {
    return `append: cannot write to '${fullPath}': Permission denied`;
  }

  const segments = fullPath.split("/").filter(Boolean);
  const name = segments.pop();

  if (!name) {
    return "append: invalid file name";
  }

  // Navigate to parent
  let current = fileSystem;
  for (const segment of segments) {
    if (current.type !== "directory" || !current.children) {
      return `append: cannot write to '${fullPath}': No such file or directory`;
    }
    const next = current.children[segment];
    if (!next) {
      return `append: cannot write to '${fullPath}': No such file or directory`;
    }
    current = next;
  }

  if (current.type !== "directory" || !current.children) {
    return `append: cannot write to '${fullPath}': Not a directory`;
  }

  const now = new Date();
  const dateStr = `${now.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  const existing = current.children[name];

  if (existing) {
    if (existing.type === "directory") {
      return `append: '${name}': Is a directory`;
    }
    if (!isUserCreated(fullPath)) {
      return `append: cannot modify '${name}': Permission denied`;
    }

    const existingContent =
      typeof existing.content === "string" ? existing.content : "";
    const newContent = existingContent + content;

    // Check size after append
    if (newContent.length > TERMINAL_CONFIG.MAX_FILE_SIZE) {
      return `append: file would exceed max size (${TERMINAL_CONFIG.MAX_FILE_SIZE} bytes)`;
    }

    existing.content = newContent;
    existing.size = `${newContent.length}`;
    existing.modified = dateStr;
    updateUserFileContent(fullPath, newContent);
    return true;
  }

  // Create new file
  if (content.length > TERMINAL_CONFIG.MAX_FILE_SIZE) {
    return `append: content too large (max ${TERMINAL_CONFIG.MAX_FILE_SIZE} bytes)`;
  }

  if (isAtFileLimit()) {
    return `append: cannot create '${name}': Too many user files (max ${TERMINAL_CONFIG.MAX_USER_FILES})`;
  }

  current.children[name] = {
    name,
    type: "file",
    permissions: "-rw-r--r--",
    owner: "guest",
    size: `${content.length}`,
    modified: dateStr,
    content,
  };

  addUserFile({ path: fullPath, type: "file", content });
  return true;
}
