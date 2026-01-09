import type { Command, CommandResult, ContactInfo, AnimatedLine } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';

export const messageCommand: Command = {
  name: 'message',
  description: 'Send me a message',
  usage: 'message [-t "title"] "your message"',
  aliases: ['msg', 'send_message', './send_message'],
  execute: (args): CommandResult => {
    const contactData = getContentData('contact') as ContactInfo | undefined;
    const email = contactData?.email ?? 'hello@danielboyle.dev';

    // Parse arguments
    let title = '';
    let messageBody = '';

    // Check for -t flag
    const tIndex = args.indexOf('-t');
    if (tIndex !== -1 && args[tIndex + 1]) {
      title = args[tIndex + 1]!;
      // Remove -t and its value from args
      args = [...args.slice(0, tIndex), ...args.slice(tIndex + 2)];
    }

    // Rest is the message
    messageBody = args.join(' ').replace(/^["']|["']$/g, '');

    // If no message provided, show help
    if (!messageBody) {
      const lines: string[] = [];
      lines.push('');
      lines.push('+------------------------------------------------------------------+');
      lines.push('|                        SEND A MESSAGE                            |');
      lines.push('+------------------------------------------------------------------+');
      lines.push('');
      lines.push('  <span class="term-cyan">Usage:</span>');
      lines.push('');
      lines.push('    message "Your message here"');
      lines.push('    message -t "Subject" "Your message here"');
      lines.push('');
      lines.push('  <span class="term-dim">Examples:</span>');
      lines.push('');
      lines.push('    message "Hi! I loved your portfolio!"');
      lines.push('    message -t "Job Opportunity" "Would love to discuss a role..."');
      lines.push('');
      lines.push('  -------------------------------------------------------------------');
      lines.push('');
      lines.push('  <span class="term-yellow">Alternative contact methods:</span>');
      lines.push('');
      lines.push(`  * <span class="term-white">Email:</span>    <span class="term-green">${email}</span>`);
      lines.push('  * <span class="term-white">LinkedIn:</span> Great for professional connections');
      lines.push('  * <span class="term-white">GitHub:</span>   Check out my open source work');
      lines.push('');
      lines.push('  <span class="term-dim">Run `contact` to see all my social links!</span>');
      lines.push('');

      return {
        output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
      };
    }

    // Simulate sending message with animation
    const animatedLines: AnimatedLine[] = [];

    const addLine = (content: string, delay: number) => {
      animatedLines.push({
        line: createLine(content, 'output', { isHtml: true }),
        delay,
      });
    };

    addLine('', 0);
    addLine('<span class="term-cyan font-bold">Preparing message...</span>', 300);
    addLine('', 200);

    if (title) {
      addLine(`<span class="term-dim">Subject:</span>  ${title}`, 200);
    }
    addLine(`<span class="term-dim">Message:</span>  ${messageBody.length > 50 ? messageBody.slice(0, 47) + '...' : messageBody}`, 200);
    addLine(`<span class="term-dim">To:</span>       ${email}`, 200);
    addLine('', 300);

    addLine('<span class="term-yellow">[~] Connecting to mail server...</span>', 400);
    addLine('<span class="term-yellow">[~] Encrypting message...</span>', 300);
    addLine('<span class="term-yellow">[~] Sending...</span>', 400);
    addLine('', 300);
    addLine('<span class="term-green font-bold">[+] Message sent successfully!</span>', 500);
    addLine('', 300);
    addLine('<span class="term-dim">-------------------------------------------------------------------</span>', 200);
    addLine('', 200);
    addLine('<span class="term-white">Thanks for reaching out! I\'ll get back to you soon.</span>', 300);
    addLine('', 200);
    addLine('<span class="term-dim">Note: This is a simulated send. For a real response,</span>', 100);
    addLine(`<span class="term-dim">please email me directly at ${email}</span>`, 100);
    addLine('', 100);

    return {
      output: [],
      animatedOutput: animatedLines,
    };
  },
};
