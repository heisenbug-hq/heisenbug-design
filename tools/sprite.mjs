import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Builds icons/sprite.svg from icons/icons/*.svg and icons/status/*.svg.
// Icon symbols carry no stroke-width: the consumer sets it on the wrapping
// <svg> (2.25, 1.8 or 1.5 for 16, 20 or 24 px). Status symbols keep their own.
const ROOT = fileURLToPath(new URL("../icons/", import.meta.url));

function parts(text) {
  const match = text.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/);
  if (!match) throw new Error("not an svg");
  const attribute = (name) =>
    match[1].match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
  return { attribute, inner: match[2].trim() };
}

export async function buildSprite(root = ROOT) {
  const manifest = JSON.parse(
    await readFile(join(root, "manifest.json"), "utf8"),
  );
  const symbols = [];
  for (const glyph of manifest.statusGlyphs.items) {
    const { attribute, inner } = parts(
      await readFile(join(root, "status", `status-${glyph.id}.svg`), "utf8"),
    );
    symbols.push(
      `<symbol id="hb-status-${glyph.id}" viewBox="${attribute("viewBox")}">${inner}</symbol>`,
    );
  }
  for (const name of Object.values(manifest.icons).flat()) {
    const { attribute, inner } = parts(
      await readFile(join(root, "icons", `${name}.svg`), "utf8"),
    );
    symbols.push(
      `<symbol id="hb-${name}" viewBox="${attribute("viewBox")}" fill="${attribute("fill")}" stroke="${attribute("stroke")}" stroke-linecap="${attribute("stroke-linecap")}" stroke-linejoin="${attribute("stroke-linejoin")}">${inner}</symbol>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join("\n")}\n</svg>\n`;
}

if (import.meta.main) {
  const text = await buildSprite();
  if (process.argv.includes("--check")) {
    if (text !== (await readFile(join(ROOT, "sprite.svg"), "utf8"))) {
      console.error(
        "icons/sprite.svg is out of date: run node tools/sprite.mjs",
      );
      process.exitCode = 1;
    }
  } else await writeFile(join(ROOT, "sprite.svg"), text);
}
