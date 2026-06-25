import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug: "thomas-supply" },
    update: {},
    create: { name: "Thomas Supply Inc.", slug: "thomas-supply" }
  });

  const dealer = await prisma.dealerAccount.upsert({
    where: { accountNumber: "TS-1001" },
    update: {},
    create: {
      organizationId: organization.id,
      name: "Acme Mechanical",
      accountNumber: "TS-1001",
      odooPartnerId: "odoo_partner_1001"
    }
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@acme.test" },
    update: {},
    create: {
      organizationId: organization.id,
      email: "owner@acme.test",
      name: "Olivia Owner"
    }
  });

  await prisma.dealerUserMembership.upsert({
    where: { dealerAccountId_userId: { dealerAccountId: dealer.id, userId: owner.id } },
    update: {},
    create: { dealerAccountId: dealer.id, userId: owner.id, role: "owner" }
  });

  await prisma.user.upsert({
    where: { email: "admin@thomassupply.test" },
    update: {},
    create: {
      organizationId: organization.id,
      email: "admin@thomassupply.test",
      name: "Taylor Admin",
      adminRole: "admin"
    }
  });

  const products = [
    ["KP-2T-16S", "odoo_product_2001", "KeepRite 2 Ton 16 SEER Condenser", "KeepRite", "Equipment"],
    ["FAST-CAP-45-5", "odoo_product_2002", "OEM Dual Run Capacitor 45/5 MFD", "FAST Parts", "Electrical"],
    ["GF-M8-1625", "odoo_product_2003", "Glasfloss MERV 8 Filter 16x25x1", "Glasfloss", "Filters"]
  ];

  for (const [sku, odooProductId, name, brand, category] of products) {
    await prisma.productCache.upsert({
      where: { sku },
      update: {},
      create: {
        sku,
        odooProductId,
        name,
        brand,
        category,
        description: `${name} demo cache record.`,
        lastSyncedAt: new Date()
      }
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
