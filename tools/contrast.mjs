import { readFile } from "node:fs/promises";
import { readTokens, validate, themes } from "./tokens.mjs";
export function luminance(hex) {
  const rgb = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
export function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (values[1] + 0.05) / (values[0] + 0.05);
}
export function checkPairs(colors, pairs) {
  return pairs.flatMap(({ foreground, background, minimum }) => {
    if (!Number.isFinite(minimum) || minimum < 1)
      throw new Error("Invalid contrast threshold");
    return themes.map((theme) => {
      if (!colors[theme][foreground] || !colors[theme][background])
        throw new Error(`Unknown contrast token ${foreground}/${background}`);
      const ratio = contrast(
        colors[theme][foreground],
        colors[theme][background],
      );
      return {
        theme,
        foreground,
        background,
        minimum,
        ratio,
        pass: ratio >= minimum,
      };
    });
  });
}
export async function main() {
  const data = JSON.parse(
    await readFile(new URL("../contrast-pairs.json", import.meta.url), "utf8"),
  );
  data.notes.forEach((note) => console.log(note));
  const results = checkPairs(validate(await readTokens()), data.pairs);
  for (const r of results)
    console.log(
      `${r.pass ? "PASS" : "FAIL"} ${r.theme} ${r.foreground} / ${r.background}: ${r.ratio.toFixed(4)}:1 (minimum ${r.minimum}:1)`,
    );
  if (results.some((r) => !r.pass)) process.exitCode = 1;
}
if (import.meta.main) await main();
