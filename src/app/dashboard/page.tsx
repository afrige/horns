
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { parseTheme } from "@/lib/theme";
import { DashboardEditor } from "@/components/dashboard/DashboardEditor";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.status !== "ACTIVE") {
    redirect("/login");
  }

  const profile = await db.profile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, displayName: user.username },
    update: {},
  });

  const links = await db.link.findMany({
    where: { userId: user.id },
    orderBy: { position: "asc" },
    select: {
      id: true,
      kind: true,
      title: true,
      description: true,
      url: true,
      visible: true,
    },
  });

  return (
    <DashboardEditor
      initial={{
        username: user.username,
        uid: user.uid,
        email: user.email,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        bannerUrl: profile.bannerUrl,
        published: !!profile.publishedAt,
        theme: parseTheme(profile.theme),
        links,
      }}
    />
  );
}
