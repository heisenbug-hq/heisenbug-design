import { describe, it, expect, afterEach } from "vitest";
import { readFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { frontMatter, render } from "./tokens.mjs";
import { contrast, checkPairs } from "./contrast.mjs";
import { checkDrift } from "./drift.mjs";
import { inspect } from "./guards.mjs";
import { marker } from "../bin/documents.mjs";
const source = await readFile(new URL("../DESIGN.md", import.meta.url), "utf8");
const tokens = frontMatter(source);
const clone = () => structuredClone(tokens);

describe("token build", () => {
  it("emits each theme color exactly once and identical variable sets", () => {
    const css = render(tokens);
    const blocks = [
      ...css.tokens.matchAll(/:root\[data-theme="(dark|light)"\] \{([^}]+)\}/g),
    ];
    expect(blocks).toHaveLength(2);
    const names = blocks.map(([, theme, block]) => {
      expect(block).toContain(`color-scheme: ${theme}`);
      for (const [key, value] of Object.entries(tokens.colors).filter(([key]) =>
        key.endsWith(`-${theme}`),
      )) {
        const line = `--hb-color-${key.replace(/-(dark|light)$/, "")}: ${value};`;
        expect(block.split(line)).toHaveLength(2);
      }
      return [...block.matchAll(/(--hb-[\w-]+):/g)].map((m) => m[1]).sort();
    });
    expect(names[0]).toEqual(names[1]);
    expect(css.tokens).toContain(
      "--hb-component-button-primary-background-color: var(--hb-color-primary-button)",
    );
    expect(css.tokens).toContain("system-ui");
    expect(css.tokens).toContain("ui-monospace");
    expect(css.theme).toContain("@theme inline");
    expect(css.theme).not.toMatch(/#[\da-f]{3,8}\b/i);
    for (const name of names[0].filter((name) =>
      name.startsWith("--hb-color-"),
    ))
      expect(css.theme).toContain(`var(${name})`);
  });
  it.each(["ground", "ground-blue"])("rejects invalid theme key %s", (key) => {
    const input = clone();
    input.colors[key] = "#000000";
    expect(() => render(input)).toThrow("two-theme key");
  });
  it("rejects a missing theme color", () => {
    const input = clone();
    delete input.colors["ground-light"];
    expect(() => render(input)).toThrow("theme keys differ");
  });
  it.each([
    "{colors.missing-dark}",
    "{colors.ground-light}",
    "{typography.ui}",
    "red",
  ])("rejects unresolved reference %s", (reference) => {
    const input = clone();
    input.components["button-primary-dark"].textColor = reference;
    expect(() => render(input)).toThrow("reference");
  });
  it("rejects mismatched component properties", () => {
    const input = clone();
    delete input.components["button-primary-dark"].textColor;
    expect(() => render(input)).toThrow("properties differ");
  });
});
describe("contrast and drift", () => {
  it("uses WCAG linearized luminance and exact thresholds", () => {
    expect(contrast("#000000", "#FFFFFF")).toBe(21);
    expect(contrast("#FFFFFF", "#FFFFFF")).toBe(1);
    expect(contrast("#F85149", "#25282D")).toBeCloseTo(4.411376, 5);
    const colors = {
      dark: { a: "#F85149", b: "#25282D" },
      light: { a: "#CF222E", b: "#E2E5E9" },
    };
    expect(
      checkPairs(colors, [
        { foreground: "a", background: "b", minimum: 3 },
      ]).every((r) => r.pass),
    ).toBe(true);
    expect(
      checkPairs(colors, [
        { foreground: "a", background: "b", minimum: 4.5 },
      ]).every((r) => !r.pass),
    ).toBe(true);
    expect(() =>
      checkPairs(colors, [
        { foreground: "missing", background: "b", minimum: 3 },
      ]),
    ).toThrow("Unknown");
  });
  it("detects table-only edits, removed rows and button-label drift", () => {
    expect(() => checkDrift(source)).not.toThrow();
    expect(() =>
      checkDrift(
        source.replace("| Ground | `#1F2125`", "| Ground | `#000000`"),
      ),
    ).toThrow("drift");
    expect(() => checkDrift(source.replace(/^\| Raised .*\n/m, ""))).toThrow(
      "Missing",
    );
    expect(() =>
      checkDrift(
        source.replace("`#ECEEF0` / `#1F2125`", "`#ECEEF0` / `#000000`"),
      ),
    ).toThrow("drift");
  });
});
describe("text and file guards", () => {
  it("rejects em dash and emoji in any text extension", () => {
    for (const value of [
      "\u2014",
      "\u{1f41b}",
      "\u{1f1ee}\u{1f1f3}",
      "1\ufe0f\u20e3",
    ])
      expect(inspect("notes.txt", Buffer.from(value))).not.toHaveLength(0);
    expect(inspect("code.mjs", Buffer.from("plain ASCII"))).toEqual([]);
    expect(inspect("boards/image.png", Buffer.from([0, 255]))).toEqual([]);
  });
  it("allows SVG only in named top-level locations", () => {
    for (const path of ["brand/logo.svg", "icons/a.svg", "dist/a.svg"])
      expect(inspect(path, Buffer.from("<svg/>"))).toEqual([]);
    for (const path of [".github/assets/a.svg", "src/icons/a.svg", "a.SVG"])
      expect(inspect(path, Buffer.from("<svg/>"))).toHaveLength(1);
  });
});
const folders = [];
afterEach(async () => {
  await Promise.all(
    folders.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});
describe("consumer commands", () => {
  const command = (name, cwd) =>
    spawnSync(
      process.execPath,
      [fileURLToPath(new URL(`../bin/${name}.mjs`, import.meta.url))],
      { cwd, encoding: "utf8" },
    );
  it("checks missing, synced and modified copies through both real bins", async () => {
    const root = await mkdtemp(join(tmpdir(), "hb-consumer-"));
    folders.push(root);
    expect(command("check", root).status).toBe(1);
    expect(command("sync", root).status).toBe(0);
    expect(command("check", root).status).toBe(0);
    const design = await readFile(join(root, "DESIGN.md"), "utf8");
    expect(design).toMatch(/^---\n[\s\S]+?\n---\n<!-- Synced/);
    expect(frontMatter(design)).toEqual(tokens);
    expect((design.match(/<!-- Synced/g) ?? []).length).toBe(1);
    expect(await readFile(join(root, "docs/ui-standards.md"), "utf8")).toMatch(
      /^<!-- Synced/,
    );
    await writeFile(join(root, "DESIGN.md"), design + "\nDrift");
    expect(command("check", root).status).toBe(1);
    expect(command("sync", root).status).toBe(0);
    await writeFile(join(root, "docs/ui-standards.md"), "Drift");
    expect(command("check", root).status).toBe(1);
    expect(command("sync", root).status).toBe(0);
    expect(command("check", root).status).toBe(0);
    expect(
      (await readFile(join(root, "DESIGN.md"), "utf8")).split(marker),
    ).toHaveLength(2);
  });
});
