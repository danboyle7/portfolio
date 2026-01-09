// Command registry and execution

import type { Command, CommandContext, CommandResult } from '../types';
import { createLine } from '../utils';

// Import all commands
import { helpCommand } from './help';
import { lsCommand } from './ls';
import { cdCommand } from './cd';
import { catCommand } from './cat';
import { pwdCommand } from './pwd';
import { clearCommand } from './clear';
import { profileCommand } from './profile';
import { treeCommand } from './tree';
import { whoamiCommand } from './whoami';
import { echoCommand } from './echo';
import { dateCommand } from './date';
import { historyCommand } from './history';
import { skillsCommand } from './skills';
import { contactCommand } from './contact';
import { experienceCommand } from './experience';
import { educationCommand } from './education';
import { blogCommand } from './blog';
import { projectsCommand } from './projects';
import { messageCommand } from './message';

// Easter egg commands
import { cowsayCommand } from './easter-eggs/cowsay';
import { slCommand } from './easter-eggs/sl';
import { fortuneCommand } from './easter-eggs/fortune';
import { matrixCommand } from './easter-eggs/matrix';
import { hackerCommand } from './easter-eggs/hacker';
import { sudoCommand } from './easter-eggs/sudo';
import { snakeCommand } from './easter-eggs/snake';
import { exitCommand, rebootCommand } from './exit';

// Command registry
const commands: Map<string, Command> = new Map();

// Register all commands
const allCommands: Command[] = [
  helpCommand,
  lsCommand,
  cdCommand,
  catCommand,
  pwdCommand,
  clearCommand,
  profileCommand,
  treeCommand,
  whoamiCommand,
  echoCommand,
  dateCommand,
  historyCommand,
  skillsCommand,
  contactCommand,
  experienceCommand,
  educationCommand,
  blogCommand,
  projectsCommand,
  messageCommand,
  exitCommand,
  rebootCommand,
  // Easter eggs
  cowsayCommand,
  slCommand,
  fortuneCommand,
  matrixCommand,
  hackerCommand,
  sudoCommand,
  snakeCommand,
];

// Initialize command registry
for (const cmd of allCommands) {
  commands.set(cmd.name, cmd);
  // Register aliases
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      commands.set(alias, cmd);
    }
  }
}

/**
 * Get a command by name
 */
export function getCommand(name: string): Command | undefined {
  return commands.get(name.toLowerCase());
}

/**
 * Get all available commands (excluding hidden ones)
 */
export function getAllCommands(): Command[] {
  const seen = new Set<string>();
  const result: Command[] = [];

  for (const cmd of commands.values()) {
    if (!seen.has(cmd.name) && !cmd.hidden) {
      seen.add(cmd.name);
      result.push(cmd);
    }
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Execute a command
 */
export async function executeCommand(
  commandStr: string,
  context: CommandContext
): Promise<CommandResult> {
  const trimmed = commandStr.trim();

  if (!trimmed) {
    return { output: [] };
  }

  // Parse command and args
  const parts = trimmed.split(/\s+/);
  const commandName = parts[0]!.toLowerCase();
  const args = parts.slice(1);

  // Check for special commands first
  if (commandName === 'sudo' && args.join(' ').includes('rm -rf /')) {
    const cmd = getCommand('sudo');
    if (cmd) {
      return cmd.execute(args, context);
    }
  }

  // Get command
  const command = getCommand(commandName);

  if (!command) {
    return {
      output: [
        createLine(
          `zsh: command not found: ${commandName}`,
          'error'
        ),
        createLine(
          `Type 'help' to see available commands.`,
          'system'
        ),
      ],
    };
  }

  try {
    return await command.execute(args, context);
  } catch (error) {
    return {
      output: [
        createLine(
          `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'error'
        ),
      ],
    };
  }
}

/**
 * Get command suggestions for tab completion
 */
export function getCommandSuggestions(partial: string): string[] {
  const lower = partial.toLowerCase();
  const suggestions = new Set<string>();

  for (const cmd of allCommands) {
    if (cmd.hidden) continue;

    // Match command name
    if (cmd.name.startsWith(lower)) {
      suggestions.add(cmd.name);
    }

    // Match aliases
    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        if (alias.startsWith(lower)) {
          suggestions.add(alias);
        }
      }
    }
  }

  return Array.from(suggestions).sort();
}

export { allCommands };

