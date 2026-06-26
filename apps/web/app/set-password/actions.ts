"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

function fail(message: string): never {
  redirect(`/set-password?error=${encodeURIComponent(message)}`);
}

export async function setPasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) fail("Use a password of at least 8 characters.");
  if (password !== confirm) fail("Those passwords don't match.");

  const supabase = createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) {
    redirect(
      `/login?error=${encodeURIComponent(
        "Your session expired. Open your invite link again."
      )}`
    );
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) fail(error.message);

  const user = await getCurrentUser();
  redirect(user?.adminRole ? "/admin" : "/dealer/dashboard");
}
