import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine, escapeHtml } from "@/lib/terminal/utils";

export const envCommand: Command = {
  name: "env",
  description: "Print environment variables",
  usage: "env",
  aliases: ["printenv"],
  execute: (args, context): CommandResult => {
    // If an argument is provided, print just that variable
    if (args.length > 0) {
      const varName = args[0]!;
      const value = context.env[varName];
      if (value !== undefined) {
        return {
          output: [createLine(escapeHtml(value), "output", { isHtml: true })],
        };
      }
      return { output: [] };
    }

    // Print all environment variables
    const lines = Object.entries(context.env)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) =>
        createLine(
          `<span class="term-cyan">${escapeHtml(key)}</span>=<span class="term-green">${escapeHtml(value)}</span>`,
          "output",
          { isHtml: true },
        ),
      );

    return {
      output: [createLine("", "output"), ...lines, createLine("", "output")],
    };
  },
};
