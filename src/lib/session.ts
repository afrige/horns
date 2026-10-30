import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import { db } from "./db";
import { env } from "./env";

const TTL_MS = 30 * 24 * 3600 * 1000;
const sha = (t: string) => createHash("sha256").update(t).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TTL_MS);
  await db.session.create({ data: { userId, tokenHash: sha(token), expiresAt } });
  (await cookies()).set(env.SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(env.SESSION_COOKIE)?.value;
  if (!token) return null;
  const s = await db.session.findUnique({ where: { tokenHash: sha(token) }, include: { user: true } });
  if (!s || s.expiresAt < new Date() || s.user.status !== "ACTIVE") return null;
  return s.user;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(env.SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: sha(token) } });
  jar.delete(env.SESSION_COOKIE);
}
