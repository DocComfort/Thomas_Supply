const base = "https://thomassupply.net";
const routes = ["", "/about", "/locations", "/brands", "/contact"];

export default function sitemap() {
  const now = new Date();
  return routes.map((r) => ({
    url: base + r,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
