// src/pages/api/search.json.ts
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

function stripMd(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, " ") // code fences
    .replace(/`[^`]*`/g, " ")       // inline code
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ") // images
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")  // links
    .replace(/^#{1,6}\s+/gm, " ")   // headings
    .replace(/>\s+/g, " ")          // blockquotes
    .replace(/[*_~]/g, " ")         // emphasis
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromSlug(slug: string) {
  const last = slug.split("/").pop() ?? slug;
  // display-friendly; keep it simple
  const withSpaces = last.replace(/[-_]+/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export const GET: APIRoute = async () => {
  const entries = await getCollection("notes");

  const index = entries.map((entry) => {
    const title = entry.data?.title?.trim() || titleFromSlug(entry.slug);
    const content = stripMd(entry.body).slice(0, 20_000); // cap for speed
    return { slug: entry.slug, title, content };
  });

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
