import type { Command, CommandResult, SkillCategory } from '../types';
import { createLine, createProgressBar } from '../utils';
import { getContentData } from '../file-system';

export const skillsCommand: Command = {
  name: 'skills',
  description: 'Display technical skills',
  usage: 'skills [category]',
  execute: (args): CommandResult => {
    const skills = getContentData('skills') as SkillCategory[] | undefined;

    // Check if content is loaded
    if (!skills || skills.length === 0) {
      return {
        output: [
          createLine('', 'output'),
          createLine('No skills data found.', 'warning'),
          createLine('Content may not be loaded. Try running: pnpm run generate-content', 'system'),
          createLine('', 'output'),
        ],
      };
    }

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
    lines.push('+------------------------------------------------------------------+');
    lines.push('|                      TECHNICAL SKILLS                            |');
    lines.push('+------------------------------------------------------------------+');
    lines.push('');

    for (const cat of filteredSkills) {
      // Use >> as icon if emoji present (to avoid emojis in terminal)
      const icon = cat.icon && !cat.icon.includes('>') ? '>>' : cat.icon;
      lines.push(`<span class="term-cyan font-bold">${icon} ${cat.name.toUpperCase()}</span>`);
      lines.push('<span class="term-dim">---------------------------------------------------</span>');

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
