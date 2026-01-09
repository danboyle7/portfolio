import type { Command, CommandResult, Experience } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';

export const experienceCommand: Command = {
  name: 'experience',
  description: 'Display work experience',
  usage: 'experience [--timeline]',
  aliases: ['work', 'jobs'],
  execute: (args): CommandResult => {
    const experienceData = getContentData('experience') as Experience[] | undefined;
    const showTimeline = args.includes('--timeline') || args.includes('-t');

    // Default experience data
    const defaultExperience: Experience[] = [
      {
        company: 'Tech Innovations Inc.',
        role: 'Senior Full-Stack Developer',
        period: '2022 - Present',
        location: 'San Francisco, CA',
        description: 'Leading development of cloud-native applications and mentoring junior developers.',
        highlights: [
          'Architected microservices handling 1M+ requests/day',
          'Reduced deployment time by 60% with CI/CD improvements',
          'Led team of 5 developers on flagship product rewrite',
        ],
        technologies: ['TypeScript', 'React', 'Node.js', 'AWS', 'PostgreSQL'],
      },
      {
        company: 'StartupXYZ',
        role: 'Full-Stack Developer',
        period: '2020 - 2022',
        location: 'Remote',
        description: 'Built and scaled a SaaS platform from 0 to 50,000 users.',
        highlights: [
          'Implemented real-time collaboration features',
          'Built payment integration handling $500K+ MRR',
          'Optimized database queries reducing load times by 40%',
        ],
        technologies: ['JavaScript', 'Vue.js', 'Python', 'Django', 'MongoDB'],
      },
      {
        company: 'Digital Agency Co.',
        role: 'Frontend Developer',
        period: '2018 - 2020',
        location: 'New York, NY',
        description: 'Developed responsive web applications for enterprise clients.',
        highlights: [
          'Delivered 20+ client projects on time and within budget',
          'Introduced component library reducing dev time by 30%',
          'Mentored 3 junior developers',
        ],
        technologies: ['React', 'TypeScript', 'CSS', 'Node.js'],
      },
    ];

    const experience = experienceData ?? defaultExperience;

    if (showTimeline) {
      return renderTimeline(experience);
    }

    return renderCards(experience);
  },
};

function renderCards(experience: Experience[]): CommandResult {
  const lines: string[] = [];
  lines.push('');
  lines.push('╔══════════════════════════════════════════════════════════════════╗');
  lines.push('║                      WORK EXPERIENCE                             ║');
  lines.push('╚══════════════════════════════════════════════════════════════════╝');
  lines.push('');

  for (const job of experience) {
    lines.push(`<span class="term-green font-bold">┌─ ${job.role}</span>`);
    lines.push(`<span class="term-cyan">│  @ ${job.company}</span>`);
    lines.push(`<span class="term-dim">│  ${job.period} • ${job.location}</span>`);
    lines.push('│');
    lines.push(`<span class="term-white">│  ${job.description}</span>`);
    lines.push('│');
    lines.push('<span class="term-yellow">│  Highlights:</span>');
    
    for (const highlight of job.highlights) {
      lines.push(`<span class="term-dim">│  </span>  • ${highlight}`);
    }
    
    lines.push('│');
    lines.push(`<span class="term-magenta">│  Stack: ${job.technologies.join(' • ')}</span>`);
    lines.push('└───────────────────────────────────────────────────────────────');
    lines.push('');
  }

  lines.push('<span class="term-dim">Run `experience --timeline` for timeline view</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderTimeline(experience: Experience[]): CommandResult {
  const lines: string[] = [];
  lines.push('');
  lines.push('╔══════════════════════════════════════════════════════════════════╗');
  lines.push('║                    CAREER TIMELINE                               ║');
  lines.push('╚══════════════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push('                            NOW');
  lines.push('                             │');

  for (let i = 0; i < experience.length; i++) {
    const job = experience[i]!;
    const isLast = i === experience.length - 1;
    
    lines.push(`                             │`);
    lines.push(`    <span class="term-green font-bold">${job.period.padStart(20)}</span>  ●──┬── <span class="term-cyan font-bold">${job.role}</span>`);
    lines.push(`                             │  │   <span class="term-white">${job.company}</span>`);
    lines.push(`                             │  │   <span class="term-dim">${job.location}</span>`);
    lines.push(`                             │  └── <span class="term-magenta">${job.technologies.slice(0, 4).join(', ')}</span>`);
    
    if (!isLast) {
      lines.push('                             │');
      lines.push('                             │');
    }
  }

  lines.push('                             │');
  lines.push('                          START');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

