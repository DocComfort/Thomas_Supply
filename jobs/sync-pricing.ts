import { mockDb } from "@thomas-supply/db";
import { getDealerPrice } from "@thomas-supply/odoo";

async function main() {
  const startedAt = new Date().toISOString();
  let recordsWritten = 0;
  for (const dealer of mockDb.dealerAccounts) {
    for (const product of mockDb.products) {
      const price = await getDealerPrice(product.sku, dealer.accountNumber);
      mockDb.upsertPrice({
        dealerAccountId: dealer.id,
        productId: product.id,
        currency: price.currency,
        unitPriceCents: price.unitPriceCents,
        expiresAt: price.expiresAt,
        source: "mock_odoo"
      });
      recordsWritten += 1;
    }
  }
  mockDb.createSyncJob({
    jobType: "sync-pricing",
    status: "succeeded",
    message: "Refreshed short-lived dealer price cache.",
    recordsRead: recordsWritten,
    recordsWritten,
    startedAt,
    finishedAt: new Date().toISOString()
  });
  console.log(`Synced ${recordsWritten} dealer price rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
