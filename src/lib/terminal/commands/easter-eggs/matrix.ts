import type { Command, CommandResult } from '../../types';
import { createLine } from '../../utils';

export const matrixCommand: Command = {
  name: 'matrix',
  description: 'Enter the Matrix',
  usage: 'matrix',
  hidden: true,
  execute: (): CommandResult => {
    const lines: string[] = [];
    lines.push('');
    lines.push('<span class="term-green">Wake up, Neo...</span>');
    lines.push('');
    lines.push('<span class="term-green">The Matrix has you...</span>');
    lines.push('');
    lines.push('<span class="term-green">Follow the white rabbit.</span>');
    lines.push('');
    lines.push('<span class="term-green font-bold">Knock, knock, Neo.</span>');
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
      triggerEffect: 'matrix',
    };
  },
};

