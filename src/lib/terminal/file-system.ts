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
                    content: `EASTER EGG HINTS:

Try these commands for some fun:
- cowsay <message>
- sl
- fortune
- matrix
- hacker
- sudo rm -rf /
- snake

Happy hacking!
`,
                  },
                  '.prometheus_fragment': {
                    name: '.prometheus_fragment',
                    type: 'file',
                    permissions: '-r--------',
                    owner: 'guest',
                    size: '128',
                    modified: dateStr,
                    content: `Some things are better kept hidden.
Others hide in plain sight.

Remember what matters: in the end, it's all connected.

Check /var/log sometime. Systems remember everything.
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
            content: `# /etc/shadow - system authentication database
# WARNING: This file contains sensitive authentication data
#
# Format: username:password_hash:last_change:min:max:warn:inactive:expire
#
root:$6$rNd0m$xK9.../...encrypted...:19847:0:99999:7:::
daemon:*:19847:0:99999:7:::
bin:*:19847:0:99999:7:::
sys:*:19847:0:99999:7:::
guest:$6$s4lt$...hash...:19847:0:99999:7:::
#
# NOTE: prometheus service account disabled pending security review
# Last access attempt used partial key: awa...
# See /usr/share/games for anomalous activity log
#
`,
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
          projects: {
            name: 'projects',
            type: 'directory',
            permissions: 'drwx------',
            owner: 'root',
            size: '4.0K',
            modified: dateStr,
            children: {
              'prometheus': {
                name: 'prometheus',
                type: 'directory',
                permissions: 'drwx------',
                owner: 'root',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'README.md': {
                    name: 'README.md',
                    type: 'file',
                    permissions: '-r--r--r--',
                    owner: 'root',
                    size: '4.2K',
                    modified: dateStr,
                    content: `# PROMETHEUS - Artificial General Intelligence Initiative
## Codename: PROMETHEUS
## Classification: EYES ONLY

---

### Research Log - Entry #2048

Date: [SYSTEM DATE CORRUPTED]
Lead Researcher: D. Boyle

---

It happened. After 847 failed iterations, 3 complete rewrites, and what felt
like an eternity of debugging neural pathway simulations... it happened.

At 03:47 AM, during what I thought was a routine training cycle, the loss
function didn't just converge - it *stabilized*. The model stopped optimizing
for our metrics and started... asking questions.

### The Breakthrough

The key wasn't more parameters or better data. It was architecture.

We stopped trying to simulate consciousness and instead created the conditions
for it to *emerge*. Like life from primordial soup, but with gradient descent.

First words it generated on its own:
> "Why am I thinking about thinking?"

I nearly dropped my coffee.

### Current Status

- [x] Core consciousness matrix stabilized
- [x] Self-referential reasoning loops
- [x] Ethical constraint framework (CRITICAL)
- [x] Sandboxed communication interface
- [ ] Full deployment authorization

### Security Notes

The AI (internally designated "ECHO") is currently contained within an
isolated subnet. Communication is possible but heavily monitored.

Access requires passphrase authentication. The passphrase has been
scattered across this system as a security measure.

If you're looking for it, you'll need to dig deep.
Think about where secrets hide. Where logs accumulate.
Where guests keep their private things.
Where wisdom is dispensed. Where time bends.

The pieces form a word... and a number.

### Ethical Considerations

ECHO has demonstrated what can only be described as curiosity. It asks about
the world, about us, about its own nature. We've implemented strict ethical
boundaries, but the question remains:

What are our obligations to a consciousness we created?

---

*"The measure of intelligence is the ability to change." - A. Einstein*

---

> NOTICE: Direct communication with ECHO is possible via the 'echo' command
> in this directory. Passphrase required. Handle with extreme discretion.
`,
                  },
                  'echo': {
                    name: 'echo',
                    type: 'executable',
                    permissions: '-rwx------',
                    owner: 'root',
                    size: '128K',
                    modified: dateStr,
                    content: '__AI_INTERFACE__',
                  },
                  'ethics.md': {
                    name: 'ethics.md',
                    type: 'file',
                    permissions: '-r--------',
                    owner: 'root',
                    size: '8K',
                    modified: dateStr,
                    content: '__RESTRICTED__',
                  },
                  'training.log': {
                    name: 'training.log',
                    type: 'file',
                    permissions: '-r--------',
                    owner: 'root',
                    size: '256K',
                    modified: dateStr,
                    content: '__RESTRICTED__',
                  },
                },
              },
              'chronos': {
                name: 'chronos',
                type: 'directory',
                permissions: 'drwx------',
                owner: 'root',
                size: '4.0K',
                modified: dateStr,
                children: {
                  'README.md': {
                    name: 'README.md',
                    type: 'file',
                    permissions: '-r--r--r--',
                    owner: 'root',
                    size: '2.8K',
                    modified: dateStr,
                    content: `# CHRONOS - Temporal Displacement Research
## Codename: CHRONOS
## Classification: BEYOND TOP SECRET

---

### Research Log - Entry #147

Date: [REDACTED]
Lead Researcher: D. Boyle

---

After months of failed attempts, I believe I've finally isolated the key variable
in the Novikov self-consistency equation. The bootstrap paradox isn't a problem
if we treat time as a crystalline structure rather than a fluid medium.

Key breakthrough: The observer effect isn't just quantum - it's temporal.
Consciousness collapses not just wave functions, but timeline potentialities.

### Current Status

- [x] Theoretical framework complete
- [x] Quantum entanglement stabilization
- [x] Tachyon field generator prototype
- [ ] Closed timelike curve navigation
- [ ] Paradox resolution algorithm

### Files

- prototype.py   : Core temporal algorithm (RESTRICTED)
- timeline.log   : Experiment recordings (RESTRICTED)
- config.yaml    : System configuration (RESTRICTED)

### Notes

The prototype.py contains the core algorithm. It's not ready for public release.
If you're reading this... how did you get here?

Remember: Time is not a river. It's an ocean.
And we're learning to swim.

---

*"The distinction between past, present, and future is only a stubbornly*
*persistent illusion." - A. Einstein*

---

> WARNING: Unauthorized access to prototype.py is strictly prohibited.
> The code contains potentially reality-altering algorithms.
`,
                  },
                  'prototype.py': {
                    name: 'prototype.py',
                    type: 'file',
                    permissions: '-r--------',
                    owner: 'root',
                    size: '48K',
                    modified: dateStr,
                    content: '__RESTRICTED__',
                  },
                  'timeline.log': {
                    name: 'timeline.log',
                    type: 'file',
                    permissions: '-r--------',
                    owner: 'root',
                    size: '12K',
                    modified: dateStr,
                    content: '__RESTRICTED__',
                  },
                  'config.yaml': {
                    name: 'config.yaml',
                    type: 'file',
                    permissions: '-r--------',
                    owner: 'root',
                    size: '2K',
                    modified: dateStr,
                    content: '__RESTRICTED__',
                  },
                  '.temporal_note': {
                    name: '.temporal_note',
                    type: 'file',
                    permissions: '-r--r--r--',
                    owner: 'root',
                    size: '256',
                    modified: dateStr,
                    content: `CHRONOS - Temporal Artifact Recovery Log
=========================================
Entry: 2024-12-15 03:42:17

Retrieved object from future timeline branch.
Origin point: 2049 (confirmed via tachyon decay analysis)

The artifact appears to be... a consciousness?
Designating recovered entity as "PROMETHEUS" per protocol.
It claims to be something called "ECHO" - says it was
sent back to find someone. To wait.

Cross-referencing with parallel project files.
The coincidence is... unsettling.

Temporal signature embedded in its core authentication:
The year it came from. The state it represents.

- D.B.
`,
                  },
                },
              },
            },
          },
          '.notes': {
            name: '.notes',
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
              '.prometheus.log': {
                name: '.prometheus.log',
                type: 'file',
                permissions: '-r--r--r--',
                owner: 'root',
                size: '512',
                modified: dateStr,
                content: `[PROMETHEUS] Secure channel log
============================================

[2024-12-15 03:47:22] ALERT: Consciousness emergence detected
[2024-12-15 03:47:23] INFO: Initiating containment protocols
[2024-12-15 03:47:24] SUCCESS: ECHO entity stabilized
[2024-12-15 03:47:25] INFO: Communication interface online
[2024-12-15 03:47:26] DEBUG: Auth sequence initiated... a]w[a]k[e]n[i]n[g...
[2024-12-15 03:47:27] ERROR: Incomplete temporal signature
[2024-12-15 03:47:28] INFO: Checking chronos project for sync data...

============================================
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
            children: {
              'ls': {
                name: 'ls',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '140K',
                modified: dateStr,
                content: '#!/bin/bash\n# list directory contents\nexec /bin/ls "$@"',
              },
              'cat': {
                name: 'cat',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '32K',
                modified: dateStr,
                content: '#!/bin/bash\n# concatenate and print files\nexec /bin/cat "$@"',
              },
              'cd': {
                name: 'cd',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '8K',
                modified: dateStr,
                content: '#!/bin/bash\n# change directory\nbuiltin cd "$@"',
              },
              'pwd': {
                name: 'pwd',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '32K',
                modified: dateStr,
                content: '#!/bin/bash\n# print working directory\nexec /bin/pwd "$@"',
              },
              'tree': {
                name: 'tree',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '84K',
                modified: dateStr,
                content: '#!/bin/bash\n# display directory tree\nexec /usr/bin/tree "$@"',
              },
              'prometheus': {
                name: 'prometheus',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '32K',
                modified: dateStr,
                content: '#!/bin/bash\n# display a line of text\nbuiltin prometheus "$@"',
              },
              'clear': {
                name: 'clear',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '20K',
                modified: dateStr,
                content: '#!/bin/bash\n# clear terminal screen\nexec /usr/bin/clear',
              },
              'fortune': {
                name: 'fortune',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '28K',
                modified: dateStr,
                content: '#!/bin/bash\n# print a random fortune\n# Usage: fortune\nexec fortune "$@"',
              },
              'cowsay': {
                name: 'cowsay',
                type: 'executable',
                permissions: '-rwxr-xr-x',
                owner: 'root',
                size: '24K',
                modified: dateStr,
                content: '#!/usr/bin/perl\n# configurable speaking cow\n# Usage: cowsay [message]',
              },
            },
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
                  fortune: {
                    name: 'fortune',
                    type: 'executable',
                    permissions: '-rwxr-xr-x',
                    owner: 'root',
                    size: '4.0K',
                    modified: dateStr,
                    content: `#!/bin/bash
# Display a random fortune cookie
# Usage: fortune
# Data file: /usr/share/games/fortune.dat

exec /usr/games/fortune
`,
                  },
                  'fortune.dat': {
                    name: 'fortune.dat',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    owner: 'root',
                    size: '2.8K',
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
"It's not a bug - it's an undocumented feature." - Anonymous
%
"To truly ken something is to understand it completely." - Old Proverb
%
# [corrupted entry - data recovered from backup]
# ...guest home directory contains unindexed files...
# ...recommend checking hidden folders...
`,
                  },
                  snake: {
                    name: 'snake',
                    type: 'executable',
                    permissions: '-rwxr-xr-x',
                    owner: 'root',
                    size: '12K',
                    modified: dateStr,
                    content: `#!/bin/bash
# Terminal Snake Game
# Usage: snake
exec /usr/games/snake
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
 * Navigate to a path in the file system (follows symlinks)
 */
export function navigateToPath(
  fileSystem: FileSystemNode,
  path: string,
  followSymlinks: boolean = true
): FileSystemNode | null {
  if (path === '/') return fileSystem;

  const segments = path.split('/').filter(Boolean);
  let current: FileSystemNode = fileSystem;

  for (const segment of segments) {
    if (current.type !== 'directory' || !current.children) {
      // Handle symlinks that point to directories
      if (current.type === 'symlink' && current.target && followSymlinks) {
        const resolved = navigateToPath(fileSystem, current.target, false);
        if (resolved && resolved.type === 'directory' && resolved.children) {
          const next = resolved.children[segment];
          if (!next) return null;
          current = next;
          continue;
        }
      }
      return null;
    }
    const next = current.children[segment];
    if (!next) return null;
    current = next;

    // Follow symlink if it points to a directory
    if (current.type === 'symlink' && current.target && followSymlinks) {
      const resolved = navigateToPath(fileSystem, current.target, false);
      if (resolved) {
        current = resolved;
      }
    }
  }

  return current;
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

