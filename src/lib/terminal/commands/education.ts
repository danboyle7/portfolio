import type { Command, CommandResult, Education } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';

export const educationCommand: Command = {
  name: 'education',
  description: 'Display education history',
  usage: 'education',
  aliases: ['edu', 'school'],
  execute: (): CommandResult => {
    const education = getContentData('education') as Education[] | undefined;

    // Check if content is loaded
    if (!education || education.length === 0) {
      return {
        output: [
          createLine('', 'output'),
          createLine('No education data found.', 'warning'),
          createLine('Content may not be loaded. Try running: pnpm run generate-content', 'system'),
          createLine('', 'output'),
        ],
      };
    }

    const lines: string[] = [];
    lines.push('');
    lines.push('+------------------------------------------------------------------+');
    lines.push('|                          EDUCATION                               |');
    lines.push('+------------------------------------------------------------------+');
    lines.push('');

    for (const edu of education) {
      // Certificate-style box
      lines.push('  +------------------------------------------------------------+');
      lines.push(`  |  <span class="term-yellow font-bold">[*] ${edu.degree}</span>`);
      lines.push(`  |      <span class="term-cyan">${edu.field}</span>`);
      lines.push('  |');
      lines.push(`  |  <span class="term-green">${edu.institution}</span>`);
      lines.push(`  |  <span class="term-dim">${edu.period} | ${edu.location}</span>`);

      if (edu.gpa) {
        lines.push(`  |  <span class="term-magenta">GPA: ${edu.gpa}</span>`);
      }

      if (edu.highlights && edu.highlights.length > 0) {
        lines.push('  |');
        for (const highlight of edu.highlights) {
          lines.push(`  |  <span class="term-dim">></span> ${highlight}`);
        }
      }

      lines.push('  +------------------------------------------------------------+');
      lines.push('');
    }

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};
