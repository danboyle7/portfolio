"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { BlogPost, About } from "@/lib/terminal/types";

interface BlogPostClientProps {
  post: BlogPost | undefined;
  posts: BlogPost[];
  about: About | undefined;
  slug: string;
}

export function BlogPostClient({
  post,
  posts,
  about,
  slug,
}: BlogPostClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Get related posts (same tags, excluding current)
  const relatedPosts = posts
    .filter(
      (p) => p.slug !== slug && p.tags.some((tag) => post?.tags.includes(tag)),
    )
    .slice(0, 3);

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">404</div>
          <h1 className="mb-4 text-2xl font-bold text-white">Post Not Found</h1>
          <p className="mb-8 text-slate-400">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/blog"
            className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* Main content */}
      <main className="relative pt-24 pb-16">
        <article className="mx-auto max-w-4xl px-6">
          {/* Hero Section */}
          <header className="mb-12">
            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl leading-tight font-bold text-white sm:text-5xl">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mb-8 flex flex-wrap items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
                  {(post.author ?? about?.name ?? "DB").charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {post.author ?? about?.name ?? "Daniel Boyle"}
                  </div>
                  <div className="text-sm text-slate-500">Author</div>
                </div>
              </div>
              <span className="text-slate-700">•</span>
              <time className="text-sm">{formatDate(post.date)}</time>
              <span className="text-slate-700">•</span>
              <span className="text-sm">{post.readTime}</span>
            </div>

            {/* Hero Image */}
            {post.image && (
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            {!post.image && (
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-linear-to-br from-blue-600/20 via-indigo-600/20 to-cyan-600/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-24 w-24 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:text-blue-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-li:text-slate-300 prose-ul:marker:text-blue-400 prose-ol:marker:text-blue-400 [&_pre]:bg-transparent! [&_pre]:p-0! [&_pre]:m-0!">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");

                  // Check if this is an inline code or a code block
                  const isInline = !match && !className;

                  if (isInline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match ? match[1] : "text"}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Share and Actions */}
          <div className="mt-12 flex items-center justify-between border-t border-slate-800 pt-8">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-blue-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-blue-400"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              View all posts &rarr;
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mx-auto mt-16 max-w-4xl px-6">
            <h2 className="mb-8 text-2xl font-bold text-white">
              Related Posts
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 transition-all hover:border-blue-500/30 hover:bg-slate-900/50"
                >
                  <h3 className="mb-2 font-semibold text-white transition-colors group-hover:text-blue-400">
                    {relatedPost.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm text-slate-400">
                    {relatedPost.excerpt}
                  </p>
                  <div className="text-xs text-slate-500">
                    {formatDate(relatedPost.date)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {about?.name ?? "Daniel Boyle"}.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
