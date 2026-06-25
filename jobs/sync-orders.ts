import { mockDb } from "@thomas-supply/db";

async function main() {
  const startedAt = new Date().toISOString();
  const orders = mockDb.listOrderRequests();
  mockDb.createSyncJob({
    jobType: "sync-orders",
    status: "succeeded",
    message: "Checked local order requests for Odoo reference state.",
    recordsRead: orders.length,
    recordsWritten: 0,
    startedAt,
    finishedAt: new Date().toISOString()
  });
  console.log(`Checked ${orders.length} order requests.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
