// src/lib/folders.ts
import type { CollectionEntry } from "astro:content";

type NotesEntry = CollectionEntry<"notes">;

export function folderPrefixesFromSlug(slug: string) {
  // "a/b/c-note" -> ["a", "a/b"]
  const parts = slug.split("/").filter(Boolean);
  const prefixes: string[] = [];
  for (let i = 1; i < parts.length; i++) prefixes.push(parts.slice(0, i).join("/"));
  return prefixes;
}

export function allFolderSlugs(entries: NotesEntry[]) {
  const set = new Set<string>();
  for (const e of entries) for (const p of folderPrefixesFromSlug(e.slug)) set.add(p);
  return Array.from(set).sort(); // deterministic
}

export function entriesUnderFolder(
  entries: NotesEntry[],
  folderSlug: string,
  opts: { recursive?: boolean } = {}
) {
  const recursive = opts.recursive ?? true;
  const prefix = folderSlug ? `${folderSlug}/` : "";

  const inFolder = entries.filter((e) => e.slug.startsWith(prefix));

  if (recursive) return inFolder.sort((a, b) => a.slug.localeCompare(b.slug));

  // direct only: exactly one segment deeper than folder
  const depth = folderSlug.split("/").filter(Boolean).length;
  return inFolder
    .filter((e) => e.slug.split("/").filter(Boolean).length === depth + 1)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
