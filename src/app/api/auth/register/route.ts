import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "@node-rs/argon2";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import { skeleton, validateFormat } from "@/lib/username";

const Body = z.object({
  username: z.string().max(40),
  email: z.string().email().max(254),
  password: z.string().min(10).max(128),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { username, email, password } = parsed.data;

  // Registrants are always the "user" tier. Plus/owner lengths are enforced on username CHANGE.
  const v = validateFormat(username, "user");
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  const reserved = await db.reservedUsername.findUnique({ where: { nameLower: skeleton(v.lower) } });
  if (reserved) return NextResponse.json({ error: "Username unavailable" }, { status: 409 });

  try {
    const user = await db.user.create({
      data: {
        username: username.trim(),
        usernameLower: v.lower,
        email: email.toLowerCase(),
        passwordHash: await hash(password),
        profile: { create: { displayName: username.trim() } },
      },
    });
    await createSession(user.id);
    return NextResponse.json({ uid: user.uid, username: user.username }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return NextResponse.json({ error: "Username or email already in use" }, { status: 409 });
    throw e;
  }
}
