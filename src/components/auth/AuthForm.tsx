
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const signup = mode === "signup";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${signup ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          signup ? { username, email, password } : { email, password }
        ),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm font-bold tracking-[0.3em] text-zinc-100">
          HORNS
        </Link>

        <div className="mt-10 rounded-2xl border border-white/10 bg-[#121215] p-7 shadow-2xl sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            {signup ? "Create your identity" : "Welcome back"}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {signup ? "Join HORNS." : "Sign in."}
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            {signup
              ? "Create your profile and make it yours."
              : "Continue to your HORNS dashboard."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {signup && (
              <label className="block">
                <span className="mb-2 block text-sm text-zinc-300">Username</span>
                <input
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[A-Za-z0-9_]+"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                />
                <span className="mt-1 block text-xs text-zinc-500">
                  3–20 characters. Letters, numbers and underscores.
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm text-zinc-300">Email</span>
              <input
                required
                type="email"
                maxLength={254}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-zinc-300">Password</span>
              <input
                required
                type="password"
                minLength={signup ? 10 : 1}
                maxLength={128}
                autoComplete={signup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={signup ? "At least 10 characters" : "Your password"}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? "Please wait..." : signup ? "Create account" : "Sign in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {signup ? "Already have an account? " : "New to HORNS? "}
            <Link
              href={signup ? "/login" : "/signup"}
              className="font-medium text-white hover:underline"
            >
              {signup ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Your identity. Your page.
        </p>
      </div>
    </main>
  );
}
