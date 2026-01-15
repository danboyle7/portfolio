import type { Command, CommandResult } from "@/lib/terminal/types";
import { createLine } from "@/lib/terminal/utils";
import { getContentData } from "@/lib/terminal/file-system";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  status: "production" | "beta" | "development" | "archived";
  repo?: string;
  repo_source?: "github" | "gitlab" | "bitbucket";
  live?: string;
  stars?: number;
  start_date?: string; // Format: YYYY-MM
  end_date?: string; // Format: YYYY-MM
}

// Format date string (YYYY-MM) to readable format (e.g., "Jan 2024")
function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = parseInt(month ?? "1", 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}

// Calculate duration between two dates
function calculateDuration(startDate: string, endDate?: string): string {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const end = endDate ? endDate.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const [endYear, endMonth] = end;

  if (!startYear || !startMonth || !endYear || !endMonth) return "";

  let months = (endYear - startYear) * 12 + (endMonth - startMonth);
  months = Math.max(1, months + 1);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths}mo`;
  } else if (remainingMonths === 0) {
    return `${years}yr`;
  } else {
    return `${years}yr ${remainingMonths}mo`;
  }
}

export const projectsCommand: Command = {
  name: "projects",
  description: "Display portfolio projects",
  usage: "projects [-i] [--detailed]",
  aliases: ["portfolio", "repos"],
  execute: (args): CommandResult => {
    // Check for interactive mode flag (default if no args)
    if (
      args.includes("-i") ||
      args.includes("--interactive") ||
      args.length === 0
    ) {
      return {
        output: [
          createLine("Launching interactive projects viewer...", "system"),
        ],
        enterInteractiveMode: { type: "portfolio", section: "projects" },
      };
    }

    const projects = getContentData("projects") as Project[] | undefined;
    const detailed = args.includes("--detailed") || args.includes("-d");

    // Check if content is loaded
    if (!projects || projects.length === 0) {
      return {
        output: [
          createLine("", "output"),
          createLine("No projects found.", "warning"),
          createLine(
            "Content may not be loaded. Try running: pnpm run generate-content",
            "system",
          ),
          createLine("", "output"),
        ],
      };
    }

    const lines: string[] = [];
    lines.push("");
    lines.push(
      "+------------------------------------------------------------------+",
    );
    lines.push(
      "|                          PROJECTS                                |",
    );
    lines.push(
      "+------------------------------------------------------------------+",
    );
    lines.push("");

    for (const project of projects) {
      const statusColors: Record<string, string> = {
        production: "term-green",
        beta: "term-yellow",
        development: "term-cyan",
        archived: "term-dim",
      };
      const statusColor = statusColors[project.status] ?? "term-dim";
      const statusIcon =
        project.status === "production"
          ? "[+]"
          : project.status === "beta"
            ? "[~]"
            : project.status === "development"
              ? "[.]"
              : "[-]";

      // Project header with name and status
      lines.push(
        `<span class="term-blue font-bold">>> ${project.name}</span>  <span class="${statusColor}">${statusIcon} ${project.status.toUpperCase()}</span>`,
      );

      // Timeline (if available)
      if (project.start_date) {
        const endDisplay = project.end_date ? formatDate(project.end_date) : "Present";
        const duration = calculateDuration(project.start_date, project.end_date);
        lines.push(
          `   <span class="term-dim">${formatDate(project.start_date)} - ${endDisplay}</span>  <span class="term-cyan">(${duration})</span>`,
        );
      }

      // Handle multi-line descriptions (preserving paragraph breaks)
      const paragraphs = project.description.split(/\n\s*\n/);
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        if (!paragraph) continue;
        // Split paragraph into lines and output each
        const paraLines = paragraph.split("\n").filter((line) => line.trim() !== "");
        for (const line of paraLines) {
          lines.push(`   ${line.trim()}`);
        }
        // Add blank line between paragraphs (but not after the last one)
        if (i < paragraphs.length - 1) {
          lines.push("");
        }
      }
      lines.push(
        `   <span class="term-magenta">${project.technologies.join(" | ")}</span>`,
      );

      if (detailed || project.stars || project.repo) {
        const extras: string[] = [];
        if (project.stars) extras.push(`* ${project.stars}`);
        if (project.repo) extras.push(`@ ${project.repo}`);
        if (project.live) extras.push(`> ${project.live}`);
        if (!project.repo) extras.push(`[private]`);
        if (extras.length > 0) {
          lines.push(`   <span class="term-dim">${extras.join("  ")}</span>`);
        }
      }
      lines.push("");
    }

    const totalStars = projects.reduce((sum, p) => sum + (p.stars ?? 0), 0);
    lines.push(
      "-------------------------------------------------------------------",
    );
    lines.push(
      `<span class="term-dim">Total: ${projects.length} projects | ${totalStars} stars</span>`,
    );
    lines.push("");

    return {
      output: lines.map((line) => createLine(line, "output", { isHtml: true })),
    };
  },
};
