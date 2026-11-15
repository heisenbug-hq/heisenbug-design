import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readTokens, render } from "./tokens.mjs";
import { renderFontCss } from "./fontcss.mjs";
const output = render(await readTokens());
const dist = new URL("../dist/", import.meta.url);
await mkdir(dist, { recursive: true });
await writeFile(new URL("tokens.css", dist), output.tokens);
await writeFile(new URL("theme.css", dist), output.theme);
const manifest = JSON.parse(
  await readFile(new URL("../fonts/manifest.json", import.meta.url), "utf8"),
);
await writeFile(new URL("fonts.css", dist), renderFontCss(manifest));
console.log("Built dist/tokens.css, dist/theme.css and dist/fonts.css");
