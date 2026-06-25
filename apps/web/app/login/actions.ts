"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@thomas-supply/shared/validation";
import { loginByEmail } from "@/lib/auth";
import { assertRateLimit } from "@/lib/rate-limit";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.parse({ email: formData.get("email") });
  await assertRateLimit(`login:${parsed.email.toLowerCase()}`, 10, 60_000);
  const user = await loginByEmail(parsed.email);
  if (user.adminRole) redirect("/admin");
  redirect("/dealer/dashboard");
}
