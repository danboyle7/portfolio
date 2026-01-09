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

    // Initial sequence - faster pacing
    addLine('', 0);
    addLine('<span class="term-green font-bold">[*] INITIALIZING HACK SEQUENCE...</span>', 300);
    addLine('', 150);

    // Connection phase
    addLine('<span class="term-dim">$ establishing connection to target...</span>', 200);
    addLine('<span class="term-yellow">[~] Resolving DNS...</span>', 300);
    addLine('<span class="term-yellow">[~] TCP handshake...</span>', 200);
    addLine('<span class="term-green">[+] Connection established</span>', 300);
    addLine('', 150);

    // Port scan
    addLine('<span class="term-dim">$ scanning open ports...</span>', 200);
    addLine('<span class="term-white">    PORT     STATE    SERVICE</span>', 150);
    addLine('<span class="term-green">    22/tcp   open     ssh</span>', 80);
    addLine('<span class="term-green">    80/tcp   open     http</span>', 80);
    addLine('<span class="term-green">    443/tcp  open     https</span>', 80);
    addLine('<span class="term-yellow">    3306/tcp filtered mysql</span>', 80);
    addLine('<span class="term-green">    8080/tcp open     http-proxy</span>', 80);
    addLine('', 150);

    // Vulnerability scan
    addLine('<span class="term-dim">$ running vulnerability scan...</span>', 200);
    addLine('<span class="term-yellow">[~] Checking CVE database...</span>', 300);
    addLine('<span class="term-green">[+] Found 3 potential entry points</span>', 250);
    addLine('', 150);

    // SQL injection attempt
    addLine('<span class="term-dim">$ attempting SQL injection...</span>', 200);
    addLine('<span class="term-red">[-] Failed: WAF detected</span>', 300);

    // XSS attempt
    addLine('<span class="term-dim">$ trying XSS payload...</span>', 200);
    addLine('<span class="term-red">[-] Failed: CSP blocking</span>', 300);
    addLine('', 100);

    // Zero-day exploit
    addLine('<span class="term-dim">$ deploying zero-day exploit CVE-2024-XXXX...</span>', 300);
    addLine('<span class="term-yellow">[~] Bypassing firewall...</span>', 350);
    addLine('<span class="term-green">[+] Firewall bypassed</span>', 300);
    addLine('', 150);

    // Privilege escalation
    addLine('<span class="term-dim">$ escalating privileges...</span>', 200);
    addLine('<span class="term-yellow">[~] Attempting kernel exploit...</span>', 300);
    addLine('<span class="term-green">[+] Got root!</span>', 350);
    addLine('', 150);

    // Credential extraction
    addLine('<span class="term-dim">$ extracting credentials from /etc/shadow...</span>', 200);
    addLine('<span class="term-green">[+] Credentials dumped</span>', 250);

    // Backdoor installation
    addLine('<span class="term-dim">$ installing backdoor...</span>', 200);
    addLine('<span class="term-green">[+] Backdoor installed at /tmp/.hidden</span>', 300);

    // Log cleaning
    addLine('<span class="term-dim">$ cleaning logs...</span>', 150);
    addLine('<span class="term-green">[+] Logs cleared</span>', 150);
    addLine('', 200);

    // Single animated progress bar with clear instruction
    addLine('<span class="term-dim">Completing operation...</span>', 150);
    // Progress bar updates on single line concept - using carriage return simulation
    addLine('<span class="term-green">[██████████████████████████████████████████████████] 100%</span>', 500);
    addLine('', 250);

    // Success messages
    addLine('<span class="term-cyan font-bold">ACCESS GRANTED</span>', 350);
    addLine('', 200);
    addLine('<span class="term-white">root@target:~# </span><span class="term-green">whoami</span>', 250);
    addLine('<span class="term-white">root</span>', 150);
    addLine('', 150);
    addLine('<span class="term-white">root@target:~# </span><span class="term-green">cat /etc/passwd | head -1</span>', 250);
    addLine('<span class="term-white">root:x:0:0:root:/root:/bin/bash</span>', 150);
    addLine('', 300);

    // Just kidding reveal
    addLine('<span class="term-dim">-------------------------------------------------------------------</span>', 200);
    addLine('', 150);
    addLine('<span class="term-yellow font-bold">// JUST KIDDING</span>', 400);
    addLine('', 200);
    addLine('<span class="term-dim">This is a portfolio website. No actual hacking occurred.</span>', 100);
    addLine('<span class="term-dim">All "exploits" are simulated for entertainment purposes.</span>', 100);
    addLine('', 200);
    addLine('  <span class="term-dim">+----------------------------------------------------------+</span>', 50);
    addLine('  <span class="term-dim">|</span>                                                          <span class="term-dim">|</span>', 50);
    addLine('  <span class="term-dim">|</span>   <span class="term-green">"I\'m in."</span>                                              <span class="term-dim">|</span>', 50);
    addLine('  <span class="term-dim">|</span>                          <span class="term-dim">- Every hacker in movies ever</span>   <span class="term-dim">|</span>', 50);
    addLine('  <span class="term-dim">|</span>                                                          <span class="term-dim">|</span>', 50);
    addLine('  <span class="term-dim">+----------------------------------------------------------+</span>', 50);
    addLine('', 50);

    return {
      output: [],
      animatedOutput: animatedLines,
      triggerEffect: 'hacker',
    };
  },
};
