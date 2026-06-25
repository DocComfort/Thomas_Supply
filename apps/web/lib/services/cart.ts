import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mockDb } from "@thomas-supply/db";
import { createQuotationRequest, getDealerPrice, getInventoryByLocation } from "@thomas-supply/odoo";
import {
  addCartItemSchema,
  submitOrderRequestSchema,
  updateCartItemSchema
} from "@thomas-supply/shared/validation";
import { assertRateLimit } from "../rate-limit";
import { requireDealerContext } from "../auth";
import { AppError } from "../errors";
import { auditOdooFailure, writeAuditLog } from "../audit";

async function recheckDealerPrice(input: {
  userId: string;
  dealerAccountId: string;
  dealerAccountNumber: string;
  sku: string;
}) {
  try {
    return await getDealerPrice(input.sku, input.dealerAccountNumber);
  } catch (error) {
    await auditOdooFailure({
      userId: input.userId,
      dealerAccountId: input.dealerAccountId,
      action: "pricing.recheck",
      error,
      metadata: { sku: input.sku }
    });
    throw new AppError("Could not verify current dealer pricing. Please try again or call your branch.", 502, "PRICE_RECHECK_FAILED");
  }
}

async function recheckInventory(input: { userId: string; dealerAccountId: string; sku: string }) {
  try {
    const inventory = await getInventoryByLocation(input.sku);
    if (inventory.length === 0) {
      throw new AppError("No inventory availability was returned for this product.", 409, "INVENTORY_UNAVAILABLE");
    }
    if (inventory.every((item) => item.status === "out_of_stock")) {
      throw new AppError("This product is out of stock at all available locations.", 409, "OUT_OF_STOCK");
    }
    return inventory;
  } catch (error) {
    await auditOdooFailure({
      userId: input.userId,
      dealerAccountId: input.dealerAccountId,
      action: "inventory.recheck",
      error,
      metadata: { sku: input.sku }
    });
    if (error instanceof AppError) throw error;
    throw new AppError("Could not verify current inventory. Please try again or call your branch.", 502, "INVENTORY_RECHECK_FAILED");
  }
}

export async function getDealerCart() {
  const { user, dealerAccount } = await requireDealerContext("dealer:read");
  return mockDb.getActiveCart(user.id, dealerAccount.id);
}

export async function addDealerCartItem(input: unknown) {
  const parsed = addCartItemSchema.parse(input);
  const { user, dealerAccount } = await requireDealerContext("cart:write");
  await assertRateLimit(`cart:${user.id}`);

  const product = mockDb.findProductBySku(parsed.sku);
  if (!product) throw new AppError("Product was not found.", 404, "PRODUCT_NOT_FOUND");
  const cart = mockDb.getActiveCart(user.id, dealerAccount.id);
  const existingQuantity = cart.items.find((item) => item.sku === product.sku)?.quantity ?? 0;
  if (existingQuantity + parsed.quantity > 999) {
    throw new AppError("Cart quantity cannot exceed 999 units for a single SKU.", 422, "CART_QUANTITY_LIMIT");
  }

  const price = await recheckDealerPrice({
    userId: user.id,
    dealerAccountId: dealerAccount.id,
    dealerAccountNumber: dealerAccount.accountNumber,
    sku: product.sku
  });

  mockDb.addCartItem(user.id, dealerAccount.id, {
    sku: product.sku,
    productId: product.id,
    name: product.name,
    quantity: parsed.quantity,
    quotedUnitPriceCents: price.unitPriceCents
  });

  await writeAuditLog({
    actorType: "dealer_user",
    userId: user.id,
    dealerAccountId: dealerAccount.id,
    action: "cart.item_added",
    resourceType: "product",
    resourceId: product.sku,
    metadata: { quantity: parsed.quantity }
  });

  revalidatePath("/dealer/cart");
  redirect("/dealer/cart");
}

export async function updateDealerCartItem(input: unknown) {
  const parsed = updateCartItemSchema.parse(input);
  const { user, dealerAccount } = await requireDealerContext("cart:write");
  const cart = mockDb.getActiveCart(user.id, dealerAccount.id);
  if (!cart.items.some((item) => item.sku === parsed.sku)) {
    throw new AppError("That SKU is not in your active cart.", 404, "CART_ITEM_NOT_FOUND");
  }
  mockDb.updateCartItem(user.id, dealerAccount.id, parsed.sku, parsed.quantity);
  await writeAuditLog({
    actorType: "dealer_user",
    userId: user.id,
    dealerAccountId: dealerAccount.id,
    action: "cart.item_updated",
    resourceType: "product",
    resourceId: parsed.sku,
    metadata: { quantity: parsed.quantity }
  });
  revalidatePath("/dealer/cart");
}

export async function submitDealerOrderRequest(input: unknown) {
  const parsed = submitOrderRequestSchema.parse(input);
  const { user, dealerAccount } = await requireDealerContext("order:create");
  await assertRateLimit(`order:${user.id}`);

  const cart = mockDb.getActiveCart(user.id, dealerAccount.id);
  if (cart.items.length === 0) throw new AppError("Your cart is empty.", 400, "EMPTY_CART");

  const items = [];
  for (const item of cart.items) {
    const product = mockDb.findProductBySku(item.sku);
    if (!product) throw new AppError(`Product ${item.sku} is no longer available.`, 409, "PRODUCT_UNAVAILABLE");

    const price = await recheckDealerPrice({
      userId: user.id,
      dealerAccountId: dealerAccount.id,
      dealerAccountNumber: dealerAccount.accountNumber,
      sku: product.sku
    });
    const inventory = await recheckInventory({
      userId: user.id,
      dealerAccountId: dealerAccount.id,
      sku: product.sku
    });
    items.push({
      sku: product.sku,
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      unitPriceCents: price.unitPriceCents,
      inventorySummary: inventory.map((inventoryItem) => ({
        productId: product.id,
        locationCode: inventoryItem.locationCode,
        locationName: inventoryItem.locationName,
        status: inventoryItem.status,
        quantity: dealerAccount.allowExactInventory ? inventoryItem.quantity : undefined,
        allowExactQuantity: dealerAccount.allowExactInventory,
        lastSyncedAt: new Date().toISOString()
      }))
    });
  }

  const subtotalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const order = mockDb.createOrderRequest({
    dealerAccountId: dealerAccount.id,
    userId: user.id,
    status: "submitted",
    notes: parsed.notes,
    subtotalCents,
    items
  });

  try {
    const odooResponse = await createQuotationRequest({
      dealerAccountNumber: dealerAccount.accountNumber,
      requestedByEmail: user.email,
      notes: parsed.notes,
      items: items.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents
      }))
    });

    mockDb.updateOrderRequest(order.id, {
      status: odooResponse.status,
      odooReferenceId: odooResponse.referenceId
    });
    mockDb.markActiveCartSubmitted(user.id, dealerAccount.id);
  } catch (error) {
    mockDb.updateOrderRequest(order.id, { status: "failed" });
    await auditOdooFailure({
      userId: user.id,
      dealerAccountId: dealerAccount.id,
      action: "orders.createQuotationRequest",
      error,
      metadata: { orderRequestId: order.id }
    });
  }

  await writeAuditLog({
    actorType: "dealer_user",
    userId: user.id,
    dealerAccountId: dealerAccount.id,
    action: "order.submitted",
    resourceType: "order_request",
    resourceId: order.id,
    metadata: { subtotalCents, itemCount: items.length }
  });

  revalidatePath("/dealer/order-requests");
  redirect("/dealer/order-requests");
}
