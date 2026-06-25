"use server";

import { submitDealerOrderRequest, updateDealerCartItem } from "@/lib/services/cart";

export async function updateCartItemAction(formData: FormData) {
  await updateDealerCartItem({
    sku: formData.get("sku"),
    quantity: formData.get("quantity")
  });
}

export async function submitOrderRequestAction(formData: FormData) {
  await submitDealerOrderRequest({
    notes: formData.get("notes")
  });
}
