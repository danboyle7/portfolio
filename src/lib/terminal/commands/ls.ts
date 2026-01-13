import type { Command, CommandResult, FileSystemNode } from '@/lib/terminal/types';
import { createLine, resolvePath } from '@/lib/terminal/utils';
import { navigateToPath } from '@/lib/terminal/file-system';

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

    // Filter symlinks in short format (only show in long format)
    if (!longFormat) {
      entries = entries.filter((e) => e.type !== 'symlink');
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

    // Short format - display in a grid with even columns
    const coloredNames = entries.map((e) => colorizeEntryShort(e));
    const plainNames = entries.map((e) => getPlainName(e));
    const output = formatColumns(coloredNames, plainNames);

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

// Short format colorization (no symlink arrow, just the name with suffix)
function colorizeEntryShort(node: FileSystemNode): string {
  switch (node.type) {
    case 'directory':
      return `<span class="term-blue font-bold">${node.name}/</span>`;
    case 'executable':
      return `<span class="term-green font-bold">${node.name}*</span>`;
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

// Get the plain text name with any suffix (/, *) for width calculation
function getPlainName(node: FileSystemNode): string {
  switch (node.type) {
    case 'directory':
      return node.name + '/';
    case 'executable':
      return node.name + '*';
    default:
      return node.name;
  }
}

function formatColumns(coloredItems: string[], plainItems: string[]): string {
  if (plainItems.length === 0) return '';

  const terminalWidth = 80;
  const minGap = 2; // Minimum gap between columns

  // Find the maximum item length
  const maxLen = Math.max(...plainItems.map((s) => s.length));

  // Calculate column width (item width + gap)
  const colWidth = maxLen + minGap;

  // Calculate number of columns that fit
  const numCols = Math.max(1, Math.floor(terminalWidth / colWidth));

  // Calculate number of rows needed
  const numRows = Math.ceil(plainItems.length / numCols);

  // Build the grid row by row, filling column by column (like ls does)
  const rows: string[] = [];
  for (let row = 0; row < numRows; row++) {
    const rowParts: string[] = [];
    for (let col = 0; col < numCols; col++) {
      const idx = col * numRows + row;
      if (idx < coloredItems.length) {
        const coloredItem = coloredItems[idx]!;
        const plainItem = plainItems[idx]!;
        // Pad to column width (except for last column)
        if (col < numCols - 1) {
          const padding = colWidth - plainItem.length;
          rowParts.push(coloredItem + ' '.repeat(Math.max(0, padding)));
        } else {
          rowParts.push(coloredItem);
        }
      }
    }
    rows.push(rowParts.join(''));
  }

  return rows.join('\n');
}

