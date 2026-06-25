import { NextResponse } from "next/server";
import { getDealerCart } from "@/lib/services/cart";
import { toApiError, toErrorStatus } from "@/lib/errors";

export async function GET() {
  try {
    const cart = await getDealerCart();
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: toErrorStatus(error) });
  }
}
