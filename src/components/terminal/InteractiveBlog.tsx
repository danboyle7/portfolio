"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { BlogPost } from "@/lib/terminal/types";
import { getContentData } from "@/lib/terminal/file-system";

interface InteractiveBlogProps {
  onExit: () => void;
  onSelectPost: (slug: string) => void;
}

export function InteractiveBlog({
  onExit,
  onSelectPost,
}: InteractiveBlogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get posts from content cache - YAML is the source of truth
  const blogData = getContentData("blog") as BlogPost[] | undefined;
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
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(filteredPosts.length - 1, prev + 1),
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredPosts[selectedIndex]) {
            onSelectPost(filteredPosts[selectedIndex]!.slug);
          }
          break;
        case "Escape":
          e.preventDefault();
          onExit();
          break;
        case "q":
          if (!searchQuery) {
            e.preventDefault();
            onExit();
          }
          break;
      }
    },
    [filteredPosts, selectedIndex, searchQuery, onSelectPost, onExit],
  );

  // Handle case when no posts are available
  if (allPosts.length === 0) {
    return (
      <div className="rounded-lg border border-green-900 bg-black p-4 font-mono">
        <div className="mb-3 border-b border-green-900 pb-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-green-400">
              BLOG - Interactive Mode
            </span>
            <span className="text-xs text-gray-500">[ESC to exit]</span>
          </div>
        </div>
        <div className="py-8 text-center text-yellow-500">
          No blog posts found.
          <br />
          <span className="text-xs text-gray-500">
            Content may not be loaded. Try running: pnpm run generate-content
          </span>
        </div>
        <div className="mt-3 border-t border-green-900 pt-2 text-xs text-gray-500">
          <span>Press ESC to exit</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-900 bg-black p-4 font-mono">
      {/* Header */}
      <div className="mb-3 border-b border-green-900 pb-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-green-400">
            BLOG - Interactive Mode
          </span>
          <span className="text-xs text-gray-500">[ESC/q to exit]</span>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-3">
        <div className="flex items-center gap-2 rounded border border-green-900 bg-gray-900 px-3 py-2 focus-within:border-green-700">
          <span className="text-yellow-500">/</span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type to search posts..."
            className="terminal-input flex-1 border-none bg-transparent text-green-300 placeholder-gray-600 outline-none focus:ring-0 focus:outline-none"
            spellCheck={false}
          />
          <span className="text-xs text-gray-500">
            {filteredPosts.length} / {allPosts.length}
          </span>
        </div>
      </div>

      {/* Posts list */}
      <div className="max-h-[400px] space-y-1 overflow-y-auto">
        {filteredPosts.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No posts matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <div
              key={post.slug}
              className={`cursor-pointer rounded p-2 transition-colors ${
                index === selectedIndex
                  ? "border border-green-700 bg-green-900/50"
                  : "border border-transparent hover:bg-gray-900"
              }`}
              onClick={() => {
                setSelectedIndex(index);
                onSelectPost(post.slug);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-gray-500">
                      {index === selectedIndex ? ">" : " "}
                    </span>
                    <span
                      className={`truncate font-medium ${
                        index === selectedIndex
                          ? "text-green-400"
                          : "text-green-600"
                      }`}
                    >
                      {post.title}
                    </span>
                  </div>
                  <div className="mt-1 ml-8 text-xs text-gray-500">
                    {post.excerpt.length > 70
                      ? post.excerpt.slice(0, 67) + "..."
                      : post.excerpt}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-gray-500">{post.date}</div>
                  <div className="text-xs text-gray-600">{post.readTime}</div>
                </div>
              </div>
              <div className="mt-1 ml-8 flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-cyan-500"
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
      <div className="mt-3 flex items-center justify-between border-t border-green-900 pt-2 text-xs text-gray-500">
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
