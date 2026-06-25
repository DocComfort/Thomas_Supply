// Cross-platform logo downloader. Run with:  npm run logos
// Downloads Thomas Supply brand + partner logos into public/photos.
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const base = "https://www.thomassupply.net/images/";
const dest = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "photos");

const files = {
  "I1873_C1873_thomas_logo.png": "thomas-logo-original.png",
  "I1955_C1955_keeprite.png": "keeprite.png",
  "I1875_C1875_keeprite-logo.jpg": "keeprite-equipment.jpg",
  "I1949_C1949_lg-logo.png": "lg.png",
  "I1950_C1950_russell-logo.png": "russell.png",
  "I1951_C1951_manitowoclogo.png": "manitowoc.png",
  "I1952_C1952_glasfloss-color-logo1.jpg": "glasfloss.jpg",
  "I1953_C1953_diversitech.png": "diversitech.png",
  "I1954_C1954_fast.jpg": "fast.jpg",
  "I1956_C1956_icp_logo.PNG": "icp.png",
  "I1958_C1958_proud_member_of_bluehawk.png": "bluehawk.png",
};

await mkdir(dest, { recursive: true });
let ok = 0, fail = 0;
for (const [src, out] of Object.entries(files)) {
  try {
    const res = await fetch(base + src);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(dest, out), buf);
    console.log("OK   " + out);
    ok++;
  } catch (e) {
    console.warn("FAIL " + src + "  -> " + e.message);
    fail++;
  }
}
console.log(`\nDone. ${ok} downloaded, ${fail} failed. Files are in public/photos/`);
