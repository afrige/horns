import { PrismaClient, Rarity } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { skeleton, normalize } from "../src/lib/username";

const db = new PrismaClient();

const BADGES: [string, string, string, Rarity, boolean][] = [
  ["OWNER", "Owner", "Platform owner and creator of HORNS.", "LEGENDARY", true],
  ["ADMIN", "Admin", "HORNS administrator.", "EPIC", true],
  ["MODERATOR", "Moderator", "HORNS moderator.", "RARE", true],
  ["VERIFIED", "Verified", "Verified account.", "RARE", true],
  ["EARLY", "Early Supporter", "Joined during the early days.", "EPIC", true],
  ["SUPPORTER", "Supporter", "Supports HORNS.", "UNCOMMON", true],
  ["HORNS_PLUS", "HORNS+", "Active HORNS+ subscriber.", "RARE", true],
  ["DEVELOPER", "Developer", "Builds HORNS.", "EPIC", true],
  ["DESIGNER", "Designer", "Designs for HORNS.", "EPIC", true],
  ["OG", "OG", "Original community member.", "LEGENDARY", true],
];

const RESERVED = ["admin", "administrator", "owner", "horns", "hornsplus", "support", "staff",
  "moderator", "mod", "system", "root", "official", "help", "security", "api", "www", "dashboard",
  "login", "register", "settings", "premium"];

async function main() {
  for (const [id, name, description, rarity, adminOnly] of BADGES)
    await db.badge.upsert({
      where: { id },
      update: { name, description, rarity, adminOnly },
      create: { id, name, description, rarity, adminOnly, pixelIcon: `/badges/${id.toLowerCase()}.svg` },
    });

  for (const n of RESERVED)
    await db.reservedUsername.upsert({
      where: { nameLower: skeleton(n) }, update: {}, create: { nameLower: skeleton(n), reason: "system" },
    });

  const id = process.env.OWNER_USER_ID, email = process.env.OWNER_EMAIL,
    pw = process.env.OWNER_PASSWORD, uname = process.env.OWNER_USERNAME;
  if (!id || !email || !pw || !uname) throw new Error("Set OWNER_USER_ID, OWNER_EMAIL, OWNER_PASSWORD, OWNER_USERNAME");

  // Owner bypasses reserved/min-length rules; identity is the fixed id, not the username.
  await db.user.upsert({
    where: { id },
    update: {},
    create: {
      id, username: uname, usernameLower: normalize(uname), email: email.toLowerCase(),
      passwordHash: await hash(pw), role: "OWNER",
      profile: { create: { displayName: uname } },
      badges: { create: { badgeId: "OWNER", assignedBy: id } },
    },
  });
}

main().finally(() => db.$disconnect());
