export function normalizeSlug(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\.mdx?$/, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
