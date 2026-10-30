import { NextResponse } from "next/server";
import { z } from "zod";
import { verify } from "@node-rs/argon2";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";

const Body = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  const ok = user && user.status === "ACTIVE" && (await verify(user.passwordHash, parsed.data.password));
  if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  await db.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
  await createSession(user.id);
  return NextResponse.json({ uid: user.uid, username: user.username });
}
