import type { CollectionEntry } from "astro:content";

type NotesEntry = CollectionEntry<"notes">;
export type WorkspaceSubfolder = { folderSlug: string; count: number };

export function workspaceKeyFromSlug(slug: string) {
  return slug.split("/")[0] ?? "";
}

export function entriesInWorkspace(entries: NotesEntry[], workspaceKey: string) {
  const prefix = `${workspaceKey}/`;
  return entries
    .filter((e) => e.slug === workspaceKey || e.slug.startsWith(prefix))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function directSubfolders(
  entries: NotesEntry[],
  workspaceKey: string,
  maxDepth = 1,
) {
  const prefix = `${workspaceKey}/`;
  const map = new Map<string, WorkspaceSubfolder>();

  for (const e of entries) {
    if (!e.slug.startsWith(prefix)) continue;
    const rest = e.slug.slice(prefix.length);
    const segments = rest.split("/").filter(Boolean);
    if (segments.length === 0) continue;

    const folderSlug = `${workspaceKey}/${segments.slice(0, maxDepth).join("/")}`;
    const item = map.get(folderSlug) ?? { folderSlug, count: 0 };
    item.count += 1;
    map.set(folderSlug, item);
  }

  return Array.from(map.values()).sort((a, b) => a.folderSlug.localeCompare(b.folderSlug));
}
