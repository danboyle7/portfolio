import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";

/**
 * Strip surrounding quotes from a string (single or double)
 */
function stripQuotes(text: string): string {
  // Handle double quotes
  if (text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1);
  }
  // Handle single quotes
  if (text.startsWith("'") && text.endsWith("'")) {
    return text.slice(1, -1);
  }
  return text;
}

export const echoCommand: Command = {
  name: "echo",
  description: "Print text to terminal",
  usage: "echo <text>",
  execute: (args, context): CommandResult => {
    // Join args and then strip outer quotes if present
    let text = args.join(" ");

    // Strip surrounding quotes from the entire string
    text = stripQuotes(text);

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

    // Don't use isHtml - just output as plain text
    const lines = text.split("\n").map((line) => createLine(line, "output"));

    return { output: lines };
  },
};
