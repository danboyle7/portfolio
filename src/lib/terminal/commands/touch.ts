import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine, resolvePath } from "@/lib/terminal/utils";
import { createFile } from "@/lib/terminal/storage";

export const touchCommand: Command = {
  name: "touch",
  description: "Create an empty file or update file timestamp",
  usage: "touch <file> [file2] ...",
  execute: (args, context): CommandResult => {
    if (args.length === 0) {
      return {
        output: [createLine("touch: missing file operand", "error")],
      };
    }

    const results: CommandResult["output"] = [];

    for (const arg of args) {
      // Skip flags (could add -c for no-create in future)
      if (arg.startsWith("-")) {
        results.push(
          createLine(`touch: invalid option -- '${arg.slice(1)}'`, "error"),
        );
        continue;
      }

      const fullPath = resolvePath(context.currentPath, arg);
      const result = createFile(context.fileSystem, fullPath);

      if (result !== true) {
        results.push(createLine(result, "error"));
      }
    }

    return { output: results };
  },
};
