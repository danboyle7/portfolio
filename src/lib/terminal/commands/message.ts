import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';
import type { ContactInfo } from '../types';

export const messageCommand: Command = {
  name: 'message',
  description: 'Send me a message',
  usage: 'message',
  aliases: ['msg', 'send_message', './send_message'],
  execute: (): CommandResult => {
    const contactData = getContentData('contact') as ContactInfo | undefined;
    const email = contactData?.email ?? 'hello@danielboyle.dev';

    const lines: string[] = [];
    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════════╗');
    lines.push('║                      📧 SEND A MESSAGE                           ║');
    lines.push('╚══════════════════════════════════════════════════════════════════╝');
    lines.push('');
    lines.push('  <span class="term-cyan">Thanks for wanting to reach out!</span>');
    lines.push('');
    lines.push('  The best way to contact me is via email:');
    lines.push('');
    lines.push(`  <span class="term-green font-bold">📧 ${email}</span>`);
    lines.push('');
    lines.push('  <span class="term-dim">────────────────────────────────────────────────────────────────</span>');
    lines.push('');
    lines.push('  <span class="term-yellow">Quick links:</span>');
    lines.push('');
    lines.push(`  • <span class="term-white">Email:</span> <a href="mailto:${email}" class="term-green">${email}</a>`);
    lines.push('  • <span class="term-white">LinkedIn:</span> Great for professional connections');
    lines.push('  • <span class="term-white">GitHub:</span> Check out my open source work');
    lines.push('');
    lines.push('  <span class="term-dim">Run `contact` to see all my social links!</span>');
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

