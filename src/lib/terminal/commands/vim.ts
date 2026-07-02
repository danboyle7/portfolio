import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine, resolvePath } from "@/lib/terminal/utils";
import { navigateToPath } from "@/lib/terminal/file-system";
import { isUserCreated, createFile } from "@/lib/terminal/storage";
import { contentDataToMarkdown } from "@/lib/terminal/content-to-markdown";

export const vimCommand: Command = {
  name: "vim",
  description: "Edit a file with vim",
  usage: "vim [file]",
  aliases: ["vi"],
  execute: (args, context): CommandResult => {
    // No file argument - open vim with splash screen
    if (args.length === 0) {
      return {
        output: [],
        enterInteractiveMode: {
          type: "vim",
          data: {
            filePath: "",
            initialContent: "",
            isReadOnly: false,
            isNewFile: true,
            showSplash: true,
          },
        },
      };
    }

    const fileName = args[0]!;
    const fullPath = resolvePath(context.currentPath, fileName);

    // Check if file exists
    const node = navigateToPath(context.fileSystem, fullPath);

    if (node) {
      // File exists
      if (node.type === "directory") {
        return {
          output: [createLine(`vim: '${fileName}' is a directory`, "error")],
        };
      }

      // Check if it's a system file (read-only)
      const isSystem = !isUserCreated(fullPath);

      // Get content
      let content = "";
      if (typeof node.content === "string") {
        content = node.content;
      } else if (
        node.content &&
        typeof node.content === "object" &&
        "type" in node.content
      ) {
        // It's a ContentData placeholder - render it as read-only Markdown
        // source so vim shows a real .md file instead of refusing to open it.
        const markdown = contentDataToMarkdown(node.content);
        if (markdown === null) {
          return {
            output: [
              createLine(
                `vim: '${fileName}' is a special file (read-only)`,
                "error",
              ),
            ],
          };
        }
        content = markdown;
      }

      return {
        output: [],
        enterInteractiveMode: {
          type: "vim",
          data: {
            filePath: fullPath,
            initialContent: content,
            isReadOnly: isSystem,
          },
        },
      };
    }

    // File doesn't exist - create new file
    // Check if parent directory exists
    const parentPath = fullPath.split("/").slice(0, -1).join("/") || "/";
    const parentNode = navigateToPath(context.fileSystem, parentPath);

    if (parentNode?.type !== "directory") {
      return {
        output: [
          createLine(
            `vim: cannot create '${fileName}': No such directory`,
            "error",
          ),
        ],
      };
    }

    // Check write permission
    if (!fullPath.startsWith("/home/guest") && !fullPath.startsWith("/tmp")) {
      return {
        output: [
          createLine(
            `vim: cannot create '${fileName}': Permission denied`,
            "error",
          ),
        ],
      };
    }

    // Create empty file first so it exists in the filesystem
    const createResult = createFile(context.fileSystem, fullPath, "");
    if (createResult !== true) {
      return {
        output: [createLine(createResult, "error")],
      };
    }

    return {
      output: [],
      enterInteractiveMode: {
        type: "vim",
        data: {
          filePath: fullPath,
          initialContent: "",
          isReadOnly: false,
          isNewFile: true,
        },
      },
    };
  },
};
