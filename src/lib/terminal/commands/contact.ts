import type { Command, CommandResult, ContactInfo } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';

export const contactCommand: Command = {
  name: 'contact',
  description: 'Display contact information',
  usage: 'contact',
  aliases: ['email', 'socials'],
  execute: (): CommandResult => {
    const contactData = getContentData('contact') as ContactInfo | undefined;

    // Default contact info
    const defaultContact: ContactInfo = {
      email: 'hello@danielboyle.dev',
      github: 'github.com/danielboyle',
      linkedin: 'linkedin.com/in/danielboyle',
      twitter: 'twitter.com/danielboyle',
      website: 'danielboyle.dev',
      location: 'San Francisco, CA',
      availability: 'Open to opportunities',
    };

    const contact = contactData ?? defaultContact;

    const lines: string[] = [];
    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════════╗');
    lines.push('║                      GET IN TOUCH                                ║');
    lines.push('╚══════════════════════════════════════════════════════════════════╝');
    lines.push('');
    lines.push('  ┌─────────────────────────────────────────────────────────────┐');
    lines.push('  │                                                             │');
    lines.push(`  │   <span class="term-cyan">📧 Email</span>      <span class="term-green">${contact.email}</span>`);
    lines.push('  │                                                             │');
    lines.push(`  │   <span class="term-cyan">🐙 GitHub</span>     <span class="term-white">${contact.github}</span>`);
    lines.push('  │                                                             │');
    lines.push(`  │   <span class="term-cyan">💼 LinkedIn</span>   <span class="term-white">${contact.linkedin}</span>`);
    lines.push('  │                                                             │');
    
    if (contact.twitter) {
      lines.push(`  │   <span class="term-cyan">🐦 Twitter</span>    <span class="term-white">${contact.twitter}</span>`);
      lines.push('  │                                                             │');
    }
    
    if (contact.website) {
      lines.push(`  │   <span class="term-cyan">🌐 Website</span>    <span class="term-white">${contact.website}</span>`);
      lines.push('  │                                                             │');
    }
    
    lines.push(`  │   <span class="term-cyan">📍 Location</span>   <span class="term-dim">${contact.location}</span>`);
    lines.push('  │                                                             │');
    lines.push(`  │   <span class="term-cyan">💼 Status</span>     <span class="term-green font-bold">${contact.availability}</span>`);
    lines.push('  │                                                             │');
    lines.push('  └─────────────────────────────────────────────────────────────┘');
    lines.push('');
    lines.push('  <span class="term-yellow">💡 TIP:</span> The best way to reach me is via email!');
    lines.push('');
    lines.push('  <span class="term-dim">────────────────────────────────────────────────────────────────</span>');
    lines.push('');
    lines.push('  <span class="term-magenta">Want to send a message directly?</span>');
    lines.push('  <span class="term-green">Run: cd ~/contact && ./send_message</span>');
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

