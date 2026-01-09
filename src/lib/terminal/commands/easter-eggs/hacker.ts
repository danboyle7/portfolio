import type { Command, CommandResult, AnimatedLine } from '../../types';
import { createLine } from '../../utils';

export const hackerCommand: Command = {
  name: 'hacker',
  description: 'Activate hacker mode',
  usage: 'hacker',
  aliases: ['hackerman', 'h4ck3r'],
  hidden: true,
  execute: (): CommandResult => {
    const animatedLines: AnimatedLine[] = [];

    const addLine = (content: string, delay: number) => {
      animatedLines.push({
        line: createLine(content, 'output', { isHtml: true }),
        delay,
      });
    };

    // Initial sequence
    addLine('', 0);
    addLine('<span class="term-green font-bold">[*] INITIALIZING HACK SEQUENCE...</span>', 500);
    addLine('', 300);

    // Connection phase
    addLine('<span class="term-dim">$ establishing connection to target...</span>', 400);
    addLine('<span class="term-yellow">[~] Resolving DNS...</span>', 600);
    addLine('<span class="term-yellow">[~] TCP handshake...</span>', 400);
    addLine('<span class="term-green">[+] Connection established</span>', 500);
    addLine('', 300);

    // Port scan
    addLine('<span class="term-dim">$ scanning open ports...</span>', 400);
    addLine('<span class="term-white">    PORT     STATE    SERVICE</span>', 300);
    addLine('<span class="term-green">    22/tcp   open     ssh</span>', 150);
    addLine('<span class="term-green">    80/tcp   open     http</span>', 150);
    addLine('<span class="term-green">    443/tcp  open     https</span>', 150);
    addLine('<span class="term-yellow">    3306/tcp filtered mysql</span>', 150);
    addLine('<span class="term-green">    8080/tcp open     http-proxy</span>', 150);
    addLine('', 300);

    // Vulnerability scan
    addLine('<span class="term-dim">$ running vulnerability scan...</span>', 400);
    addLine('<span class="term-yellow">[~] Checking CVE database...</span>', 600);
    addLine('<span class="term-yellow">[~] Testing for common exploits...</span>', 500);
    addLine('<span class="term-green">[+] Found 3 potential entry points</span>', 400);
    addLine('', 300);

    // SQL injection attempt
    addLine('<span class="term-dim">$ attempting SQL injection...</span>', 400);
    addLine('<span class="term-yellow">[~] Payload: \' OR 1=1 --</span>', 300);
    addLine('<span class="term-red">[-] Failed: WAF detected</span>', 600);
    addLine('', 200);

    // XSS attempt
    addLine('<span class="term-dim">$ trying XSS payload...</span>', 400);
    addLine('<span class="term-yellow">[~] Payload: &lt;script&gt;alert(1)&lt;/script&gt;</span>', 300);
    addLine('<span class="term-red">[-] Failed: CSP blocking</span>', 600);
    addLine('', 200);

    // Zero-day exploit
    addLine('<span class="term-dim">$ deploying zero-day exploit CVE-2024-XXXX...</span>', 500);
    addLine('<span class="term-yellow">[~] Loading exploit module...</span>', 400);
    addLine('<span class="term-yellow">[~] Bypassing firewall...</span>', 600);
    addLine('<span class="term-yellow">[~] Evading IDS...</span>', 400);
    addLine('<span class="term-green">[+] Firewall bypassed</span>', 500);
    addLine('', 300);

    // Privilege escalation
    addLine('<span class="term-dim">$ escalating privileges...</span>', 400);
    addLine('<span class="term-yellow">[~] Attempting kernel exploit...</span>', 500);
    addLine('<span class="term-yellow">[~] Dirty COW variant detected...</span>', 400);
    addLine('<span class="term-green">[+] Got root!</span>', 600);
    addLine('', 300);

    // Credential extraction
    addLine('<span class="term-dim">$ extracting credentials from /etc/shadow...</span>', 400);
    addLine('<span class="term-yellow">[~] Reading shadow file...</span>', 300);
    addLine('<span class="term-yellow">[~] Parsing hashes...</span>', 300);
    addLine('<span class="term-green">[+] Credentials dumped</span>', 400);
    addLine('', 200);

    // Backdoor installation
    addLine('<span class="term-dim">$ installing backdoor...</span>', 400);
    addLine('<span class="term-yellow">[~] Creating hidden service...</span>', 400);
    addLine('<span class="term-yellow">[~] Setting up reverse shell...</span>', 400);
    addLine('<span class="term-green">[+] Backdoor installed at /tmp/.hidden</span>', 500);
    addLine('', 200);

    // Log cleaning
    addLine('<span class="term-dim">$ cleaning logs...</span>', 300);
    addLine('<span class="term-green">[+] /var/log/auth.log cleared</span>', 200);
    addLine('<span class="term-green">[+] /var/log/syslog cleared</span>', 200);
    addLine('<span class="term-green">[+] /var/log/secure cleared</span>', 200);
    addLine('', 400);

    // Progress bar animation
    addLine('<span class="term-dim">Completing operation...</span>', 300);
    addLine('<span class="term-green">[████                            ]  12%</span>', 200);
    addLine('<span class="term-green">[████████                        ]  25%</span>', 200);
    addLine('<span class="term-green">[████████████                    ]  37%</span>', 200);
    addLine('<span class="term-green">[████████████████                ]  50%</span>', 200);
    addLine('<span class="term-green">[████████████████████            ]  62%</span>', 200);
    addLine('<span class="term-green">[████████████████████████        ]  75%</span>', 200);
    addLine('<span class="term-green">[████████████████████████████    ]  87%</span>', 200);
    addLine('<span class="term-green font-bold">[████████████████████████████████] 100%</span>', 300);
    addLine('', 400);

    // Success messages
    addLine('<span class="term-cyan font-bold">ACCESS GRANTED</span>', 500);
    addLine('', 300);
    addLine('<span class="term-white">root@target:~# </span><span class="term-green">whoami</span>', 400);
    addLine('<span class="term-white">root</span>', 200);
    addLine('', 200);
    addLine('<span class="term-white">root@target:~# </span><span class="term-green">cat /etc/passwd | head -1</span>', 400);
    addLine('<span class="term-white">root:x:0:0:root:/root:/bin/bash</span>', 200);
    addLine('', 500);

    // Just kidding reveal
    addLine('<span class="term-dim">-------------------------------------------------------------------</span>', 400);
    addLine('', 300);
    addLine('<span class="term-yellow font-bold blink">// JUST KIDDING</span>', 600);
    addLine('', 300);
    addLine('<span class="term-dim">This is a portfolio website. No actual hacking occurred.</span>', 200);
    addLine('<span class="term-dim">All "exploits" are simulated for entertainment purposes.</span>', 200);
    addLine('', 400);
    addLine('  <span class="term-dim">+----------------------------------------------------------+</span>', 100);
    addLine('  <span class="term-dim">|</span>                                                          <span class="term-dim">|</span>', 100);
    addLine('  <span class="term-dim">|</span>   <span class="term-green">"I\'m in."</span>                                              <span class="term-dim">|</span>', 100);
    addLine('  <span class="term-dim">|</span>                          <span class="term-dim">- Every hacker in movies ever</span>   <span class="term-dim">|</span>', 100);
    addLine('  <span class="term-dim">|</span>                                                          <span class="term-dim">|</span>', 100);
    addLine('  <span class="term-dim">+----------------------------------------------------------+</span>', 100);
    addLine('', 100);

    return {
      output: [], // Will be populated by animated output
      animatedOutput: animatedLines,
      triggerEffect: 'hacker',
    };
  },
};
