import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type {
  DealerAccountRecord,
  DealerUserMembershipRecord,
  UserRecord,
} from "@thomas-supply/db";
import {
  hasAdminPermission,
  hasDealerPermission,
  type AdminPermission,
  type DealerPermission,
} from "@thomas-supply/shared/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import * as repo from "@/lib/repo";
import { AppError } from "./errors";

// Which dealer account a multi-account user is currently acting as. This is a
// non-sensitive preference cookie; the auth session itself is managed by
// Supabase via httpOnly cookies.
const ACTIVE_DEALER_COOKIE = "tsp_dealer_account";

export type CurrentUser = UserRecord;

export type DealerContext = {
  user: CurrentUser;
  membership: DealerUserMembershipRecord;
  dealerAccount: DealerAccountRecord;
};

export type AdminContext = {
  user: CurrentUser;
  adminRole: NonNullable<UserRecord["adminRole"]>;
};

/**
 * Resolves the signed-in Supabase user to the app's User profile. Returns null
 * if there is no session, no linked profile, or the profile is deactivated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const user = await repo.findUserByAuthUserId(authUser.id);
  if (!user || !user.isActive) return null;
  return user;
}

export async function logout() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  cookies().delete(ACTIVE_DEALER_COOKIE);
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

async function resolveDealerMembership(userId: string) {
  const memberships = await repo.listMembershipsForUser(userId);
  const activeDealerAccountId = cookies().get(ACTIVE_DEALER_COOKIE)?.value;
  if (activeDealerAccountId) {
    const activeMembership = memberships.find(
      (membership) => membership.dealerAccountId === activeDealerAccountId
    );
    if (activeMembership) return activeMembership;
  }
  return memberships[0];
}

export async function requireDealerContext(
  permission?: DealerPermission
): Promise<DealerContext> {
  const user = await requireCurrentUser();
  const membership = await resolveDealerMembership(user.id);
  if (!membership) {
    throw new AppError(
      "Your user is not mapped to an active dealer account.",
      403,
      "DEALER_REQUIRED"
    );
  }
  if (permission && !hasDealerPermission(membership.role, permission)) {
    throw new AppError(
      "Your dealer role does not allow that action.",
      403,
      "PERMISSION_DENIED"
    );
  }
  const dealerAccount = await repo.findActiveDealerAccount(
    membership.dealerAccountId
  );
  if (!dealerAccount) {
    throw new AppError(
      "Dealer account is inactive or missing.",
      403,
      "DEALER_INACTIVE"
    );
  }
  return { user, membership, dealerAccount };
}

export async function requireDealerAccountAccess(
  dealerAccountId: string,
  permission?: DealerPermission
) {
  const user = await requireCurrentUser();
  const membership = await repo.findMembership(user.id, dealerAccountId);
  if (!membership) {
    throw new AppError(
      "You cannot access that dealer account.",
      403,
      "DEALER_ACCESS_DENIED"
    );
  }
  if (permission && !hasDealerPermission(membership.role, permission)) {
    throw new AppError(
      "Your dealer role does not allow that action.",
      403,
      "PERMISSION_DENIED"
    );
  }
  const dealerAccount = await repo.findActiveDealerAccount(dealerAccountId);
  if (!dealerAccount) {
    throw new AppError(
      "Dealer account is inactive or missing.",
      403,
      "DEALER_INACTIVE"
    );
  }
  return { user, membership, dealerAccount };
}

export async function requireAdminContext(
  permission?: AdminPermission
): Promise<AdminContext> {
  const user = await requireCurrentUser();
  if (!user.adminRole) {
    throw new AppError(
      "Thomas Supply admin access is required.",
      403,
      "ADMIN_REQUIRED"
    );
  }
  if (permission && !hasAdminPermission(user.adminRole, permission)) {
    throw new AppError(
      "Your admin role does not allow that action.",
      403,
      "PERMISSION_DENIED"
    );
  }
  return { user, adminRole: user.adminRole };
}
