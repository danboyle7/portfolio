import type { Command, CommandResult } from '../types';

export const contactCommand: Command = {
  name: 'contact',
  description: 'Open contact information app',
  usage: 'contact',
  aliases: ['email', 'socials'],
  execute: (): CommandResult => {
    return {
      output: [],
      enterInteractiveMode: { type: 'contact' },
    };
  },
};
