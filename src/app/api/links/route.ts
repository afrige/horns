
import { NextResponse } from "next/server";
import { z } from "zod";
import { LinkKind } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

function validExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function authenticatedUser() {
  const user = await getCurrentUser();
  if (!user || user.status !== "ACTIVE") return null;
  return user;
}

const CreateBody = z.object({
  kind: z.nativeEnum(LinkKind),
  title: z.string().trim().min(1).max(60),
  description: z.string().max(160).optional().nullable(),
  url: z.string().trim().max(2048),
});

export async function POST(req: Request) {
  const user = await authenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = CreateBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !validExternalUrl(parsed.data?.url ?? "")) {
    return NextResponse.json({ error: "Enter a valid HTTP or HTTPS link." }, { status: 400 });
  }

  const count = await db.link.count({ where: { userId: user.id } });
  if (count >= 50) {
    return NextResponse.json({ error: "You can add up to 50 links." }, { status: 400 });
  }

  const link = await db.link.create({
    data: {
      userId: user.id,
      kind: parsed.data.kind,
      title: parsed.data.title,
      description: parsed.data.description || null,
      url: parsed.data.url,
      position: count,
    },
  });

  return NextResponse.json({ link }, { status: 201 });
}

const UpdateBody = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(60).optional(),
  description: z.string().max(160).nullable().optional(),
  url: z.string().trim().max(2048).optional(),
  visible: z.boolean().optional(),
  position: z.number().int().min(0).max(1000).optional(),
});

export async function PATCH(req: Request) {
  const user = await authenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = UpdateBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid link data." }, { status: 400 });
  }

  const { id, ...input } = parsed.data;

  if (input.url !== undefined && !validExternalUrl(input.url)) {
    return NextResponse.json({ error: "Enter a valid HTTP or HTTPS link." }, { status: 400 });
  }

  const result = await db.link.updateMany({
    where: { id, userId: user.id },
    data: input,
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await authenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing link ID." }, { status: 400 });

  const result = await db.link.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
