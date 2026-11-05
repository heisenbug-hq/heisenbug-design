import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
export const marker =
  "<!-- Synced from heisenbug-hq/heisenbug-design; do not edit here -->";
export function marked(source) {
  if (source.startsWith("---\n") || source.startsWith("---\r\n")) {
    const match = source.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
    if (!match) throw new Error("Unclosed front matter");
    return `${match[0]}${marker}\n${source.slice(match[0].length)}`;
  }
  return `${marker}\n\n${source}`;
}
export async function documents() {
  return Promise.all(
    ["DESIGN.md", "docs/ui-standards.md"].map(async (path) => ({
      path,
      content: marked(
        await readFile(new URL(`../${path}`, import.meta.url), "utf8"),
      ),
    })),
  );
}
export async function sync(root = process.cwd()) {
  for (const { path, content } of await documents()) {
    const target = resolve(root, path);
    if (target === fileURLToPath(new URL(`../${path}`, import.meta.url)))
      throw new Error("Cannot sync over the canonical source");
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
  }
}
export async function check(root = process.cwd()) {
  const differences = [];
  for (const { path, content } of await documents()) {
    try {
      if ((await readFile(resolve(root, path), "utf8")) !== content)
        differences.push(path);
    } catch (error) {
      if (error.code === "ENOENT") differences.push(path);
      else throw error;
    }
  }
  return differences;
}
