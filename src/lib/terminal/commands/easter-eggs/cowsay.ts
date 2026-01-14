import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";

export const cowsayCommand: Command = {
  name: "cowsay",
  description: "Have a cow say something",
  usage: "cowsay <message>",
  hidden: true,
  execute: (args): CommandResult => {
    const message = args.join(" ") || "Moo! You found an easter egg!";

    // Create the speech bubble
    const maxWidth = Math.min(message.length, 40);
    const lines = wrapText(message, maxWidth);
    const bubbleWidth = Math.max(...lines.map((l) => l.length)) + 2;

    const output: string[] = [];
    output.push(" " + "_".repeat(bubbleWidth));

    if (lines.length === 1) {
      output.push(`< ${lines[0]!.padEnd(bubbleWidth - 2)} >`);
    } else {
      output.push(`/ ${lines[0]!.padEnd(bubbleWidth - 2)} \\`);
      for (let i = 1; i < lines.length - 1; i++) {
        output.push(`| ${lines[i]!.padEnd(bubbleWidth - 2)} |`);
      }
      output.push(`\\ ${lines[lines.length - 1]!.padEnd(bubbleWidth - 2)} /`);
    }

    output.push(" " + "-".repeat(bubbleWidth));

    // The cow
    output.push("        \\   ^__^");
    output.push("         \\  (oo)\\_______");
    output.push("            (__)\\       )\\/\\");
    output.push("                ||----w |");
    output.push("                ||     ||");
    output.push("");

    return {
      output: output.map((line) => createLine(line, "output")),
      triggerEffect: "cowsay",
    };
  },
};

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxWidth) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [""];
}
