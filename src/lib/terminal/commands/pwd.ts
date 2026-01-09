import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';

export const pwdCommand: Command = {
  name: 'pwd',
  description: 'Print working directory',
  usage: 'pwd',
  execute: (_args, context): CommandResult => {
    return {
      output: [createLine(context.currentPath, 'output')],
    };
  },
};

