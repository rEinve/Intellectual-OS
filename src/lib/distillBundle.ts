// src/lib/distillBundle.ts
import type { CollectionEntry } from "astro:content";
import { extractClipsFromMarkdown, type Clip } from "@lib/clips";

type NotesEntry = CollectionEntry<"notes">;

export type DistillSection = {
  sourceSlug: string;
  sourceTitle: string;
  clips: Clip[];
};

export type DistillBundle = {
  totalNotes: number;
  totalClips: number;
  sections: DistillSection[]; // <- ordered stream by note
};

export async function buildDistillBundle(args: {
  entries: NotesEntry[];
  getBody: (e: NotesEntry) => Promise<string> | string;
  titleOf: (e: NotesEntry) => string;
}): Promise<DistillBundle> {
  const { entries, getBody, titleOf } = args;

  const sections: DistillSection[] = [];
  let totalClips = 0;

  for (const e of entries) {
    const body = await getBody(e);
    const sourceTitle = titleOf(e);

    const clips = extractClipsFromMarkdown({
      body: body ?? "",
      sourceSlug: e.slug,
      sourceTitle,
    });

    totalClips += clips.length;

    // Keep note order even if clips are empty (optional).
    // If you prefer to hide empties, only push when clips.length > 0.
    sections.push({
      sourceSlug: e.slug,
      sourceTitle,
      clips,
    });
  }

  return {
    totalNotes: entries.length,
    totalClips,
    sections,
  };
}
