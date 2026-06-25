import { NextResponse } from "next/server";
import { skuParamsSchema } from "@thomas-supply/shared/validation";
import { getDealerProductDetail } from "@/lib/services/products";
import { toApiError, toErrorStatus } from "@/lib/errors";

export async function GET(_request: Request, { params }: { params: { sku: string } }) {
  try {
    const parsed = skuParamsSchema.parse({ sku: decodeURIComponent(params.sku) });
    const detail = await getDealerProductDetail(parsed.sku);
    return NextResponse.json(detail);
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: toErrorStatus(error) });
  }
}
