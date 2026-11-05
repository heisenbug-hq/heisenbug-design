import { mkdir, writeFile } from "node:fs/promises";
import { readTokens, render } from "./tokens.mjs";
const output = render(await readTokens());
const dist = new URL("../dist/", import.meta.url);
await mkdir(dist, { recursive: true });
await writeFile(new URL("tokens.css", dist), output.tokens);
await writeFile(new URL("theme.css", dist), output.theme);
console.log("Built dist/tokens.css and dist/theme.css");
