import type { Command, CommandResult } from '@/lib/terminal/types';
import { createLine } from '@/lib/terminal/utils';

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

