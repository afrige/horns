
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { ThemeSchema, safeUrl } from "@/lib/theme";

const Body = z.object({
  displayName: z.string().trim().min(1).max(40).optional(),
  bio: z.string().max(300).optional(),
  avatarUrl: z.string().max(2048).nullable().optional(),
  bannerUrl: z.string().max(2048).nullable().optional(),
  theme: ThemeSchema.optional(),
  published: z.boolean().optional(),
});

function validateImageUrl(value: string | null | undefined) {
  if (value === undefined || value === null || value === "") return null;
  const safe = safeUrl(value);
  if (!safe) throw new Error("Use a valid HTTP or HTTPS image URL.");
  return safe;
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  }

  const input = parsed.data;

  try {
    const data: Prisma.ProfileUpdateInput = {};

    if (input.displayName !== undefined) data.displayName = input.displayName;
    if (input.bio !== undefined) data.bio = input.bio;
    if (input.avatarUrl !== undefined) data.avatarUrl = validateImageUrl(input.avatarUrl);
    if (input.bannerUrl !== undefined) data.bannerUrl = validateImageUrl(input.bannerUrl);
    if (input.theme !== undefined) {
      data.theme = input.theme as Prisma.InputJsonValue;
    }
    if (input.published !== undefined) {
      data.publishedAt = input.published ? new Date() : null;
    }

    const profile = await db.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        displayName: input.displayName ?? user.username,
        bio: input.bio ?? "",
        ...(input.avatarUrl !== undefined
          ? { avatarUrl: validateImageUrl(input.avatarUrl) }
          : {}),
        ...(input.bannerUrl !== undefined
          ? { bannerUrl: validateImageUrl(input.bannerUrl) }
          : {}),
        ...(input.theme !== undefined
          ? { theme: input.theme as Prisma.InputJsonValue }
          : {}),
        ...(input.published
          ? { publishedAt: new Date() }
          : {}),
      },
      update: data,
    });

    return NextResponse.json({
      ok: true,
      published: !!profile.publishedAt,
      updatedAt: profile.updatedAt,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("valid HTTP")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
