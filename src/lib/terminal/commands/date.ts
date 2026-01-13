import type { Command, CommandResult } from '@/lib/terminal/types';
import { createLine } from '@/lib/terminal/utils';

export const dateCommand: Command = {
  name: 'date',
  description: 'Display current date and time',
  usage: 'date',
  execute: (): CommandResult => {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

    return {
      output: [createLine(formatted, 'output')],
    };
  },
};

