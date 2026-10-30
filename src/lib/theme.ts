import { z } from "zod";
import type { CSSProperties } from "react";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);

// Everything stored in Profile.theme is untrusted JSON: parse, clamp, default.
export const ThemeSchema = z.object({
  bgColor: hex.default("#0b0b0d"),
  bgGradient: z.object({ from: hex, to: hex, angle: z.number().min(0).max(360) }).nullable().default(null),
  textColor: hex.default("#f4f4f5"),
  mutedColor: hex.default("#a1a1aa"),
  accent: hex.default("#e4e4e7"),
  cardColor: hex.default("#141417"),
  cardOpacity: z.number().min(0).max(1).default(0.72),
  borderColor: hex.default("#2a2a30"),
  radius: z.number().min(0).max(40).default(22),
  blur: z.number().min(0).max(40).default(16),
  shadow: z.enum(["none", "soft", "deep"]).default("soft"),
});
export type Theme = z.infer<typeof ThemeSchema>;

export function parseTheme(raw: unknown): Theme {
  const r = ThemeSchema.safeParse(raw);
  return r.success ? r.data : ThemeSchema.parse({});
}

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
const SHADOWS = { none: "none", soft: "0 10px 40px rgba(0,0,0,.35)", deep: "0 24px 80px rgba(0,0,0,.65)" };

export function themeToStyle(t: Theme): CSSProperties {
  const bg = t.bgGradient
    ? `linear-gradient(${t.bgGradient.angle}deg, ${t.bgGradient.from}, ${t.bgGradient.to})`
    : t.bgColor;
  return {
    background: bg,
    "--text": t.textColor,
    "--muted": t.mutedColor,
    "--accent": t.accent,
    "--card": `rgba(${rgb(t.cardColor)},${t.cardOpacity})`,
    "--border": t.borderColor,
    "--radius": `${t.radius}px`,
    "--blur": `${t.blur}px`,
    "--shadow": SHADOWS[t.shadow],
  } as CSSProperties;
}

/** Only http(s) or same-site paths. Blocks javascript:, data:, etc. */
export function safeUrl(u?: string | null): string | null {
  if (!u) return null;
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  try {
    const p = new URL(u);
    return p.protocol === "https:" || p.protocol === "http:" ? p.toString() : null;
  } catch {
    return null;
  }
}
