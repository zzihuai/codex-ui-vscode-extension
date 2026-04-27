/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");

function resolveVendor(name, rel) {
  const repoRoot = path.resolve(__dirname, "..");
  try {
    return require.resolve(rel, { paths: [repoRoot] });
  } catch {
    return require.resolve(rel, { paths: [path.resolve(repoRoot, "..")] });
  }
}

function copyVendor(name, rel) {
  const repoRoot = path.resolve(__dirname, "..");
  const src = resolveVendor(name, rel);
  const destDir = path.resolve(__dirname, "../resources/vendor");
  const dest = path.join(destDir, name);

  if (!fs.existsSync(src)) {
    throw new Error(`${name} not found at ${src}. Run pnpm install.`);
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Prepared vendor: ${path.relative(repoRoot, dest)}`);
}

function main() {
  copyVendor("markdown-it.min.js", path.join("markdown-it", "dist", "markdown-it.min.js"));
  copyVendor("katex.min.js", path.join("katex", "dist", "katex.min.js"));
}

main();
