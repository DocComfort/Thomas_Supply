"use server";

import { addDealerCartItem } from "@/lib/services/cart";

export async function addToCartAction(formData: FormData) {
  await addDealerCartItem({
    sku: formData.get("sku"),
    quantity: formData.get("quantity")
  });
}
