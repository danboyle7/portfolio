import type { Command, CommandResult } from '../../types';
import { createLine, randomFrom } from '../../utils';

const fortunes = [
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
  '"First, solve the problem. Then, write the code." - John Johnson',
  '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
  '"Simplicity is the soul of efficiency." - Austin Freeman',
  '"Make it work, make it right, make it fast." - Kent Beck',
  '"The best error message is the one that never shows up." - Thomas Fuchs',
  '"Programming isn\'t about what you know; it\'s about what you can figure out." - Chris Pine',
  '"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie',
  '"Deleted code is debugged code." - Jeff Sickel',
  '"It\'s not a bug – it\'s an undocumented feature." - Anonymous',
  '"Talk is cheap. Show me the code." - Linus Torvalds',
  '"Programs must be written for people to read, and only incidentally for machines to execute." - Harold Abelson',
  '"The most disastrous thing that you can ever learn is your first programming language." - Alan Kay',
  '"There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton',
  '"The best thing about a boolean is even if you are wrong, you are only off by a bit." - Anonymous',
  '"A language that doesn\'t affect the way you think about programming is not worth knowing." - Alan Perlis',
  '"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday\'s code." - Dan Salomon',
  '"Measuring programming progress by lines of code is like measuring aircraft building progress by weight." - Bill Gates',
  '"Debugging is twice as hard as writing the code in the first place." - Brian Kernighan',
  '"The computer was born to solve problems that did not exist before." - Bill Gates',
];

export const fortuneCommand: Command = {
  name: 'fortune',
  description: 'Display a random programming fortune',
  usage: 'fortune',
  hidden: true,
  execute: (): CommandResult => {
    const fortune = randomFrom(fortunes);
    
    const lines: string[] = [];
    lines.push('');
    lines.push('╭────────────────────────────────────────────────────────────────╮');
    lines.push('│  <span class="term-yellow">🔮 FORTUNE COOKIE</span>                                             │');
    lines.push('├────────────────────────────────────────────────────────────────┤');
    
    // Word wrap the fortune
    const words = fortune.split(' ');
    let currentLine = '│  ';
    const maxWidth = 60;
    
    for (const word of words) {
      if ((currentLine + word).length > maxWidth) {
        lines.push(currentLine.padEnd(66) + '│');
        currentLine = '│  ' + word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    lines.push(currentLine.padEnd(66) + '│');
    
    lines.push('╰────────────────────────────────────────────────────────────────╯');
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

