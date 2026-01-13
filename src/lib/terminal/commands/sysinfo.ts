import type { Command, CommandResult } from '@/lib/terminal/types';
import { createLine } from '@/lib/terminal/utils';
import { VERSION } from '@/lib/version';

export const sysinfoCommand: Command = {
  name: 'sysinfo',
  description: 'Display system information (neofetch style)',
  usage: 'sysinfo',
  aliases: ['neofetch', 'info'],
  execute: (_args, _context): CommandResult => {
    // ASCII art logo
    const logo = [
      '        ▄▄▄▄▄▄▄▄▄▄▄        ',
      '      ▄█████████████▄      ',
      '    ▄███▀▀▀▀▀▀▀▀▀▀███▄    ',
      '   ████   ▄▄▄▄▄   ████   ',
      '   ████   █████   ████   ',
      '   ████   █████   ████   ',
      '   ████   ▀▀▀▀▀   ████   ',
      '    ▀███▄▄▄▄▄▄▄▄▄███▀    ',
      '      ▀█████████████▀      ',
      '        ▀▀▀▀▀▀▀▀▀▀▀        ',
    ];

    // System info lines
    const info = [
      { label: 'OS', value: `Portfolio OS v${VERSION}` },
      { label: 'Host', value: 'Web Browser' },
      { label: 'Kernel', value: 'Next.js 16.x' },
      { label: 'Shell', value: 'zsh' },
      { label: 'Terminal', value: 'Portfolio Terminal' },
      { label: 'Resolution', value: 'Responsive' },
      { label: 'Theme', value: 'Dracula' },
      { label: 'Icons', value: 'Lucide' },
    ];

    const output: string[] = [];
    const logoWidth = 30;

    // Render logo alongside system info
    for (let i = 0; i < Math.max(logo.length, info.length + 2); i++) {
      const logoLine = logo[i] ?? ' '.repeat(28);
      let infoLine = '';

      if (i === 0) {
        // User@host line
        infoLine = '<span class="term-green font-bold">visitor</span><span class="term-white">@</span><span class="term-green font-bold">portfolio</span>';
      } else if (i === 1) {
        // Separator
        infoLine = '<span class="term-dim">─────────────────────</span>';
      } else if (i - 2 < info.length) {
        const item = info[i - 2]!;
        infoLine = `<span class="term-cyan font-bold">${item.label}</span><span class="term-white">:</span> <span class="term-white">${item.value}</span>`;
      }

      output.push(`<span class="term-cyan">${logoLine}</span>  ${infoLine}`);
    }

    output.push('');

    // Color palette
    output.push(' '.repeat(logoWidth) + '<span class="term-bg-black">   </span><span class="term-bg-red">   </span><span class="term-bg-green">   </span><span class="term-bg-yellow">   </span><span class="term-bg-blue">   </span><span class="term-bg-magenta">   </span><span class="term-bg-cyan">   </span><span class="term-bg-white">   </span>');
    output.push('');

    return {
      output: output.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};
