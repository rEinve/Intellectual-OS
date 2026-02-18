import idx from "@content/notes.index.json";

type NotesIndex = Record<string, { mtimeMs: number }>;

const notesIndex = idx as NotesIndex;

export function getMtimeMsForSlug(slug: string) {
  return notesIndex[slug]?.mtimeMs ?? 0;
}

export function sortByRecent(aSlug: string, bSlug: string) {
  const a = getMtimeMsForSlug(aSlug);
  const b = getMtimeMsForSlug(bSlug);
  if (b !== a) return b - a;
  return aSlug.localeCompare(bSlug);
}
