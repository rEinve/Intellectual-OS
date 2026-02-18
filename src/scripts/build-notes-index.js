import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(process.cwd(), "src/content/notes");
const OUT = path.resolve(process.cwd(), "src/content/notes.index.json");

const exts = new Set([".md", ".mdx"]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (exts.has(path.extname(ent.name).toLowerCase())) out.push(full);
  }
  return out;
}

function slugFromFile(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  return rel.replace(/\.(md|mdx)$/i, "");
}

const files = walk(ROOT);
const index = {};

for (const f of files) {
  const slug = slugFromFile(f);
  const stat = fs.statSync(f);
  index[slug] = { mtimeMs: stat.mtimeMs };
}

fs.writeFileSync(OUT, JSON.stringify(index, null, 2), "utf-8");
console.log(`[notes-index] wrote ${Object.keys(index).length} slugs -> ${OUT}`);
