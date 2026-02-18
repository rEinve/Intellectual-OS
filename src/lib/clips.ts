// src/lib/clips.ts

export type ClipType =
  | "quote"
  | "tip"
  | "important"
  | "warning"
  | "caution"
  | "callout";

export type Clip = {
  id: string;
  text: string;
  type: ClipType;
  sourceSlug: string;
  sourceTitle: string;
  section?: {
    text: string;
    slug: string;
    depth: number;
  };
};

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function makeId(sourceSlug: string, n: number) {
  return `${sourceSlug}::clip::${n}`;
}

function isHeadingLine(line: string) {
  return /^#{1,6}\s+/.test(line);
}

function parseHeading(line: string) {
  const m = /^(#{1,6})\s+(.*)$/.exec(line);
  if (!m) return null;
  const depth = m[1]!.length;
  const text = (m[2] ?? "").trim();
  if (!text) return null;
  return { depth, text, slug: slugifyHeading(text) };
}

function isBlockquoteLine(line: string) {
  return /^\s*>/.test(line);
}

function stripOneBlockquotePrefix(line: string) {
  return line.replace(/^\s*>\s?/, "");
}

function detectCalloutType(firstLine: string): {
  type: ClipType;
  cleaned: string;
} {
  const m = /^\[!(TIP|IMPORTANT|WARNING|CAUTION|CALLOUT)\]\s*/i.exec(firstLine);

  if (!m) {
    return { type: "quote", cleaned: firstLine };
  }

  const rawType = m[1].toLowerCase() as ClipType;
  const cleaned = firstLine.replace(/^\[![^\]]+\]\s*/i, "");

  return { type: rawType, cleaned };
}

export function extractClipsFromMarkdown(args: {
  body: string;
  sourceSlug: string;
  sourceTitle: string;
}): Clip[] {
  const { body, sourceSlug, sourceTitle } = args;

  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const clips: Clip[] = [];

  let currentSection: Clip["section"] | undefined;
  let i = 0;
  let clipCount = 0;

  while (i < lines.length) {
    const raw = lines[i] ?? "";
    const line = raw.trimEnd();

    if (isHeadingLine(line)) {
      const h = parseHeading(line);
      if (h) currentSection = h;
      i++;
      continue;
    }

    if (isBlockquoteLine(line)) {
      const buffer: string[] = [];
      let j = i;

      while (j < lines.length) {
        const next = (lines[j] ?? "").trimEnd();
        if (!isBlockquoteLine(next)) break;
        buffer.push(stripOneBlockquotePrefix(next));
        j++;
      }

      if (buffer.length === 0) {
        i = j;
        continue;
      }

      // Detect callout type from first line
      const first = buffer[0] ?? "";
      const { type, cleaned } = detectCalloutType(first);
      buffer[0] = cleaned;

      // Normalize paragraph breaks
      const parts: string[] = [];
      for (const b of buffer) {
        if (b.trim() === "") {
          if (parts.length === 0 || parts[parts.length - 1] === "") continue;
          parts.push("");
        } else {
          parts.push(b);
        }
      }

      const text = parts
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      if (text) {
        clips.push({
          id: makeId(sourceSlug, ++clipCount),
          text,
          type,
          sourceSlug,
          sourceTitle,
          section: currentSection,
        });
      }

      i = j;
      continue;
    }

    i++;
  }

  return clips;
}
