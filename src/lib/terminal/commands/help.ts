import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';

export const helpCommand: Command = {
  name: 'help',
  description: 'Display available commands',
  usage: 'help [command]',
  aliases: ['?', 'h'],
  execute: (args): CommandResult => {
    if (args.length > 0) {
      // Show help for specific command
      const cmdName = args[0]!.toLowerCase();
      const cmdHelp = getCommandHelp(cmdName);
      if (cmdHelp) {
        return {
          output: [
            createLine(``, 'output'),
            createLine(`  ${cmdHelp.name.toUpperCase()}`, 'success'),
            createLine(`  ${cmdHelp.description}`, 'output'),
            createLine(``, 'output'),
            createLine(`  Usage: ${cmdHelp.usage}`, 'output'),
            ...(cmdHelp.aliases ? [createLine(`  Aliases: ${cmdHelp.aliases.join(', ')}`, 'system')] : []),
            createLine(``, 'output'),
          ],
        };
      }
      return {
        output: [createLine(`help: no help topics match '${cmdName}'`, 'error')],
      };
    }

    // Show all commands
    return {
      output: [
        createLine('', 'output'),
        createLine('╔══════════════════════════════════════════════════════════════════╗', 'system'),
        createLine('║                    PORTFOLIO TERMINAL v1.0.0                     ║', 'system'),
        createLine('╚══════════════════════════════════════════════════════════════════╝', 'system'),
        createLine('', 'output'),
        createLine('  NAVIGATION', 'success'),
        createLine('  ──────────', 'system'),
        createLine('  cd <dir>       Change directory (try: cd ~/experience)', 'output'),
        createLine('  ls [-la]       List directory contents', 'output'),
        createLine('  pwd            Print working directory', 'output'),
        createLine('  tree           Show directory structure', 'output'),
        createLine('  cat <file>     Display file contents', 'output'),
        createLine('', 'output'),
        createLine('  PORTFOLIO', 'success'),
        createLine('  ─────────', 'system'),
        createLine('  profile        Display system/profile info', 'output'),
        createLine('  skills         View technical skills', 'output'),
        createLine('  experience     View work experience', 'output'),
        createLine('  education      View education history', 'output'),
        createLine('  projects       View portfolio projects', 'output'),
        createLine('  blog           View blog posts', 'output'),
        createLine('  contact        View contact information', 'output'),
        createLine('  message        Send me a message', 'output'),
        createLine('', 'output'),
        createLine('  UTILITIES', 'success'),
        createLine('  ─────────', 'system'),
        createLine('  whoami         Display current user', 'output'),
        createLine('  date           Display current date/time', 'output'),
        createLine('  echo <text>    Print text to terminal', 'output'),
        createLine('  history        Show command history', 'output'),
        createLine('  clear          Clear terminal screen', 'output'),
        createLine('  exit           Close terminal session', 'output'),
        createLine('', 'output'),
        createLine('  TIP: Try exploring with cd, ls, and cat!', 'warning'),
        createLine('  TIP: Hidden files start with . (use ls -a)', 'warning'),
        createLine('', 'output'),
      ],
    };
  },
};

interface CommandHelp {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
}

function getCommandHelp(name: string): CommandHelp | null {
  const helpData: Record<string, CommandHelp> = {
    cd: {
      name: 'cd',
      description: 'Change the current working directory',
      usage: 'cd [directory]\n\n  Examples:\n    cd ~         Go to home directory\n    cd ..        Go to parent directory\n    cd ~/skills  Go to skills directory',
    },
    ls: {
      name: 'ls',
      description: 'List directory contents',
      usage: 'ls [-la] [directory]\n\n  Options:\n    -l    Long format with details\n    -a    Show hidden files\n    -la   Both options combined',
      aliases: ['dir', 'll'],
    },
    cat: {
      name: 'cat',
      description: 'Display file contents',
      usage: 'cat <file>\n\n  Examples:\n    cat README.md\n    cat ~/about/README.md',
    },
    tree: {
      name: 'tree',
      description: 'Display directory structure as a tree',
      usage: 'tree [directory]\n\n  Examples:\n    tree         Show from current directory\n    tree ~       Show from home directory',
    },
    profile: {
      name: 'profile',
      description: 'Display system and profile information with ASCII art',
      usage: 'profile',
      aliases: ['me', 'about', 'info'],
    },
    skills: {
      name: 'skills',
      description: 'Display technical skills with proficiency levels',
      usage: 'skills [category]\n\n  Categories: languages, frameworks, tools, all',
    },
    clear: {
      name: 'clear',
      description: 'Clear the terminal screen',
      usage: 'clear',
      aliases: ['cls'],
    },
  };

  return helpData[name] ?? null;
}

