import type { Command, CommandResult, BlogPost } from '../types';
import { createLine } from '../utils';
import { getContentData } from '../file-system';

export const blogCommand: Command = {
  name: 'blog',
  description: 'Display blog posts',
  usage: 'blog [post-slug] | blog -i (interactive)',
  aliases: ['posts', 'articles'],
  execute: (args): CommandResult => {
    const blogData = getContentData('blog') as BlogPost[] | undefined;
    const interactive = args.includes('-i') || args.includes('--interactive');

    // Default blog posts
    const defaultPosts: BlogPost[] = [
      {
        slug: 'building-terminal-portfolio',
        title: 'Building a Terminal-Style Portfolio with Next.js',
        date: '2024-01-15',
        excerpt: 'How I created this unique terminal-inspired portfolio website using Next.js and TypeScript.',
        tags: ['Next.js', 'TypeScript', 'Portfolio', 'Creative'],
        content: 'Full article content...',
        readTime: '8 min read',
      },
      {
        slug: 'typescript-best-practices',
        title: 'TypeScript Best Practices for 2024',
        date: '2024-01-10',
        excerpt: 'A comprehensive guide to writing clean, maintainable TypeScript code.',
        tags: ['TypeScript', 'Best Practices', 'Clean Code'],
        content: 'Full article content...',
        readTime: '12 min read',
      },
      {
        slug: 'microservices-lessons',
        title: 'Lessons Learned from Building Microservices',
        date: '2023-12-20',
        excerpt: 'Real-world insights from architecting and scaling microservices in production.',
        tags: ['Microservices', 'Architecture', 'DevOps'],
        content: 'Full article content...',
        readTime: '15 min read',
      },
      {
        slug: 'react-performance',
        title: 'React Performance Optimization Techniques',
        date: '2023-12-05',
        excerpt: 'Practical tips for making your React applications blazing fast.',
        tags: ['React', 'Performance', 'Frontend'],
        content: 'Full article content...',
        readTime: '10 min read',
      },
    ];

    const posts = blogData ?? defaultPosts;

    // Interactive mode
    if (interactive) {
      return {
        output: [],
        enterInteractiveMode: {
          type: 'blog',
          data: posts,
        },
      };
    }

    // If a specific post is requested
    if (args.length > 0 && !args[0]!.startsWith('-')) {
      const slug = args[0];
      const post = posts.find((p) => p.slug === slug);

      if (!post) {
        return {
          output: [
            createLine(`blog: post '${slug}' not found`, 'error'),
            createLine('Use `blog` to list all posts', 'system'),
          ],
        };
      }

      return renderPost(post);
    }

    // List all posts
    const lines: string[] = [];
    lines.push('');
    lines.push('+------------------------------------------------------------------+');
    lines.push('|                          BLOG POSTS                              |');
    lines.push('+------------------------------------------------------------------+');
    lines.push('');

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]!;
      lines.push(`  <span class="term-green font-bold">[${i + 1}] ${post.title}</span>`);
      lines.push(`      <span class="term-dim">${post.date} | ${post.readTime}</span>`);
      lines.push(`      ${post.excerpt}`);
      lines.push(`      <span class="term-cyan">${post.tags.map((t) => `#${t}`).join(' ')}</span>`);
      lines.push(`      <span class="term-yellow">> blog ${post.slug}</span>`);
      lines.push('');
    }

    lines.push('  -------------------------------------------------------------------');
    lines.push('');
    lines.push('  <span class="term-dim">Commands:</span>');
    lines.push('    blog <slug>     Read a specific post');
    lines.push('    blog -i         Interactive mode (TUI)');
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

function renderInteractive(posts: BlogPost[]): CommandResult {
  const lines: string[] = [];

  lines.push('');
  lines.push('+------------------------------------------------------------------+');
  lines.push('|                    BLOG - INTERACTIVE MODE                       |');
  lines.push('+------------------------------------------------------------------+');
  lines.push('');
  lines.push('  <span class="term-dim">Navigate: Type the number and press Enter</span>');
  lines.push('');
  lines.push('  +--------------------------------------------------------------+');

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]!;
    const num = `[${i + 1}]`.padEnd(4);
    const title = post.title.length > 45 ? post.title.slice(0, 42) + '...' : post.title;
    const date = post.date;
    lines.push(`  | ${num} <span class="term-green">${title.padEnd(45)}</span> <span class="term-dim">${date}</span> |`);
  }

  lines.push('  +--------------------------------------------------------------+');
  lines.push('');
  lines.push('  <span class="term-cyan">></span> Enter post number (1-' + posts.length + ') or type `blog <slug>` to read');
  lines.push('');
  lines.push('  <span class="term-dim">TIP: You can search with `blog <keyword>` in future updates</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}

function renderPost(post: BlogPost): CommandResult {
  const lines: string[] = [];

  lines.push('');
  lines.push('====================================================================');
  lines.push('');
  lines.push(`<span class="term-green font-bold text-lg">${post.title}</span>`);
  lines.push('');
  lines.push(`<span class="term-dim">${post.date} | ${post.readTime}</span>`);
  lines.push(`<span class="term-cyan">${post.tags.map((t) => `#${t}`).join(' ')}</span>`);
  lines.push('');
  lines.push('====================================================================');
  lines.push('');
  lines.push(post.excerpt);
  lines.push('');
  lines.push('<span class="term-dim">[Full article content would be rendered here from markdown]</span>');
  lines.push('');
  lines.push('====================================================================');
  lines.push('');
  lines.push('<span class="term-dim">< blog    Return to blog list</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}
