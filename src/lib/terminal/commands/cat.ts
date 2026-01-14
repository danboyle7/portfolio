import type { Command, CommandResult, ContentData } from "@/lib/terminal/types";
import { createLine, resolvePath, escapeHtml } from "@/lib/terminal/utils";
import { navigateToPath, getFileContent } from "@/lib/terminal/file-system";
import { renderContentData } from "@/lib/terminal/content-renderer";

export const catCommand: Command = {
  name: "cat",
  description: "Display file contents",
  usage: "cat <file>",
  aliases: ["less", "more"],
  execute: (args, context): CommandResult => {
    if (args.length === 0) {
      return {
        output: [createLine("cat: missing file operand", "error")],
      };
    }

    const target = args[0]!;
    const targetPath = resolvePath(context.currentPath, target);
    const node = navigateToPath(context.fileSystem, targetPath);

    if (!node) {
      return {
        output: [
          createLine(`cat: ${target}: No such file or directory`, "error"),
        ],
      };
    }

    if (node.type === "directory") {
      return {
        output: [createLine(`cat: ${target}: Is a directory`, "error")],
      };
    }

    const content = getFileContent(context.fileSystem, targetPath);

    if (content === null) {
      return {
        output: [createLine(`cat: ${target}: Unable to read file`, "error")],
      };
    }

    // Check for restricted files
    if (content === "__RESTRICTED__") {
      const lines: string[] = [];
      lines.push("");
      lines.push('<span class="term-red font-bold">ACCESS DENIED</span>');
      lines.push("");
      lines.push(
        `<span class="term-dim">cat: ${target}: Permission denied</span>`,
      );
      lines.push("");
      lines.push(
        '<span class="term-yellow">You do not have permission to view this file.</span>',
      );
      lines.push(
        '<span class="term-dim">This file is owned by root and requires elevated privileges.</span>',
      );
      lines.push("");

      // Add intriguing hints based on the file
      if (target.includes("classified") || target.includes("project_x")) {
        lines.push(
          '<span class="term-dim">+----------------------------------------------------------+</span>',
        );
        lines.push(
          '<span class="term-dim">|</span> <span class="term-yellow">NOTICE:</span> This file contains classified information.     <span class="term-dim">|</span>',
        );
        lines.push(
          '<span class="term-dim">|</span> Unauthorized access attempts are logged and monitored.   <span class="term-dim">|</span>',
        );
        lines.push(
          '<span class="term-dim">+----------------------------------------------------------+</span>',
        );
        lines.push("");
        lines.push(
          '<span class="term-dim">Curious about what\'s inside? Some secrets are meant to</span>',
        );
        lines.push('<span class="term-dim">stay hidden... for now. ;)</span>');
      } else if (target.includes("shadow")) {
        lines.push(
          '<span class="term-dim">The shadow file contains encrypted password hashes.</span>',
        );
        lines.push('<span class="term-dim">Nice try though!</span>');
      } else if (target.includes("notes")) {
        lines.push(
          '<span class="term-dim">Personal notes of the system administrator.</span>',
        );
        lines.push(
          '<span class="term-dim">What could they be working on?</span>',
        );
      }
      lines.push("");

      return {
        output: lines.map((line) =>
          createLine(line, "output", { isHtml: true }),
        ),
      };
    }

    // Check if it's dynamic content
    if (typeof content === "object" && "type" in content) {
      return renderContentData(content as ContentData);
    }

    // Check for binary files
    if (typeof content === "string" && content.startsWith("[Binary file")) {
      return {
        output: [createLine(content, "warning")],
      };
    }

    // Regular text file
    const lines = (content as string).split("\n");
    return {
      output: lines.map((line) =>
        createLine(escapeHtml(line), "output", { isHtml: true }),
      ),
    };
  },
};
