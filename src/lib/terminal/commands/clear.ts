import type { Command, CommandResult } from '@/lib/terminal/types';

export const clearCommand: Command = {
  name: 'clear',
  description: 'Clear terminal screen',
  usage: 'clear',
  aliases: ['cls'],
  execute: (): CommandResult => {
    return {
      output: [],
      clearScreen: true,
    };
  },
};

