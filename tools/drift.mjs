import { readFile } from "node:fs/promises";
import { frontMatter, validate } from "./tokens.mjs";
export function checkDrift(source) {
  const colors = validate(frontMatter(source));
  const section = source.split(/^## Colors\s*$/m)[1]?.split(/^## /m)[0];
  if (!section) throw new Error("Missing Colors section");
  const roles = [
    "ground",
    "raised",
    "selected",
    "hairline",
    "control-border",
    "text",
    "text-2",
    "text-3",
    "red-text",
    "primary-button / label",
  ];
  const seen = new Set();
  for (const line of section.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells[0] === "Role" || /^[- :]+$/.test(cells[0])) continue;
    const role = cells[0]
      .toLowerCase()
      .replace(/ /g, "-")
      .replace("primary-button-/-label", "primary-button / label");
    if (!roles.includes(role) || seen.has(role) || cells.length !== 3)
      throw new Error(`Unknown or duplicate Colors row ${cells[0]}`);
    seen.add(role);
    const keys =
      role === "primary-button / label"
        ? ["primary-button", "primary-button-label"]
        : [role];
    for (const [i, theme] of ["dark", "light"].entries()) {
      const values = cells[i + 1].match(/#[\da-f]{6}\b/gi) ?? [];
      if (
        values.length !== keys.length ||
        keys.some(
          (key, j) =>
            values[j].toUpperCase() !== colors[theme][key].toUpperCase(),
        )
      )
        throw new Error(`Colors table drift: ${cells[0]} ${theme}`);
    }
  }
  if (seen.size !== roles.length) throw new Error("Missing Colors table rows");
}
if (import.meta.main) {
  checkDrift(await readFile(new URL("../DESIGN.md", import.meta.url), "utf8"));
  console.log("Colors table matches front matter");
}
