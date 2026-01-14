import type { Command, CommandResult, Experience } from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";
import { getContentData } from "@/lib/terminal/file-system";

export const experienceCommand: Command = {
  name: "experience",
  description: "Display work experience",
  usage: "experience [-i] [--timeline]",
  aliases: ["work", "jobs"],
  execute: (args): CommandResult => {
    // Check for interactive mode flag (default if no args)
    if (
      args.includes("-i") ||
      args.includes("--interactive") ||
      args.length === 0
    ) {
      return {
        output: [
          createLine("Launching interactive experience viewer...", "system"),
        ],
        enterInteractiveMode: { type: "portfolio", section: "experience" },
      };
    }

    const experience = getContentData("experience") as Experience[] | undefined;
    const showTimeline = args.includes("--timeline") || args.includes("-t");

    // Check if content is loaded
    if (!experience || experience.length === 0) {
      return {
        output: [
          createLine("", "output"),
          createLine("No experience data found.", "warning"),
          createLine(
            "Content may not be loaded. Try running: pnpm run generate-content",
            "system",
          ),
          createLine("", "output"),
        ],
      };
    }

    if (showTimeline) {
      return renderTimeline(experience);
    }

    return renderCards(experience);
  },
};

function renderCards(experience: Experience[]): CommandResult {
  const lines: string[] = [];
  lines.push("");
  lines.push(
    "+------------------------------------------------------------------+",
  );
  lines.push(
    "|                        WORK EXPERIENCE                           |",
  );
  lines.push(
    "+------------------------------------------------------------------+",
  );
  lines.push("");

  for (const job of experience) {
    lines.push(`<span class="term-green font-bold">+-- ${job.role}</span>`);
    lines.push(`<span class="term-cyan">|   @ ${job.company}</span>`);
    lines.push(
      `<span class="term-dim">|   ${job.period} | ${job.location}</span>`,
    );
    lines.push("|");
    lines.push(`<span class="term-white">|   ${job.description}</span>`);
    lines.push("|");
    lines.push('<span class="term-yellow">|   Highlights:</span>');

    for (const highlight of job.highlights) {
      lines.push(`<span class="term-dim">|   </span>  * ${highlight}`);
    }

    lines.push("|");
    lines.push(
      `<span class="term-magenta">|   Stack: ${job.technologies.join(" | ")}</span>`,
    );
    lines.push(
      "+-------------------------------------------------------------------",
    );
    lines.push("");
  }

  lines.push(
    '<span class="term-dim">Run `experience --timeline` for timeline view</span>',
  );
  lines.push("");

  return {
    output: lines.map((line) => createLine(line, "output", { isHtml: true })),
  };
}

function renderTimeline(experience: Experience[]): CommandResult {
  const lines: string[] = [];
  lines.push("");
  lines.push(
    "+------------------------------------------------------------------+",
  );
  lines.push(
    "|                       CAREER TIMELINE                            |",
  );
  lines.push(
    "+------------------------------------------------------------------+",
  );
  lines.push("");
  lines.push("                            NOW");
  lines.push("                             |");

  for (let i = 0; i < experience.length; i++) {
    const job = experience[i]!;
    const isLast = i === experience.length - 1;

    lines.push("                             |");
    lines.push(
      `    <span class="term-green font-bold">${job.period.padStart(20)}</span>  o--+-- <span class="term-cyan font-bold">${job.role}</span>`,
    );
    lines.push(
      `                             |  |   <span class="term-white">${job.company}</span>`,
    );
    lines.push(
      `                             |  |   <span class="term-dim">${job.location}</span>`,
    );
    lines.push(
      `                             |  +-- <span class="term-magenta">${job.technologies.slice(0, 4).join(", ")}</span>`,
    );

    if (!isLast) {
      lines.push("                             |");
      lines.push("                             |");
    }
  }

  lines.push("                             |");
  lines.push("                          START");
  lines.push("");

  return {
    output: lines.map((line) => createLine(line, "output", { isHtml: true })),
  };
}
