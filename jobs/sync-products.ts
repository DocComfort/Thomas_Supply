import { mockDb } from "@thomas-supply/db";
import { searchProducts } from "@thomas-supply/odoo";

async function main() {
  const startedAt = new Date().toISOString();
  const products = await searchProducts("");
  mockDb.createSyncJob({
    jobType: "sync-products",
    status: "succeeded",
    message: "Synced products from the configured Odoo adapter.",
    recordsRead: products.length,
    recordsWritten: products.length,
    startedAt,
    finishedAt: new Date().toISOString()
  });
  console.log(`Synced ${products.length} products.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
