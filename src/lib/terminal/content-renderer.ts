/**
 * Content Renderer
 *
 * Renders content from the content cache for display in the terminal.
 * All content comes from YAML files via the generated content.
 *
 * NO DEFAULT CONTENT - YAML files are the single source of truth.
 */

import type { CommandResult, ContentData, About, Experience, SkillCategory, Education, BlogPost, ContactInfo, Hobby } from './types';
import { createLine, createProgressBar } from './utils';
import { getContentData } from './file-system';

/**
 * Render content data to terminal output
 */
export function renderContentData(content: ContentData): CommandResult {
  switch (content.type) {
    case 'about':
      return renderAbout();
    case 'experience':
      return renderExperience();
    case 'skills':
      return renderSkills();
    case 'education':
      return renderEducation();
    case 'blog':
      return renderBlogList();
    case 'contact':
      return renderContact();
    case 'hobbies':
      return renderHobbies();
    case 'projects':
      return renderProjects();
    default:
      return {
        output: [createLine('[Content not available]', 'warning')],
      };
  }
}

function noContentMessage(type: string): CommandResult {
  return {
    output: [
      createLine('', 'output'),
      createLine(`No ${type} data found.`, 'warning'),
      createLine('Content may not be loaded. Try running: pnpm run generate-content', 'system'),
      createLine('', 'output'),
    ],
  };
}

function renderAbout(): CommandResult {
  const about = getContentData('about') as About | undefined;

  if (!about) {
    return noContentMessage('about');
  }

  const lines: string[] = [];
  lines.push('');
  lines.push('# ABOUT ME');
  lines.push('-----------------------------------------------------------');
  lines.push('');
  lines.push(`<span class="term-green font-bold">${about.name}</span>`);
  lines.push(`<span class="term-cyan">${about.title}</span>`);
  lines.push(`<span class="term-dim">"${about.tagline}"</span>`);
  lines.push('');

  for (const paragraph of about.bio) {
    lines.push(paragraph);
    lines.push('');
  }

  lines.push('-----------------------------------------------------------');
  lines.push('');
  lines.push('<span class="term-yellow">TIP:</span> Run `profile` for a prettier overview!');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderExperience(): CommandResult {
  const experience = getContentData('experience') as Experience[] | undefined;

  if (!experience || experience.length === 0) {
    return noContentMessage('experience');
  }

  const lines: string[] = [];
  lines.push('');
  lines.push('# WORK EXPERIENCE');
  lines.push('===================================================================');
  lines.push('');

  for (const job of experience) {
    lines.push(`<span class="term-green font-bold">${job.role}</span> @ <span class="term-cyan">${job.company}</span>`);
    lines.push(`<span class="term-dim">${job.period} | ${job.location}</span>`);
    lines.push('');
    lines.push(job.description);
    lines.push('');
    lines.push('<span class="term-yellow">Highlights:</span>');
    for (const highlight of job.highlights) {
      lines.push(`  * ${highlight}`);
    }
    lines.push('');
    lines.push(`<span class="term-magenta">Stack: ${job.technologies.join(' | ')}</span>`);
    lines.push('');
    lines.push('-------------------------------------------------------------------');
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `experience` for the full interactive experience view</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderSkills(): CommandResult {
  const skills = getContentData('skills') as SkillCategory[] | undefined;

  if (!skills || skills.length === 0) {
    return noContentMessage('skills');
  }

  const lines: string[] = [];
  lines.push('');
  lines.push('# TECHNICAL SKILLS');
  lines.push('===================================================================');
  lines.push('');

  for (const category of skills) {
    lines.push(`<span class="term-cyan font-bold">>> ${category.name}</span>`);
    lines.push('');

    for (const skill of category.skills) {
      const bar = createProgressBar(skill.level, 20, '▓', '░');
      lines.push(`  ${skill.name.padEnd(15)} <span class="term-green">${bar}</span> ${skill.level}%`);
    }
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `skills` for the full interactive skills view</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderEducation(): CommandResult {
  const education = getContentData('education') as Education[] | undefined;

  if (!education || education.length === 0) {
    return noContentMessage('education');
  }

  const lines: string[] = [];
  lines.push('');
  lines.push('# EDUCATION');
  lines.push('===================================================================');
  lines.push('');

  for (const edu of education) {
    lines.push(`<span class="term-green font-bold">[*] ${edu.degree} in ${edu.field}</span>`);
    lines.push(`    <span class="term-cyan">${edu.institution}</span>`);
    lines.push(`    <span class="term-dim">${edu.period} | ${edu.location}</span>`);
    if (edu.gpa) {
      lines.push(`    <span class="term-yellow">GPA: ${edu.gpa}</span>`);
    }
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `education` for the full view</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderBlogList(): CommandResult {
  const blogData = getContentData('blog') as BlogPost[] | undefined;

  const lines: string[] = [];
  lines.push('');
  lines.push('# BLOG');
  lines.push('===================================================================');
  lines.push('');

  if (blogData && blogData.length > 0) {
    for (const post of blogData.slice(0, 5)) {
      lines.push(`<span class="term-green">>> ${post.title}</span>`);
      lines.push(`   <span class="term-dim">${post.date}</span>`);
      lines.push('');
    }
  } else {
    lines.push('No blog posts found.');
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `blog` for the full blog listing</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderContact(): CommandResult {
  const contact = getContentData('contact') as ContactInfo | undefined;

  if (!contact) {
    return noContentMessage('contact');
  }

  const lines: string[] = [];
  lines.push('');
  lines.push('# CONTACT');
  lines.push('===================================================================');
  lines.push('');
  lines.push(`<span class="term-cyan">Email:</span>    <span class="term-green">${contact.email}</span>`);
  lines.push(`<span class="term-cyan">GitHub:</span>   ${contact.github}`);
  lines.push(`<span class="term-cyan">LinkedIn:</span> ${contact.linkedin}`);
  if (contact.twitter) {
    lines.push(`<span class="term-cyan">Twitter:</span>  ${contact.twitter}`);
  }
  lines.push(`<span class="term-cyan">Location:</span> ${contact.location}`);
  lines.push(`<span class="term-cyan">Status:</span>   <span class="term-green">${contact.availability}</span>`);
  lines.push('');
  lines.push('<span class="term-dim">Run `contact` for more details</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderHobbies(): CommandResult {
  const hobbies = getContentData('hobbies') as Hobby[] | undefined;

  if (!hobbies || hobbies.length === 0) {
    return noContentMessage('hobbies');
  }

  const lines: string[] = [];
  lines.push('');
  lines.push('# HOBBIES & INTERESTS');
  lines.push('===================================================================');
  lines.push('');

  for (const hobby of hobbies) {
    // Use >> instead of emoji icons
    lines.push(`<span class="term-cyan">>> ${hobby.name}</span>`);
    lines.push(`   ${hobby.description}`);
    lines.push('');
  }

  lines.push('<span class="term-dim">Life isn\'t all about code... but mostly it is!</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  status: string;
}

function renderProjects(): CommandResult {
  const projects = getContentData('projects') as Project[] | undefined;

  if (!projects || projects.length === 0) {
    return noContentMessage('projects');
  }

  const lines: string[] = [];
  lines.push('');
  lines.push('# PROJECTS');
  lines.push('===================================================================');
  lines.push('');

  for (const project of projects) {
    lines.push(`<span class="term-green font-bold">[*] ${project.name}</span>`);
    lines.push(`    ${project.description}`);
    lines.push(`    <span class="term-magenta">Stack: ${project.technologies.join(' | ')}</span>`);
    if (project.github) {
      lines.push(`    <span class="term-cyan">Repo: ${project.github}</span>`);
    }
    if (project.url) {
      lines.push(`    <span class="term-cyan">URL: ${project.url}</span>`);
    }
    lines.push(`    <span class="term-dim">Status: ${project.status}</span>`);
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `projects` for the full interactive projects view</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}
