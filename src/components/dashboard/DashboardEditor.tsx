
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, Eye, EyeOff, LogOut, Plus, Save, Trash2 } from "lucide-react";
import type { Theme } from "@/lib/theme";

type LinkItem = {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  url: string;
  visible: boolean;
};

type DashboardData = {
  username: string;
  uid: number;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  published: boolean;
  theme: Theme;
  links: LinkItem[];
};

const LINK_KINDS = [
  "INSTAGRAM", "YOUTUBE", "TIKTOK", "GITHUB", "SPOTIFY",
  "DISCORD", "YAPIN", "TWITCH", "X", "CUSTOM",
] as const;

const LABELS: Record<string, string> = {
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  TIKTOK: "TikTok",
  GITHUB: "GitHub",
  SPOTIFY: "Spotify",
  DISCORD: "Discord",
  YAPIN: "Yapper",
  TWITCH: "Twitch",
  X: "X",
  CUSTOM: "Custom",
};

export function DashboardEditor({ initial }: { initial: DashboardData }) {
  const router = useRouter();

  const [profile, setProfile] = useState(initial);
  const [links, setLinks] = useState(initial.links);
  const [kind, setKind] = useState<(typeof LINK_KINDS)[number]>("CUSTOM");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof DashboardData>(key: K, value: DashboardData[K]) {
    setProfile((old) => ({ ...old, [key]: value }));
  }

  function updateTheme<K extends keyof Theme>(key: K, value: Theme[K]) {
    setProfile((old) => ({
      ...old,
      theme: { ...old.theme, [key]: value },
    }));
  }

  async function saveProfile(publish?: boolean) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl || null,
          bannerUrl: profile.bannerUrl || null,
          theme: profile.theme,
          ...(publish === undefined ? {} : { published: publish }),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Could not save your profile.");
        return;
      }

      if (publish !== undefined) {
        setProfile((old) => ({ ...old, published: data.published }));
      }

      setMessage(publish === undefined ? "Changes saved." : publish ? "Your profile is published!" : "Your profile is now unpublished.");
      router.refresh();
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function addLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title: linkTitle,
          url: linkUrl,
          description: linkDescription || null,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Could not add link.");
        return;
      }

      setLinks((old) => [...old, data.link]);
      setLinkTitle("");
      setLinkUrl("");
      setLinkDescription("");
      setMessage("Link added.");
    } catch {
      setError("Connection failed. Please try again.");
    }
  }

  async function deleteLink(id: string) {
    setError("");
    setMessage("");

    const response = await fetch(`/api/links?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not delete link.");
      return;
    }

    setLinks((old) => old.filter((link) => link.id !== id));
    setMessage("Link deleted.");
  }

  async function toggleLink(link: LinkItem) {
    const response = await fetch("/api/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id, visible: !link.visible }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not update link.");
      return;
    }

    setLinks((old) =>
      old.map((item) =>
        item.id === link.id ? { ...item, visible: !item.visible } : item
      )
    );
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  async function copyProfile() {
    await navigator.clipboard.writeText(`${window.location.origin}/${profile.username}`);
    setMessage("Profile URL copied.");
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40";

  return (
    <main className="min-h-screen bg-[#0b0b0d] text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a href="/" className="font-bold tracking-[0.3em]">HORNS</a>
          <div className="flex items-center gap-3">
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 text-sm text-zinc-400 hover:text-white sm:flex"
            >
              View profile <ExternalLink size={14} />
            </a>
            <button onClick={logout} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Your workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-400">
              @{profile.username} · UID {String(profile.uid).padStart(6, "0")}
            </p>
          </div>

          <button onClick={copyProfile} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5">
            <Copy size={15} /> Copy profile link
          </button>
        </div>

        {(error || message) && (
          <div
            role="status"
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-[#121215] p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Profile information</h2>
                <p className="mt-1 text-sm text-zinc-500">Make your page recognizable.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm text-zinc-300">
                  Display name
                  <input className={fieldClass} maxLength={40} value={profile.displayName} onChange={(e) => update("displayName", e.target.value)} />
                </label>

                <label className="block text-sm text-zinc-300">
                  Username
                  <input className={`${fieldClass} opacity-60`} value={`@${profile.username}`} readOnly />
                </label>

                <label className="block text-sm text-zinc-300 sm:col-span-2">
                  Bio
                  <textarea className={fieldClass} rows={3} maxLength={300} value={profile.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Tell people a little about yourself..." />
                  <span className="mt-1 block text-right text-xs text-zinc-600">{profile.bio.length}/300</span>
                </label>

                <label className="block text-sm text-zinc-300 sm:col-span-2">
                  Avatar image URL
                  <input className={fieldClass} value={profile.avatarUrl ?? ""} onChange={(e) => update("avatarUrl", e.target.value || null)} placeholder="https://example.com/avatar.png" />
                </label>

                <label className="block text-sm text-zinc-300 sm:col-span-2">
                  Banner image URL
                  <input className={fieldClass} value={profile.bannerUrl ?? ""} onChange={(e) => update("bannerUrl", e.target.value || null)} placeholder="https://example.com/banner.png" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#121215] p-6">
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="mt-1 text-sm text-zinc-500">Customize the colors of your profile.</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {([
                  ["bgColor", "Background"],
                  ["textColor", "Text"],
                  ["mutedColor", "Muted text"],
                  ["accent", "Accent"],
                  ["cardColor", "Card"],
                  ["borderColor", "Border"],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-zinc-300">
                    {label}
                    <input
                      type="color"
                      value={profile.theme[key]}
                      onChange={(e) => updateTheme(key, e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-5">
                <label className="text-sm text-zinc-300">
                  Card opacity: {Math.round(profile.theme.cardOpacity * 100)}%
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={profile.theme.cardOpacity}
                    onChange={(e) => updateTheme("cardOpacity", Number(e.target.value))}
                    className="mt-3 w-full accent-white"
                  />
                </label>
              </div>

              <div className="mt-5">
                <label className="text-sm text-zinc-300">
                  Corner radius: {profile.theme.radius}px
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={profile.theme.radius}
                    onChange={(e) => updateTheme("radius", Number(e.target.value))}
                    className="mt-3 w-full accent-white"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#121215] p-6">
              <h2 className="text-lg font-semibold">Your links</h2>
              <p className="mt-1 text-sm text-zinc-500">Add your social profiles and other destinations.</p>

              <div className="mt-5 space-y-3">
                {links.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-zinc-500">
                    No links yet. Add your first one below.
                  </p>
                )}

                {links.map((link) => (
                  <div key={link.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{link.title}</p>
                      <p className="truncate text-xs text-zinc-500">{link.url}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-600">{LABELS[link.kind] ?? link.kind}</p>
                    </div>
                    <button
                      onClick={() => toggleLink(link)}
                      title={link.visible ? "Hide link" : "Show link"}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                    >
                      {link.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => deleteLink(link.id)}
                      title="Delete link"
                      className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={addLink} className="mt-6 space-y-3 border-t border-white/10 pt-6">
                <h3 className="text-sm font-medium">Add a link</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <select className={fieldClass} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
                    {LINK_KINDS.map((item) => <option key={item} value={item}>{LABELS[item]}</option>)}
                  </select>
                  <input className={fieldClass} required maxLength={60} value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Link title" />
                </div>
                <input className={fieldClass} required type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
                <input className={fieldClass} maxLength={160} value={linkDescription} onChange={(e) => setLinkDescription(e.target.value)} placeholder="Short description (optional)" />
                <button type="submit" className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium hover:bg-white/5">
                  <Plus size={16} /> Add link
                </button>
              </form>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-white/10 bg-[#121215] p-6">
              <h2 className="font-semibold">Publishing</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {profile.published
                  ? "Your profile is currently published and can be visited by anyone with its link."
                  : "Your profile is not published yet. Save your changes, then publish when you're ready."}
              </p>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Status</span>
                  <span className={profile.published ? "text-emerald-300" : "text-amber-300"}>
                    {profile.published ? "Published" : "Unpublished"}
                  </span>
                </div>
                <p className="mt-2 break-all text-xs text-zinc-500">
                  {typeof window !== "undefined" ? window.location.origin : "https://horns-ruby.vercel.app"}/{profile.username}
                </p>
              </div>

              <button
                onClick={() => saveProfile()}
                disabled={saving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-medium hover:bg-white/5 disabled:opacity-50"
              >
                <Save size={16} /> Save changes
              </button>

              <button
                onClick={() => saveProfile(!profile.published)}
                disabled={saving}
                className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
              >
                {saving ? "Saving..." : profile.published ? "Unpublish profile" : "Publish profile"}
              </button>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#121215] p-6">
              <h2 className="font-semibold">Account</h2>
              <p className="mt-3 text-sm text-zinc-400">{profile.email}</p>
              <p className="mt-2 text-xs text-zinc-600">Permanent UID: {profile.uid}</p>
              <button onClick={logout} className="mt-5 flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
                <LogOut size={15} /> Sign out
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
