import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine, escapeHtml } from "@/lib/terminal/utils";

export const echoCommand: Command = {
  name: "echo",
  description: "Print text to terminal",
  usage: "echo <text>",
  execute: (args, context): CommandResult => {
    let text = args.join(" ");

    // Handle special shell variables ($?, $$, $0, etc.)
    text = text.replace(/\$\?/g, context.env["?"] ?? "0");
    text = text.replace(/\$\$/g, context.env.$ ?? "1337");
    text = text.replace(/\$0/g, context.env["0"] ?? "bash");

    // Handle regular environment variables
    text = text.replace(/\$(\w+)/g, (_, varName: string) => {
      return context.env[varName] ?? "";
    });

    // Handle special escape sequences
    text = text.replace(/\\n/g, "\n").replace(/\\t/g, "\t");

    const lines = text
      .split("\n")
      .map((line) => createLine(escapeHtml(line), "output", { isHtml: true }));

    return { output: lines };
  },
};
