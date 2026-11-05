import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
export function inspect(path, bytes) {
  const errors = [];
  if (/\.svg$/i.test(path) && !/^(brand|icons|dist)\//.test(path))
    errors.push(`${path}: SVG must be under brand/, icons/ or dist/`);
  if (bytes.includes(0)) return errors;
  const text = bytes.toString("utf8");
  if (/\u2014/u.test(text)) errors.push(`${path}: em dash is forbidden`);
  if (
    /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3\ufe0f]/u.test(text)
  )
    errors.push(`${path}: emoji is forbidden`);
  return errors;
}
if (import.meta.main) {
  const paths = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
  const errors = [];
  for (const path of paths) {
    try {
      errors.push(...inspect(path, await readFile(path)));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else console.log("Tracked text and SVG rules pass");
}
