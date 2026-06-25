import { NextResponse } from "next/server";
import { searchDealerProducts } from "@/lib/services/products";
import { toApiError, toErrorStatus } from "@/lib/errors";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const products = await searchDealerProducts({ q: url.searchParams.get("q") ?? "" });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: toErrorStatus(error) });
  }
}
