import type { Command, CommandResult } from '../../types';
import { createLine } from '../../utils';

export const sudoCommand: Command = {
  name: 'sudo',
  description: 'Execute command as superuser',
  usage: 'sudo <command>',
  hidden: true,
  execute: (args): CommandResult => {
    const command = args.join(' ');
    
    // Check for the infamous rm -rf /
    if (command.includes('rm') && command.includes('-rf') && command.includes('/')) {
      const lines: string[] = [];
      lines.push('');
      lines.push('<span class="term-red font-bold">☠️  DANGER: SYSTEM DESTRUCTION INITIATED ☠️</span>');
      lines.push('');
      lines.push('<span class="term-red">Deleting /usr...</span>');
      lines.push('<span class="term-red">Deleting /etc...</span>');
      lines.push('<span class="term-red">Deleting /home...</span>');
      lines.push('<span class="term-red">Deleting /var...</span>');
      lines.push('<span class="term-red">Deleting system32... wait, wrong OS</span>');
      lines.push('');
      lines.push('<span class="term-yellow">████████████████████████████████ 100%</span>');
      lines.push('');
      lines.push('<span class="term-green font-bold">JK! 😂 Nice try though!</span>');
      lines.push('');
      lines.push('<span class="term-dim">This is a virtual filesystem. You can\'t break anything here.</span>');
      lines.push('<span class="term-dim">But seriously, don\'t run this on real systems! 🙏</span>');
      lines.push('');
      lines.push('  ╔═══════════════════════════════════════════════════════════╗');
      lines.push('  ║                                                           ║');
      lines.push('  ║   🏆 Achievement Unlocked: "Tried to Break Everything"    ║');
      lines.push('  ║                                                           ║');
      lines.push('  ╚═══════════════════════════════════════════════════════════╝');
      lines.push('');

      return {
        output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
        triggerEffect: 'destroy',
      };
    }

    // Any other sudo command
    if (command) {
      return {
        output: [
          createLine('', 'output'),
          createLine('<span class="term-yellow">guest is not in the sudoers file.</span>', 'warning', { isHtml: true }),
          createLine('<span class="term-yellow">This incident will be reported.</span>', 'warning', { isHtml: true }),
          createLine('', 'output'),
          createLine('<span class="term-dim">(Just kidding, you\'re a guest here! 😊)</span>', 'system', { isHtml: true }),
          createLine('', 'output'),
        ],
      };
    }

    return {
      output: [
        createLine('usage: sudo <command>', 'error'),
      ],
    };
  },
};

