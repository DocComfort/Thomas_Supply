import { NextResponse } from "next/server";
import { loginSchema } from "@thomas-supply/shared/validation";
import { loginByEmail } from "@/lib/auth";
import { toUserMessage } from "@/lib/errors";
import { assertRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;

  try {
    const formData = await request.formData();
    const parsed = loginSchema.parse({ email: formData.get("email") });
    await assertRateLimit(`login:${parsed.email.toLowerCase()}`, 10, 60_000);
    const user = await loginByEmail(parsed.email);

    return NextResponse.redirect(
      new URL(user.adminRole ? "/admin" : "/dealer/dashboard", origin),
      { status: 303 }
    );
  } catch (error) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", toUserMessage(error));
    return NextResponse.redirect(url, { status: 303 });
  }
}
