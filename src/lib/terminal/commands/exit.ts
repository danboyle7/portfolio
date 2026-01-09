import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';

export const exitCommand: Command = {
  name: 'exit',
  description: 'Exit terminal session',
  usage: 'exit',
  aliases: ['logout', 'quit'],
  execute: (): CommandResult => {
    return {
      output: [
        createLine('', 'output'),
        createLine('╔════════════════════════════════════════════════╗', 'system'),
        createLine('║                                                ║', 'system'),
        createLine('║   Thanks for visiting my portfolio!            ║', 'system'),
        createLine('║                                                ║', 'system'),
        createLine('║   The terminal is eternal... refreshing...     ║', 'system'),
        createLine('║                                                ║', 'system'),
        createLine('╚════════════════════════════════════════════════╝', 'system'),
        createLine('', 'output'),
      ],
      triggerEffect: 'reboot',
    };
  },
};

