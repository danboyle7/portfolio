import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";

export const resumeCommand: Command = {
  name: "resume",
  description: "Download resume",
  usage: "resume [--full | --short]",
  aliases: ["cv"],
  execute: (args): CommandResult => {
    const fullFlag = args.includes("--full");
    const shortFlag = args.includes("--short");

    // Default to condensed (short) version
    const isFullVersion = fullFlag && !shortFlag;
    const resumePath = isFullVersion
      ? "/resume/dboyle-resume-full.pdf"
      : "/resume/dboyle-resume-condensed.pdf";
    const versionName = isFullVersion ? "full" : "one-page";

    return {
      output: [createLine(`Opening ${versionName} resume...`, "system")],
      openUrl: resumePath,
    };
  },
};
