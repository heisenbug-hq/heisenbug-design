import { describe, it, expect, afterEach } from "vitest";
import { readFile, mkdtemp, rm, writeFile, cp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { frontMatter, render } from "./tokens.mjs";
import { contrast, checkPairs } from "./contrast.mjs";
import { checkDrift } from "./drift.mjs";
import { inspect } from "./guards.mjs";
import { marker } from "../bin/documents.mjs";
import { checkIcons, ICON_COUNT, GLYPH_COUNT } from "./icons.mjs";
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
describe("icon pack", () => {
  const pack = fileURLToPath(new URL("../icons/", import.meta.url));
  const copy = async () => {
    const root = await mkdtemp(join(tmpdir(), "hb-icons-"));
    folders.push(root);
    await cp(pack, root, { recursive: true });
    return root;
  };
  const edit = async (root, path, change) =>
    writeFile(
      join(root, path),
      change(await readFile(join(root, path), "utf8")),
    );
  it("matches the manifest and uses currentColor only", async () => {
    expect(ICON_COUNT).toBe(67);
    expect(GLYPH_COUNT).toBe(6);
    expect(await checkIcons(pack)).toEqual([]);
  });
  it("rejects a missing icon and an icon the manifest does not name", async () => {
    const root = await copy();
    await rm(join(root, "icons/bug.svg"));
    await writeFile(join(root, "icons/extra.svg"), "<svg/>");
    const errors = await checkIcons(root);
    expect(errors).toContain("icons/icons: missing bug.svg");
    expect(errors).toContain("icons/icons: unexpected extra.svg");
  });
  it("rejects a manifest that is not 67 icons and 6 glyphs", async () => {
    const root = await copy();
    await edit(root, "manifest.json", (text) => {
      const manifest = JSON.parse(text);
      manifest.icons.Editor.push("bold");
      manifest.statusGlyphs.items.pop();
      return JSON.stringify(manifest);
    });
    const errors = (await checkIcons(root)).join("\n");
    expect(errors).toContain("duplicate icon names");
    expect(errors).toContain("expected 67 icons");
    expect(errors).toContain("expected 6 status glyphs");
  });
  it("rejects SVG that does not parse", async () => {
    const root = await copy();
    await edit(root, "icons/x.svg", (text) => text.replace("</svg>", ""));
    expect((await checkIcons(root)).join()).toContain(
      "icons/icons/x.svg: does not parse",
    );
  });
  it.each([
    ['stroke="currentColor"', 'stroke="#CF222E"'],
    ['stroke="currentColor"', 'stroke="red"'],
    ['fill="none"', 'fill="url(#paint)"'],
    ['fill="none"', 'fill="none" style="stroke: rgb(0, 0, 0)"'],
    ["<path", "<style>path{fill:red}</style><path"],
  ])("rejects a hard-coded colour (%s to %s)", async (from, to) => {
    const root = await copy();
    await edit(root, "icons/x.svg", (text) => text.replace(from, to));
    expect((await checkIcons(root)).join()).toMatch(
      /icons\/icons\/x\.svg: .*(hard-coded colour|not allowed)/,
    );
  });
  it("rejects sprite drift and a second token source", async () => {
    const root = await copy();
    await edit(root, "sprite.svg", (text) =>
      text.replace('id="hb-status-open"', 'id="hb-status-closed"'),
    );
    await cp(join(root, "status"), join(root, "tokens"), { recursive: true });
    const errors = (await checkIcons(root)).join("\n");
    expect(errors).toContain("icons/sprite.svg: missing hb-status-open");
    expect(errors).toContain("icons/sprite.svg: unexpected hb-status-closed");
    expect(errors).toContain("icons/tokens: not part of the pack");
  });
  it("rejects a glyph colour token that tokens.css does not define", async () => {
    const root = await copy();
    await edit(root, "manifest.json", (text) =>
      text.replace('"--hb-color-status-fixed"', '"--hb-status-fixed"'),
    );
    expect((await checkIcons(root)).join()).toContain(
      "status fixed names --hb-status-fixed",
    );
  });
});
