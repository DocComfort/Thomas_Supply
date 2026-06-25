const base = "https://thomassupply.net";
const routes = ["", "/about", "/locations", "/brands", "/contact", "/legal/licenses"];

export default function sitemap() {
  const now = new Date();
  return routes.map((r) => ({
    url: base + r,
    lastModified: now,
    changeFrequency: r.startsWith("/legal") ? "yearly" : "monthly",
    priority: r === "" ? 1 : r.startsWith("/legal") ? 0.3 : 0.7,
  }));
}
