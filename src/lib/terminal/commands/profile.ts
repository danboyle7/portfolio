import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';
import type { About } from '../types';

export const profileCommand: Command = {
  name: 'profile',
  description: 'Display system/profile information',
  usage: 'profile',
  aliases: ['me', 'about', 'info'],
  execute: (_args, context): CommandResult => {
    const aboutData = getContentData('about') as About | undefined;

    const name = aboutData?.name ?? 'Daniel Boyle';
    const title = aboutData?.title ?? 'Full-Stack Developer';
    const tagline = aboutData?.tagline ?? 'Building the future, one commit at a time';

    // Large ASCII art name "DANIEL"
    const asciiName = [
      ' ██████╗   █████╗  ███╗   ██╗ ██╗ ███████╗ ██╗     ',
      ' ██╔══██╗ ██╔══██╗ ████╗  ██║ ██║ ██╔════╝ ██║     ',
      ' ██║  ██║ ███████║ ██╔██╗ ██║ ██║ █████╗   ██║     ',
      ' ██║  ██║ ██╔══██║ ██║╚██╗██║ ██║ ██╔══╝   ██║     ',
      ' ██████╔╝ ██║  ██║ ██║ ╚████║ ██║ ███████╗ ███████╗',
      ' ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═══╝ ╚═╝ ╚══════╝ ╚══════╝',
    ];

    const output: string[] = [];
    output.push('');
    output.push('<span class="term-dim">╔══════════════════════════════════════════════════════════════════╗</span>');
    output.push('<span class="term-dim">║</span>                                                                  <span class="term-dim">║</span>');
    
    // Add ASCII name
    for (const line of asciiName) {
      output.push(`<span class="term-dim">║</span> <span class="term-green font-bold">${line}</span> <span class="term-dim">║</span>`);
    }
    
    output.push('<span class="term-dim">║</span>                                                                  <span class="term-dim">║</span>');
    output.push('<span class="term-dim">╚══════════════════════════════════════════════════════════════════╝</span>');
    output.push('');
    
    // System info section
    output.push('  <span class="term-cyan font-bold">' + context.user + '@' + context.hostname + '</span>');
    output.push('  <span class="term-dim">────────────────────────────────────────────</span>');
    output.push('');
    output.push(`  <span class="term-cyan">Name</span>       <span class="term-white">${name}</span>`);
    output.push(`  <span class="term-cyan">Title</span>      <span class="term-white">${title}</span>`);
    output.push(`  <span class="term-cyan">Tagline</span>    <span class="term-dim">"${tagline}"</span>`);
    output.push('');
    output.push('  <span class="term-dim">────────────────────────────────────────────</span>');
    output.push('');
    output.push('  <span class="term-cyan">OS</span>         <span class="term-white">Portfolio OS v1.0.0</span>');
    output.push('  <span class="term-cyan">Host</span>       <span class="term-white">Web Browser</span>');
    output.push('  <span class="term-cyan">Kernel</span>     <span class="term-white">Next.js 16.x</span>');
    output.push('  <span class="term-cyan">Shell</span>      <span class="term-white">zsh 5.9</span>');
    output.push('  <span class="term-cyan">Terminal</span>   <span class="term-white">Portfolio Terminal</span>');
    output.push('');
    output.push('  <span class="term-dim">────────────────────────────────────────────</span>');
    output.push('');
    output.push('  <span class="term-cyan">Languages</span>  <span class="term-yellow">TypeScript</span> <span class="term-dim">|</span> <span class="term-blue">Python</span> <span class="term-dim">|</span> <span class="term-orange">Rust</span>');
    output.push('  <span class="term-cyan">Frameworks</span> <span class="term-cyan">React</span> <span class="term-dim">|</span> <span class="term-white">Next.js</span> <span class="term-dim">|</span> <span class="term-green">Node.js</span>');
    output.push('  <span class="term-cyan">Tools</span>      <span class="term-red">Git</span> <span class="term-dim">|</span> <span class="term-blue">Docker</span> <span class="term-dim">|</span> <span class="term-yellow">AWS</span>');
    output.push('');
    
    // Color palette using blocks
    output.push('  <span class="term-bg-black">   </span><span class="term-bg-red">   </span><span class="term-bg-green">   </span><span class="term-bg-yellow">   </span><span class="term-bg-blue">   </span><span class="term-bg-magenta">   </span><span class="term-bg-cyan">   </span><span class="term-bg-white">   </span>');
    output.push('');

    return {
      output: output.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};
