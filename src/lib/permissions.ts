import { env } from "./env";
import { db } from "./db";
import type { Tier } from "./username";

/** The ONLY owner check. Compares the session's user id to a server-side secret. */
export const isOwner = (userId: string) => userId === env.OWNER_USER_ID;

export async function hasPlus(userId: string) {
  if (isOwner(userId)) return true; // owner previews all premium features
  const s = await db.subscription.findUnique({ where: { userId } });
  return !!s && s.status === "ACTIVE" && !!s.currentPeriodEnd && s.currentPeriodEnd > new Date();
}

export async function getTier(userId: string): Promise<Tier> {
  if (isOwner(userId)) return "owner";
  return (await hasPlus(userId)) ? "plus" : "user";
}

export async function isAdmin(userId: string) {
  if (isOwner(userId)) return true;
  const u = await db.user.findUnique({ where: { id: userId }, select: { role: true, status: true } });
  return u?.status === "ACTIVE" && u.role === "ADMIN";
}
