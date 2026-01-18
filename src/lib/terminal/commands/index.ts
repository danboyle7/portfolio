// Command registry and execution

import type {
  Command,
  CommandContext,
  CommandResult,
} from "@/lib/terminal/types";
import { createLine, resolvePath } from "@/lib/terminal/utils";
import { writeFile, appendFile } from "@/lib/terminal/storage";

// Import all commands
import { helpCommand } from "./help";
import { lsCommand } from "./ls";
import { cdCommand } from "./cd";
import { catCommand } from "./cat";
import { pwdCommand } from "./pwd";
import { clearCommand } from "./clear";
import { profileCommand } from "./profile";
import { treeCommand } from "./tree";
import { whoamiCommand } from "./whoami";
import { echoCommand } from "./echo";
import { dateCommand } from "./date";
import { historyCommand } from "./history";
import { skillsCommand } from "./skills";
import { contactCommand } from "./contact";
import { experienceCommand } from "./experience";
import { educationCommand } from "./education";
import { blogCommand } from "./blog";
import { projectsCommand } from "./projects";
import { messageCommand } from "./message";
import { envCommand } from "./env";
import { portfolioHubCommand } from "./portfolio-hub";
import { neofetchCommand } from "./neofetch";
import { resumeCommand } from "./resume";

// File system commands
import { mkdirCommand } from "./mkdir";
import { rmdirCommand } from "./rmdir";
import { rmCommand } from "./rm";
import { touchCommand } from "./touch";
import { teeCommand, executeTee } from "./tee";
import { vimCommand } from "./vim";
import { resetCommand } from "./reset";

// Easter egg commands
import { cowsayCommand } from "./easter-eggs/cowsay";
import { slCommand } from "./easter-eggs/sl";
import { fortuneCommand } from "./easter-eggs/fortune";
import { matrixCommand } from "./easter-eggs/matrix";
import { hackerCommand } from "./easter-eggs/hacker";
import { sudoCommand } from "./easter-eggs/sudo";
import { snakeCommand } from "./easter-eggs/snake";
import { prometheusCommand } from "./easter-eggs/prometheus";
import { exitCommand, rebootCommand } from "./exit";

// Command registry
const commands = new Map<string, Command>();

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
  envCommand,
  portfolioHubCommand,
  neofetchCommand,
  resumeCommand,
  exitCommand,
  rebootCommand,
  // File system commands
  mkdirCommand,
  rmdirCommand,
  rmCommand,
  touchCommand,
  teeCommand,
  vimCommand,
  resetCommand,
  // Easter eggs
  cowsayCommand,
  slCommand,
  fortuneCommand,
  matrixCommand,
  hackerCommand,
  sudoCommand,
  snakeCommand,
  prometheusCommand,
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
 * Parse redirects from a command string
 * Returns { command, redirects } where redirects contains file targets
 */
function parseRedirects(commandStr: string): {
  command: string;
  redirectFile: string | null;
  appendMode: boolean;
} {
  // Match >> or > followed by filename (with possible whitespace)
  const appendMatch = /^(.+?)\s*>>\s*(\S+)\s*$/.exec(commandStr);
  if (appendMatch) {
    return {
      command: appendMatch[1]!.trim(),
      redirectFile: appendMatch[2]!,
      appendMode: true,
    };
  }

  const redirectMatch = /^(.+?)\s*>\s*(\S+)\s*$/.exec(commandStr);
  if (redirectMatch) {
    return {
      command: redirectMatch[1]!.trim(),
      redirectFile: redirectMatch[2]!,
      appendMode: false,
    };
  }

  return { command: commandStr, redirectFile: null, appendMode: false };
}

/**
 * Parse pipes from a command string
 * Returns array of command strings
 */
function parsePipes(commandStr: string): string[] {
  // Simple pipe parsing - split on | but not inside quotes
  // For simplicity, we'll just split on | for now
  return commandStr.split(/\s*\|\s*/).filter(Boolean);
}

/**
 * Extract text output from a command result
 */
function extractOutputText(result: CommandResult): string {
  return result.output
    .filter((line) => line.type !== "system")
    .map((line) => line.content)
    .join("\n");
}

/**
 * Execute a single command (no pipes/redirects)
 */
async function executeSingleCommand(
  commandStr: string,
  context: CommandContext,
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
  if (commandName === "sudo" && args.join(" ").includes("rm -rf /")) {
    const cmd = getCommand("sudo");
    if (cmd) {
      return cmd.execute(args, context);
    }
  }

  // Get command
  const command = getCommand(commandName);

  if (!command) {
    return {
      output: [
        createLine(`bash: command not found: ${commandName}`, "error"),
        createLine(`Type 'help' to see available commands.`, "system"),
      ],
    };
  }

  try {
    return await command.execute(args, context);
  } catch (error) {
    return {
      output: [
        createLine(
          `Error executing command: ${error instanceof Error ? error.message : "Unknown error"}`,
          "error",
        ),
      ],
    };
  }
}

/**
 * Execute a command with pipe and redirect support
 */
export async function executeCommand(
  commandStr: string,
  context: CommandContext,
): Promise<CommandResult> {
  const trimmed = commandStr.trim();

  if (!trimmed) {
    return { output: [] };
  }

  // First, check for redirects (applied to the whole pipeline)
  const {
    command: commandWithoutRedirect,
    redirectFile,
    appendMode,
  } = parseRedirects(trimmed);

  // Parse pipes
  const pipeCommands = parsePipes(commandWithoutRedirect);

  // Handle pipe to tee specially
  const teeIndex = pipeCommands.findIndex(
    (cmd) => cmd.trim().startsWith("tee ") || cmd.trim() === "tee",
  );

  if (teeIndex > 0) {
    // Execute commands before tee
    let result = await executeSingleCommand(pipeCommands[0]!, context);

    for (let i = 1; i < teeIndex; i++) {
      // For now, we don't support full piping of output as stdin
      // Just execute each command
      result = await executeSingleCommand(pipeCommands[i]!, context);
    }

    // Get output text for tee
    const outputText = extractOutputText(result);

    // Execute tee with the output
    const teeCmd = pipeCommands[teeIndex]!.trim();
    const teeArgs = teeCmd.split(/\s+/).slice(1);

    const teeError = executeTee(
      context.fileSystem,
      context.currentPath,
      outputText,
      teeArgs,
    );

    if (teeError) {
      return {
        output: [...result.output, createLine(teeError, "error")],
      };
    }

    // Return original output (tee passes through)
    return result;
  }

  // Execute the command (or first command in a simple pipe)
  const result = await executeSingleCommand(pipeCommands[0]!, context);

  // Note: If there are more pipe commands (but not tee), we just show output of first command
  // Full pipe support would require stdin handling which we don't have

  // Handle redirect
  if (redirectFile && result.output.length > 0) {
    const outputText = extractOutputText(result);
    const fullPath = resolvePath(context.currentPath, redirectFile);

    const writeResult = appendMode
      ? appendFile(context.fileSystem, fullPath, outputText + "\n")
      : writeFile(context.fileSystem, fullPath, outputText);

    if (writeResult !== true) {
      return {
        output: [createLine(writeResult, "error")],
      };
    }

    // Redirect means no output to terminal
    return { output: [] };
  }

  return result;
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
