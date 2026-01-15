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
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = parseInt(month ?? "1", 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}

// Calculate duration between two dates
function calculateDuration(startDate: string, endDate?: string): string {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const end = endDate
    ? endDate.split("-").map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];
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

// Truncate text to approximately maxSentences worth of content
function truncateDescription(
  description: string,
  maxChars: number = 150,
): string {
  // First, normalize the text by joining lines within paragraphs
  const normalized = description
    .split(/\n\s*\n/)
    .map((p) =>
      p
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l)
        .join(" "),
    )
    .join(" ")
    .trim();

  if (normalized.length <= maxChars) {
    return normalized;
  }
  // Truncate at word boundary
  const truncated = normalized.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export const projectsCommand: Command = {
  name: "projects",
  description: "Display portfolio projects",
  usage: "projects [--all] [-n|--name <project-name>]",
  aliases: ["portfolio", "repos"],
  execute: (args): CommandResult => {
    // Parse arguments
    const allFlag = args.includes("--all");
    const nameIndex = Math.max(args.indexOf("--name"), args.indexOf("-n"));
    const projectName =
      nameIndex !== -1 && args[nameIndex + 1]
        ? args.slice(nameIndex + 1).join(" ")
        : null;

    // Default: launch interactive mode
    if (!allFlag && !projectName) {
      return {
        output: [
          createLine("Launching interactive projects viewer...", "system"),
        ],
        enterInteractiveMode: { type: "portfolio", section: "projects" },
      };
    }

    const projects = getContentData("projects") as Project[] | undefined;

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

    // --name <project-name>: Show detailed view of a specific project
    if (projectName) {
      const project = projects.find(
        (p) => p.name.toLowerCase() === projectName.toLowerCase(),
      );

      if (!project) {
        const availableNames = projects.map((p) => p.name).join(", ");
        return {
          output: [
            createLine("", "output"),
            createLine(`Project "${projectName}" not found.`, "error"),
            createLine("", "output"),
            createLine(`Available projects: ${availableNames}`, "system"),
            createLine("", "output"),
          ],
        };
      }

      return renderDetailedProject(project);
    }

    // --all: Show all projects in snapshot view
    if (allFlag) {
      return renderAllProjects(projects);
    }

    // Fallback to interactive mode
    return {
      output: [
        createLine("Launching interactive projects viewer...", "system"),
      ],
      enterInteractiveMode: { type: "portfolio", section: "projects" },
    };
  },
};

function renderDetailedProject(project: Project): CommandResult {
  const lines: string[] = [];
  const statusColors: Record<string, string> = {
    production: "term-green",
    beta: "term-yellow",
    development: "term-cyan",
    archived: "term-dim",
  };
  const statusIcons: Record<string, string> = {
    production: "●",
    beta: "◐",
    development: "○",
    archived: "◌",
  };

  lines.push("");
  lines.push(
    "╔══════════════════════════════════════════════════════════════════╗",
  );
  lines.push(
    `║  <span class="term-blue font-bold">${project.name.padEnd(62)}</span>║`,
  );
  lines.push(
    "╚══════════════════════════════════════════════════════════════════╝",
  );
  lines.push("");

  // Status and timeline
  const statusColor = statusColors[project.status] ?? "term-dim";
  const statusIcon = statusIcons[project.status] ?? "○";
  lines.push(
    `<span class="${statusColor}">${statusIcon} ${project.status.toUpperCase()}</span>`,
  );

  if (project.start_date) {
    const endDisplay = project.end_date
      ? formatDate(project.end_date)
      : "Present";
    const duration = calculateDuration(project.start_date, project.end_date);
    lines.push(
      `<span class="term-dim">${formatDate(project.start_date)} – ${endDisplay}</span>  <span class="term-cyan">(${duration})</span>`,
    );
  }
  lines.push("");

  // Description - join lines within paragraphs, preserve paragraph breaks
  lines.push('<span class="term-dim">─── Description ───</span>');
  const paragraphs = project.description.split(/\n\s*\n/);
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    if (!paragraph?.trim()) continue;
    // Join lines within a paragraph into a single line
    const text = paragraph
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .join(" ");
    lines.push(`  ${text}`);
    // Add extra blank line between paragraphs (but not after the last one)
    if (i < paragraphs.length - 1) {
      lines.push("");
    }
  }
  lines.push("");

  // Technologies
  if (project.technologies.length > 0) {
    lines.push('<span class="term-dim">─── Technologies ───</span>');
    lines.push(
      `  <span class="term-magenta">${project.technologies.join(" | ")}</span>`,
    );
    lines.push("");
  }

  // Links
  if (project.repo || project.live) {
    lines.push('<span class="term-dim">─── Links ───</span>');
    if (project.repo) {
      const repoIcon =
        project.repo_source === "gitlab"
          ? "🦊"
          : project.repo_source === "bitbucket"
            ? "🪣"
            : "🐙";
      lines.push(
        `  ${repoIcon} <span class="term-cyan">${project.repo}</span>`,
      );
    }
    if (project.live) {
      lines.push(`  🌐 <span class="term-green">${project.live}</span>`);
    }
    lines.push("");
  } else {
    lines.push('<span class="term-dim">[Private Repository]</span>');
    lines.push("");
  }

  return {
    output: lines.map((line) => createLine(line, "output", { isHtml: true })),
  };
}

function renderAllProjects(projects: Project[]): CommandResult {
  const lines: string[] = [];
  const statusColors: Record<string, string> = {
    production: "term-green",
    beta: "term-yellow",
    development: "term-cyan",
    archived: "term-dim",
  };
  const statusIcons: Record<string, string> = {
    production: "●",
    beta: "◐",
    development: "○",
    archived: "◌",
  };

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
    const statusColor = statusColors[project.status] ?? "term-dim";
    const statusIcon = statusIcons[project.status] ?? "○";

    // Project name with status
    lines.push(
      `<span class="term-blue font-bold">${project.name}</span>  <span class="${statusColor}">${statusIcon} ${project.status}</span>`,
    );

    // Timeline (if available)
    if (project.start_date) {
      const endDisplay = project.end_date
        ? formatDate(project.end_date)
        : "Present";
      const duration = calculateDuration(project.start_date, project.end_date);
      lines.push(
        `  <span class="term-dim">${formatDate(project.start_date)} – ${endDisplay}</span>  <span class="term-cyan">(${duration})</span>`,
      );
    }

    // Truncated description (1-2 lines)
    const shortDesc = truncateDescription(project.description, 150);
    lines.push(`  <span class="term-dim">${shortDesc}</span>`);

    // Technologies (abbreviated)
    if (project.technologies.length > 0) {
      const techStr =
        project.technologies.length > 4
          ? project.technologies.slice(0, 4).join(" | ") + " ..."
          : project.technologies.join(" | ");
      lines.push(`  <span class="term-magenta">${techStr}</span>`);
    }

    lines.push("");
  }

  lines.push(
    "-------------------------------------------------------------------",
  );
  lines.push(
    `<span class="term-dim">Total: ${projects.length} projects | Use 'projects --name <name>' for details</span>`,
  );
  lines.push("");

  return {
    output: lines.map((line) => createLine(line, "output", { isHtml: true })),
  };
}
