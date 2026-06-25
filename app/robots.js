const base = "https://thomassupply.net";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: base + "/sitemap.xml",
  };
}
