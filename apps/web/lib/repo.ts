import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  DealerAccountRecord,
  DealerUserMembershipRecord,
  UserRecord,
} from "@thomas-supply/db";
import type { AdminRole, DealerRole } from "@thomas-supply/shared";

/**
 * Server-only data access for the dealer/account/user domain, backed by the
 * Supabase service-role client. The app's own permission checks (auth.ts) gate
 * every caller, so this layer trusts its inputs. Never import from a client
 * component.
 */

const ORG_ID = "org_thomas_supply";

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function toUser(row: any): UserRecord {
  return {
    id: row.id,
    organizationId: row.organizationId ?? undefined,
    email: row.email,
    name: row.name,
    adminRole: (row.adminRole ?? undefined) as AdminRole | undefined,
    isActive: row.isActive,
  };
}

function toDealer(row: any): DealerAccountRecord {
  return {
    id: row.id,
    organizationId: row.organizationId,
    name: row.name,
    accountNumber: row.accountNumber,
    odooPartnerId: row.odooPartnerId,
    isActive: row.isActive,
    allowExactInventory: row.allowExactInventory,
  };
}

function toMembership(row: any): DealerUserMembershipRecord {
  return {
    id: row.id,
    dealerAccountId: row.dealerAccountId,
    userId: row.userId,
    role: row.role as DealerRole,
    isActive: row.isActive,
  };
}

/* ---------------------------------------------------------------- reads --- */

export async function findUserByAuthUserId(
  authUserId: string
): Promise<UserRecord | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("User")
    .select("*")
    .eq("authUserId", authUserId)
    .maybeSingle();
  if (error) throw error;
  return data ? toUser(data) : null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("User")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toUser(data) : null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("User")
    .select("*")
    .ilike("email", email)
    .maybeSingle();
  if (error) throw error;
  return data ? toUser(data) : null;
}

export async function listMembershipsForUser(
  userId: string
): Promise<DealerUserMembershipRecord[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("DealerUserMembership")
    .select("*")
    .eq("userId", userId)
    .eq("isActive", true);
  if (error) throw error;
  return (data ?? []).map(toMembership);
}

export async function findMembership(
  userId: string,
  dealerAccountId: string
): Promise<DealerUserMembershipRecord | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("DealerUserMembership")
    .select("*")
    .eq("userId", userId)
    .eq("dealerAccountId", dealerAccountId)
    .eq("isActive", true)
    .maybeSingle();
  if (error) throw error;
  return data ? toMembership(data) : null;
}

/** Active accounts only — used to resolve dealer access. */
export async function findActiveDealerAccount(
  id: string
): Promise<DealerAccountRecord | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("DealerAccount")
    .select("*")
    .eq("id", id)
    .eq("isActive", true)
    .maybeSingle();
  if (error) throw error;
  return data ? toDealer(data) : null;
}

/** Any account (active or not) — used by admin editing screens. */
export async function getDealerAccount(
  id: string
): Promise<DealerAccountRecord | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("DealerAccount")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toDealer(data) : null;
}

export async function listDealerAccounts(): Promise<DealerAccountRecord[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("DealerAccount")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toDealer);
}

export type DealerUserListItem = DealerUserMembershipRecord & {
  user?: UserRecord;
  dealerAccount?: DealerAccountRecord;
};

export async function listDealerUsers(
  dealerAccountId?: string
): Promise<DealerUserListItem[]> {
  const db = createSupabaseAdminClient();
  let query = db.from("DealerUserMembership").select("*");
  if (dealerAccountId) query = query.eq("dealerAccountId", dealerAccountId);
  const { data: memRows, error } = await query;
  if (error) throw error;
  const memberships = (memRows ?? []).map(toMembership);

  const userIds = [...new Set(memberships.map((m) => m.userId))];
  const dealerIds = [...new Set(memberships.map((m) => m.dealerAccountId))];

  const [usersRes, dealersRes] = await Promise.all([
    userIds.length
      ? db.from("User").select("*").in("id", userIds)
      : Promise.resolve({ data: [], error: null }),
    dealerIds.length
      ? db.from("DealerAccount").select("*").in("id", dealerIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (usersRes.error) throw usersRes.error;
  if (dealersRes.error) throw dealersRes.error;

  const userMap = new Map((usersRes.data ?? []).map((u) => [u.id, toUser(u)]));
  const dealerMap = new Map(
    (dealersRes.data ?? []).map((d) => [d.id, toDealer(d)])
  );

  return memberships.map((m) => ({
    ...m,
    user: userMap.get(m.userId),
    dealerAccount: dealerMap.get(m.dealerAccountId),
  }));
}

export async function listAllUsers(): Promise<UserRecord[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("User")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toUser);
}

/** Admin users (Thomas Supply staff with an adminRole). */
export async function listAdminUsers(): Promise<UserRecord[]> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("User")
    .select("*")
    .not("adminRole", "is", null)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toUser);
}

/* --------------------------------------------------------------- writes --- */

export async function createDealerAccount(input: {
  name: string;
  accountNumber: string;
  odooPartnerId: string;
  allowExactInventory?: boolean;
}): Promise<DealerAccountRecord> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("DealerAccount")
    .insert({
      id: newId("dealer"),
      organizationId: ORG_ID,
      name: input.name,
      accountNumber: input.accountNumber,
      odooPartnerId: input.odooPartnerId,
      isActive: true,
      allowExactInventory: input.allowExactInventory ?? false,
      updatedAt: nowIso(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return toDealer(data);
}

export async function updateDealerAccount(
  id: string,
  patch: Partial<{
    name: string;
    accountNumber: string;
    odooPartnerId: string;
    allowExactInventory: boolean;
    isActive: boolean;
  }>
): Promise<DealerAccountRecord> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from("DealerAccount")
    .update({ ...patch, updatedAt: nowIso() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return toDealer(data);
}

/**
 * Invites a person by email (Supabase sends a set-password link), then creates
 * the matching app User row and, optionally, a dealer membership.
 */
export async function inviteUser(input: {
  email: string;
  name: string;
  adminRole?: AdminRole | null;
  dealerAccountId?: string;
  dealerRole?: DealerRole;
  redirectTo: string;
}): Promise<UserRecord> {
  const db = createSupabaseAdminClient();

  const { data: invited, error: inviteError } =
    await db.auth.admin.inviteUserByEmail(input.email, {
      redirectTo: input.redirectTo,
      data: { name: input.name },
    });
  if (inviteError) throw inviteError;
  const authUserId = invited.user.id;

  const userId = newId("user");
  const { data: userRow, error: userError } = await db
    .from("User")
    .insert({
      id: userId,
      authUserId,
      organizationId: ORG_ID,
      email: input.email,
      name: input.name,
      adminRole: input.adminRole ?? null,
      isActive: true,
      updatedAt: nowIso(),
    })
    .select("*")
    .single();
  if (userError) throw userError;

  if (input.dealerAccountId && input.dealerRole) {
    const { error: memError } = await db.from("DealerUserMembership").insert({
      id: newId("mem"),
      dealerAccountId: input.dealerAccountId,
      userId,
      role: input.dealerRole,
      isActive: true,
      updatedAt: nowIso(),
    });
    if (memError) throw memError;
  }

  return toUser(userRow);
}

export async function setUserActive(
  userId: string,
  isActive: boolean
): Promise<void> {
  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("User")
    .update({ isActive, updatedAt: nowIso() })
    .eq("id", userId);
  if (error) throw error;
}

export async function setMembershipRole(
  membershipId: string,
  role: DealerRole
): Promise<void> {
  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("DealerUserMembership")
    .update({ role, updatedAt: nowIso() })
    .eq("id", membershipId);
  if (error) throw error;
}

export async function setMembershipActive(
  membershipId: string,
  isActive: boolean
): Promise<void> {
  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("DealerUserMembership")
    .update({ isActive, updatedAt: nowIso() })
    .eq("id", membershipId);
  if (error) throw error;
}
