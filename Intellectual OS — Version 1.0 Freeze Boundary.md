🧊 Intellectual OS — Version 1.0 Freeze Boundary
Definition

Version 1.0 = Structural Stability Guarantee

After 1.0:

Slug semantics will not change

Routing shape will not change

Clip extraction rules will not change

Recency logic will not change

Folder/workspace model will not change

Index generation contract will not change

Only:

UI refinement

Performance tuning

Documentation improvements

Bug fixes

No structural expansion.

🔒 Frozen Contracts
1️⃣ Slug Model (Immutable)

Slug derived strictly from filesystem path

First slug segment = workspace

No aliasing

No dynamic rewrite rules

No slug normalization beyond existing logic

Changing this = breaking architecture.

2️⃣ Routing Surface (Immutable)
/notes/[...slug]
/notes/[...slug]/distill


No additional structural routes.

No special cases.

Routing must remain deterministic.

3️⃣ Recency Engine (Immutable)

Source of truth:

mtime (filesystem modified time)


Generated via:

src/scripts/build-notes-index.js


Output:

src/content/notes.index.json


Sorting contract:

mtime desc

slug asc fallback

No frontmatter recency.
No metadata override.

This is core to structural determinism.

Your package.json already enforces predev + prebuild index generation 

package

4️⃣ Clip Extraction Contract (Immutable)

From src/lib/clips.ts

Rules frozen:

Any > blockquote becomes clip

Multi-paragraph preserved

Blank lines preserved

Order preserved

Callouts recognized

No regrouping

No semantic reinterpretation

Clips are structural — not stylistic.

5️⃣ Library Responsibility Map (Immutable)
clips.ts          → extraction only
folders.ts        → slug/folder logic only
distillBundle.ts  → bundle assembly only
notesIndex.ts     → mtime + sorting only
notesTree.ts      → sidebar only


No file may:

Duplicate another file’s logic

Reach across responsibilities

One file = one domain.

6️⃣ Markdown Pipeline (Frozen)

Current markdown security layer:

rehypeSlug

rehypeSanitize

Defined in astro.config.mjs 

astro.config

No additional markdown behavior without deliberate review.

This protects:

Script injection

Structural HTML mutation

7️⃣ Server-First Constraint (Frozen)

No client-side content rendering

No hydration for note content

No stateful UI logic

Minimal JS only.

8️⃣ Desktop-Only Constraint (Frozen)

Minimum width: 1440px
No responsive refactors allowed pre-1.1.

9️⃣ No Frontmatter Dependency (Immutable)

Frontmatter remains optional.

System must function correctly with raw Obsidian-style markdown.

🧠 Version Tag

You are ready to tag:

v1.0.0


Commit message:

chore: freeze structural architecture for v1.0
