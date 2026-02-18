# CONTRIBUTING.md

*Intellectual OS Contribution Guidelines*

---

## 1. Philosophy

This project is not a CMS.
It is not a blogging engine.
It is a deterministic thinking system.

All contributions must preserve:

* Slug-driven structure
* Server-first rendering
* Minimal JavaScript
* App-agnostic note ingestion
* Calm, desktop-first UI
* Deterministic output

---

## 2. Architectural Constraints (Non-Negotiable)

### Slug is Structural Truth

* Never introduce alternative routing systems.
* Do not override slug logic with database state.
* Do not create hidden mappings between folders and views.

Workspace = first slug segment.
This must remain consistent.

---

### No Frontmatter Dependency

Notes must work as raw Markdown.

Do NOT:

* Require `date`
* Require `title`
* Require `tags`
* Require custom metadata fields

If metadata exists, it may enhance display — but it must never be required.

---

### Recency Rules

Recency is derived from:

Filesystem modified time (`mtime`)

Generated via:

```
scripts/build-notes-index.js
```

Never replace this with:

* Frontmatter dates
* Client-side timestamps
* Runtime filesystem scanning

Sorting must remain deterministic.

---

### Clip Extraction Rules

Clips are derived strictly from Markdown blockquotes:

```
> Quote text
```

Multi-line and multi-paragraph blockquotes must remain one clip.

Supported callouts:

* `[!TIP]`
* `[!IMPORTANT]`
* `[!WARNING]`
* `[!CAUTION]`
* `[!CALLOUT]`

Do not introduce new syntax unless it adheres to Markdown standard behavior.

---

### Server-First Policy

Avoid hydration unless absolutely necessary.

Before adding client-side behavior, ask:

* Can this be rendered server-side?
* Can this be solved structurally?
* Is this essential to thinking flow?

If hydration is required, justify it in PR description.

---

## 3. Code Organization Rules

### One Module Per Concern

Inside `src/lib/`:

Each file must have one clear responsibility.

Do not:

* Duplicate helpers across files
* Create alternative versions of existing utilities
* Leave unused experimental files in the repo

If a file becomes unused, delete it.

---

### Avoid Drift

Before adding a new file to `src/lib/`:

1. Check if functionality already exists.
2. Refactor existing module if possible.
3. Avoid parallel logic.

---

### No Silent Side Effects

All transformations must be:

* Explicit
* Deterministic
* Traceable from route → lib → view

Avoid hidden global state.

---

## 4. UI Guidelines

This is a calm, editorial interface.

### Do:

* Use existing tokens
* Maintain spacing rhythm
* Preserve reading width constraints
* Keep typography consistent

### Do Not:

* Introduce flashy animations
* Add decorative complexity
* Add mobile-first logic (system is desktop-first)
* Increase CSS specificity unnecessarily

---

## 5. Pull Request Checklist

Before submitting a PR:

* [ ] Slug logic unchanged
* [ ] Recency logic intact
* [ ] No new required frontmatter
* [ ] No heavy hydration added
* [ ] No duplicate lib files created
* [ ] Distill output remains natural stream
* [ ] `notes.index.json` generation still works
* [ ] Build passes

---

## 6. Development Workflow

Run before dev/build:

```bash
node scripts/build-notes-index.js
```

Recommended scripts:

```json
{
  "predev": "node scripts/build-notes-index.js",
  "dev": "astro dev",
  "prebuild": "node scripts/build-notes-index.js",
  "build": "astro build"
}
```

---

## 7. Breaking Changes Policy

Breaking structural changes must:

* Be documented in `ARCHITECTURE.md`
* Update README if relevant
* Include reasoning in PR description
* Not violate deterministic guarantees

---

## 8. What This Project Is Optimizing For

* Clarity
* Structure
* Longevity
* Low cognitive load
* Predictable output

Not:

* Feature accumulation
* Tool complexity
* Rapid UI experimentation

---

## 9. Long-Term Rule

If a change makes the system:

* Harder to reason about
* Less deterministic
* More dependent on formatting rules
* More app-specific

It should not be merged.

---

## 10. Final Guiding Principle

Structure first.
Extraction second.
Presentation third.

If structure weakens, the system collapses.

---
