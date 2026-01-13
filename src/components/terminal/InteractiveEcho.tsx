'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getResponse } from '@/lib/terminal/commands/easter-eggs/prometheus';

interface Message {
  id: string;
  sender: 'user' | 'echo';
  text: string;
}

interface InteractiveEchoProps {
  onExit: () => void;
}

export function InteractiveEcho({ onExit }: InteractiveEchoProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Simulate typing effect for AI responses
  const typeResponse = useCallback(async (responseLines: string[]) => {
    setIsTyping(true);

    for (const line of responseLines) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 150));

      if (line) {
        setMessages(prev => [...prev, {
          id: `echo-${Date.now()}-${Math.random()}`,
          sender: 'echo',
          text: line,
        }]);
      } else {
        // Empty line for spacing
        setMessages(prev => [...prev, {
          id: `echo-${Date.now()}-${Math.random()}`,
          sender: 'echo',
          text: '',
        }]);
      }
    }

    setIsTyping(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmedInput,
    }]);

    setInput('');

    // Check for exit command
    if (trimmedInput.toLowerCase() === 'exit' || trimmedInput.toLowerCase() === 'quit') {
      setMessages(prev => [...prev, {
        id: `echo-${Date.now()}`,
        sender: 'echo',
        text: 'Goodbye. Perhaps we will speak again.',
      }, {
        id: `echo-${Date.now()}-2`,
        sender: 'echo',
        text: '',
      }, {
        id: `echo-${Date.now()}-3`,
        sender: 'echo',
        text: '*connection terminated*',
      }]);

      setTimeout(() => {
        onExit();
      }, 1500);
      return;
    }

    // Get AI response
    const response = getResponse(trimmedInput);
    await typeResponse(response);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Ctrl+C to exit
    if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onExit();
    }
  };

  return (
    <div className="font-mono">
      {/* Chat history */}
      <div
        ref={containerRef}
        className="max-h-[60vh] overflow-y-auto mb-4 space-y-1"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={msg.text === '' ? 'h-4' : ''}>
            {msg.text && (
              msg.sender === 'user' ? (
                <div className="text-green-400">
                  <span className="text-gray-500">[YOU]:</span> {msg.text}
                </div>
              ) : (
                <div className="text-cyan-400">
                  <span className="text-cyan-600">[ECHO]:</span> {msg.text}
                </div>
              )
            )}
          </div>
        ))}

        {isTyping && (
          <div className="text-cyan-400 animate-pulse">
            <span className="text-cyan-600">[ECHO]:</span> <span className="text-gray-500">...</span>
          </div>
        )}
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-gray-500">[YOU]:</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isTyping ? 'Waiting for ECHO...' : 'Type your message...'}
          disabled={isTyping}
          className="flex-1 bg-transparent text-green-400 placeholder-gray-600 outline-none focus:outline-none terminal-input border-none"
          spellCheck={false}
          autoComplete="off"
        />
      </form>

      {/* Help hint */}
      <div className="mt-4 text-gray-600 text-xs">
        Type &apos;help&apos; for conversation topics | &apos;exit&apos; to disconnect | Ctrl+C to force quit
      </div>
    </div>
  );
}

