// Terminal utility functions

import type { TerminalLine } from "./types";

/**
 * Generate a unique ID for terminal lines
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create a terminal line object
 */
export function createLine(
  content: string,
  type: TerminalLine["type"] = "output",
  options: Partial<TerminalLine> = {},
): TerminalLine {
  return {
    id: generateId(),
    type,
    content,
    timestamp: new Date(),
    ...options,
  };
}

/**
 * Create multiple lines from an array of strings
 */
export function createLines(
  contents: string[],
  type: TerminalLine["type"] = "output",
  options: Partial<TerminalLine> = {},
): TerminalLine[] {
  return contents.map((content) => createLine(content, type, options));
}

/**
 * Format file size for display
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}G`;
}

/**
 * Format date for ls -l style output
 */
export function formatDate(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, " ");
  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  return `${month} ${day} ${hours}:${mins}`;
}

/**
 * Parse command input into command and arguments
 */
export function parseCommand(input: string): {
  command: string;
  args: string[];
} {
  const trimmed = input.trim();
  if (!trimmed) return { command: "", args: [] };

  const parts: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";

  for (const char of trimmed) {
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = "";
    } else if (char === " " && !inQuotes) {
      if (current) {
        parts.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current) parts.push(current);

  return {
    command: parts[0]?.toLowerCase() ?? "",
    args: parts.slice(1),
  };
}

/**
 * Resolve path (handles .., ., and absolute paths)
 */
export function resolvePath(currentPath: string, newPath: string): string {
  // Handle absolute paths
  if (newPath.startsWith("/")) {
    return normalizePath(newPath);
  }

  // Handle home shortcut
  if (newPath === "~" || newPath.startsWith("~/")) {
    return normalizePath(newPath.replace("~", "/home/guest"));
  }

  // Handle relative paths
  const currentParts = currentPath.split("/").filter(Boolean);
  const newParts = newPath.split("/").filter(Boolean);

  for (const part of newParts) {
    if (part === "..") {
      currentParts.pop();
    } else if (part !== ".") {
      currentParts.push(part);
    }
  }

  return "/" + currentParts.join("/");
}

/**
 * Normalize a path (remove double slashes, trailing slashes)
 */
export function normalizePath(path: string): string {
  const normalized = path.replace(/\/+/g, "/").replace(/\/$/, "");
  return normalized || "/";
}

/**
 * Get path segments
 */
export function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

/**
 * Format path for display (shorten home directory)
 */
export function formatPath(path: string): string {
  if (path.startsWith("/home/guest")) {
    return path.replace("/home/guest", "~");
  }
  return path;
}

/**
 * Create progress bar string
 */
export function createProgressBar(
  percent: number,
  width = 30 as number,
  filled = "█" as string,
  empty = "░" as string,
): string {
  const filledCount = Math.round((percent / 100) * width);
  const emptyCount = width - filledCount;
  return filled.repeat(filledCount) + empty.repeat(emptyCount);
}

/**
 * Create a skill bar with label
 */
export function createSkillBar(
  name: string,
  level: number,
  width = 20 as number,
): string {
  const bar = createProgressBar(level, width, "▓", "░");
  const levelStr = `${level}%`.padStart(4);
  const nameStr = name.padEnd(15);
  return `${nameStr} ${bar} ${levelStr}`;
}

/**
 * Wrap text to a specific width
 */
export function wrapText(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= width) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Center text within a given width
 */
export function centerText(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text;
}

/**
 * Create a box around text
 */
export function createBox(lines: string[], padding = 1 as number): string[] {
  const maxLength = Math.max(...lines.map((l) => l.length));
  const width = maxLength + padding * 2;

  const result: string[] = [];
  result.push("╔" + "═".repeat(width) + "╗");

  for (const line of lines) {
    const paddedLine = line + " ".repeat(maxLength - line.length);
    result.push(
      "║" + " ".repeat(padding) + paddedLine + " ".repeat(padding) + "║",
    );
  }

  result.push("╚" + "═".repeat(width) + "╝");
  return result;
}

/**
 * Typewriter effect timing
 */
export function getTypewriterDelay(
  text: string,
  baseDelay = 30 as number,
): number {
  return text.length * baseDelay;
}

/**
 * Random from array
 */
export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * Sleep helper for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * ANSI-style color codes for terminal output
 * These will be converted to CSS classes
 */
export const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
} as const;

/**
 * Format text with color class
 */
export function colorize(text: string, color: keyof typeof colors): string {
  return `<span class="term-${color}">${text}</span>`;
}

/**
 * Escape HTML in text
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
