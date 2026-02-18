# 🧠 ARCHITECTURE.md

*Intellectual OS — Structural Map*

---

## 1. System Intent

This system is a **desktop-first, server-rendered Intellectual OS** built with Astro.

It exists to:

* Organize raw Markdown notes
* Extract blockquotes (`>`) as distillable units
* Aggregate content across folders/workspaces
* Produce production-ready outputs
* Remain deterministic and app-agnostic

---

## 2. Structural Truth

### Slug = Structure

The slug derived from filesystem path is the primary structural truth.

Example:

```
src/content/notes/philosophy/power-prayer/morning-questions.md
```

Slug:

```
philosophy/power-prayer/morning-questions
```

Routing and grouping are based solely on slug structure.

No database.
No CMS state.
No hidden metadata.

---

## 3. Workspace Model

Workspace = first segment of slug.

Examples:

| Slug             | Workspace  |
| ---------------- | ---------- |
| `philosophy/...` | philosophy |
| `systems/...`    | systems    |
| `daily-note/...` | daily-note |

Workspace display metadata lives in:

```
src/config/workspaces.ts
```

Keys must match slug exactly.

---

## 4. Routing

### Dynamic Route

```
src/pages/notes/[...slug].astro
```

Renders:

* NoteView → if slug matches a note
* FolderView → if slug matches a folder
* WorkspaceBoard → if slug is a workspace root

---

### Distill Route

```
src/pages/notes/[...slug]/distill.astro
```

Behavior:

* Aggregates notes under folder/workspace
* Sorts by filesystem modified time (mtime)
* Extracts clips
* Renders natural clip stream

---

## 5. Recency System

Recency is not derived from frontmatter.

Recency = filesystem modified time (mtime).

Generated via:

```
scripts/build-notes-index.js
```

Output:

```
src/content/notes.index.json
```

Accessed through:

```
src/lib/notesIndex.ts
```

Sorting rule:

1. Most recent mtime first
2. Fallback: slug lexicographic order

---

## 6. Clip Extraction Engine

Located in:

```
src/lib/clips.ts
```

Extraction Rules:

* Any Markdown blockquote (`>`) becomes a clip
* Multi-line and multi-paragraph blockquotes are treated as one clip
* Paragraph breaks inside blockquotes are preserved
* Callouts supported:

  * `[!TIP]`
  * `[!IMPORTANT]`
  * `[!WARNING]`
  * `[!CAUTION]`
  * `[!CALLOUT]`

Clip type is derived from callout marker or defaults to `"quote"`.

---

## 7. Distill Pipeline

```
Folder/workspace
    ↓
entriesUnderFolder()
    ↓
Sort by mtime
    ↓
buildDistillBundle()
    ↓
extractClipsFromMarkdown()
    ↓
DistillView
```

Order rules:

* Notes sorted by recency
* Clips preserved in natural order inside each note
* No thematic regrouping

---

## 8. Core Libraries (Canonical)

`src/lib/` should contain only:

* `clips.ts`
* `folders.ts`
* `distillBundle.ts`
* `notesIndex.ts`
* `notesTree.ts` (if sidebar tree is active)

Each file has one responsibility.

No duplicate logic across files.

---

## 9. Design System

* Token-based SCSS
* Desktop-first layout (1440px+)
* Minimal JS
* Server-rendered UI
* Material Symbols via `--font-icon`
* Calm hierarchy

---

## 10. Non-Goals

This system is NOT:

* A CMS
* A WYSIWYG editor
* A blogging engine
* Dependent on any specific note-taking app
* Frontmatter-driven

Notes must work as raw Markdown.

---

## 11. Determinism Rules

* No random ordering
* No client-side re-sorting
* No implicit state
* All output reproducible from filesystem + code

---

## 12. Contribution Constraints

When modifying architecture:

* Preserve slug as structural truth
* Avoid new lib modules unless necessary
* Avoid hydration-heavy UI
* Do not introduce frontmatter dependency
* Maintain recency logic via mtime
* Keep distill output natural

---

## 13. Mental Model

This is not a publishing tool.

It is a **thinking engine**.

Structure first.
Extraction second.
Presentation third.

---
