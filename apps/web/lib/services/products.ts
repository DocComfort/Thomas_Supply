import { mockDb } from "@thomas-supply/db";
import type { InventoryRecord } from "@thomas-supply/db";
import {
  getDealerPrice,
  getInventoryByLocation,
  getProductBySku,
  searchProducts
} from "@thomas-supply/odoo";
import { productSearchSchema } from "@thomas-supply/shared/validation";
import { hasDealerPermission } from "@thomas-supply/shared/permissions";
import { auditOdooFailure, writeAuditLog } from "../audit";
import { AppError } from "../errors";
import { requireDealerContext } from "../auth";

function maskInventory(items: InventoryRecord[], allowExactInventory: boolean) {
  return items.map((item) => ({
    ...item,
    quantity: allowExactInventory ? item.quantity : undefined,
    allowExactQuantity: allowExactInventory
  }));
}

function canUseMockFallback() {
  return process.env.NODE_ENV !== "production" || process.env.ODOO_ALLOW_MOCK === "true";
}

export async function searchDealerProducts(input: unknown) {
  const { q } = productSearchSchema.parse(input);
  const { user, dealerAccount } = await requireDealerContext("product:read");
  try {
    return await searchProducts(q);
  } catch (error) {
    await auditOdooFailure({ userId: user.id, dealerAccountId: dealerAccount.id, action: "products.search", error, metadata: { q } });
    if (!canUseMockFallback()) {
      throw new AppError("Product search is temporarily unavailable.", 502, "ODOO_PRODUCT_SEARCH_FAILED");
    }
    return mockDb.searchProducts(q);
  }
}

export async function getDealerProductDetail(sku: string) {
  const { user, membership, dealerAccount } = await requireDealerContext("product:read");
  const canViewPricing = hasDealerPermission(membership.role, "pricing:read");

  const product =
    (await getProductBySku(sku).catch(async (error) => {
      await auditOdooFailure({ userId: user.id, dealerAccountId: dealerAccount.id, action: "products.get", error, metadata: { sku } });
      if (!canUseMockFallback()) {
        throw new AppError("Product lookup is temporarily unavailable.", 502, "ODOO_PRODUCT_LOOKUP_FAILED");
      }
      return null;
    })) ?? mockDb.findProductBySku(sku);

  if (!product) throw new AppError("Product was not found.", 404, "PRODUCT_NOT_FOUND");

  const localProduct = mockDb.findProductBySku(product.sku);
  let price = null;

  if (canViewPricing) {
    try {
      price = await getDealerPrice(product.sku, dealerAccount.accountNumber);
      if (localProduct) {
        mockDb.upsertPrice({
          dealerAccountId: dealerAccount.id,
          productId: localProduct.id,
          currency: price.currency,
          unitPriceCents: price.unitPriceCents,
          expiresAt: price.expiresAt,
          source: "mock_odoo"
        });
      }
      await writeAuditLog({
        actorType: "dealer_user",
        userId: user.id,
        dealerAccountId: dealerAccount.id,
        action: "pricing.view",
        resourceType: "product",
        resourceId: product.sku,
        metadata: { sku: product.sku }
      });
    } catch (error) {
      await auditOdooFailure({ userId: user.id, dealerAccountId: dealerAccount.id, action: "pricing.get", error, metadata: { sku } });
      if (!canUseMockFallback()) {
        throw new AppError("Dealer pricing is temporarily unavailable.", 502, "ODOO_PRICING_FAILED");
      }
    }
  }

  let inventory = mockDb.getInventory(localProduct?.id ?? "");
  try {
    const odooInventory = await getInventoryByLocation(product.sku);
    inventory = odooInventory.map((item) => ({
      productId: localProduct?.id ?? product.sku,
      locationCode: item.locationCode,
      locationName: item.locationName,
      status: item.status,
      quantity: item.quantity,
      allowExactQuantity: dealerAccount.allowExactInventory,
      lastSyncedAt: new Date().toISOString()
    }));
  } catch (error) {
    await auditOdooFailure({ userId: user.id, dealerAccountId: dealerAccount.id, action: "inventory.get", error, metadata: { sku } });
    if (!canUseMockFallback()) {
      throw new AppError("Inventory availability is temporarily unavailable.", 502, "ODOO_INVENTORY_FAILED");
    }
  }

  return {
    product,
    dealerAccount,
    membership,
    price,
    canViewPricing,
    inventory: maskInventory(inventory, dealerAccount.allowExactInventory)
  };
}
