// Renders dist/fonts.css from the committed fonts/manifest.json.
export function renderFontCss(manifest) {
  return manifest
    .map(
      ({ family, weight, file, unicodeRange }) =>
        `@font-face {\n  font-family: "${family}";\n  font-style: normal;\n  font-weight: ${weight};\n  font-display: swap;\n  src: url("../fonts/${file}") format("woff2");\n  unicode-range: ${unicodeRange};\n}\n`,
    )
    .join("\n");
}
