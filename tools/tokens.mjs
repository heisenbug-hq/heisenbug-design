import { readFile } from "node:fs/promises";
import { parse } from "yaml";

export const themes = ["dark", "light"];
export function frontMatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("DESIGN.md must start with YAML front matter");
  return parse(match[1]);
}
export async function readTokens() {
  return frontMatter(
    await readFile(new URL("../DESIGN.md", import.meta.url), "utf8"),
  );
}
export function splitThemes(tokens, label) {
  const result = { dark: {}, light: {} };
  for (const [key, value] of Object.entries(tokens ?? {})) {
    const match = key.match(/^([a-z][a-z0-9-]*)-(dark|light)$/);
    if (!match) throw new Error(`${label}: invalid two-theme key ${key}`);
    result[match[2]][match[1]] = value;
  }
  if (!Object.keys(result.dark).length) throw new Error(`${label}: no tokens`);
  if (
    Object.keys(result.dark).sort().join() !==
    Object.keys(result.light).sort().join()
  ) {
    throw new Error(`${label}: theme keys differ`);
  }
  return result;
}
export function validate(tokens) {
  const colors = splitThemes(tokens.colors, "colors");
  for (const values of Object.values(colors)) {
    for (const value of Object.values(values)) {
      if (!/^#[\da-f]{6}$/i.test(value))
        throw new Error(`Invalid color: ${value}`);
    }
  }
  return colors;
}
function componentValue(value, theme, colors) {
  if (typeof value !== "string")
    throw new Error("Component values must be references");
  const match = value.match(/^\{colors\.([a-z][a-z0-9-]*)-(dark|light)\}$/);
  if (!match || match[2] !== theme || !(match[1] in colors[theme])) {
    throw new Error(`Unresolved or cross-theme reference: ${value}`);
  }
  return `var(--hb-color-${match[1]})`;
}
export function render(tokens) {
  const colors = validate(tokens);
  const components = splitThemes(tokens.components, "components");
  const fontLines = [];
  const utilityLines = [];
  for (const name of Object.keys(colors.dark)) {
    utilityLines.push(`  --color-${name}: var(--hb-color-${name});`);
  }
  for (const [name, token] of Object.entries(tokens.typography ?? {})) {
    if (
      !/^[a-z][a-z0-9-]*$/.test(name) ||
      typeof token.fontFamily !== "string" ||
      !/^[\w -]+$/.test(token.fontFamily)
    ) {
      throw new Error(`Invalid typography token ${name}`);
    }
    const fallback = /mono/i.test(token.fontFamily)
      ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    fontLines.push(`  --hb-font-${name}: "${token.fontFamily}", ${fallback};`);
    utilityLines.push(`  --font-${name}: var(--hb-font-${name});`);
    if (token.fontWeight !== undefined) {
      if (!Number.isInteger(token.fontWeight))
        throw new Error(`Invalid font weight ${name}`);
      fontLines.push(`  --hb-font-${name}-weight: ${token.fontWeight};`);
    }
    if (token.letterSpacing !== undefined) {
      if (!/^-?[\d.]+em$/.test(token.letterSpacing))
        throw new Error(`Invalid letter spacing ${name}`);
      fontLines.push(
        `  --hb-font-${name}-letter-spacing: ${token.letterSpacing};`,
      );
    }
  }
  const blocks = themes.map((theme) => {
    const lines = [`  color-scheme: ${theme};`];
    for (const [name, value] of Object.entries(colors[theme]))
      lines.push(`  --hb-color-${name}: ${value};`);
    for (const [name, properties] of Object.entries(components[theme])) {
      const other = components[theme === "dark" ? "light" : "dark"][name];
      if (
        Object.keys(properties).sort().join() !==
        Object.keys(other).sort().join()
      )
        throw new Error(`Component ${name}: theme properties differ`);
      for (const [property, value] of Object.entries(properties)) {
        if (!/^[a-zA-Z]+$/.test(property))
          throw new Error(`Invalid component property ${property}`);
        const kebab = property.replace(
          /[A-Z]/g,
          (letter) => `-${letter.toLowerCase()}`,
        );
        lines.push(
          `  --hb-component-${name}-${kebab}: ${componentValue(value, theme, colors)};`,
        );
      }
    }
    return `:root[data-theme="${theme}"] {\n${lines.join("\n")}\n}`;
  });
  return {
    tokens: `/* Generated from DESIGN.md. */\n:root {\n${fontLines.join("\n")}\n}\n\n${blocks.join("\n\n")}\n`,
    theme: `/* Generated from DESIGN.md. Load tokens.css alongside this file. */\n@theme inline {\n${utilityLines.join("\n")}\n}\n`,
  };
}
