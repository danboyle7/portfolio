import type { Command, CommandResult } from "@/lib/terminal/types";

export const slCommand: Command = {
  name: "sl",
  description: "Steam locomotive (you meant ls, right?)",
  usage: "sl",
  hidden: true,
  execute: (): CommandResult => {
    return {
      output: [],
      enterInteractiveMode: { type: "sl" },
    };
  },
};
