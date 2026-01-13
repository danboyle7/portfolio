# Terminal Portfolio

An interactive terminal-styled portfolio website built with Next.js, featuring a fully functional command-line interface, CRT effects, and a retro computer aesthetic.

![Terminal Portfolio](./public/computer2.png)

## Features

### 🖥️ Interactive Terminal
- Fully functional command-line interface with tab completion
- Command history navigation (↑/↓ arrows)
- Environment variables support
- File system navigation (`cd`, `ls`, `cat`, `pwd`)

### 🎮 Interactive Applications
- **Portfolio Hub** - Browse experience, skills, projects, education, and hobbies
- **Blog** - Interactive searchable blog with full post viewing
- **Contact** - Send messages directly from the terminal
- **Snake** - Classic snake game, playable in the terminal
- **Hidden Easter Eggs** - Discover secrets hidden throughout the system

### 🎨 Visual Effects
- Authentic CRT monitor display with scanlines and vignette
- Matrix rain animation
- Glitch effects
- Boot sequence animation
- Retro computer frame with working power and zoom buttons

### 📱 Responsive Design
- Scales gracefully from desktop to mobile
- Computer frame on larger screens, clean terminal on mobile
- Font scaling optimized for readability at all sizes

## Commands

| Command | Description |
|---------|-------------|
| `help` | Display available commands |
| `portfolio` | Open the interactive portfolio hub |
| `skills` | View technical skills |
| `experience` | View work history |
| `education` | View academic background |
| `projects` | View portfolio projects |
| `contact` | Open contact information app |
| `blog` | Interactive blog viewer |
| `about` | About this terminal |
| `clear` | Clear the terminal |
| `snake` | Play snake game |

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/danboyle7/portfolio.git
cd portfolio

# Install dependencies
pnpm install

# Generate content from YAML files
pnpm run generate-content

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the terminal.

### Building for Production

```bash
pnpm run build
pnpm start
```

## Content Management

All portfolio content is managed through YAML files in the `/content` directory:

- `experience.yaml` - Work history and roles
- `skills.yaml` - Technical skills with proficiency levels
- `education.yaml` - Academic background
- `contact.yaml` - Contact information
- `blog/` - Blog posts in Markdown
- `projects.yaml` - Portfolio projects
- `hobbies.yaml` - Interests and passions

After editing content files, regenerate the content:

```bash
pnpm run generate-content
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Content**: YAML + Markdown
- **Database**: Drizzle ORM (optional, for dynamic features)
- **Deployment**: Vercel-ready

## Project Structure

```
├── content/           # YAML content files
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router
│   ├── components/
│   │   └── terminal/  # Terminal components
│   ├── lib/
│   │   └── terminal/  # Terminal logic & commands
│   └── styles/        # Global styles
└── scripts/           # Build scripts
```

## Customization

### Adding New Commands

Create a new command file in `src/lib/terminal/commands/`:

```typescript
import type { Command, CommandResult } from '../types';
import { createLine } from '../utils';

export const myCommand: Command = {
  name: 'mycommand',
  description: 'Description of my command',
  usage: 'mycommand [args]',
  execute: (args): CommandResult => {
    return {
      output: [createLine('Hello from my command!', 'output')],
    };
  },
};
```

Then register it in `src/lib/terminal/commands/index.ts`.

### Modifying the Computer Frame

Adjust the screen bounds and button positions in `src/components/terminal/ComputerBackground.tsx`.

### CRT Effects

Toggle and customize CRT effects in `src/components/terminal/CRTEffect.tsx`.

## License

MIT © Daniel Boyle

## Author

**Daniel W. Boyle**
- Email: dan.boyle7@gmail.com
- GitHub: [@danboyle7](https://github.com/danboyle7)
- LinkedIn: [daniel-w-boyle](https://linkedin.com/in/daniel-w-boyle)
