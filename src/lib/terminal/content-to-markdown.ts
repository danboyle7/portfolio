/**
 * Content -> Markdown
 *
 * Converts ContentData placeholder files into readable Markdown *source* text,
 * so `vim` can open them read-only just like a real .md file would.
 *
 * This mirrors the same data used by content-renderer.ts (which produces the
 * colorized `cat` view), but emits plain Markdown syntax instead of terminal
 * HTML spans — which is exactly what you'd see editing a .md file in vim.
 */

import type {
  ContentData,
  About,
  Experience,
  SkillCategory,
  Education,
  BlogPost,
  ContactInfo,
  Hobby,
} from "./types";
import { getContentData } from "./file-system";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  status: string;
}

/**
 * Convert a ContentData placeholder into Markdown source text.
 * Returns null when there is no data to render (content not loaded).
 */
export function contentDataToMarkdown(content: ContentData): string | null {
  switch (content.type) {
    case "about":
      return aboutToMarkdown();
    case "experience":
      return experienceToMarkdown();
    case "skills":
      return skillsToMarkdown();
    case "education":
      return educationToMarkdown();
    case "blog":
      return blogToMarkdown();
    case "contact":
      return contactToMarkdown();
    case "hobbies":
      return hobbiesToMarkdown();
    case "projects":
      return projectsToMarkdown();
    default:
      return null;
  }
}

function aboutToMarkdown(): string | null {
  const about = getContentData("about") as About | undefined;
  if (!about) return null;

  const lines: string[] = [];
  lines.push("# About Me");
  lines.push("");
  lines.push(`**${about.name}**`);
  lines.push(`_${about.title}_`);
  lines.push("");
  lines.push(`> ${about.tagline}`);
  lines.push("");
  // bio may be a single (possibly multi-line) string or an array of paragraphs.
  const paragraphs = Array.isArray(about.bio) ? about.bio : [about.bio];
  for (const paragraph of paragraphs) {
    for (const line of String(paragraph).split("\n")) {
      lines.push(line);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

function experienceToMarkdown(): string | null {
  const experience = getContentData("experience") as Experience[] | undefined;
  if (!experience || experience.length === 0) return null;

  const lines: string[] = [];
  lines.push("# Work Experience");
  lines.push("");

  experience.forEach((job, index) => {
    lines.push(`## ${job.role} @ ${job.company}`);
    lines.push("");
    lines.push(`_${job.period} — ${job.location}_`);
    lines.push("");
    lines.push(job.description);
    lines.push("");
    lines.push("**Highlights**");
    lines.push("");
    for (const highlight of job.highlights) {
      lines.push(`- ${highlight}`);
    }
    lines.push("");
    lines.push(`**Stack:** ${job.technologies.join(", ")}`);
    lines.push("");
    if (index < experience.length - 1) {
      lines.push("---");
      lines.push("");
    }
  });

  return lines.join("\n").trimEnd() + "\n";
}

function skillsToMarkdown(): string | null {
  const skills = getContentData("skills") as SkillCategory[] | undefined;
  if (!skills || skills.length === 0) return null;

  const lines: string[] = [];
  lines.push("# Technical Skills");
  lines.push("");

  for (const category of skills) {
    lines.push(`## ${category.name}`);
    lines.push("");
    for (const skill of category.skills) {
      const years = skill.years ? ` (${skill.years}+ yrs)` : "";
      lines.push(`- ${skill.name}${years}`);
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function educationToMarkdown(): string | null {
  const education = getContentData("education") as Education[] | undefined;
  if (!education || education.length === 0) return null;

  const lines: string[] = [];
  lines.push("# Education");
  lines.push("");

  for (const edu of education) {
    lines.push(`## ${edu.degree} in ${edu.field}`);
    lines.push("");
    lines.push(`- **Institution:** ${edu.institution}`);
    lines.push(`- **Period:** ${edu.period} — ${edu.location}`);
    if (edu.gpa) {
      lines.push(`- **GPA:** ${edu.gpa}`);
    }
    lines.push("");
    if (edu.highlights && edu.highlights.length > 0) {
      lines.push("**Highlights**");
      lines.push("");
      for (const highlight of edu.highlights) {
        lines.push(`- ${highlight}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trimEnd() + "\n";
}

function blogToMarkdown(): string | null {
  const blog = getContentData("blog") as BlogPost[] | undefined;
  if (!blog || blog.length === 0) return null;

  const lines: string[] = [];
  lines.push("# Blog");
  lines.push("");

  for (const post of blog) {
    lines.push(`## ${post.title}`);
    lines.push("");
    lines.push(`_${post.date} · ${post.readTime}_`);
    lines.push("");
    if (post.tags && post.tags.length > 0) {
      lines.push(`Tags: ${post.tags.map((tag) => `\`${tag}\``).join(", ")}`);
      lines.push("");
    }
    lines.push(post.excerpt);
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function contactToMarkdown(): string | null {
  const contact = getContentData("contact") as ContactInfo | undefined;
  if (!contact) return null;

  const lines: string[] = [];
  lines.push("# Contact");
  lines.push("");
  lines.push(`- **Email:** ${contact.email}`);
  lines.push(`- **GitHub:** ${contact.github}`);
  lines.push(`- **LinkedIn:** ${contact.linkedin}`);
  if (contact.twitter) {
    lines.push(`- **Twitter:** ${contact.twitter}`);
  }
  if (contact.website) {
    lines.push(`- **Website:** ${contact.website}`);
  }
  lines.push(`- **Location:** ${contact.locations.join(" | ")}`);
  lines.push(`- **Status:** ${contact.availability}`);

  return lines.join("\n").trimEnd() + "\n";
}

function hobbiesToMarkdown(): string | null {
  const hobbies = getContentData("hobbies") as Hobby[] | undefined;
  if (!hobbies || hobbies.length === 0) return null;

  const lines: string[] = [];
  lines.push("# Hobbies & Interests");
  lines.push("");

  for (const hobby of hobbies) {
    lines.push(`## ${hobby.name}`);
    lines.push("");
    lines.push(hobby.description);
    lines.push("");
    if (hobby.level) {
      lines.push(`_Level: ${hobby.level}_`);
      lines.push("");
    }
  }

  return lines.join("\n").trimEnd() + "\n";
}

function projectsToMarkdown(): string | null {
  const projects = getContentData("projects") as Project[] | undefined;
  if (!projects || projects.length === 0) return null;

  const lines: string[] = [];
  lines.push("# Projects");
  lines.push("");

  for (const project of projects) {
    lines.push(`## ${project.name}`);
    lines.push("");
    lines.push(project.description);
    lines.push("");
    lines.push(`**Stack:** ${project.technologies.join(", ")}`);
    lines.push("");
    if (project.github) {
      lines.push(`- **Repo:** ${project.github}`);
    }
    if (project.url) {
      lines.push(`- **URL:** ${project.url}`);
    }
    lines.push(`- **Status:** ${project.status}`);
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}
