import type { CollectionEntry } from "astro:content";

type NotesEntry = CollectionEntry<"notes">;

export function workspaceKeyFromSlug(slug: string) {
  return slug.split("/")[0] ?? "";
}

export function entriesInWorkspace(entries: NotesEntry[], workspaceKey: string) {
  const prefix = `${workspaceKey}/`;
  return entries
    .filter((e) => e.slug === workspaceKey || e.slug.startsWith(prefix))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function directSubfolders(entries: NotesEntry[], workspaceKey: string) {
  const prefix = `${workspaceKey}/`;
  const map = new Map<string, { folderSlug: string; count: number }>();

  for (const e of entries) {
    if (!e.slug.startsWith(prefix)) continue;
    const rest = e.slug.slice(prefix.length);         // "a/b/c"
    const seg = rest.split("/")[0];
    if (!seg) continue;

    const folderSlug = `${workspaceKey}/${seg}`;
    const item = map.get(folderSlug) ?? { folderSlug, count: 0 };
    item.count += 1;
    map.set(folderSlug, item);
  }

  return Array.from(map.values()).sort((a, b) => a.folderSlug.localeCompare(b.folderSlug));
}
