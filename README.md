# 🧠 Intellectual OS

*A calm, deterministic, desktop-first knowledge distillation system built with Astro.*

---

## Overview

This project is a **server-first Intellectual Operating System** designed to:

* Organize notes using slug-driven routing
* Extract blockquotes (`>`) as distillable clips
* Aggregate knowledge at folder and workspace level
* Preserve natural writing flow
* Produce production-ready material (scripts, blog posts, slide drafts)

It is intentionally:

* Desktop-first (1440px+)
* Minimal JavaScript
* No CMS behavior
* Not dependent on any note-taking app
* Deterministic and structure-driven

---

## Core Principles

* **Slug = Structural Truth**
* **Workspace = First slug segment**
* **Recency = Filesystem modified time (mtime)**
* **Clips = Markdown blockquotes (`>`)**
* **No required frontmatter**
* **Server-first rendering**

---

## Routing

| Route                      | Behavior                              |
| -------------------------- | ------------------------------------- |
| `/notes/[...slug]`         | Note, Folder, or Workspace board      |
| `/notes/[...slug]/distill` | Extract clips across folder/workspace |

---

## Distill Engine

Distill extracts:

* Any Markdown blockquote (`>`)
* Multi-line and multi-paragraph blockquotes as a single clip
* Callouts: `[!TIP]`, `[!WARNING]`, `[!IMPORTANT]`, `[!CAUTION]`, `[!CALLOUT]`

Order rules:

1. Notes sorted by **filesystem modified time (most recent first)**
2. Clips preserved in **natural order within each note**
3. Rendered as a calm continuous stream

---

## Recency System

Recency is derived from filesystem metadata.

Before running dev/build:

```bash
node scripts/build-notes-index.js
```

Recommended package.json setup:

```json
{
  "scripts": {
    "predev": "node src/scripts/build-notes-index.js",
    "dev": "astro dev",
    "prebuild": "node src/scripts/build-notes-index.js",
    "build": "astro build"
  }
}
```

---

## Project Structure (Core)

```
src/
  components/
  layouts/
  pages/
  lib/
    clips.ts
    folders.ts
    distillBundle.ts
    notesIndex.ts
  config/
    workspaces.ts
  /scripts/
  build-notes-index.js
```

---

## Design System

* Token-based styling
* Material 3 influenced
* Desktop-first layout
* Material Symbols via `--font-icon`
* Calm UI hierarchy
* Minimal specificity

---

## Development

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

---

## Contribution Guidelines

* Do not introduce heavy hydration.
* Do not require note frontmatter.
* Avoid adding new lib modules unless necessary.
* Keep one module per concern.
* Preserve deterministic logic.
* Maintain calm UI tone.

---

## Philosophy

This is not a CMS.
This is not a blog generator.
This is a thinking system.

The goal is to distill clarity from raw notes into production output — calmly and structurally.

---

The repository includes sample notes under:
src/content/notes/sample/

Your real notes should live under:
src/content/notes/

The notes directory is gitignored except for sample/.
