import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { DOMParser } from "@xmldom/xmldom";
import { readTokens, render } from "./tokens.mjs";

// The set is closed (AGENTS.md): changing either number is a design change.
export const ICON_COUNT = 67;
export const GLYPH_COUNT = 6;
const COLOUR_ATTRIBUTES = [
  "fill",
  "stroke",
  "color",
  "stop-color",
  "flood-color",
  "lighting-color",
];
const ALLOWED_COLOURS = new Set(["currentcolor", "none"]);
const PACK_ENTRIES = [
  "LICENSE-lucide.txt",
  "README.txt",
  "icon.mjs",
  "icons",
  "manifest.json",
  "sprite.svg",
  "status",
];

export function parseSvg(text) {
  const problems = [];
  const document = new DOMParser({
    onError: (level, message) => problems.push(`${level}: ${message}`),
  }).parseFromString(text, "image/svg+xml");
  const root = document.documentElement;
  if (!problems.length && root?.nodeName !== "svg")
    problems.push("root element is not svg");
  if (problems.length) throw new Error(problems.join("; "));
  return document;
}

export function colourErrors(path, document) {
  const errors = [];
  const visit = (element) => {
    if (element.nodeName === "style")
      errors.push(`${path}: <style> is not allowed`);
    for (const name of COLOUR_ATTRIBUTES) {
      if (!element.hasAttribute(name)) continue;
      const value = element.getAttribute(name).trim();
      if (!ALLOWED_COLOURS.has(value.toLowerCase()))
        errors.push(`${path}: ${name}="${value}" is a hard-coded colour`);
    }
    for (const declaration of (element.getAttribute("style") ?? "").split(
      ";",
    )) {
      const [property, ...rest] = declaration.split(":");
      const name = property?.trim().toLowerCase();
      const value = rest.join(":").trim();
      if (
        COLOUR_ATTRIBUTES.includes(name) &&
        !ALLOWED_COLOURS.has(value.toLowerCase())
      )
        errors.push(`${path}: style ${name}: ${value} is a hard-coded colour`);
    }
    for (const child of Array.from(element.childNodes))
      if (child.nodeType === 1) visit(child);
  };
  visit(document.documentElement);
  return errors;
}

async function svgNames(folder) {
  const entries = (await readdir(folder)).filter(
    (entry) => !entry.startsWith("."),
  );
  return {
    svgs: entries.filter((entry) => entry.endsWith(".svg")),
    other: entries.filter((entry) => !entry.endsWith(".svg")),
  };
}

function compare(label, expected, actual, errors) {
  const want = new Set(expected);
  const have = new Set(actual);
  for (const name of want)
    if (!have.has(name)) errors.push(`${label}: missing ${name}`);
  for (const name of have)
    if (!want.has(name)) errors.push(`${label}: unexpected ${name}`);
}

export async function checkIcons(
  root = fileURLToPath(new URL("../icons/", import.meta.url)),
  tokensCss,
) {
  const errors = [];
  for (const entry of await readdir(root))
    if (!entry.startsWith(".") && !PACK_ENTRIES.includes(entry))
      errors.push(
        `icons/${entry}: not part of the pack (tokens live only in DESIGN.md)`,
      );
  const manifest = JSON.parse(
    await readFile(join(root, "manifest.json"), "utf8"),
  );
  const names = Object.values(manifest.icons ?? {}).flat();
  const glyphs = manifest.statusGlyphs?.items ?? [];
  if (new Set(names).size !== names.length)
    errors.push("manifest: duplicate icon names");
  if (names.length !== ICON_COUNT || manifest.count !== ICON_COUNT)
    errors.push(
      `manifest: expected ${ICON_COUNT} icons, found ${names.length} (count ${manifest.count})`,
    );
  if (glyphs.length !== GLYPH_COUNT)
    errors.push(
      `manifest: expected ${GLYPH_COUNT} status glyphs, found ${glyphs.length}`,
    );

  const icons = await svgNames(join(root, "icons"));
  const status = await svgNames(join(root, "status"));
  for (const entry of [...icons.other, ...status.other])
    errors.push(`icons: unexpected non-SVG file ${entry}`);
  compare(
    "icons/icons",
    names.map((name) => `${name}.svg`),
    icons.svgs,
    errors,
  );
  compare(
    "icons/status",
    glyphs.map((glyph) => `status-${glyph.id}.svg`),
    status.svgs,
    errors,
  );

  tokensCss ??= render(await readTokens()).tokens;
  for (const glyph of glyphs)
    if (!tokensCss.includes(`${glyph.colourToken}:`))
      errors.push(
        `manifest: status ${glyph.id} names ${glyph.colourToken}, which tokens.css does not define`,
      );

  const files = [
    ...icons.svgs.map((name) => `icons/${name}`),
    ...status.svgs.map((name) => `status/${name}`),
    "sprite.svg",
  ];
  for (const file of files) {
    const path = `icons/${file}`;
    let document;
    try {
      document = parseSvg(await readFile(join(root, file), "utf8"));
    } catch (error) {
      errors.push(`${path}: does not parse (${error.message})`);
      continue;
    }
    errors.push(...colourErrors(path, document));
    if (file === "sprite.svg")
      compare(
        "icons/sprite.svg",
        [
          ...names.map((name) => `hb-${name}`),
          ...glyphs.map((glyph) => `hb-status-${glyph.id}`),
        ],
        Array.from(document.getElementsByTagName("symbol")).map((symbol) =>
          symbol.getAttribute("id"),
        ),
        errors,
      );
  }
  return errors;
}

if (import.meta.main) {
  const root = fileURLToPath(new URL("../icons/", import.meta.url));
  if (!(await stat(root).catch(() => null))?.isDirectory()) {
    console.error("icons/ is missing");
    process.exitCode = 1;
  } else {
    const errors = await checkIcons(root);
    if (errors.length) {
      console.error(errors.join("\n"));
      process.exitCode = 1;
    } else
      console.log(
        `Icon pack matches its manifest (${ICON_COUNT} icons, ${GLYPH_COUNT} status glyphs); every SVG parses and uses currentColor only`,
      );
  }
}
