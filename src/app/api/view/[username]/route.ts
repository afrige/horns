import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { normalize } from "@/lib/username";

// Counts one view per visitor per profile per 24h. Skips the profile's own owner.
export async function POST(_: Request, { params }: { params: Promise<{ username: string }> }) {
  const lower = normalize((await params).username);
  const user = await db.user.findUnique({ where: { usernameLower: lower }, include: { profile: true } });
  if (!user?.profile || user.status !== "ACTIVE") return NextResponse.json({ error: "Not found" }, { status: 404 });

  const jar = await cookies();
  const key = `hv_${lower}`;
  const me = await getCurrentUser();
  if (jar.get(key) || me?.id === user.id) return NextResponse.json({ views: user.profile.views });

  const updated = await db.profile.update({ where: { userId: user.id }, data: { views: { increment: 1 } } });
  jar.set(key, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 86400 });
  return NextResponse.json({ views: updated.views });
}
