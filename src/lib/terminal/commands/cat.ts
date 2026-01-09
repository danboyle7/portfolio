import type { Command, CommandResult, ContentData } from '../types';
import { createLine, resolvePath, escapeHtml } from '../utils';
import { navigateToPath, getFileContent } from '../file-system';
import { renderContentData } from '../content-renderer';

export const catCommand: Command = {
  name: 'cat',
  description: 'Display file contents',
  usage: 'cat <file>',
  aliases: ['less', 'more'],
  execute: (args, context): CommandResult => {
    if (args.length === 0) {
      return {
        output: [createLine('cat: missing file operand', 'error')],
      };
    }

    const target = args[0]!;
    const targetPath = resolvePath(context.currentPath, target);
    const node = navigateToPath(context.fileSystem, targetPath);

    if (!node) {
      return {
        output: [createLine(`cat: ${target}: No such file or directory`, 'error')],
      };
    }

    if (node.type === 'directory') {
      return {
        output: [createLine(`cat: ${target}: Is a directory`, 'error')],
      };
    }

    const content = getFileContent(context.fileSystem, targetPath);

    if (content === null) {
      return {
        output: [createLine(`cat: ${target}: Unable to read file`, 'error')],
      };
    }

    // Check if it's dynamic content
    if (typeof content === 'object' && 'type' in content) {
      return renderContentData(content as ContentData);
    }

    // Check for binary files
    if (typeof content === 'string' && content.startsWith('[Binary file')) {
      return {
        output: [createLine(content, 'warning')],
      };
    }

    // Regular text file
    const lines = (content as string).split('\n');
    return {
      output: lines.map((line) => 
        createLine(escapeHtml(line), 'output', { isHtml: true })
      ),
    };
  },
};

