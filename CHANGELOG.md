# CHANGELOG.md

*Intellectual OS*

All notable changes to this project will be documented here.

This project follows a structural stability philosophy:

* Structure changes are major.
* Behavior refinements are minor.
* Visual tweaks are patch-level.

---

## [Unreleased]

### Planned

* Refine production board visual calm
* Export modes for distill (script / blog / slide)
* Search refinement pass
* Structural freeze for Version 1.0

---

## [0.4.0] – Workspace Distill Engine Stabilized

### Added

* Workspace-level `/distill` support
* Folder-level and workspace-level clip aggregation
* Multi-paragraph blockquote extraction (Markdown Guide compliant)
* Callout detection:

  * `[!TIP]`
  * `[!IMPORTANT]`
  * `[!WARNING]`
  * `[!CAUTION]`
  * `[!CALLOUT]`
* Natural clip stream rendering (no thematic grouping)
* Deterministic recency sorting via filesystem modified time (mtime)
* `notes.index.json` generation script
* Material Symbols token integration (`--font-icon`)

### Changed

* Clip extraction updated to treat multi-line blockquotes as a single clip
* Distill view switched from note list to clip stream
* Recency no longer dependent on frontmatter
* Routing stabilized for workspace roots

### Removed

* Legacy clip syntax (`[clip]`, `[!clip]`)
* Frontmatter-based recency assumptions
* Duplicate `folderEntries` declarations in distill route

---

## [0.3.0] – Slug-Driven Workspace Model

### Added

* Workspace = first slug segment rule
* Workspace production board view
* Folder landing pages
* Deterministic route resolution:

  * NoteView
  * FolderView
  * WorkspaceBoard

### Changed

* Slug parameter handling standardized (string-only for `[...slug]`)
* Removed array-based route param usage

---

## [0.2.0] – Distill Foundation

### Added

* `extractClipsFromMarkdown()` engine
* Callout type system
* Clip section anchoring via headings
* `distillBundle.ts` aggregation pipeline

### Changed

* Server-first distill rendering
* Deterministic slug-based aggregation

---

## [0.1.0] – Initial Architecture

### Added

* Astro-based slug-driven routing
* Desktop-first layout (1440px+)
* Fuse.js search (bundled)
* Sidebar tree from entry.slug
* Folder-level distill
* Token-based design system

---

# Versioning Philosophy

This project uses semantic versioning in spirit, but with architectural weight:

* **Major** → Structural truth changes (routing, slug rules, recency logic)
* **Minor** → Behavior or extraction logic improvements
* **Patch** → UI refinements or non-structural fixes

---

# Structural Freeze Goal

Version 1.0 will represent:

* Stable routing model
* Stable clip extraction rules
* Stable workspace logic
* Stable recency system
* Stable distill pipeline

After 1.0:

* Only additive enhancements allowed
* No structural drift

---


