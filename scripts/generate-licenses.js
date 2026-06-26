#!/usr/bin/env node
/*
 * generate-licenses.js
 *
 * Builds the open-source license disclosure for the Thomas Supply web
 * properties by reading the resolved dependency tree from package-lock.json.
 * No external dependencies — run it any time the lockfile changes:
 *
 *   node scripts/generate-licenses.js            # production deps (shipped)
 *   node scripts/generate-licenses.js --include-dev   # everything
 *
 * Output: app/legal/licenses/licenses.generated.json
 * The /legal/licenses page renders that file.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LOCKFILE = path.join(ROOT, "package-lock.json");
const OUT_DIR = path.join(ROOT, "app", "legal", "licenses");
const OUT_FILE = path.join(OUT_DIR, "licenses.generated.json");

const includeDev = process.argv.includes("--include-dev");

// A few packages declare their license only via a LICENSE file or the legacy
// `licenses: [{ type }]` field, which npm's lockfile v3 does not carry forward
// into its normalized `license` string — so they show up as UNKNOWN. These were
// verified against each package's own published metadata on the npm registry.
const LICENSE_OVERRIDES = {
  // registry.npmjs.org/busboy -> licenses: [{ type: "MIT" }]
  busboy: "MIT",
  // registry.npmjs.org/streamsearch -> licenses: [{ type: "MIT" }]
  streamsearch: "MIT",
};

// Normalize the many shapes a lockfile "license" field can take into a single
// SPDX-style string: "MIT", "Apache-2.0", "(MIT OR Apache-2.0)", etc.
function normalizeLicense(license) {
  if (!license) return "UNKNOWN";
  if (typeof license === "string") return license.trim() || "UNKNOWN";
  if (Array.isArray(license)) {
    const parts = license
      .map((l) => (typeof l === "string" ? l : l && l.type))
      .filter(Boolean);
    return parts.length ? `(${parts.join(" OR ")})` : "UNKNOWN";
  }
  if (typeof license === "object" && license.type) return String(license.type);
  return "UNKNOWN";
}

function main() {
  if (!fs.existsSync(LOCKFILE)) {
    console.error(`Cannot find ${LOCKFILE}. Run "npm install" first.`);
    process.exit(1);
  }

  const lock = JSON.parse(fs.readFileSync(LOCKFILE, "utf8"));
  const packages = lock.packages || {};
  const seen = new Map(); // "name@version" -> { name, version, license }

  for (const [key, meta] of Object.entries(packages)) {
    // Only real installed packages live under node_modules/. This skips the
    // workspace roots ("", "apps/web", "packages/db", ...).
    if (!key.startsWith("node_modules/")) continue;
    // Symlinked workspace packages (our own code) — not third-party.
    if (meta.link) continue;
    // Dev-only tooling does not ship to users; exclude unless asked.
    if (meta.dev && !includeDev) continue;

    const name = meta.name || key.slice(key.lastIndexOf("node_modules/") + "node_modules/".length);
    // Our own first-party workspace packages are not third-party deps.
    if (name.startsWith("@thomas-supply/")) continue;

    const version = meta.version || "";
    let license = normalizeLicense(meta.license);
    if (license === "UNKNOWN" && LICENSE_OVERRIDES[name]) {
      license = LICENSE_OVERRIDES[name];
    }
    const id = `${name}@${version}`;
    if (!seen.has(id)) seen.set(id, { name, version, license });
  }

  const groups = new Map(); // license -> packages[]
  for (const pkg of seen.values()) {
    if (!groups.has(pkg.license)) groups.set(pkg.license, []);
    groups.get(pkg.license).push(pkg);
  }

  const groupList = [...groups.entries()]
    .map(([license, pkgs]) => ({
      license,
      count: pkgs.length,
      packages: pkgs.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.count - a.count || a.license.localeCompare(b.license));

  const data = {
    generatedAt: new Date().toISOString().slice(0, 10),
    scope: includeDev ? "all dependencies (production + development)" : "production dependencies",
    totalPackages: seen.size,
    licenseCount: groupList.length,
    groups: groupList,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2) + "\n");

  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)}`);
  console.log(`${data.totalPackages} packages across ${data.licenseCount} license types (${data.scope}):`);
  for (const g of groupList) console.log(`  ${g.license.padEnd(30)} ${g.count}`);
}

main();
