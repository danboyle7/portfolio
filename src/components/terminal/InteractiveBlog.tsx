'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { BlogPost } from '@/lib/terminal/types';
import { getContentData } from '@/lib/terminal/file-system';

interface InteractiveBlogProps {
  onExit: () => void;
  onSelectPost: (slug: string) => void;
}

export function InteractiveBlog({ onExit, onSelectPost }: InteractiveBlogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get posts from content cache - YAML is the source of truth
  const blogData = getContentData('blog') as BlogPost[] | undefined;
  const allPosts = blogData ?? [];

  // Filter posts based on search
  const filteredPosts = allPosts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(filteredPosts.length - 1, prev + 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredPosts[selectedIndex]) {
            onSelectPost(filteredPosts[selectedIndex]!.slug);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onExit();
          break;
        case 'q':
          if (!searchQuery) {
            e.preventDefault();
            onExit();
          }
          break;
      }
    },
    [filteredPosts, selectedIndex, searchQuery, onSelectPost, onExit]
  );

  // Handle case when no posts are available
  if (allPosts.length === 0) {
    return (
      <div className="bg-black border border-green-900 rounded-lg p-4 font-mono text-sm">
        <div className="border-b border-green-900 pb-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-bold">BLOG - Interactive Mode</span>
            <span className="text-gray-500 text-xs">[ESC to exit]</span>
          </div>
        </div>
        <div className="text-yellow-500 text-center py-8">
          No blog posts found.
          <br />
          <span className="text-gray-500 text-xs">Content may not be loaded. Try running: pnpm run generate-content</span>
        </div>
        <div className="border-t border-green-900 pt-2 mt-3 text-xs text-gray-500">
          <span>Press ESC to exit</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-green-900 rounded-lg p-4 font-mono text-sm">
      {/* Header */}
      <div className="border-b border-green-900 pb-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-green-400 font-bold">BLOG - Interactive Mode</span>
          <span className="text-gray-500 text-xs">[ESC/q to exit]</span>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-3">
        <div className="flex items-center gap-2 bg-gray-900 border border-green-900 rounded px-3 py-2 focus-within:border-green-700">
          <span className="text-yellow-500">/</span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type to search posts..."
            className="terminal-input bg-transparent flex-1 text-green-300 placeholder-gray-600 outline-none focus:outline-none focus:ring-0 border-none"
            spellCheck={false}
          />
          <span className="text-gray-500 text-xs">
            {filteredPosts.length} / {allPosts.length}
          </span>
        </div>
      </div>

      {/* Posts list */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {filteredPosts.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No posts matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <div
              key={post.slug}
              className={`p-2 rounded cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-green-900/50 border border-green-700'
                  : 'hover:bg-gray-900 border border-transparent'
              }`}
              onClick={() => {
                setSelectedIndex(index);
                onSelectPost(post.slug);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-6">{index === selectedIndex ? '>' : ' '}</span>
                    <span
                      className={`font-medium truncate ${
                        index === selectedIndex ? 'text-green-400' : 'text-green-600'
                      }`}
                    >
                      {post.title}
                    </span>
                  </div>
                  <div className="ml-8 text-gray-500 text-xs mt-1">
                    {post.excerpt.length > 70 ? post.excerpt.slice(0, 67) + '...' : post.excerpt}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-gray-500 text-xs">{post.date}</div>
                  <div className="text-gray-600 text-xs">{post.readTime}</div>
                </div>
              </div>
              <div className="ml-8 mt-1 flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 bg-gray-800 text-cyan-500 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with controls */}
      <div className="border-t border-green-900 pt-2 mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex gap-4">
          <span>[Arrow Up/Down] Navigate</span>
          <span>[Enter] Select</span>
          <span>[Type] Search</span>
        </div>
        <div>
          <span>[ESC] Exit</span>
        </div>
      </div>
    </div>
  );
}
