// src/lib/notesTree.ts
// Slug/path is the structural source of truth.
// Titles are display-only and preserve readability.

export type NotesEntryLike = {
  slug: string; // e.g. "daily/2026-02-14" (no .md)
  data?: { title?: string };
};

export type TreeNode =
  | {
      kind: "folder";
      name: string; // display label for folder segment (derived)
      slug: string; // folder prefix slug e.g. "projects/irrigation"
      children: TreeNode[];
    }
  | {
      kind: "note";
      name: string; // display label for note (derived or frontmatter)
      slug: string; // full note slug e.g. "projects/irrigation/pump-design"
    };

/**
 * Routing-safe comparison:
 * - normalize for matching (lowercase)
 * - keep UI text as originally readable (no forced lowercasing in labels)
 */
export function normalizeSlug(input: string): string {
  return input
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

/**
 * Turn a slug segment into a readable label (display-only).
 * Examples:
 *  - "pump-design" -> "Pump design"
 *  - "How to Improve pump efficacy" -> "How to Improve pump efficacy"
 *  - "2026-02-14" -> "2026-02-14"
 */
export function humanizeSegment(segment: string): string {
  const s = segment.trim();
  if (!s) return s;

  // Convert hyphens/underscores to spaces for display, but keep existing casing.
  const withSpaces = s.replace(/[-_]+/g, " ");

  // Light “sentence case” only if the string looks like a typical slug (all lower).
  // If user already has casing/spaces, we preserve it.
  const isAllLower = withSpaces === withSpaces.toLowerCase();
  if (!isAllLower) return withSpaces;

  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

/**
 * Prefer frontmatter title if present.
 * Otherwise derive from filename (last segment of slug).
 * NOTE: entry.slug does not include ".md" in Astro content slugs.
 */
export function getDisplayTitle(entry: NotesEntryLike): string {
  const fm = entry?.data?.title?.trim();
  if (fm) return fm;

  const parts = entry.slug.split("/").filter(Boolean);
  const last = parts[parts.length - 1] ?? entry.slug;
  return humanizeSegment(last);
}

type FolderNode = Extract<TreeNode, { kind: "folder" }>;

/**
 * Build tree once (build-time). Unlimited nesting.
 * Avoid duplicate traversal by:
 * - single pass insertion
 * - deterministic sorting at the end
 */
export function buildNotesTree(entries: NotesEntryLike[]): FolderNode {
  const root: FolderNode = {
    kind: "folder",
    name: "Notes",
    slug: "",
    children: [],
  };

  // Map folderSlug -> folder node for O(1) reuse while inserting
  const folderIndex = new Map<string, FolderNode>();
  folderIndex.set("", root);

  for (const entry of entries) {
    const slugRaw = entry.slug ?? "";
    const slug = slugRaw.replace(/^\/+|\/+$/g, ""); // keep original for storage; normalize only for matching
    const parts = slug.split("/").filter(Boolean);
    if (!parts.length) continue;

    // walk folders
    let folderSlug = "";
    let parent = root;

    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i]!;
      const isLeaf = i === parts.length - 1;

      if (isLeaf) {
        // note node
        const noteNode: TreeNode = {
          kind: "note",
          name: getDisplayTitle(entry),
          slug,
        };
        parent.children.push(noteNode);
      } else {
        folderSlug = folderSlug ? `${folderSlug}/${segment}` : segment;

        const existing = folderIndex.get(folderSlug);
        if (existing) {
          parent = existing;
        } else {
          const folderNode: FolderNode = {
            kind: "folder",
            name: humanizeSegment(segment),
            slug: folderSlug,
            children: [],
          };
          parent.children.push(folderNode);
          folderIndex.set(folderSlug, folderNode);
          parent = folderNode;
        }
      }
    }
  }

  // Sort folders first, then notes; alphabetical by display name (case-insensitive)
  const sortRecursive = (node: FolderNode) => {
    node.children.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    for (const child of node.children) {
      if (child.kind === "folder") sortRecursive(child);
    }
  };

  sortRecursive(root);
  return root;
}
