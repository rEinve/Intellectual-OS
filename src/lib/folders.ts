// src/lib/folders.ts
import type { CollectionEntry } from "astro:content";
import { humanizeSegment } from "./notesTree";

type NotesEntry = CollectionEntry<"notes">;
export type FolderSummary = { folderSlug: string; count: number };

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

export function isFolderSlug(entries: NotesEntry[], folderSlug: string) {
  const prefix = folderSlug ? `${folderSlug}/` : "";
  return entries.some((entry) => entry.slug.startsWith(prefix));
}

export function directChildFolders(
  entries: NotesEntry[],
  folderSlug: string
): FolderSummary[] {
  const prefix = folderSlug ? `${folderSlug}/` : "";
  const map = new Map<string, FolderSummary>();

  for (const entry of entries) {
    if (!entry.slug.startsWith(prefix)) continue;

    const rest = entry.slug.slice(prefix.length);
    const segments = rest.split("/").filter(Boolean);
    if (segments.length <= 1) continue;

    const childSlug = `${folderSlug}/${segments[0]}`.replace(/^\/+/, "");
    const current = map.get(childSlug) ?? { folderSlug: childSlug, count: 0 };
    current.count += 1;
    map.set(childSlug, current);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.folderSlug.localeCompare(b.folderSlug)
  );
}

export function labelFromFolderSlug(folderSlug: string) {
  const segment = folderSlug.split("/").filter(Boolean).at(-1) ?? folderSlug;
  return humanizeSegment(segment);
}
