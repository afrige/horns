import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { normalize } from "@/lib/username";
import { parseTheme, safeUrl } from "@/lib/theme";
import { ProfileView, type ProfileData } from "@/components/ProfileView";

const RANK: Record<string, number> = { LEGENDARY: 4, EPIC: 3, RARE: 2, UNCOMMON: 1, COMMON: 0 };

async function load(raw: string) {
  const user = await db.user.findUnique({
    where: { usernameLower: normalize(decodeURIComponent(raw)) },
    include: {
      profile: true,
      links: { where: { visible: true }, orderBy: { position: "asc" } },
      badges: { where: { visible: true }, include: { badge: true } },
    },
  });
  return user && user.status === "ACTIVE" && user.profile ? user : null;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const u = await load((await params).username);
  return u ? { title: `${u.profile!.displayName} (@${u.username}) · HORNS`, description: u.profile!.bio.slice(0, 160) } : {};
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const u = await load((await params).username);
  if (!u) notFound();
  const pr = u.profile!;

  const data: ProfileData = {
    username: u.username, uid: u.uid, displayName: pr.displayName, bio: pr.bio,
    avatarUrl: safeUrl(pr.avatarUrl), bannerUrl: safeUrl(pr.bannerUrl),
    views: pr.views, theme: parseTheme(pr.theme),
    badges: u.badges
      .map((ub) => ub.badge)
      .sort((a, b) => RANK[b.rarity] - RANK[a.rarity])
      .map((b) => ({ id: b.id, name: b.name, description: b.description, rarity: b.rarity })),
    links: u.links
      .map((l) => ({ id: l.id, kind: l.kind, title: l.title, description: l.description, url: safeUrl(l.url) }))
      .filter((l): l is typeof l & { url: string } => !!l.url),
  };
  return <ProfileView p={data} />;
}
