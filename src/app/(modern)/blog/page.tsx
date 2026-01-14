"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { getContentData } from "@/lib/terminal/file-system";
import type { BlogPost, About } from "@/lib/terminal/types";
import { FilterDropdown, FilterChip } from "@/components/modern/FilterDropdown";
import { AnimatePresence } from "motion/react";

export default function BlogPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const posts = (getContentData("blog") as BlogPost[]) ?? [];
  const about = getContentData("about") as About;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Get all unique tags as filter options
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags)),
  ).sort();
  const tagOptions = allTags.map((tag) => ({
    id: tag,
    slug: tag,
    name: tag,
  }));

  // Filter posts based on search and tags
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // Clear all filters
  const handleClearAll = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`relative transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* Main content */}
      <main className="relative pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              Exploration & Thoughts
            </span>
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              My{" "}
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Sharing insights on software development, creative coding, and the
              journey of building things that matter.
            </p>
          </div>

          {/* Search and Filters - Centered */}
          <div className="mb-12">
            {/* Search - Centered */}
            <div className="mx-auto mb-6 max-w-xl">
              <div className="relative">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pr-4 pl-12 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Filter dropdown and chips - Centered */}
            <div className="flex flex-wrap items-center gap-3">
              <FilterDropdown
                label="Topics"
                items={tagOptions}
                selectedItems={selectedTags}
                onToggle={handleTagToggle}
                type="multi"
              />

              {/* Selected filter chips */}
              <AnimatePresence>
                {selectedTags.map((tag) => (
                  <FilterChip
                    key={tag}
                    label={tag}
                    onRemove={() => handleTagToggle(tag)}
                    variant="primary"
                  />
                ))}
              </AnimatePresence>

              {/* Clear all */}
              <AnimatePresence>
                {(selectedTags.length > 0 || searchQuery) && (
                  <button
                    onClick={handleClearAll}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-300 shadow-sm transition-colors hover:border-slate-600 hover:bg-slate-800"
                  >
                    Clear all
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="mb-2 text-xl font-semibold text-white">
                No posts found
              </h3>
              <p className="text-slate-400">
                {searchQuery || selectedTags.length > 0
                  ? "Try adjusting your search or filters"
                  : "Blog posts coming soon!"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <article
                      className={`h-full overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/30 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-900/50 hover:shadow-xl hover:shadow-blue-500/5 ${
                        isLoaded
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden bg-slate-800">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-linear-to-br from-blue-600/20 to-indigo-600/20">
                            <svg
                              className="h-16 w-16 text-slate-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                              />
                            </svg>
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Tags */}
                        <div className="mb-3 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-blue-400">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="mb-4 line-clamp-2 text-sm text-slate-400">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>{formatDate(post.date)}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Results count */}
              <div className="mt-8 text-center text-sm text-slate-500">
                {filteredPosts.length === posts.length
                  ? `${posts.length} article${posts.length !== 1 ? "s" : ""}`
                  : `${filteredPosts.length} of ${posts.length} article${posts.length !== 1 ? "s" : ""}`}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {about?.name ?? "Daniel Boyle"}.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
