import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";

export const pwdCommand: Command = {
  name: "pwd",
  description: "Print working directory",
  usage: "pwd",
  execute: (_args, context): CommandResult => {
    return {
      output: [createLine(context.currentPath, "output")],
    };
  },
};
