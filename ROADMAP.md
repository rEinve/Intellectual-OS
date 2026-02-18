# ROADMAP.md

*Intellectual OS — Structured Evolution Plan*

---

## Vision

Build a calm, deterministic, server-first Intellectual OS that:

* Ingests raw Markdown notes
* Extracts structured thinking units (clips)
* Aggregates insight across workspaces
* Produces production-ready outputs
* Remains app-agnostic and format-light

No drift.
No feature accumulation.
Only structural clarity.

---

# Phase 1 — Structural Stabilization (Current Phase)

### Goal

Lock down core architecture before expansion.

### Must Be Stable Before 1.0

* [x] Slug-driven routing
* [x] Workspace = first slug segment
* [x] Folder landing pages
* [x] Workspace production board
* [x] `/distill` at folder and workspace level
* [x] Multi-paragraph blockquote extraction
* [x] Callout type support
* [x] Natural clip stream (no theme grouping)
* [x] Filesystem mtime recency
* [x] Deterministic sorting
* [x] Minimal hydration
* [x] Repo documentation

### Remaining Before 1.0

* [ ] Remove unused lib modules
* [ ] Ensure zero duplicated logic
* [ ] Confirm no dead code paths
* [ ] Freeze core surface

---

# Phase 2 — Production Output Layer

### Goal

Turn distilled clips into structured output formats.

### 2.1 Script Mode

Render clips as:

```
TITLE
HOOK
SECTION
POINT
CLOSING
```

Auto-structure based on:

* Heading depth
* Clip grouping
* Workspace context

No AI required.
Pure structural transformation.

---

### 2.2 Slide Mode

Render clips as:

* One clip per slide
* Optional heading as slide title
* Clean presentation mode layout

Export:

* Printable Markdown
* Or simple HTML presentation view

---

### 2.3 Article Mode

Transform clip stream into:

* Editorial article structure
* Section grouping by heading
* Clean publish-ready layout

Still server-first.

---

# Phase 3 — Refinement & Intelligence (Without AI Dependency)

### 3.1 Clip Tagging (Structural Only)

Optional detection:

* Question clips
* Definition clips
* Action clips

Derived from pattern matching.
No required metadata.

---

### 3.2 Export Tools

* Copy as Markdown
* Copy as Script format
* Export to .md file
* Export to .txt

Minimal JS only where necessary.

---

### 3.3 Recency Modes

Optional toggle (server param):

* Recently modified
* Recently created (if index extended)
* Alphabetical

Must remain deterministic.

---

# Phase 4 — System Maturity

### 4.1 Structural Freeze (Version 1.0)

Once achieved:

* No routing changes
* No slug logic changes
* No recency model changes
* No clip syntax changes

Only additive features allowed.

---

### 4.2 Performance Optimization

If workspace grows large:

* Limit distill to recent N notes
* Optional lazy aggregation
* Maintain server-first approach

---

# Non-Goals

This system will NOT:

* Become a CMS
* Require structured frontmatter
* Depend on any note-taking app
* Introduce AI summarization as core logic
* Introduce mobile-first complexity
* Accumulate UI gimmicks

---

# Long-Term Philosophy

This project optimizes for:

* Cognitive clarity
* Structural determinism
* Longevity
* Low maintenance
* Predictable behavior

It is a thinking engine, not a feature engine.

---

# Current Direction

Immediate next decision:

1. Freeze core architecture (prepare 1.0)
2. Build Script Mode
3. Build Slide Mode
4. Refine Workspace board calmness
5. Clean unused lib files

---


