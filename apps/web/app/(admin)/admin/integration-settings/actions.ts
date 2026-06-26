"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { testOdooConnection } from "@thomas-supply/odoo";
import { requireAdminContext } from "@/lib/auth";
import { getOdooConfig, saveOdooSettings } from "@/lib/settings";
import { toUserMessage } from "@/lib/errors";

const PATH = "/admin/integration-settings";

export async function saveOdooSettingsAction(formData: FormData) {
  const { user } = await requireAdminContext("admin:integration");
  const baseUrl = String(formData.get("baseUrl") ?? "").trim();
  const database = String(formData.get("database") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const apiKey = String(formData.get("apiKey") ?? "").trim();
  const allowMock = formData.get("allowMock") === "on";

  if (!baseUrl || !database || !username) {
    redirect(
      `${PATH}?error=${encodeURIComponent(
        "Odoo URL, database, and username are required."
      )}`
    );
  }

  try {
    await saveOdooSettings({
      baseUrl,
      database,
      username,
      apiKey: apiKey.length > 0 ? apiKey : null,
      allowMock,
      updatedByEmail: user.email,
    });
  } catch (error) {
    redirect(`${PATH}?error=${encodeURIComponent(toUserMessage(error))}`);
  }

  revalidatePath(PATH);
  redirect(`${PATH}?ok=${encodeURIComponent("Odoo settings saved.")}`);
}

export async function testOdooConnectionAction() {
  await requireAdminContext("admin:integration");
  const config = await getOdooConfig();

  if (
    !config ||
    !config.baseUrl ||
    !config.database ||
    !config.username ||
    !config.apiKey
  ) {
    redirect(
      `${PATH}?error=${encodeURIComponent(
        "Enter and save all four Odoo fields before testing the connection."
      )}`
    );
  }

  const result = await testOdooConnection({
    baseUrl: config.baseUrl,
    database: config.database,
    username: config.username,
    apiKey: config.apiKey,
  });

  redirect(
    `${PATH}?${result.ok ? "ok" : "error"}=${encodeURIComponent(result.message)}`
  );
}
