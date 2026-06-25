import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { mockDb } from "@thomas-supply/db";
import type {
  DealerAccountRecord,
  DealerUserMembershipRecord,
  UserRecord
} from "@thomas-supply/db";
import {
  hasAdminPermission,
  hasDealerPermission,
  type AdminPermission,
  type DealerPermission
} from "@thomas-supply/shared/permissions";
import { AppError } from "./errors";

const SESSION_COOKIE = "tsp_session";
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

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret === "replace-me-in-production") {
    if (process.env.NODE_ENV === "production") {
      throw new AppError("AUTH_SECRET must be configured before production use.", 500, "AUTH_SECRET_REQUIRED");
    }
    return "dev-only-auth-secret";
  }
  return secret;
}

function signSessionValue(userId: string) {
  const signature = crypto.createHmac("sha256", getAuthSecret()).update(userId).digest("base64url");
  return `${userId}.${signature}`;
}

function verifySessionValue(value: string | undefined) {
  if (!value) return null;
  const [userId, signature] = value.split(".");
  if (!userId || !signature) return null;

  const expected = signSessionValue(userId).split(".")[1];
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  return userId;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const userId = verifySessionValue(cookies().get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  return mockDb.findUserById(userId) ?? null;
}

export async function loginByEmail(email: string) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_AUTH !== "true") {
    throw new AppError("Demo login is disabled in production. Configure a real auth provider.", 403, "DEMO_AUTH_DISABLED");
  }

  const user = mockDb.findUserByEmail(email);
  if (!user) throw new AppError("No active demo user exists for that email.", 401, "AUTH_INVALID");

  cookies().set(SESSION_COOKIE, signSessionValue(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  const membership = mockDb.listMembershipsForUser(user.id)[0];
  if (membership) {
    cookies().set(ACTIVE_DEALER_COOKIE, membership.dealerAccountId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });
  }

  return user;
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  cookies().delete(ACTIVE_DEALER_COOKIE);
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

function resolveDealerMembership(userId: string) {
  const memberships = mockDb.listMembershipsForUser(userId);
  const activeDealerAccountId = cookies().get(ACTIVE_DEALER_COOKIE)?.value;
  if (activeDealerAccountId) {
    const activeMembership = memberships.find((membership) => membership.dealerAccountId === activeDealerAccountId);
    if (activeMembership) return activeMembership;
  }
  return memberships[0];
}

export async function requireDealerContext(permission?: DealerPermission): Promise<DealerContext> {
  const user = await requireCurrentUser();
  const membership = resolveDealerMembership(user.id);
  if (!membership) throw new AppError("Your user is not mapped to an active dealer account.", 403, "DEALER_REQUIRED");
  if (permission && !hasDealerPermission(membership.role, permission)) {
    throw new AppError("Your dealer role does not allow that action.", 403, "PERMISSION_DENIED");
  }
  const dealerAccount = mockDb.findDealerAccount(membership.dealerAccountId);
  if (!dealerAccount) throw new AppError("Dealer account is inactive or missing.", 403, "DEALER_INACTIVE");
  return { user, membership, dealerAccount };
}

export async function requireDealerAccountAccess(dealerAccountId: string, permission?: DealerPermission) {
  const user = await requireCurrentUser();
  const membership = mockDb.findMembership(user.id, dealerAccountId);
  if (!membership) throw new AppError("You cannot access that dealer account.", 403, "DEALER_ACCESS_DENIED");
  if (permission && !hasDealerPermission(membership.role, permission)) {
    throw new AppError("Your dealer role does not allow that action.", 403, "PERMISSION_DENIED");
  }
  const dealerAccount = mockDb.findDealerAccount(dealerAccountId);
  if (!dealerAccount) throw new AppError("Dealer account is inactive or missing.", 403, "DEALER_INACTIVE");
  return { user, membership, dealerAccount };
}

export async function requireAdminContext(permission?: AdminPermission): Promise<AdminContext> {
  const user = await requireCurrentUser();
  if (!user.adminRole) throw new AppError("Thomas Supply admin access is required.", 403, "ADMIN_REQUIRED");
  if (permission && !hasAdminPermission(user.adminRole, permission)) {
    throw new AppError("Your admin role does not allow that action.", 403, "PERMISSION_DENIED");
  }
  return { user, adminRole: user.adminRole };
}
