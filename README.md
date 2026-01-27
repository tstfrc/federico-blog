<div align="center">
  <h1>Federico's Blog</h1>
  <p>Microsoft & Modern Work Blog & Notes</p>
</div>

A modern, fast, and accessible blog platform built with **[Astro](https://astro.build)** and customized for Federico Tosetto's blog. Share insights, articles, and notes about Microsoft technologies, modern work, and more.

## Table of Contents

1. [About](#about)
2. [Key Features](#key-features)
3. [Getting Started](#getting-started)
4. [Creating Content](#creating-content)
5. [Deployment](#deployment)
6. [License](#license)

## About

This is a personalized blog platform for **Federico Tosetto**, focused on sharing knowledge about Microsoft technologies, modern workplace solutions, and professional insights. The blog leverages Astro's modern approach to web performance combined with beautiful design and excellent user experience.

## Key Features

- ⚡ **Astro** - Lightning-fast static site generation
- 🎨 **Tailwind CSS** - Modern, beautiful design
- 📱 **Responsive** - Works on all devices
- 🌓 **Dark & Light Modes** - User theme preference
- 🔍 **Search** - Fast client-side search
- 📝 **Markdown** - Write with rich formatting
- ♿ **Accessible** - Built with accessibility in mind
- 🤖 **SEO Optimized** - Automatic sitemaps and RSS feeds

## Tech Stack

- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Search**: Pagefind
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/federico-blog.git
cd federico-blog
```

2. Install dependencies:
```bash
pnpm install
```

### Development

Start the development server:
```bash
pnpm dev
```

The site will be available at `http://localhost:3000`

### Build & Deploy

```bash
pnpm build    # Build for production
pnpm preview  # Preview production build locally
```

## Creating Content

### Blog Posts

Create a new file in `src/content/post/` with frontmatter:

```markdown
---
title: "Post Title"
description: "Brief description"
publishDate: "2025-01-08"
tags: ["tag1", "tag2"]
draft: false
---

Your content here...
```

### Notes

Similar to posts, but create files in `src/content/note/` for standalone notes.

### Tags

Create tag pages in `src/content/tag/`:

```markdown
---
title: "Tag Name"
description: "Description"
---
```

### Content Features

- **Admonitions**: Use `::: warning` or `::: tip` for callouts
- **GitHub Cards**: Paste GitHub URLs to embed repositories
- **Reading Time**: Calculated automatically

## Deployment

The site builds to `/dist` and can be deployed to:

- **Vercel** - Zero-config deployment
- **Netlify** - Connected git deployment
- **Any static host** - AWS S3, GitHub Pages, Cloudflare, etc.

## License

MIT

---

**Built with ❤️ using Astro**
