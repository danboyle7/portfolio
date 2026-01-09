// Virtual file system for terminal navigation

import type { FileSystemNode, ContentData } from './types';

// Content data loaders - these will be populated from YAML files
let contentCache: Record<string, unknown> = {};

export function setContentCache(content: Record<string, unknown>) {
  contentCache = content;
}

export function getContentData(type: string): unknown {
  return contentCache[type];
}

// Create the virtual file system structure
export function createFileSystem(): FileSystemNode {
  const now = new Date();
  const dateStr = `${now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

  return {
    name: '/',
    type: 'directory',
    permissions: 'drwxr-xr-x',
    owner: 'root',
    size: '4.0K',
    modified: dateStr,
    children: {
      home: {
        name: 'home',
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        size: '4.0K',
        modified: dateStr,
        children: {
          guest: {
            name: 'guest',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'guest',
            size: '4.0K',
            modified: dateStr,
            children: {
              '.bashrc': {
                name: '.bashrc',
                type: 'file',
                permissions: '-rw-r--r--',
                owner: 'guest',
                size: '512',
                modified: dateStr,
                content: `# ~/.bashrc: executed by bash for non-login shells.

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# Aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'

# Custom prompt
PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '

# Enable color support
export LS_COLORS='di=34:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43'

# Welcome message
echo "Welcome to my portfolio terminal!"
echo "Type 'help' to get started."
`,
              },
              '.profile': {
                name: '.profile',
                type: 'file',
                permissions: '-rw-r--r--',
                owner: 'guest',
                size: '256',
                modified: dateStr,
                content: `# ~/.profile: executed by the command interpreter for login shells.

# Set PATH
export PATH="$HOME/bin:$PATH"

# Default editor
export EDITOR=vim

# Portfolio version
export PORTFOLIO_VERSION="1.0.0"
`,
              },
              about: {
                name: 'about',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'README.md': {
                    name: 'README.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '2.1K',
                    modified: dateStr,
                    content: { type: 'about', data: null } as ContentData,
                  },
                  'avatar.png': {
                    name: 'avatar.png',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '48K',
                    modified: dateStr,
                    content: '[Binary file - avatar.png]',
                  },
                },
              },
              experience: {
                name: 'experience',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'EXPERIENCE.md': {
                    name: 'EXPERIENCE.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '4.2K',
                    modified: dateStr,
                    content: { type: 'experience', data: null } as ContentData,
                  },
                  'timeline': {
                    name: 'timeline',
                    type: 'executable',
                    permissions: '-rwxr-xr-x',
                    owner: 'guest',
                    size: '1.2K',
                    modified: dateStr,
                    content: '#!/bin/bash\n# Run ./timeline to view work history',
                  },
                },
              },
              skills: {
                name: 'skills',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'SKILLS.md': {
                    name: 'SKILLS.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '3.1K',
                    modified: dateStr,
                    content: { type: 'skills', data: null } as ContentData,
                  },
                  'languages': {
                    name: 'languages',
                    type: 'directory',
                    permissions: 'drwxr-xr-x',
                    owner: 'guest',
                    size: '4.0K',
                    modified: dateStr,
                    children: {
                      'typescript.ts': {
                        name: 'typescript.ts',
                        type: 'file',
                        permissions: '-rw-r--r--',
                        owner: 'guest',
                        size: '256',
                        modified: dateStr,
                        content: '// TypeScript - Primary Language\nexport const proficiency = 95;\nexport const yearsOfExperience = 6;',
                      },
                      'python.py': {
                        name: 'python.py',
                        type: 'file',
                        permissions: '-rw-r--r--',
                        owner: 'guest',
                        size: '256',
                        modified: dateStr,
                        content: '# Python - Secondary Language\nproficiency = 85\nyears_of_experience = 4',
                      },
                      'rust.rs': {
                        name: 'rust.rs',
                        type: 'file',
                        permissions: '-rw-r--r--',
                        owner: 'guest',
                        size: '256',
                        modified: dateStr,
                        content: '// Rust - Learning & Growing\nconst PROFICIENCY: u8 = 70;\nconst YEARS: u8 = 2;',
                      },
                    },
                  },
                  'frameworks': {
                    name: 'frameworks',
                    type: 'directory',
                    permissions: 'drwxr-xr-x',
                    owner: 'guest',
                    size: '4.0K',
                    modified: dateStr,
                    children: {},
                  },
                  'tools': {
                    name: 'tools',
                    type: 'directory',
                    permissions: 'drwxr-xr-x',
                    owner: 'guest',
                    size: '4.0K',
                    modified: dateStr,
                    children: {},
                  },
                },
              },
              education: {
                name: 'education',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'EDUCATION.md': {
                    name: 'EDUCATION.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '1.8K',
                    modified: dateStr,
                    content: { type: 'education', data: null } as ContentData,
                  },
                  'certifications': {
                    name: 'certifications',
                    type: 'directory',
                    permissions: 'drwxr-xr-x',
                    owner: 'guest',
                    size: '4.0K',
                    modified: dateStr,
                    children: {},
                  },
                },
              },
              blog: {
                name: 'blog',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'README.md': {
                    name: 'README.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '512',
                    modified: dateStr,
                    content: { type: 'blog', data: null } as ContentData,
                  },
                  'posts': {
                    name: 'posts',
                    type: 'directory',
                    permissions: 'drwxr-xr-x',
                    owner: 'guest',
                    size: '4.0K',
                    modified: dateStr,
                    children: {},
                  },
                },
              },
              hobbies: {
                name: 'hobbies',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'HOBBIES.md': {
                    name: 'HOBBIES.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '1.4K',
                    modified: dateStr,
                    content: { type: 'hobbies', data: null } as ContentData,
                  },
                },
              },
              contact: {
                name: 'contact',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'CONTACT.md': {
                    name: 'CONTACT.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '896',
                    modified: dateStr,
                    content: { type: 'contact', data: null } as ContentData,
                  },
                  'send_message': {
                    name: 'send_message',
                    type: 'executable',
                    permissions: '-rwxr-xr-x',
                    owner: 'guest',
                    size: '512',
                    modified: dateStr,
                    content: '#!/bin/bash\n# Run ./send_message to open contact form',
                  },
                },
              },
              projects: {
                name: 'projects',
                type: 'symlink',
                permissions: 'lrwxrwxrwx',
                owner: 'guest',
                size: '24',
                modified: dateStr,
                target: '/var/www/projects',
              },
              '.secrets': {
                name: '.secrets',
                type: 'directory',
                permissions: 'drwx------',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'easter_eggs.txt': {
                    name: 'easter_eggs.txt',
                    type: 'file',
                    permissions: '-r--------',
                    owner: 'guest',
                    size: '256',
                    modified: dateStr,
                    content: `🎮 EASTER EGG HINTS:

Try these commands for some fun:
- cowsay <message>
- sl
- fortune
- matrix
- hacker
- sudo rm -rf /
- konami (↑↑↓↓←→←→BA)

Happy hacking! 🚀
`,
                  },
                },
              },
            },
          },
        },
      },
      etc: {
        name: 'etc',
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        size: '4.0K',
        modified: dateStr,
        children: {
          motd: {
            name: 'motd',
            type: 'file',
            permissions: '-rw-r--r--',
            owner: 'root',
            size: '512',
            modified: dateStr,
            content: `
+--------------------------------------------------------------+
|                                                              |
|          Welcome to Daniel Boyle's Portfolio Terminal        |
|                                                              |
|    Type 'help' to see available commands                     |
|    Type 'profile' for system info                            |
|    Type 'tree' to explore the file structure                 |
|                                                              |
+--------------------------------------------------------------+
`,
          },
          hostname: {
            name: 'hostname',
            type: 'file',
            permissions: '-rw-r--r--',
            owner: 'root',
            size: '16',
            modified: dateStr,
            content: 'portfolio',
          },
          '.classified': {
            name: '.classified',
            type: 'file',
            permissions: '-r--------',
            owner: 'root',
            size: '4.2K',
            modified: dateStr,
            content: '__RESTRICTED__',
          },
          'shadow': {
            name: 'shadow',
            type: 'file',
            permissions: '-r--------',
            owner: 'root',
            size: '1.2K',
            modified: dateStr,
            content: '__RESTRICTED__',
          },
        },
      },
      root: {
        name: 'root',
        type: 'directory',
        permissions: 'drwx------',
        owner: 'root',
        size: '4.0K',
        modified: dateStr,
        children: {
          '.project_x': {
            name: '.project_x',
            type: 'directory',
            permissions: 'drwx------',
            owner: 'root',
            size: '4.0K',
            modified: dateStr,
            children: {
              'README.md': {
                name: 'README.md',
                type: 'file',
                permissions: '-r--------',
                owner: 'root',
                size: '2.8K',
                modified: dateStr,
                content: '__RESTRICTED__',
              },
              'prototype.ts': {
                name: 'prototype.ts',
                type: 'file',
                permissions: '-r--------',
                owner: 'root',
                size: '48K',
                modified: dateStr,
                content: '__RESTRICTED__',
              },
            },
          },
          'notes.txt': {
            name: 'notes.txt',
            type: 'file',
            permissions: '-r--------',
            owner: 'root',
            size: '512',
            modified: dateStr,
            content: '__RESTRICTED__',
          },
        },
      },
      var: {
        name: 'var',
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        size: '4.0K',
        modified: dateStr,
        children: {
          www: {
            name: 'www',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'www-data',
            size: '4.0K',
            modified: dateStr,
            children: {
              projects: {
                name: 'projects',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'guest',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'PROJECTS.md': {
                    name: 'PROJECTS.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'guest',
                    size: '4.0K',
                    modified: dateStr,
                    content: { type: 'projects', data: null } as ContentData,
                  },
                },
              },
            },
          },
          log: {
            name: 'log',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            size: '4.0K',
            modified: dateStr,
            children: {
              'portfolio.log': {
                name: 'portfolio.log',
                type: 'file',
                permissions: '-rw-r--r--',
                owner: 'root',
                size: '2.1K',
                modified: dateStr,
                content: `[2024-01-01 00:00:00] INFO: Portfolio system initialized
[2024-01-01 00:00:01] INFO: Loading content modules...
[2024-01-01 00:00:02] SUCCESS: All systems operational
[2024-01-01 00:00:03] INFO: Awaiting visitor connection...
[${new Date().toISOString()}] SUCCESS: Visitor connected!
`,
              },
            },
          },
        },
      },
      usr: {
        name: 'usr',
        type: 'directory',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        size: '4.0K',
        modified: dateStr,
        children: {
          bin: {
            name: 'bin',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            size: '4.0K',
            modified: dateStr,
            children: {},
          },
          share: {
            name: 'share',
            type: 'directory',
            permissions: 'drwxr-xr-x',
            owner: 'root',
            size: '4.0K',
            modified: dateStr,
            children: {
              games: {
                name: 'games',
                type: 'directory',
                permissions: 'drwxr-xr-x',
                owner: 'root',
                size: '4.0K',
                modified: dateStr,
                children: {
                  fortunes: {
                    name: 'fortunes',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'root',
                    size: '4.0K',
                    modified: dateStr,
                    content: `"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler
%
"First, solve the problem. Then, write the code." - John Johnson
%
"Code is like humor. When you have to explain it, it's bad." - Cory House
%
"Simplicity is the soul of efficiency." - Austin Freeman
%
"Make it work, make it right, make it fast." - Kent Beck
%
"The best error message is the one that never shows up." - Thomas Fuchs
%
"Programming isn't about what you know; it's about what you can figure out." - Chris Pine
%
"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie
%
"Deleted code is debugged code." - Jeff Sickel
%
"It's not a bug – it's an undocumented feature." - Anonymous
`,
                  },
                },
              },
            },
          },
        },
      },
      tmp: {
        name: 'tmp',
        type: 'directory',
        permissions: 'drwxrwxrwt',
        owner: 'root',
        size: '4.0K',
        modified: dateStr,
        children: {},
      },
    },
  };
}

/**
 * Navigate to a path in the file system
 */
export function navigateToPath(
  fileSystem: FileSystemNode,
  path: string
): FileSystemNode | null {
  if (path === '/') return fileSystem;

  const segments = path.split('/').filter(Boolean);
  let current: FileSystemNode | undefined = fileSystem;

  for (const segment of segments) {
    if (current.type !== 'directory' || !current.children) {
      return null;
    }
    current = current.children[segment];
    if (!current) return null;
  }

  return current ?? null;
}

/**
 * List contents of a directory
 */
export function listDirectory(
  fileSystem: FileSystemNode,
  path: string
): FileSystemNode[] | null {
  const node = navigateToPath(fileSystem, path);
  if (!node || node.type !== 'directory' || !node.children) {
    return null;
  }
  return Object.values(node.children);
}

/**
 * Check if path exists
 */
export function pathExists(fileSystem: FileSystemNode, path: string): boolean {
  return navigateToPath(fileSystem, path) !== null;
}

/**
 * Check if path is a directory
 */
export function isDirectory(fileSystem: FileSystemNode, path: string): boolean {
  const node = navigateToPath(fileSystem, path);
  return node?.type === 'directory';
}

/**
 * Get file content
 */
export function getFileContent(
  fileSystem: FileSystemNode,
  path: string
): string | ContentData | null {
  const node = navigateToPath(fileSystem, path);
  if (!node || node.type === 'directory') {
    return null;
  }
  return node.content ?? null;
}

/**
 * Get parent path
 */
export function getParentPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  segments.pop();
  return '/' + segments.join('/');
}

/**
 * Get filename from path
 */
export function getFilename(path: string): string {
  const segments = path.split('/').filter(Boolean);
  return segments[segments.length - 1] ?? '';
}

