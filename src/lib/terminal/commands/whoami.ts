import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';

export const whoamiCommand: Command = {
  name: 'user',
  description: 'Print current username',
  usage: 'user',
  execute: (_args, context): CommandResult => {
    return {
      output: [createLine(context.user, 'output')],
    };
  },
};

