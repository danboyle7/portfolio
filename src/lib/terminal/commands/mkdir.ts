import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine, resolvePath } from "@/lib/terminal/utils";
import { createDirectory } from "@/lib/terminal/storage";

export const mkdirCommand: Command = {
  name: "mkdir",
  description: "Create a directory",
  usage: "mkdir <directory>",
  execute: (args, context): CommandResult => {
    if (args.length === 0) {
      return {
        output: [createLine("mkdir: missing operand", "error")],
      };
    }

    const results: CommandResult["output"] = [];

    for (const arg of args) {
      // Skip flags (future -p support could be added)
      if (arg.startsWith("-")) {
        results.push(
          createLine(`mkdir: invalid option -- '${arg.slice(1)}'`, "error"),
        );
        continue;
      }

      const fullPath = resolvePath(context.currentPath, arg);
      const result = createDirectory(context.fileSystem, fullPath);

      if (result !== true) {
        results.push(createLine(result, "error"));
      }
    }

    return { output: results };
  },
};
