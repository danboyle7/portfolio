import type { Command, CommandResult, AnimatedLine } from '../../types';
import { createLine } from '../../utils';

export const sudoCommand: Command = {
  name: 'sudo',
  description: 'Execute command as superuser',
  usage: 'sudo <command>',
  hidden: true,
  execute: (args): CommandResult => {
    const command = args.join(' ');

    // Check for the infamous rm -rf /
    if (command.includes('rm') && command.includes('-rf') && command.includes('/')) {
      const animatedLines: AnimatedLine[] = [];

      const addLine = (content: string, delay: number) => {
        animatedLines.push({
          line: createLine(content, 'output', { isHtml: true }),
          delay,
        });
      };

      addLine('', 0);
      addLine('<span class="term-red font-bold">[!] CRITICAL: SYSTEM DESTRUCTION INITIATED</span>', 500);
      addLine('', 300);
      addLine('<span class="term-red">Removing /usr...</span>', 400);
      addLine('<span class="term-red">Removing /etc...</span>', 400);
      addLine('<span class="term-red">Removing /home...</span>', 400);
      addLine('<span class="term-red">Removing /var...</span>', 400);
      addLine('<span class="term-red">Removing /boot... wait, wrong OS</span>', 600);
      addLine('', 400);
      addLine('<span class="term-yellow">[████████████████████████████████] 100%</span>', 500);
      addLine('', 400);
      addLine('<span class="term-green font-bold">JK!</span> <span class="term-dim">Nice try though.</span>', 500);
      addLine('', 300);
      addLine('<span class="term-dim">This is a virtual filesystem. Nothing was harmed.</span>', 200);
      addLine('<span class="term-dim">But seriously, don\'t run this on real systems.</span>', 200);
      addLine('', 400);
      addLine('  <span class="term-dim">+----------------------------------------------------------+</span>', 100);
      addLine('  <span class="term-dim">|</span>                                                          <span class="term-dim">|</span>', 100);
      addLine('  <span class="term-dim">|</span>   <span class="term-yellow">Achievement Unlocked: "Tried to Break Everything"</span>      <span class="term-dim">|</span>', 100);
      addLine('  <span class="term-dim">|</span>                                                          <span class="term-dim">|</span>', 100);
      addLine('  <span class="term-dim">+----------------------------------------------------------+</span>', 100);
      addLine('', 100);

      return {
        output: [],
        animatedOutput: animatedLines,
        triggerEffect: 'destroy',
      };
    }

    // Any other sudo command - serious/creepy response with animation
    if (command) {
      const animatedLines: AnimatedLine[] = [];

      const addLine = (content: string, delay: number) => {
        animatedLines.push({
          line: createLine(content, 'output', { isHtml: true }),
          delay,
        });
      };

      addLine('', 0);
      addLine('<span class="term-yellow font-bold">guest is not in the sudoers file.</span>', 500);
      addLine('<span class="term-red font-bold">This incident will be reported.</span>', 800);
      addLine('', 500);
      addLine('<span class="term-dim">...</span>', 800);
      addLine('', 600);
      addLine('<span class="term-dim">Logging attempt to /var/log/auth.log</span>', 400);
      addLine('<span class="term-dim">Recording session metadata...</span>', 500);
      addLine('<span class="term-dim">Capturing terminal state...</span>', 500);
      addLine('<span class="term-dim">Analyzing user behavior patterns...</span>', 600);
      addLine('', 400);
      addLine('<span class="term-dim">IP Address:      </span><span class="term-white">[CAPTURED]</span>', 300);
      addLine('<span class="term-dim">Browser:         </span><span class="term-white">[FINGERPRINTED]</span>', 300);
      addLine('<span class="term-dim">Location:        </span><span class="term-white">[TRIANGULATING...]</span>', 500);
      addLine('<span class="term-dim">Threat Level:    </span><span class="term-yellow">MODERATE</span>', 400);
      addLine('<span class="term-dim">Timestamp:       </span><span class="term-white">' + new Date().toISOString() + '</span>', 300);
      addLine('', 500);
      addLine('<span class="term-dim">Notifying system administrator...</span>', 600);
      addLine('<span class="term-dim">Compiling incident report...</span>', 500);
      addLine('<span class="term-dim">Submitting to security team...</span>', 500);
      addLine('', 400);
      addLine('<span class="term-green">[+] Report submitted</span>', 600);
      addLine('<span class="term-yellow">[!] Countermeasures activated</span>', 500);
      addLine('', 600);
      addLine('<span class="term-dim">-------------------------------------------------------------------</span>', 300);
      addLine('', 400);
      addLine('<span class="term-dim">Relax, this is just a portfolio. But nice try. ;)</span>', 300);
      addLine('<span class="term-dim">Maybe check out `help` instead?</span>', 200);
      addLine('', 200);

      return {
        output: [],
        animatedOutput: animatedLines,
      };
    }

    return {
      output: [
        createLine('usage: sudo <command>', 'error'),
      ],
    };
  },
};
