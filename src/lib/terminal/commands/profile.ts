import type {
  Command,
  CommandResult,
  About,
  Experience,
  Education,
} from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";
import { getContentData } from "@/lib/terminal/file-system";

export const profileCommand: Command = {
  name: "profile",
  description: "Display profile overview with experience and education",
  usage: "profile",
  aliases: ["me", "about"],
  execute: (_args, _context): CommandResult => {
    const aboutData = getContentData("about") as About | undefined;
    const experienceData = getContentData("experience") as
      | Experience[]
      | undefined;
    const educationData = getContentData("education") as
      | Education[]
      | undefined;

    const name = aboutData?.name ?? "Daniel Boyle";
    const title = aboutData?.title ?? "Software Developer";
    const tagline =
      aboutData?.tagline ?? "Building the future, one commit at a time";

    const output: string[] = [];

    // Compact header
    output.push("");
    output.push(
      `<span class="term-green font-bold">▓▓▓</span> <span class="term-white font-bold">${name}</span>`,
    );
    output.push(`<span class="term-cyan">${title}</span>`);
    output.push(`<span class="term-dim">"${tagline}"</span>`);
    output.push("");

    // Most recent job
    if (experienceData && experienceData.length > 0) {
      const job = experienceData[0]!;
      output.push(
        `<span class="term-yellow">Current</span>  <span class="term-white">${job.role}</span> <span class="term-dim">@</span> <span class="term-green">${job.company}</span>`,
      );
    }

    // Most recent degree
    if (educationData && educationData.length > 0) {
      const edu = educationData[0]!;
      output.push(
        `<span class="term-yellow">Degree</span>   <span class="term-white">${edu.degree}</span> <span class="term-dim">·</span> <span class="term-green">${edu.institution}</span>`,
      );
    }

    output.push("");
    output.push(
      '<span class="term-dim">Run `experience` or `education` for full details</span>',
    );
    output.push("");

    return {
      output: output.map((line) =>
        createLine(line, "output", { isHtml: true }),
      ),
    };
  },
};
