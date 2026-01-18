import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine, resolvePath } from "@/lib/terminal/utils";
import { removeDirectory } from "@/lib/terminal/storage";

export const rmdirCommand: Command = {
  name: "rmdir",
  description: "Remove empty directories",
  usage: "rmdir <directory>",
  execute: (args, context): CommandResult => {
    if (args.length === 0) {
      return {
        output: [createLine("rmdir: missing operand", "error")],
      };
    }

    const results: CommandResult["output"] = [];

    for (const arg of args) {
      // Skip flags
      if (arg.startsWith("-")) {
        results.push(
          createLine(`rmdir: invalid option -- '${arg.slice(1)}'`, "error"),
        );
        continue;
      }

      const fullPath = resolvePath(context.currentPath, arg);
      const result = removeDirectory(context.fileSystem, fullPath);

      if (result !== true) {
        results.push(createLine(result, "error"));
      }
    }

    return { output: results };
  },
};
