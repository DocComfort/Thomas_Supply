import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "thomas-supply-dealer-portal",
    odooMode:
      process.env.ODOO_BASE_URL &&
      process.env.ODOO_DATABASE &&
      process.env.ODOO_USERNAME &&
      process.env.ODOO_API_KEY
        ? "configured"
        : "mock"
  });
}
