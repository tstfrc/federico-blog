---
title: "Getting Started with Astro: A Test Article"
description: "This is a sample article written in Markdown to test content rendering in an Astro blog."
pubDate: 2026-01-22
author: "Your Name"
tags: ["astro", "blog", "markdown", "test"]
---

# Getting Started with Astro

Welcome to this **test article** for your Astro blog.  
This post is designed to help you verify that Markdown rendering, layout, and styles are working as expected.

---

## Why Astro?

Astro is a modern static site builder that focuses on:

- ⚡ Performance by default
- 🧩 Component-driven architecture
- 🚀 Zero JavaScript by default
- 📝 First-class Markdown support

This makes it perfect for blogs, documentation, and content-driven websites.

---

## Markdown Features Test

Below you can find a quick test of common Markdown elements.

### Text Formatting

- *Italic text*
- **Bold text**
- ***Bold and italic***
- ~~Strikethrough~~

### Lists

**Unordered list**
- Item one
- Item two
- Item three

**Ordered list**
1. First item
2. Second item
3. Third item

---

### Blockquote

> Astro helps you build faster websites with less JavaScript.

---

### Code Blocks

```js
export async function getStaticPaths() {
  return [
    { params: { slug: "test-article" } }
  ];
}
