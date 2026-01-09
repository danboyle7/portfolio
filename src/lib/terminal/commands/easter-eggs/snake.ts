import type { Command, CommandResult } from '../../types';
import { createLine } from '../../utils';

export const snakeCommand: Command = {
  name: 'snake',
  description: 'Play the classic Snake game',
  usage: 'snake',
  hidden: false,
  execute: (): CommandResult => {
    return {
      output: [
        createLine('', 'output'),
        createLine('<span class="term-green font-bold">Starting Snake...</span>', 'output', { isHtml: true }),
        createLine('', 'output'),
      ],
      enterInteractiveMode: {
        type: 'snake' as any,
        data: null,
      },
    };
  },
};
