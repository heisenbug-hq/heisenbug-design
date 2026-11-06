// Heisenbug icon helper. Returns an inline SVG string for a locked icon.
// Stroke is fixed at 1.5 rendered pixels at every size (viewBox units = 1.5 * 24 / size).
import { readFileSync } from "node:fs";
export const SIZES = [16, 20, 24];
export function hbIcon(
  name,
  size = 20,
  dir = new URL("./icons/", import.meta.url),
) {
  if (!SIZES.includes(size)) throw new Error("Icon size must be 16, 20 or 24");
  const svg = readFileSync(new URL(name + ".svg", dir), "utf8");
  const inner = svg
    .replace(/<!--.*?-->/gs, "")
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
  const sw = +((1.5 * 24) / size).toFixed(3);
  return `<svg aria-hidden="true" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
