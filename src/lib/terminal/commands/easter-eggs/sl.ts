import type { Command, CommandResult } from '../../types';
import { createLine } from '../../utils';

export const slCommand: Command = {
  name: 'sl',
  description: 'Steam locomotive (you meant ls, right?)',
  usage: 'sl',
  hidden: true,
  execute: (): CommandResult => {
    // ASCII art train
    const train = [
      '',
      '<span class="term-yellow">You meant "ls", didn\'t you? 🚂</span>',
      '',
      '      ====        ________                ___________',
      '  _D _|  |_______/        \\__I_I_____===__|_________|',
      '   |(_)---  |   H\\________/ |   |        =|___ ___|',
      '   /     |  |   H  |  |     |   |         ||_| |_||',
      '  |      |  |   H  |__--------------------| [___] |',
      '  | ________|___H__/__|_____/[][]~\\_______|       |',
      '  |/ |   |-----------I_____I [][] []  D   |=======|__',
      '__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__',
      ' |/-=|___|=    ||    ||    ||    |_____/~\\___/       ',
      '  \\_/      \\O=====O=====O=====O_/      \\_/           ',
      '',
      '<span class="term-dim">Pro tip: Be careful with those fingers! 😉</span>',
      '',
    ];

    return {
      output: train.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

