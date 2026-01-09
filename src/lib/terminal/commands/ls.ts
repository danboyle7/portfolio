import type { Command, CommandResult, FileSystemNode } from '../types';
import { createLine, resolvePath } from '../utils';
import { navigateToPath } from '../file-system';

export const lsCommand: Command = {
  name: 'ls',
  description: 'List directory contents',
  usage: 'ls [-la] [directory]',
  aliases: ['dir', 'll'],
  execute: (args, context): CommandResult => {
    // Parse flags
    let showHidden = false;
    let longFormat = false;
    let targetPath = context.currentPath;

    for (const arg of args) {
      if (arg.startsWith('-')) {
        if (arg.includes('a')) showHidden = true;
        if (arg.includes('l')) longFormat = true;
      } else {
        targetPath = resolvePath(context.currentPath, arg);
      }
    }

    // If command is 'll', use long format
    if (context.history[context.history.length - 1]?.startsWith('ll')) {
      longFormat = true;
    }

    const node = navigateToPath(context.fileSystem, targetPath);

    if (!node) {
      return {
        output: [createLine(`ls: cannot access '${targetPath}': No such file or directory`, 'error')],
      };
    }

    if (node.type !== 'directory') {
      // It's a file, just show its info
      if (longFormat) {
        return {
          output: [createLine(formatLongEntry(node), 'output', { isHtml: true })],
        };
      }
      return {
        output: [createLine(colorizeEntry(node), 'output', { isHtml: true })],
      };
    }

    const children = node.children ?? {};
    let entries = Object.values(children);

    // Filter hidden files
    if (!showHidden) {
      entries = entries.filter((e) => !e.name.startsWith('.'));
    }

    // Sort: directories first, then alphabetically
    entries.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    if (entries.length === 0) {
      return { output: [] };
    }

    if (longFormat) {
      const totalBlocks = entries.length * 4;
      const lines = [
        createLine(`total ${totalBlocks}`, 'system'),
        ...entries.map((e) => createLine(formatLongEntry(e), 'output', { isHtml: true })),
      ];
      return { output: lines };
    }

    // Short format - display in columns
    const coloredNames = entries.map((e) => colorizeEntry(e));
    const output = formatColumns(coloredNames, entries.map(e => e.name));

    return {
      output: [createLine(output, 'output', { isHtml: true })],
    };
  },
};

function formatLongEntry(node: FileSystemNode): string {
  const perms = node.permissions;
  const owner = node.owner.padEnd(8);
  const size = node.size.padStart(6);
  const modified = node.modified;
  const name = colorizeEntry(node);

  return `${perms} ${owner} ${size} ${modified} ${name}`;
}

function colorizeEntry(node: FileSystemNode): string {
  switch (node.type) {
    case 'directory':
      return `<span class="term-blue font-bold">${node.name}/</span>`;
    case 'executable':
      return `<span class="term-green font-bold">${node.name}*</span>`;
    case 'symlink':
      return `<span class="term-cyan">${node.name}</span> -> <span class="term-dim">${node.target ?? '?'}</span>`;
    default:
      if (node.name.endsWith('.md')) {
        return `<span class="term-yellow">${node.name}</span>`;
      }
      if (node.name.endsWith('.ts') || node.name.endsWith('.tsx') || node.name.endsWith('.js')) {
        return `<span class="term-green">${node.name}</span>`;
      }
      if (node.name.endsWith('.py')) {
        return `<span class="term-blue">${node.name}</span>`;
      }
      if (node.name.endsWith('.rs')) {
        return `<span class="term-orange">${node.name}</span>`;
      }
      if (node.name.startsWith('.')) {
        return `<span class="term-dim">${node.name}</span>`;
      }
      return node.name;
  }
}

function formatColumns(coloredItems: string[], plainItems: string[]): string {
  const terminalWidth = 80;
  const maxLen = Math.max(...plainItems.map((s) => s.length)) + 2;
  const columns = Math.max(1, Math.floor(terminalWidth / maxLen));

  const rows: string[] = [];
  for (let i = 0; i < coloredItems.length; i += columns) {
    const rowItems = coloredItems.slice(i, i + columns);
    const plainRowItems = plainItems.slice(i, i + columns);
    const paddedItems = rowItems.map((item, idx) => {
      const plainLen = plainRowItems[idx]?.length ?? 0;
      const padding = maxLen - plainLen;
      return item + ' '.repeat(Math.max(0, padding));
    });
    rows.push(paddedItems.join(''));
  }

  return rows.join('\n');
}

