export type Tier = "owner" | "plus" | "user";

const MAX_LEN = 20;
const RE = /^[a-z0-9_]+$/;

export const minLength = (t: Tier) => (t === "owner" ? 1 : t === "plus" ? 2 : 3);
export const normalize = (n: string) => n.trim().toLowerCase();

/**
 * Look-alike skeleton used for impersonation checks.
 * ReservedUsername.nameLower stores the SKELETON of each reserved name,
 * so "adm1n", "a_dmin" and "admin" all collide with a reserved "admin".
 */
export function skeleton(n: string) {
  return normalize(n)
    .replace(/_/g, "")
    .replace(/0/g, "o")
    .replace(/[1l]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t");
}

export function validateFormat(
  raw: string,
  tier: Tier
): { ok: true; lower: string } | { ok: false; error: string } {
  const lower = normalize(raw);
  if (lower.length < minLength(tier))
    return { ok: false, error: `Username must be at least ${minLength(tier)} characters` };
  if (lower.length > MAX_LEN) return { ok: false, error: `Username must be at most ${MAX_LEN} characters` };
  if (!RE.test(lower)) return { ok: false, error: "Use only letters, numbers and underscores" };
  return { ok: true, lower };
}
