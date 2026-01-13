'use client';

import React, { useEffect } from 'react';
import type { TerminalLine } from '@/lib/terminal/types';

interface TerminalOutputProps {
  lines: TerminalLine[];
  onScrollToBottom?: () => void;
}

export function TerminalOutput({ lines, onScrollToBottom }: TerminalOutputProps) {
  // Removed auto-scroll - it causes issues with CSS-transformed containers
  // Scrolling is now handled by the parent Terminal component

  useEffect(() => {
    onScrollToBottom?.();
  }, [lines, onScrollToBottom]);

  return (
    <div className="space-y-0.5 pb-4">
      {lines.map((line) => (
        <TerminalLineComponent key={line.id} line={line} />
      ))}
    </div>
  );
}

function TerminalLineComponent({ line }: { line: TerminalLine }) {
  const getLineClass = () => {
    switch (line.type) {
      case 'input':
        return 'text-green-300';
      case 'output':
        return 'text-green-500';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      case 'system':
        return 'text-green-600';
      case 'ascii':
        return 'text-green-500 whitespace-pre';
      default:
        return 'text-green-500';
    }
  };

  if (line.isHtml) {
    return (
      <div
        className={`${getLineClass()} ${line.className ?? ''} leading-relaxed whitespace-pre-wrap`}
        dangerouslySetInnerHTML={{ __html: line.content }}
      />
    );
  }

  return (
    <div className={`${getLineClass()} ${line.className ?? ''} leading-relaxed whitespace-pre-wrap`}>
      {line.content}
    </div>
  );
}

/**
 * Render a command with its prompt
 */
export function CommandLine({
  command,
  path,
  user,
  hostname,
}: {
  command: string;
  path: string;
  user: string;
  hostname: string;
}) {
  const displayPath = path.startsWith('/home/guest')
    ? path.replace('/home/guest', '~')
    : path;

  return (
    <div className="flex items-center gap-0">
      <span className="text-green-400 font-bold">{user}@{hostname}</span>
      <span className="text-green-600">:</span>
      <span className="text-blue-400 font-bold">{displayPath}</span>
      <span className="text-green-600">$</span>
      <span className="ml-2 text-green-300">{command}</span>
    </div>
  );
}

