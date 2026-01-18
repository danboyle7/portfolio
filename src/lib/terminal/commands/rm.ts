import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine, resolvePath } from "@/lib/terminal/utils";
import { removeFile } from "@/lib/terminal/storage";

export const rmCommand: Command = {
  name: "rm",
  description: "Remove files or directories",
  usage: "rm [-rf] <file|directory>",
  execute: (args, context): CommandResult => {
    if (args.length === 0) {
      return {
        output: [createLine("rm: missing operand", "error")],
      };
    }

    // Parse flags
    let recursive = false;
    let force = false;
    const paths: string[] = [];

    for (const arg of args) {
      if (arg.startsWith("-") && arg.length > 1) {
        // Handle combined flags like -rf, -fr, -r, -f
        const flags = arg.slice(1);
        for (const flag of flags) {
          switch (flag) {
            case "r":
            case "R":
              recursive = true;
              break;
            case "f":
              force = true;
              break;
            default:
              return {
                output: [
                  createLine(`rm: invalid option -- '${flag}'`, "error"),
                  createLine("Try 'rm -rf' to remove directories", "system"),
                ],
              };
          }
        }
      } else {
        paths.push(arg);
      }
    }

    if (paths.length === 0) {
      return {
        output: [createLine("rm: missing operand", "error")],
      };
    }

    const results: CommandResult["output"] = [];

    for (const path of paths) {
      const fullPath = resolvePath(context.currentPath, path);

      // Use removeFile which handles both files and directories
      const result = removeFile(context.fileSystem, fullPath, {
        recursive,
        force,
      });

      if (result !== true) {
        results.push(createLine(result, "error"));
      }
    }

    return { output: results };
  },
};
