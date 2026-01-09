import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';

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
  usage: 'projects [--detailed]',
  aliases: ['portfolio', 'repos'],
  execute: (args): CommandResult => {
    const projectsData = getContentData('projects') as Project[] | undefined;
    const detailed = args.includes('--detailed') || args.includes('-d');

    // Default projects
    const defaultProjects: Project[] = [
      {
        name: 'terminal-portfolio',
        description: 'This terminal-style portfolio you\'re viewing right now!',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        status: 'production',
        github: 'github.com/danielboyle/terminal-portfolio',
        live: 'danielboyle.dev',
        stars: 42,
      },
      {
        name: 'cloud-sync',
        description: 'Real-time file synchronization service with conflict resolution',
        technologies: ['Rust', 'gRPC', 'PostgreSQL', 'Redis'],
        status: 'production',
        github: 'github.com/danielboyle/cloud-sync',
        stars: 128,
      },
      {
        name: 'devtools-extension',
        description: 'Browser extension for debugging React applications',
        technologies: ['TypeScript', 'React', 'Chrome APIs'],
        status: 'beta',
        github: 'github.com/danielboyle/devtools-extension',
        stars: 67,
      },
      {
        name: 'ml-pipeline',
        description: 'Automated machine learning pipeline for data processing',
        technologies: ['Python', 'TensorFlow', 'Docker', 'Airflow'],
        status: 'development',
        github: 'github.com/danielboyle/ml-pipeline',
        stars: 34,
      },
      {
        name: 'api-gateway',
        description: 'High-performance API gateway with rate limiting and caching',
        technologies: ['Go', 'Redis', 'Prometheus', 'Kubernetes'],
        status: 'production',
        github: 'github.com/danielboyle/api-gateway',
        stars: 256,
      },
    ];

    const projects = projectsData ?? defaultProjects;

    const lines: string[] = [];
    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════════╗');
    lines.push('║                        PROJECTS                                  ║');
    lines.push('╚══════════════════════════════════════════════════════════════════╝');
    lines.push('');

    for (const project of projects) {
      const statusColors: Record<string, string> = {
        production: 'term-green',
        beta: 'term-yellow',
        development: 'term-cyan',
        archived: 'term-dim',
      };
      const statusColor = statusColors[project.status] ?? 'term-dim';
      const statusIcon = project.status === 'production' ? '●' : project.status === 'beta' ? '◐' : project.status === 'development' ? '○' : '◌';

      lines.push(`<span class="term-blue font-bold">📁 ${project.name}</span>  <span class="${statusColor}">${statusIcon} ${project.status.toUpperCase()}</span>`);
      lines.push(`   ${project.description}`);
      lines.push(`   <span class="term-magenta">${project.technologies.join(' • ')}</span>`);
      
      if (detailed || project.stars) {
        const extras: string[] = [];
        if (project.stars) extras.push(`⭐ ${project.stars}`);
        if (project.github) extras.push(`🔗 ${project.github}`);
        if (project.live) extras.push(`🌐 ${project.live}`);
        if (extras.length > 0) {
          lines.push(`   <span class="term-dim">${extras.join('  ')}</span>`);
        }
      }
      lines.push('');
    }

    const totalStars = projects.reduce((sum, p) => sum + (p.stars ?? 0), 0);
    lines.push('─'.repeat(68));
    lines.push(`<span class="term-dim">Total: ${projects.length} projects • ${totalStars} ⭐</span>`);
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

