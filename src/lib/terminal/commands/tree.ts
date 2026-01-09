import type { Command, CommandResult, FileSystemNode } from '../types';
import { createLine, resolvePath } from '../utils';
import { navigateToPath } from '../file-system';

export const treeCommand: Command = {
  name: 'tree',
  description: 'Display directory structure',
  usage: 'tree [directory]',
  execute: (args, context): CommandResult => {
    let targetPath = context.currentPath;
    let maxDepth = 3;
    let showHidden = false;

    for (const arg of args) {
      if (arg === '-a') {
        showHidden = true;
      } else if (arg.startsWith('-L')) {
        maxDepth = parseInt(arg.slice(2)) || 3;
      } else if (!arg.startsWith('-')) {
        targetPath = resolvePath(context.currentPath, arg);
      }
    }

    const node = navigateToPath(context.fileSystem, targetPath);

    if (!node) {
      return {
        output: [createLine(`tree: '${targetPath}': No such file or directory`, 'error')],
      };
    }

    if (node.type !== 'directory') {
      return {
        output: [createLine(colorizeNode(node), 'output', { isHtml: true })],
      };
    }

    const lines: string[] = [];
    const displayPath = targetPath === '/home/guest' ? '~' : targetPath;
    lines.push(`<span class="term-blue font-bold">${displayPath}</span>`);

    let dirCount = 0;
    let fileCount = 0;

    function traverse(
      node: FileSystemNode,
      prefix: string,
      isLast: boolean,
      depth: number
    ): void {
      if (depth > maxDepth) return;

      const children = node.children ?? {};
      let entries = Object.values(children);

      if (!showHidden) {
        entries = entries.filter((e) => !e.name.startsWith('.'));
      }

      entries.sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') return -1;
        if (a.type !== 'directory' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
      });

      entries.forEach((entry, index) => {
        const isLastEntry = index === entries.length - 1;
        const connector = isLastEntry ? '└── ' : '├── ';
        const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');

        lines.push(prefix + connector + colorizeNode(entry));

        if (entry.type === 'directory') {
          dirCount++;
          if (depth < maxDepth) {
            traverse(entry, newPrefix, isLastEntry, depth + 1);
          }
        } else {
          fileCount++;
        }
      });
    }

    traverse(node, '', true, 1);
    lines.push('');
    lines.push(`<span class="term-dim">${dirCount} directories, ${fileCount} files</span>`);

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

function colorizeNode(node: FileSystemNode): string {
  switch (node.type) {
    case 'directory':
      return `<span class="term-blue font-bold">${node.name}/</span>`;
    case 'executable':
      return `<span class="term-green font-bold">${node.name}*</span>`;
    case 'symlink':
      return `<span class="term-cyan">${node.name}</span> -> ${node.target ?? '?'}`;
    default:
      if (node.name.endsWith('.md')) {
        return `<span class="term-yellow">${node.name}</span>`;
      }
      if (node.name.endsWith('.ts') || node.name.endsWith('.tsx')) {
        return `<span class="term-green">${node.name}</span>`;
      }
      if (node.name.startsWith('.')) {
        return `<span class="term-dim">${node.name}</span>`;
      }
      return node.name;
  }
}

