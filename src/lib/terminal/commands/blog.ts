import type { Command, CommandResult, BlogPost } from '@/lib/terminal/types';
import { createLine } from '@/lib/terminal/utils';
import { getContentData } from '@/lib/terminal/file-system';

export const blogCommand: Command = {
  name: 'blog',
  description: 'Display blog posts',
  usage: 'blog [&lt;slug&gt;] | blog -i (interactive)',
  aliases: ['posts', 'articles'],
  execute: (args): CommandResult => {
    const posts = getContentData('blog') as BlogPost[] | undefined;
    const interactive = args.includes('-i') || args.includes('--interactive');

    // Check if content is loaded
    if (!posts || posts.length === 0) {
      return {
        output: [
          createLine('', 'output'),
          createLine('No blog posts found.', 'warning'),
          createLine('Content may not be loaded. Try running: pnpm run generate-content', 'system'),
          createLine('', 'output'),
        ],
      };
    }

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
    lines.push('    blog [slug]     Read a specific post');
    lines.push('    blog -i         Interactive mode (TUI)');
    lines.push('');

    return {
      output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
    };
  },
};

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

  // Render the full content if available
  if (post.content && post.content !== 'Full article content...') {
    // Split content by lines and render
    const contentLines = post.content.split('\n');
    for (const line of contentLines) {
      // Handle markdown headers
      if (line.startsWith('# ')) {
        lines.push(`<span class="term-green font-bold">${line.slice(2)}</span>`);
      } else if (line.startsWith('## ')) {
        lines.push(`<span class="term-cyan font-bold">${line.slice(3)}</span>`);
      } else if (line.startsWith('### ')) {
        lines.push(`<span class="term-yellow">${line.slice(4)}</span>`);
      } else if (line.startsWith('- ')) {
        lines.push(`  * ${line.slice(2)}`);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        lines.push(`<span class="term-white font-bold">${line.slice(2, -2)}</span>`);
      } else {
        lines.push(line);
      }
    }
  } else {
    lines.push(post.excerpt);
    lines.push('');
    lines.push('<span class="term-dim">[Full article content would be rendered here]</span>');
  }

  lines.push('');
  lines.push('====================================================================');
  lines.push('');
  lines.push('<span class="term-dim">< blog    Return to blog list</span>');
  lines.push('');

  return {
    output: lines.map((line) => createLine(line, 'output', { isHtml: true })),
  };
}
