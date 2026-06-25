import { mockDb } from "@thomas-supply/db";
import { getDealerOrderHistory } from "@thomas-supply/odoo";
import { requireDealerContext } from "../auth";
import { getDealerCart } from "./cart";

export async function getDealerDashboardData() {
  const context = await requireDealerContext("dealer:read");
  const cart = await getDealerCart();
  return {
    ...context,
    cart,
    orders: mockDb.listOrderRequests(context.dealerAccount.id)
  };
}

export async function getDealerOrderRequests() {
  const { dealerAccount } = await requireDealerContext("order:read");
  return {
    dealerAccount,
    orders: mockDb.listOrderRequests(dealerAccount.id)
  };
}

export async function getDealerUsers() {
  const context = await requireDealerContext("dealer:read");
  return {
    ...context,
    dealerUsers: mockDb.listDealerUsers(context.dealerAccount.id)
  };
}

export async function getDealerAccountCenter() {
  return requireDealerContext("dealer:read");
}

export async function getDealerOrderHistoryData() {
  const { dealerAccount } = await requireDealerContext("order:read");
  return {
    dealerAccount,
    history: await getDealerOrderHistory(dealerAccount.accountNumber)
  };
}
