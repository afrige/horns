
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { normalize } from "@/lib/username";
import { parseTheme, safeUrl } from "@/lib/theme";
import { ProfileView, type ProfileData } from "@/components/ProfileView";

export const dynamic = "force-dynamic";

const RANK: Record<string, number> = {
  LEGENDARY: 4,
  EPIC: 3,
  RARE: 2,
  UNCOMMON: 1,
  COMMON: 0,
};

async function load(raw: string) {
  const user = await db.user.findUnique({
    where: { usernameLower: normalize(raw) },
    include: {
      profile: true,
      links: {
        where: { visible: true },
        orderBy: { position: "asc" },
      },
      badges: {
        where: { visible: true },
        include: { badge: true },
      },
    },
  });

  if (
    !user ||
    user.status !== "ACTIVE" ||
    !user.profile ||
    !user.profile.publishedAt
  ) {
    return null;
  }

  return user;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await load(username);

  if (!user) return { title: "Profile not found · HORNS" };

  return {
    title: `${user.profile!.displayName} (@${user.username}) · HORNS`,
    description: user.profile!.bio.slice(0, 160) || "A profile on HORNS.",
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await load(username);

  if (!user) notFound();

  const profile = user.profile!;

  const data: ProfileData = {
    username: user.username,
    uid: user.uid,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: safeUrl(profile.avatarUrl),
    bannerUrl: safeUrl(profile.bannerUrl),
    views: profile.views,
    theme: parseTheme(profile.theme),
    badges: user.badges
      .map((item) => item.badge)
      .sort((a, b) => RANK[b.rarity] - RANK[a.rarity])
      .map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        rarity: badge.rarity,
      })),
    links: user.links
      .map((link) => ({
        id: link.id,
        kind: link.kind,
        title: link.title,
        description: link.description,
        url: safeUrl(link.url),
      }))
      .filter(
        (link): link is typeof link & { url: string } => !!link.url
      ),
  };

  return <ProfileView p={data} />;
}
