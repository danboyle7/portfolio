import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';

export const portfolioHubCommand: Command = {
  name: 'portfolio',
  description: 'Open interactive portfolio hub',
  usage: 'portfolio',
  aliases: ['hub', 'about'],
  execute: (): CommandResult => {
    return {
      output: [createLine('Opening portfolio hub...', 'system')],
      enterInteractiveMode: { type: 'hub' },
    };
  },
};

