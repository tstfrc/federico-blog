<div align="center">
  <h1>Federico's Blog</h1>
  <p>Microsoft & Modern Work Blog & Notes</p>
</div>

A modern, fast, and accessible blog platform built with **[Astro](https://astro.build)** and customized for Federico Tosetto's blog. Share insights, articles, and notes about Microsoft technologies, modern work, and more.

## 📋 Table of Contents

1. [About](#about)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Development](#development)
5. [Available Commands](#available-commands)
6. [Project Structure](#project-structure)
7. [Configuration](#configuration)
8. [Creating Content](#creating-content)
   - [Blog Posts](#blog-posts)
   - [Notes](#notes)
   - [Tags](#tags)
9. [Search Functionality](#search-functionality)
10. [Special Features](#special-features)
11. [Deployment](#deployment)
12. [License](#license)

## About

This is a personalized blog platform for **Federico Tosetto**, focused on sharing knowledge about Microsoft technologies, modern workplace solutions, and professional insights. The blog leverages Astro's modern approach to web performance combined with beautiful design and excellent user experience.

## Key Features

- ⚡ **Astro v5** - Lightning-fast static site generation with minimal JavaScript
- 🎨 **Tailwind CSS v4** - Modern, utility-first styling
- 📱 **Responsive Design** - Works beautifully on all devices
- 🌓 **Dark & Light Modes** - User-preferred theme switching
- 🔍 **Pagefind Search** - Fast, client-side search across all content
- 📝 **Markdown & MDX** - Write content with rich formatting support
  - Custom admonitions for callouts and highlights
  - GitHub Card embeds
  - Automatic reading time calculation
- 🖼️ **Dynamic OG Images** - Automatic Open Graph image generation with Satori
- ♿ **Accessibility** - Semantic HTML with full accessibility support
- 🤝 **Webmentions** - Engage with your readers through webmention.io integration
- 📡 **RSS Feeds** - Automatic RSS feed generation
- 🤖 **SEO Optimized** - Auto-generated sitemap and robots.txt
- 💻 **Code Highlighting** - Expressive Code with multiple themes (Dracula, GitHub Light)
- 🔗 **Social Links** - Easy integration with social media profiles

## Tech Stack

- **Framework**: [Astro 5](https://astro.build)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Content**: Markdown/MDX with remark plugins
- **Search**: [Pagefind](https://pagefind.app)
- **Code Highlighting**: [Expressive Code](https://expressive-code.com)
- **Icons**: [Astro Icon](https://www.astroicon.dev)
- **Image Generation**: [Satori](https://github.com/vercel/satori)
- **Data Source**: SharePoint sync capability
- **Code Quality**: Biome for linting and formatting
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/federico-blog.git
cd federico-blog
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file (if needed for SharePoint sync):
```env
# Copy from .env.example and fill with your credentials
AZURE_TENANT_ID=your_tenant_id
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret
SHAREPOINT_SITE_URL=your_site_url
```

Validate environment variables:
```bash
pnpm validate:env
```

### Development

Start the development server:
```bash
pnpm dev
```

The site will be available at `http://localhost:3000`

## Available Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install project dependencies |
| `pnpm dev` | Start local development server |
| `pnpm build` | Build for production |
| `pnpm postbuild` | Generate static search index with Pagefind |
| `pnpm preview` | Preview production build locally |
| `pnpm check` | Run Astro type check + Biome linting |
| `pnpm lint` | Format and lint code with Biome |
| `pnpm format` | Format code with Prettier |
| `pnpm sync` | Sync content from SharePoint |

## Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── layout/         # Header, Footer, etc.
│   ├── blog/           # Blog-specific components
│   └── note/           # Note-specific components
├── content/            # Markdown/MDX content
│   ├── post/           # Blog posts
│   ├── note/           # Standalone notes
│   └── tag/            # Tag pages
├── layouts/            # Page layouts
│   ├── Base.astro      # Main layout
│   └── BlogPost.astro  # Post-specific layout
├── pages/              # Static and dynamic routes
│   ├── posts/          # Blog posts routes
│   ├── notes/          # Notes routes
│   └── tags/           # Tag archive routes
├── styles/             # CSS files
├── utils/              # Utility functions
├── plugins/            # Remark/Rehype plugins
├── lib/                # Library utilities (GraphAuth, SharePoint)
└── data/               # Data files

```

## Configuration

### Site Configuration

Edit [src/site.config.ts](src/site.config.ts) to customize:
- Author name and description
- Site title and URL
- Navigation menu links
- Date formatting preferences
- Code syntax highlighting themes

```typescript
export const siteConfig = {
  author: "Federico Tosetto",
  title: "Federico's Blog",
  description: "Microsoft Blog & Notes by Federico Tosetto",
  url: "https://federicotosetto.com/",
  // ... more options
};
```

### Astro Configuration

Modify [astro.config.ts](astro.config.ts) to:
- Configure integrations
- Set image optimization options
- Customize markdown/MDX processing

### Styling

- Global styles: [src/styles/global.css](src/styles/global.css)
- Customize [Tailwind theme](https://tailwindcss.com/docs/theme#customizing-your-theme)
- Component-specific styles in `src/styles/components/`

### Social Links

Edit [src/components/layout/Header.astro](src/components/layout/Header.astro) to add/modify social media links. Icons from [icones.js.org](https://icones.js.org/)

## Creating Content

### Blog Posts

Create a new markdown file in `src/content/post/`:

```markdown
---
title: "My Blog Post Title"
description: "Brief description of the post"
publishDate: "2025-01-08"
tags: ["tag1", "tag2"]
coverImage:
  src: ./my-image.png
  alt: "Image description"
draft: false
---

Your post content here...
```

**Supported frontmatter:**
- `title` (required) - Max 60 characters
- `description` (required) - Post summary
- `publishDate` - Date of publication
- `tags` - Array of tags (auto-deduplicated and lowercased)
- `coverImage` - Featured image with alt text
- `draft` - Set to `true` to hide from publication
- `ogImage` - Custom Open Graph image URL

### Notes

Create files in `src/content/note/` with similar frontmatter. Notes appear in the `/notes/` section and have a different layout.

### Tags

Create tag description pages in `src/content/tag/`:

```markdown
---
title: "Microsoft"
description: "Posts about Microsoft technologies"
---
```

The filename should match your tag name (case-insensitive).

### Content Features

**Admonitions** - Highlight important information:
```markdown
::: warning
This is a warning admonition
:::

::: tip
This is a tip admonition
:::
```

**GitHub Cards** - Embed GitHub repositories:
```markdown
https://github.com/username/repo
```

**Automatic Reading Time** - Calculated automatically based on content

## Search Functionality

The blog includes [Pagefind](https://pagefind.app/) for fast, client-side search. After building:

```bash
pnpm build
pnpm postbuild  # Generates search index
```

Search index is built automatically and doesn't require external services.

## Special Features

### SharePoint Sync

Sync content from SharePoint using:
```bash
pnpm sync
```

This requires Azure credentials configured in `.env` file. See [lib/sharepoint.ts](src/lib/sharepoint.ts) and [scripts/sync-sharepoint.js](scripts/sync-sharepoint.js)

### Webmentions

Show comments and interactions from other websites. Configure in your site:
1. Register at [webmention.io](https://webmention.io/)
2. Add your domain
3. Update configuration in relevant components

### OG Image Generation

Automatically generates beautiful Open Graph images for social sharing using Satori. Images are customizable by editing [src/pages/og-image/[...slug].png.ts](src/pages/og-image/[...slug].png.ts) or provide custom images via the `ogImage` frontmatter property.

## Deployment

The site builds to the `/dist` directory by default. Deploy options include:

- **Vercel**: Zero-config deployment with git integration
- **Netlify**: Connected git deployment with automatic builds
- **Static Hosting**: Works on any static host (AWS S3, GitHub Pages, Cloudflare, etc.)

See the [Astro deployment guide](https://docs.astro.build/en/guides/deploy/) for detailed instructions on your preferred platform.

### Build Process

```bash
pnpm build        # Build production-ready site to /dist
pnpm postbuild    # Generate Pagefind search index
pnpm preview      # Preview production build locally
```

## Contributing

Feel free to submit issues or pull requests to improve this blog.

## License

MIT

---

**Built with ❤️ using Astro**
