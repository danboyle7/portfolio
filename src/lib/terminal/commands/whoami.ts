import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';

export const whoamiCommand: Command = {
  name: 'whoami',
  description: 'Print current username',
  usage: 'whoami',
  aliases: ['user'],
  execute: (_args, context): CommandResult => {
    return {
      output: [createLine(context.user, 'output')],
    };
  },
};

