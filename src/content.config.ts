import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  type: "content",
  schema: z.object({
    // make everything optional so “raw notes” still load
    title: z.string().optional(),
    date: z.coerce.date().optional(), // coerce allows "2026-02-13" if you ever add it later
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { notes };
