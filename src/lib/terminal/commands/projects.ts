import type { Command, CommandResult } from '@/lib/terminal/types';
import { createLine } from '@/lib/terminal/utils';
import { getContentData } from '@/lib/terminal/file-system';

interface Project {
  name: string;
  description: string;
  technologies: string[];
  status: 'production' | 'beta' | 'development' | 'archived';
  github?: string;
  live?: string;
  stars?: number;
}

export const projectsCommand: Command = {
  name: 'projects',
  description: 'Display portfolio projects',
  usage: 'projects [-i] [--detailed]',
  aliases: ['portfolio', 'repos'],
  execute: (args): CommandResult => {
    // Check for interactive mode flag (default if no args)
    if (args.includes('-i') || args.includes('--interactive') || args.length === 0) {
      return {
        output: [createLine('Launching interactive projects viewer...', 'system')],
        enterInteractiveMode: { type: 'portfolio', section: 'projects' },
      };
    }

    const projects = getContentData('projects') as Project[] | undefined;
    const detailed = args.includes('--detailed') || args.includes('-d');

    // Check if content is loaded
    if (!projects || projects.length === 0) {
      return {
        output: [
          createLine('', 'output'),
          createLine('No projects found.', 'warning'),
          createLine('Content may not be loaded. Try running: pnpm run generate-content', 'system'),
          createLine('', 'output'),
        ],
      };
    }

    const lines: string[] = [];
    lines.push('');
    lines.push('+------------------------------------------------------------------+');
    lines.push('|                          PROJECTS                                |');
    lines.push('+------------------------------------------------------------------+');
    lines.push('');

    for (const project of projects) {
      const statusColors: Record<string, string> = {
        production: 'term-green',
        beta: 'term-yellow',
        development: 'term-cyan',
        archived: 'term-dim',
      };
      const statusColor = statusColors[project.status] ?? 'term-dim';
      const statusIcon = project.status === 'production' ? '[+]' : project.status === 'beta' ? '[~]' : project.status === 'development' ? '[.]' : '[-]';

      lines.push(`<span class="term-blue font-bold">>> ${project.name}</span>  <span class="${statusColor}">${statusIcon} ${project.status.toUpperCase()}</span>`);
      lines.push(`   ${project.description}`);
      lines.push(`   <span class="term-magenta">${project.technologies.join(' | ')}</span>`);

      if (detailed || project.stars) {
        const extras: string[] = [];
        if (project.stars) extras.push(`* ${project.stars}`);
        if (project.github) extras.push(`@ ${project.github}`);
        if (project.live) extras.push(`> ${project.live}`);
        if (extras.length > 0) {
          lines.push(`   <span class="term-dim">${extras.join('  ')}</span>`);
        }
      }
      lines.push('');
    }

    const totalStars = projects.reduce((sum, p) => sum + (p.stars ?? 0), 0);
    lines.push('-------------------------------------------------------------------');
    lines.push(`<span class="term-dim">Total: ${projects.length} projects | ${totalStars} stars</span>`);
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};
