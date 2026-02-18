// src/lib/distillModes.ts
import type { Clip } from "./clips";

export type DistillMode = "stream" | "script" | "slides" | "essay";

export type ScriptBlock = {
  kind: "line" | "beat" | "callout";
  text: string;
  meta?: { type?: Clip["type"]; sourceTitle: string; sourceSlug: string };
};

export type Slide = {
  title: string;
  body: string;
  meta?: { type?: Clip["type"]; sourceTitle: string; sourceSlug: string };
};

const BEAT = "—";

function cleanClipText(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}

function firstLine(text: string) {
  return cleanClipText(text).split("\n").find(Boolean) ?? "";
}

function softTitleFrom(text: string) {
  // Title heuristic: first line, trimmed, capped.
  const t = firstLine(text)
    .replace(/^[\[\(\{].*?[\]\)\}]\s*/g, "") // ✅ fixed regex
    .trim();

  if (!t) return "Slide";
  return t.length > 48 ? `${t.slice(0, 48).trim()}…` : t;
}

function splitForSlides(text: string, maxChars = 220): string[] {
  const s = cleanClipText(text);

  // Prefer paragraph boundaries.
  const paras = s.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];

  for (const p of paras) {
    if (p.length <= maxChars) {
      out.push(p);
      continue;
    }
    // If a paragraph is too long, split by sentences.
    const sentences = p.split(/(?<=[.!?])\s+/g).map((x) => x.trim()).filter(Boolean);
    let buf = "";
    for (const sent of sentences) {
      const next = buf ? `${buf} ${sent}` : sent;
      if (next.length > maxChars && buf) {
        out.push(buf);
        buf = sent;
      } else {
        buf = next;
      }
    }
    if (buf) out.push(buf);
  }

  return out.length ? out : [s];
}

export function toScript(clips: Clip[]): ScriptBlock[] {
  const blocks: ScriptBlock[] = [];

  for (const c of clips) {
    const text = cleanClipText(c.text);

    // Keep callouts clearly separated.
    const kind: ScriptBlock["kind"] = c.type === "quote" ? "line" : "callout";

    // Paragraphs become separate lines + beats between clips
    const paras = text.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);

    for (const p of paras) {
      blocks.push({
        kind,
        text: p,
        meta: { type: c.type, sourceTitle: c.sourceTitle, sourceSlug: c.sourceSlug },
      });
      blocks.push({ kind: "beat", text: BEAT });
    }
  }

  // Trim trailing beat
  while (blocks.length && blocks.at(-1)?.kind === "beat") blocks.pop();

  return blocks;
}

export function toSlides(clips: Clip[]): Slide[] {
  const slides: Slide[] = [];

  for (const c of clips) {
    const chunks = splitForSlides(c.text, 220);

    chunks.forEach((chunk, i) => {
      slides.push({
        title: i === 0 ? softTitleFrom(c.text) : "—",
        body: chunk,
        meta: { type: c.type, sourceTitle: c.sourceTitle, sourceSlug: c.sourceSlug },
      });
    });
  }

  return slides;
}

export function toEssay(clips: Clip[]): { htmlSafeBlocks: { kind: "p" | "aside"; text: string }[] } {
  const blocks: { kind: "p" | "aside"; text: string }[] = [];

  for (const c of clips) {
    const text = cleanClipText(c.text);
    const paras = text.split(/\n{2,}/g).map((p) => p.trim()).filter(Boolean);

    for (const p of paras) {
      blocks.push({
        kind: c.type === "quote" ? "p" : "aside",
        text: p,
      });
    }
  }

  return { htmlSafeBlocks: blocks };
}
