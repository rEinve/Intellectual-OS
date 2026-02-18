// src/lib/collectDistillClips.ts
import { getCollection } from "astro:content";
import type { Clip } from "./clips";
import { extractClipsFromMarkdown } from "./clips"; // ✅ must reuse the SAME extractor NoteView uses
import notesIndex from "../content/notes.index.json"; // adjust path to your notes.index.json

type IndexRow = { slug: string; mtime: number; title?: string };

function byMtimeDesc(a: IndexRow, b: IndexRow) {
  return (b.mtime ?? 0) - (a.mtime ?? 0);
}

export async function collectDistillClips(prefixSlug: string): Promise<Clip[]> {
  const prefix = prefixSlug.replace(/\/+$/, ""); // trim trailing slash

  // 1) filter index rows by slug prefix (deterministic set)
  const rows = (notesIndex as IndexRow[])
    .filter((r) => r.slug === prefix || r.slug.startsWith(prefix + "/"))
    .sort(byMtimeDesc);

  if (rows.length === 0) return [];

  // 2) load collection once, then map by slug
  const entries = await getCollection("notes");
  const bySlug = new Map(entries.map((e) => [e.slug, e]));

  // 3) in mtime order, extract clips from markdown body
  const out: Clip[] = [];
  for (const r of rows) {
    const entry = bySlug.get(r.slug);
    if (!entry) continue;

    // IMPORTANT: use markdown source (entry.body) — not rendered HTML.
    const md = (entry as any).body as string | undefined;
    if (!md) continue;

    const title =
      (entry.data && (entry.data as any).title) ||
      (r.title ?? entry.slug.split("/").at(-1) ?? "Untitled");

    const clips = extractClipsFromMarkdown(md, {
      sourceSlug: entry.slug,
      sourceTitle: title,
    });

    out.push(...clips);
  }

  return out;
}
