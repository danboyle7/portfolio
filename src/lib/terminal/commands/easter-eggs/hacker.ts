import type { Command, CommandResult } from '../../types';
import { createLine } from '../../utils';

export const hackerCommand: Command = {
  name: 'hacker',
  description: 'Activate hacker mode',
  usage: 'hacker',
  aliases: ['hackerman', 'h4ck3r'],
  hidden: true,
  execute: (): CommandResult => {
    const lines: string[] = [];
    
    lines.push('');
    lines.push('<span class="term-green font-bold">INITIATING HACKER MODE...</span>');
    lines.push('');
    lines.push('<span class="term-dim">$ accessing mainframe...</span>');
    lines.push('<span class="term-green">████████████████████████████████ 100%</span>');
    lines.push('');
    lines.push('<span class="term-dim">$ bypassing firewall...</span>');
    lines.push('<span class="term-green">████████████████████████████████ 100%</span>');
    lines.push('');
    lines.push('<span class="term-dim">$ decrypting password...</span>');
    lines.push('<span class="term-green">████████████████████████████████ 100%</span>');
    lines.push('');
    lines.push('<span class="term-cyan">ACCESS GRANTED</span>');
    lines.push('');
    lines.push('<span class="term-yellow">⚠️  JUST KIDDING!</span>');
    lines.push('<span class="term-dim">This is just a portfolio, not actually hacking anything 😄</span>');
    lines.push('');
    lines.push('  ╔═══════════════════════════════════════════════════════════╗');
    lines.push('  ║                                                           ║');
    lines.push('  ║   "I\'m in" - Every movie hacker ever                     ║');
    lines.push('  ║                                                           ║');
    lines.push('  ╚═══════════════════════════════════════════════════════════╝');
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
      triggerEffect: 'hacker',
    };
  },
};

