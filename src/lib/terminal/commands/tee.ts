import type {
  Command,
  CommandResult,
  FileSystemNode,
} from "@/lib/terminal/types";
import { createLine, resolvePath } from "@/lib/terminal/utils";
import { writeFile, appendFile } from "@/lib/terminal/storage";

export const teeCommand: Command = {
  name: "tee",
  description: "Read from stdin and write to file and stdout",
  usage: "command | tee [-a] <file>",
  execute: (args, _context): CommandResult => {
    // Parse flags
    const files: string[] = [];

    for (const arg of args) {
      if (arg === "-a" || arg === "--append") {
        // Append mode is handled in executeTee
      } else if (arg.startsWith("-")) {
        return {
          output: [
            createLine(`tee: invalid option -- '${arg.slice(1)}'`, "error"),
          ],
        };
      } else {
        files.push(arg);
      }
    }

    if (files.length === 0) {
      return {
        output: [
          createLine("tee: missing file operand", "error"),
          createLine("Usage: command | tee [-a] <file>", "system"),
        ],
      };
    }

    // When used standalone (not in a pipe), tee has no input
    // In pipe context, the input is handled by executeCommand
    // Here we just inform the user
    return {
      output: [
        createLine(
          "tee: no input (use with pipe, e.g., echo hello | tee file.txt)",
          "system",
        ),
      ],
    };
  },
};

/**
 * Helper function for pipe execution to write to tee files
 * Returns error message or null on success
 */
export function executeTee(
  fileSystem: FileSystemNode,
  currentPath: string,
  input: string,
  args: string[],
): string | null {
  let appendMode = false;
  const files: string[] = [];

  for (const arg of args) {
    if (arg === "-a" || arg === "--append") {
      appendMode = true;
    } else if (!arg.startsWith("-")) {
      files.push(arg);
    }
  }

  for (const file of files) {
    const fullPath = resolvePath(currentPath, file);
    const result = appendMode
      ? appendFile(fileSystem, fullPath, input)
      : writeFile(fileSystem, fullPath, input);

    if (result !== true) {
      return result;
    }
  }

  return null;
}
