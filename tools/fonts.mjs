import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));

// Family names match the typography front matter in DESIGN.md.
export const families = [
  {
    family: "Geist",
    slug: "geist",
    pkg: "@fontsource/geist",
    weights: [400, 600],
  },
  {
    family: "Spline Sans Mono",
    slug: "spline-sans-mono",
    pkg: "@fontsource/spline-sans-mono",
    weights: [400, 500],
  },
];
export const subsets = ["latin", "latin-ext"];

// Reads the unicode-range of each subset from the Fontsource weight CSS.
function ranges(css, slug, weight) {
  const result = {};
  for (const subset of subsets) {
    const file = `${slug}-${subset}-${weight}-normal.woff2`;
    const block = css
      .split("@font-face")
      .find((part) => part.includes(`/${file})`));
    const range = block?.match(/unicode-range:\s*([^;]+);/)?.[1];
    if (!range) throw new Error(`No unicode-range for ${file}`);
    result[subset] = range.trim();
  }
  return result;
}

// Builds the exact set of files that fonts/ must hold: path -> Buffer.
export async function expected() {
  const out = new Map();
  const manifest = [];
  for (const { family, slug, pkg, weights } of families) {
    const base = dirname(require.resolve(`${pkg}/package.json`));
    out.set(`OFL-${slug}.txt`, await readFile(join(base, "LICENSE")));
    for (const weight of weights) {
      const css = await readFile(join(base, `${weight}.css`), "utf8");
      const unicodeRange = ranges(css, slug, weight);
      for (const subset of subsets) {
        const file = `${slug}-${subset}-${weight}-normal.woff2`;
        out.set(file, await readFile(join(base, "files", file)));
        manifest.push({
          family,
          weight,
          subset,
          file,
          unicodeRange: unicodeRange[subset],
        });
      }
    }
  }
  out.set(
    "manifest.json",
    Buffer.from(JSON.stringify(manifest, null, 2) + "\n"),
  );
  return out;
}

export async function drift(dir = join(root, "fonts")) {
  const want = await expected();
  const errors = [];
  let have = [];
  try {
    have = await readdir(dir);
  } catch {}
  for (const [name, bytes] of want) {
    let actual;
    try {
      actual = await readFile(join(dir, name));
    } catch {
      errors.push(`fonts/${name}: missing, run pnpm fonts`);
      continue;
    }
    if (!actual.equals(bytes))
      errors.push(`fonts/${name}: differs from Fontsource, run pnpm fonts`);
  }
  for (const name of have)
    if (!want.has(name)) errors.push(`fonts/${name}: unexpected file`);
  return errors;
}

if (import.meta.main) {
  const dir = join(root, "fonts");
  if (process.argv.includes("--check")) {
    const errors = await drift(dir);
    if (errors.length) {
      console.error(errors.join("\n"));
      process.exitCode = 1;
    } else console.log("Committed fonts match Fontsource");
  } else {
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    const want = await expected();
    let total = 0;
    for (const [name, bytes] of want) {
      await writeFile(join(dir, name), bytes);
      if (name.endsWith(".woff2")) total += bytes.length;
    }
    console.log(`Copied ${want.size} files to fonts/ (woff2: ${total} bytes)`);
  }
}
