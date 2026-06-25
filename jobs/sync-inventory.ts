import { mockDb } from "@thomas-supply/db";
import { getInventoryByLocation } from "@thomas-supply/odoo";

async function main() {
  const startedAt = new Date().toISOString();
  let recordsRead = 0;
  for (const product of mockDb.products) {
    const inventory = await getInventoryByLocation(product.sku);
    recordsRead += inventory.length;
  }
  mockDb.createSyncJob({
    jobType: "sync-inventory",
    status: "succeeded",
    message: "Synced inventory availability from the configured Odoo adapter.",
    recordsRead,
    recordsWritten: recordsRead,
    startedAt,
    finishedAt: new Date().toISOString()
  });
  console.log(`Synced ${recordsRead} inventory rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
