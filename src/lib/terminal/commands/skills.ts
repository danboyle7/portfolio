import type {
  Command,
  CommandResult,
  SkillCategory,
} from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";
import { getContentData } from "@/lib/terminal/file-system";

export const skillsCommand: Command = {
  name: "skills",
  description: "Display technical skills",
  usage: "skills [-i] [category]",
  execute: (args): CommandResult => {
    // Check for interactive mode flag
    if (
      args.includes("-i") ||
      args.includes("--interactive") ||
      args.length === 0
    ) {
      return {
        output: [
          createLine("Launching interactive skills viewer...", "system"),
        ],
        enterInteractiveMode: { type: "portfolio", section: "skills" },
      };
    }

    const skills = getContentData("skills") as SkillCategory[] | undefined;

    // Check if content is loaded
    if (!skills || skills.length === 0) {
      return {
        output: [
          createLine("", "output"),
          createLine("No skills data found.", "warning"),
          createLine(
            "Content may not be loaded. Try running: pnpm run generate-content",
            "system",
          ),
          createLine("", "output"),
        ],
      };
    }

    const filteredArgs = args.filter(
      (a) => a !== "-i" && a !== "--interactive",
    );
    const category = filteredArgs[0]?.toLowerCase();

    // Filter by category if specified
    let filteredSkills = skills;
    if (category && category !== "all") {
      filteredSkills = skills.filter((cat) =>
        cat.name.toLowerCase().includes(category),
      );

      if (filteredSkills.length === 0) {
        return {
          output: [
            createLine(`skills: category '${category}' not found`, "error"),
            createLine(
              `Available: ${skills.map((s) => s.name.toLowerCase()).join(", ")}`,
              "system",
            ),
          ],
        };
      }
    }

    const lines: string[] = [];
    lines.push("");
    lines.push(
      "+------------------------------------------------------------------+",
    );
    lines.push(
      "|                      TECHNICAL SKILLS                            |",
    );
    lines.push(
      "+------------------------------------------------------------------+",
    );
    lines.push("");

    for (const cat of filteredSkills) {
      // Use >> as icon if emoji present (to avoid emojis in terminal)
      const icon = cat.icon && !cat.icon.includes(">") ? ">>" : cat.icon;
      lines.push(
        `<span class="term-cyan font-bold">${icon} ${cat.name.toUpperCase()}</span>`,
      );
      lines.push(
        '<span class="term-dim">---------------------------------------------------</span>',
      );

      for (const skill of cat.skills) {
        const nameStr = skill.name.padEnd(24);
        const years = skill.years
          ? `<span class="term-dim">${skill.years}+ yrs</span>`
          : "";
        lines.push(
          `  <span class="term-green">›</span> <span class="term-green">${nameStr}</span>${years}`,
        );
      }
      lines.push("");
    }

    return {
      output: lines.map((line) => createLine(line, "output", { isHtml: true })),
    };
  },
};
