"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import * as repo from "@/lib/repo";
import { assertRateLimit } from "@/lib/rate-limit";

function loginError(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) loginError("Enter your email and password.");

  await assertRateLimit(`login:${email.toLowerCase()}`, 10, 60_000);

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) loginError("Invalid email or password.");

  const user = await repo.findUserByAuthUserId(data.user.id);
  if (!user || !user.isActive) {
    await supabase.auth.signOut();
    loginError("Your account isn't active yet. Contact Thomas Supply.");
  }

  redirect(user.adminRole ? "/admin" : "/dealer/dashboard");
}
