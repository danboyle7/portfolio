import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";

export const resetCommand: Command = {
  name: "reset",
  description: "Reset terminal to initial state",
  usage: "reset [-y]",
  execute: (args): CommandResult => {
    // Check for help
    if (args.includes("-h") || args.includes("--help")) {
      return {
        output: [
          createLine("reset - Reset terminal to initial state", "output"),
          createLine("", "output"),
          createLine("Usage: reset [-y]", "output"),
          createLine("", "output"),
          createLine("Options:", "output"),
          createLine("  -y, --yes    Skip confirmation prompt", "output"),
          createLine("", "output"),
          createLine("This command will:", "output"),
          createLine("  - Clear all command history", "output"),
          createLine("  - Delete all user-created files and directories", "output"),
          createLine("", "output"),
          createLine(
            "Note: System files are not affected. This clears localStorage.",
            "system",
          ),
        ],
      };
    }

    // Check for -y flag (skip confirmation)
    if (args.includes("-y") || args.includes("--yes")) {
      return {
        output: [
          createLine("", "output"),
          createLine("✓ Command history cleared", "success"),
          createLine("✓ User-created files removed", "success"),
          createLine("", "output"),
          createLine("Terminal reset complete.", "system"),
        ],
        resetTerminal: true,
      };
    }

    // Prompt for confirmation
    return {
      output: [
        createLine("This will:", "warning"),
        createLine("  - Clear all command history", "output"),
        createLine("  - Delete all user-created files and directories", "output"),
        createLine("", "output"),
        createLine("Run 'reset -y' to confirm.", "system"),
      ],
    };
  },
};
