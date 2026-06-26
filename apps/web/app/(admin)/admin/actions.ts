"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireAdminContext } from "@/lib/auth";
import * as repo from "@/lib/repo";
import { toUserMessage } from "@/lib/errors";
import type { DealerRole } from "@thomas-supply/shared";

const ACCOUNTS_PATH = "/admin/dealer-accounts";
const USERS_PATH = "/admin/dealer-users";

const DEALER_ROLES: DealerRole[] = [
  "owner",
  "purchaser",
  "technician",
  "viewer",
];

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function ok(path: string, message: string): never {
  redirect(`${path}?ok=${encodeURIComponent(message)}`);
}

function originFromHeaders(): string {
  const h = headers();
  const host = h.get("host") ?? "localhost:3010";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/* ---------------------------------------------------------- dealer accounts */

export async function createDealerAccountAction(formData: FormData) {
  await requireAdminContext("admin:manage_dealers");
  const name = String(formData.get("name") ?? "").trim();
  const accountNumber = String(formData.get("accountNumber") ?? "").trim();
  const odooPartnerId = String(formData.get("odooPartnerId") ?? "").trim();
  const allowExactInventory = formData.get("allowExactInventory") === "on";

  if (!name || !accountNumber || !odooPartnerId) {
    fail(ACCOUNTS_PATH, "Name, account number, and Odoo partner ID are required.");
  }

  try {
    await repo.createDealerAccount({
      name,
      accountNumber,
      odooPartnerId,
      allowExactInventory,
    });
  } catch (error) {
    fail(ACCOUNTS_PATH, toUserMessage(error));
  }

  revalidatePath(ACCOUNTS_PATH);
  ok(ACCOUNTS_PATH, `Created “${name}”.`);
}

export async function updateDealerAccountAction(formData: FormData) {
  await requireAdminContext("admin:manage_dealers");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const accountNumber = String(formData.get("accountNumber") ?? "").trim();
  const odooPartnerId = String(formData.get("odooPartnerId") ?? "").trim();
  const allowExactInventory = formData.get("allowExactInventory") === "on";

  if (!id) fail(ACCOUNTS_PATH, "Missing dealer account id.");
  if (!name || !accountNumber || !odooPartnerId) {
    fail(ACCOUNTS_PATH, "Name, account number, and Odoo partner ID are required.");
  }

  try {
    await repo.updateDealerAccount(id, {
      name,
      accountNumber,
      odooPartnerId,
      allowExactInventory,
    });
  } catch (error) {
    fail(ACCOUNTS_PATH, toUserMessage(error));
  }

  revalidatePath(ACCOUNTS_PATH);
  ok(ACCOUNTS_PATH, `Saved “${name}”.`);
}

export async function setDealerAccountActiveAction(formData: FormData) {
  await requireAdminContext("admin:manage_dealers");
  const id = String(formData.get("id") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";
  if (!id) fail(ACCOUNTS_PATH, "Missing dealer account id.");

  try {
    await repo.updateDealerAccount(id, { isActive });
  } catch (error) {
    fail(ACCOUNTS_PATH, toUserMessage(error));
  }

  revalidatePath(ACCOUNTS_PATH);
  ok(ACCOUNTS_PATH, isActive ? "Account activated." : "Account deactivated.");
}

/* ------------------------------------------------------------- dealer users */

export async function inviteDealerUserAction(formData: FormData) {
  await requireAdminContext("admin:manage_users");
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const dealerAccountId = String(formData.get("dealerAccountId") ?? "");
  const dealerRole = String(formData.get("dealerRole") ?? "") as DealerRole;

  if (!email || !name || !dealerAccountId) {
    fail(USERS_PATH, "Email, name, and dealer account are required.");
  }
  if (!DEALER_ROLES.includes(dealerRole)) {
    fail(USERS_PATH, "Choose a valid role.");
  }

  try {
    await repo.inviteUser({
      email,
      name,
      dealerAccountId,
      dealerRole,
      redirectTo: `${originFromHeaders()}/auth/callback`,
    });
  } catch (error) {
    fail(USERS_PATH, toUserMessage(error));
  }

  revalidatePath(USERS_PATH);
  ok(USERS_PATH, `Invited ${email}. They'll get an email to set their password.`);
}

export async function setMembershipRoleAction(formData: FormData) {
  await requireAdminContext("admin:manage_users");
  const membershipId = String(formData.get("membershipId") ?? "");
  const role = String(formData.get("role") ?? "") as DealerRole;
  if (!membershipId) fail(USERS_PATH, "Missing membership id.");
  if (!DEALER_ROLES.includes(role)) fail(USERS_PATH, "Choose a valid role.");

  try {
    await repo.setMembershipRole(membershipId, role);
  } catch (error) {
    fail(USERS_PATH, toUserMessage(error));
  }

  revalidatePath(USERS_PATH);
  ok(USERS_PATH, "Role updated.");
}

export async function setMembershipActiveAction(formData: FormData) {
  await requireAdminContext("admin:manage_users");
  const membershipId = String(formData.get("membershipId") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";
  if (!membershipId) fail(USERS_PATH, "Missing membership id.");

  try {
    await repo.setMembershipActive(membershipId, isActive);
  } catch (error) {
    fail(USERS_PATH, toUserMessage(error));
  }

  revalidatePath(USERS_PATH);
  ok(USERS_PATH, isActive ? "Access restored." : "Access revoked.");
}
