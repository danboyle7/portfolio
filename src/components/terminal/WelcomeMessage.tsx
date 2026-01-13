'use client';

import React, { useEffect, useState } from 'react';

// Full ASCII art for large screens (>= 768px)
const LARGE_ASCII = `
<span class="term-green">  ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ </span>
<span class="term-green">  ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗</span>
<span class="term-green">  ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║</span>
<span class="term-green">  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║</span>
<span class="term-green">  ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝</span>
<span class="term-green">  ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ </span>
`;

// No ASCII art for small screens - just the welcome box

// Full welcome box for large screens
const LARGE_BOX = `
<span class="term-cyan">  ┌───────────────────────────────────────────────────────────────────┐</span>
<span class="term-cyan">  │</span>      <span class="term-white font-bold">Welcome to Daniel Boyle's Interactive Portfolio Terminal</span>     <span class="term-cyan">│</span>
<span class="term-cyan">  │</span>   <span class="term-dim"> Software Developer | Programming Enthusiast | Problem Solver</span>   <span class="term-cyan">│</span>
<span class="term-cyan">  └───────────────────────────────────────────────────────────────────┘</span>
`;

// Compact welcome box for small screens
const SMALL_BOX = `
<span class="term-cyan">┌─────────────────────────────────┐</span>
<span class="term-cyan">│    </span> <span class="term-white font-bold">Daniel Boyle's Portfolio</span>    <span class="term-cyan">│</span>
<span class="term-cyan">│       </span> <span class="term-dim">Software Developer</span>       <span class="term-cyan">│</span>
<span class="term-cyan">└─────────────────────────────────┘</span>
`;

const QUICK_START_LARGE = `
  <span class="term-yellow">[Quick Start]</span>
    <span class="term-green">help</span>        <span class="term-dim">-</span> List available commands
    <span class="term-green">portfolio</span>   <span class="term-dim">-</span> Interactive portfolio hub
    <span class="term-green">profile</span>     <span class="term-dim">-</span> View my profile
    <span class="term-green">contact</span>     <span class="term-dim">-</span> Get in touch
`;

const QUICK_START_SMALL = `
<span class="term-yellow">[Quick Start]</span>
  <span class="term-green">help</span> <span class="term-dim">-</span> Commands
  <span class="term-green">portfolio</span> <span class="term-dim">-</span> Hub
  <span class="term-green">contact</span> <span class="term-dim">-</span> Contact
`;

const HINT_LARGE = '<span class="term-dim">Hint: Try</span> <span class="term-green">ls</span><span class="term-dim">,</span> <span class="term-green">cd</span><span class="term-dim">, and</span> <span class="term-green">cat</span> <span class="term-dim">to explore - there might be secrets...</span>';
const HINT_SMALL = '<span class="term-dim">Try</span> <span class="term-green">ls</span><span class="term-dim">,</span> <span class="term-green">cd</span><span class="term-dim">,</span> <span class="term-green">cat</span> <span class="term-dim">to explore</span>';

const NAV_INFO_LARGE = `
<span class="term-dim">  Navigate this terminal like you would any Unix system.</span>
<span class="term-dim">  Explore the filesystem and run commands.</span>
`;

const NAV_INFO_SMALL = '<span class="term-dim">Navigate like a Unix terminal.</span>';

export function WelcomeMessage() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsSmall(window.innerWidth < 768);
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const ascii = isSmall ? null : LARGE_ASCII;
  const box = isSmall ? SMALL_BOX : LARGE_BOX;
  const quickStart = isSmall ? QUICK_START_SMALL : QUICK_START_LARGE;
  const hint = isSmall ? HINT_SMALL : HINT_LARGE;
  const navInfo = isSmall ? NAV_INFO_SMALL : NAV_INFO_LARGE;

  return (
    <div className="font-mono text-sm whitespace-pre-wrap">
      {ascii && <div dangerouslySetInnerHTML={{ __html: ascii }} />}
      <div dangerouslySetInnerHTML={{ __html: box }} />
      <br />
      <div dangerouslySetInnerHTML={{ __html: navInfo }} />
      <br />
      <div dangerouslySetInnerHTML={{ __html: quickStart }} />
      <br />
      <div dangerouslySetInnerHTML={{ __html: hint }} />
      <br />
    </div>
  );
}

