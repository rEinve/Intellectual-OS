// src/lib/distillExport.ts
import type { Clip } from "@lib/clips";

export type DistillBundle = { clips: Clip[] };

function clean(s: string) {
  return (s ?? "").replace(/\r\n/g, "\n").trim();
}

function titleFromSlug(slug: string) {
  const last = slug.split("/").at(-1) ?? slug;
  return last.replace(/-/g, " ");
}

// Script (teleprompter)
export function toScriptText(bundle: DistillBundle) {
  return bundle.clips
    .map((c) => clean(c.text))
    .filter(Boolean)
    .join("\n\n—\n\n");
}

// Essay (Markdown draft)
export function toEssayMarkdown(bundle: DistillBundle) {
  return bundle.clips
    .map((c) => {
      const t = clean(c.text);
      if (!t) return "";
      if (c.type !== "quote") return `> ${t.replace(/\n/g, "\n> ")}`;
      return t;
    })
    .filter(Boolean)
    .join("\n\n");
}

// Slides (JSON payload)
export function toSlidesJSON(bundle: DistillBundle) {
  return bundle.clips
    .map((c) => ({
      title: titleFromSlug(c.sourceSlug),
      body: clean(c.text),
      type: c.type,
      source: { slug: c.sourceSlug, title: c.sourceTitle },
      section: c.section ?? null,
    }))
    .filter((s) => s.body.length > 0);
}
