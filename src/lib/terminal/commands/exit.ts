import type { Command, CommandResult, AnimatedLine } from '../types';
import { createLine } from '../utils';

// Exit with farewell message
export const exitCommand: Command = {
  name: 'exit',
  description: 'Exit terminal session',
  usage: 'exit',
  aliases: ['logout', 'quit'],
  execute: (): CommandResult => {
    return {
      output: [
        createLine('', 'output'),
        createLine('+------------------------------------------------+', 'system'),
        createLine('|                                                |', 'system'),
        createLine('|   Thanks for visiting my portfolio!            |', 'system'),
        createLine('|                                                |', 'system'),
        createLine('|   The terminal is eternal... refreshing...     |', 'system'),
        createLine('|                                                |', 'system'),
        createLine('+------------------------------------------------+', 'system'),
        createLine('', 'output'),
      ],
      triggerEffect: 'reboot',
    };
  },
};

// Reboot with a fake Linux boot sequence
export const rebootCommand: Command = {
  name: 'reboot',
  description: 'Reboot the terminal',
  usage: 'reboot',
  aliases: ['restart'],
  execute: (): CommandResult => {
    const animatedLines: AnimatedLine[] = [];

    const addLine = (content: string, delay: number) => {
      animatedLines.push({
        line: createLine(content, 'output', { isHtml: true }),
        delay,
      });
    };

    // Shutdown sequence
    addLine('', 0);
    addLine('<span class="term-yellow">Broadcast message from root@portfolio:</span>', 100);
    addLine('', 50);
    addLine('<span class="term-dim">The system is going down for reboot NOW!</span>', 150);
    addLine('', 200);
    addLine('<span class="term-dim">Stopping portfolio services...</span>', 150);
    addLine('<span class="term-green">[  OK  ]</span> Stopped Portfolio Terminal', 100);
    addLine('<span class="term-green">[  OK  ]</span> Stopped Session Manager', 100);
    addLine('<span class="term-green">[  OK  ]</span> Stopped User Slice', 100);
    addLine('<span class="term-dim">Unmounting filesystems...</span>', 150);
    addLine('<span class="term-green">[  OK  ]</span> Unmounted /home', 80);
    addLine('<span class="term-green">[  OK  ]</span> Unmounted /var', 80);
    addLine('<span class="term-dim">Syncing disks...</span>', 100);
    addLine('<span class="term-green">[  OK  ]</span> Reached target Shutdown', 150);
    addLine('', 200);
    addLine('<span class="term-yellow">Rebooting...</span>', 300);
    addLine('', 100);

    return {
      output: [],
      animatedOutput: animatedLines,
      triggerEffect: 'reboot',
    };
  },
};
