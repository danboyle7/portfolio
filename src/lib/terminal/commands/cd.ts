import type { Command, CommandResult } from '../types';
import { createLine, resolvePath } from '../utils';
import { navigateToPath, isDirectory } from '../file-system';

export const cdCommand: Command = {
  name: 'cd',
  description: 'Change directory',
  usage: 'cd [directory]',
  execute: (args, context): CommandResult => {
    // No args = go home
    if (args.length === 0) {
      return {
        output: [],
        changeDirectory: '/home/guest',
      };
    }

    const target = args[0]!;
    const newPath = resolvePath(context.currentPath, target);

    // Check if path exists
    const node = navigateToPath(context.fileSystem, newPath);
    
    if (!node) {
      return {
        output: [createLine(`cd: no such file or directory: ${target}`, 'error')],
      };
    }

    // Check if it's a directory
    if (!isDirectory(context.fileSystem, newPath)) {
      return {
        output: [createLine(`cd: not a directory: ${target}`, 'error')],
      };
    }

    // Handle symlinks
    if (node.type === 'symlink' && node.target) {
      return {
        output: [],
        changeDirectory: node.target,
      };
    }

    return {
      output: [],
      changeDirectory: newPath,
    };
  },
};

