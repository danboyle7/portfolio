import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";

export const historyCommand: Command = {
  name: "history",
  description: "Show command history",
  usage: "history [n]",
  execute: (args, context): CommandResult => {
    let limit = context.history.length;

    if (args.length > 0) {
      const n = parseInt(args[0]!);
      if (!isNaN(n) && n > 0) {
        limit = Math.min(n, context.history.length);
      }
    }

    const historySlice = context.history.slice(-limit);
    const startIndex = context.history.length - limit + 1;

    const lines = historySlice.map((cmd, idx) => {
      const lineNum = (startIndex + idx).toString().padStart(4);
      return createLine(`${lineNum}  ${cmd}`, "output");
    });

    return { output: lines };
  },
};
