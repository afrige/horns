"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Instagram, Youtube, Github, Twitch, Twitter, Music2, MessageCircle, MessageSquare, Globe, Eye } from "lucide-react";
import { PixelBadge } from "./PixelBadge";
import { themeToStyle, type Theme } from "@/lib/theme";

export type ProfileData = {
  username: string; uid: number; displayName: string; bio: string;
  avatarUrl: string | null; bannerUrl: string | null; views: number; theme: Theme;
  badges: { id: string; name: string; description: string; rarity: string }[];
  links: { id: string; kind: string; title: string; description: string | null; url: string }[];
};

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  INSTAGRAM: Instagram, YOUTUBE: Youtube, GITHUB: Github, TWITCH: Twitch, X: Twitter,
  SPOTIFY: Music2, TIKTOK: Music2, DISCORD: MessageCircle, YAPIN: MessageSquare, CUSTOM: Globe,
};
const SOCIAL = new Set(["INSTAGRAM", "YOUTUBE", "GITHUB", "TWITCH", "X", "SPOTIFY", "TIKTOK", "DISCORD", "YAPIN"]);

function ViewCounter({ username, initial }: { username: string; initial: number }) {
  const [views, setViews] = useState(initial);
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch(`/api/view/${username}`, { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setViews(d.views))
      .catch(() => {});
  }, [username]);
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
      <Eye size={13} /> {views.toLocaleString()}
    </span>
  );
}

export function ProfileView({ p }: { p: ProfileData }) {
  const reduce = useReducedMotion();
  const social = p.links.filter((l) => SOCIAL.has(l.kind) && l.kind !== "CUSTOM");
  const custom = p.links.filter((l) => !SOCIAL.has(l.kind));
  const rel = "noopener noreferrer nofollow ugc";

  return (
    <main className="min-h-screen px-4 pb-16" style={{ ...themeToStyle(p.theme), color: "var(--text)" }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-md pt-10"
      >
        <div
          className="overflow-hidden border"
          style={{
            background: "var(--card)", borderColor: "var(--border)", borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)", backdropFilter: "blur(var(--blur))",
          }}
        >
          <div className="h-32 w-full bg-white/5">
            {p.bannerUrl && <img src={p.bannerUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />}
          </div>

          <div className="px-6 pb-7">
            <div className="-mt-12 mb-4 h-24 w-24 overflow-hidden rounded-full border-4 bg-zinc-800" style={{ borderColor: "var(--border)" }}>
              {p.avatarUrl && <img src={p.avatarUrl} alt={`${p.displayName}'s avatar`} referrerPolicy="no-referrer" className="h-full w-full object-cover" />}
            </div>

            <h1 className="text-2xl font-semibold leading-tight">{p.displayName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm" style={{ color: "var(--muted)" }}>
              <span>@{p.username}</span>
              <span className="font-mono text-xs">UID: {String(p.uid).padStart(6, "0")}</span>
            </div>

            {p.badges.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {p.badges.map((b) => (
                  <li key={b.id} title={`${b.name}: ${b.description}`} className="rounded-md border px-1.5 py-1" style={{ borderColor: "var(--border)" }}>
                    <PixelBadge id={b.id} rarity={b.rarity} title={b.name} />
                  </li>
                ))}
              </ul>
            )}

            {p.bio && <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>{p.bio}</p>}

            {social.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {social.map((l) => {
                  const Icon = ICONS[l.kind] ?? Globe;
                  return (
                    <a key={l.id} href={l.url} target="_blank" rel={rel} aria-label={l.title}
                      className="grid h-10 w-10 place-items-center rounded-full border transition hover:-translate-y-0.5 hover:bg-white/10"
                      style={{ borderColor: "var(--border)" }}>
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}

            {custom.length > 0 && (
              <div className="mt-5 space-y-2.5">
                {custom.map((l) => (
                  <a key={l.id} href={l.url} target="_blank" rel={rel}
                    className="block rounded-xl border px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/10"
                    style={{ borderColor: "var(--border)" }}>
                    <div className="text-sm font-medium">{l.title}</div>
                    {l.description && <div className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>{l.description}</div>}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <ViewCounter username={p.username.toLowerCase()} initial={p.views} />
              <span className="text-[10px] tracking-[0.3em]" style={{ color: "var(--muted)" }}>HORNS</span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
