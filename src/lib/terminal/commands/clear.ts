import type { Command, CommandResult } from '../types';

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

