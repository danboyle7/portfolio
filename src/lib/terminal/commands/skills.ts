import type { Command, CommandResult, SkillCategory } from '../types';
import { createLine, createProgressBar } from '../utils';
import { getContentData } from '../file-system';

export const skillsCommand: Command = {
  name: 'skills',
  description: 'Display technical skills',
  usage: 'skills [category]',
  execute: (args): CommandResult => {
    const skillsData = getContentData('skills') as SkillCategory[] | undefined;
    
    // Default skills if no content loaded
    const defaultSkills: SkillCategory[] = [
      {
        name: 'Languages',
        icon: '💻',
        skills: [
          { name: 'TypeScript', level: 95 },
          { name: 'JavaScript', level: 95 },
          { name: 'Python', level: 85 },
          { name: 'Rust', level: 70 },
          { name: 'Go', level: 65 },
          { name: 'SQL', level: 80 },
        ],
      },
      {
        name: 'Frameworks',
        icon: '🚀',
        skills: [
          { name: 'React', level: 95 },
          { name: 'Next.js', level: 95 },
          { name: 'Node.js', level: 90 },
          { name: 'Express', level: 85 },
          { name: 'FastAPI', level: 75 },
          { name: 'Tailwind CSS', level: 90 },
        ],
      },
      {
        name: 'Tools & DevOps',
        icon: '🔧',
        skills: [
          { name: 'Git', level: 95 },
          { name: 'Docker', level: 85 },
          { name: 'Kubernetes', level: 70 },
          { name: 'AWS', level: 80 },
          { name: 'CI/CD', level: 85 },
          { name: 'Linux', level: 85 },
        ],
      },
      {
        name: 'Databases',
        icon: '🗄️',
        skills: [
          { name: 'PostgreSQL', level: 90 },
          { name: 'MongoDB', level: 80 },
          { name: 'Redis', level: 75 },
          { name: 'SQLite', level: 85 },
        ],
      },
    ];

    const skills = skillsData ?? defaultSkills;
    const category = args[0]?.toLowerCase();

    // Filter by category if specified
    let filteredSkills = skills;
    if (category && category !== 'all') {
      filteredSkills = skills.filter(
        (cat) => cat.name.toLowerCase().includes(category)
      );
      
      if (filteredSkills.length === 0) {
        return {
          output: [
            createLine(`skills: category '${category}' not found`, 'error'),
            createLine(`Available: ${skills.map((s) => s.name.toLowerCase()).join(', ')}`, 'system'),
          ],
        };
      }
    }

    const lines: string[] = [];
    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════╗');
    lines.push('║                    TECHNICAL SKILLS                          ║');
    lines.push('╚══════════════════════════════════════════════════════════════╝');
    lines.push('');

    for (const cat of filteredSkills) {
      lines.push(`<span class="term-cyan font-bold">${cat.icon} ${cat.name.toUpperCase()}</span>`);
      lines.push('<span class="term-dim">───────────────────────────────────────────────────</span>');
      
      for (const skill of cat.skills) {
        const bar = createProgressBar(skill.level, 25, '█', '░');
        const levelStr = `${skill.level}%`.padStart(4);
        const nameStr = skill.name.padEnd(15);
        
        let barColor = 'term-green';
        if (skill.level < 70) barColor = 'term-yellow';
        if (skill.level < 50) barColor = 'term-red';
        
        lines.push(
          `  ${nameStr} <span class="${barColor}">${bar}</span> <span class="term-dim">${levelStr}</span>`
        );
      }
      lines.push('');
    }

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

