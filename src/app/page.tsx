
const features = [
  {
    number: "01",
    title: "Your identity",
    description:
      "Claim your own username and permanent HORNS identity. Make your profile unmistakably yours.",
  },
  {
    number: "02",
    title: "Make it yours",
    description:
      "Customize colors, typography, backgrounds, effects and the little details that matter.",
  },
  {
    number: "03",
    title: "All your links",
    description:
      "Bring your social accounts, projects and favorite destinations together in one place.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Everything you need to get started.",
    features: [
      "Personal profile",
      "Custom social links",
      "Profile customization",
      "Standard username",
    ],
  },
  {
    name: "HORNS+",
    price: "Coming soon",
    description: "More ways to express yourself.",
    features: [
      "Everything in Free",
      "Exclusive profile effects",
      "Premium badges",
      "Advanced customization",
      "2-character usernames",
    ],
    featured: true,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090909] text-white selection:bg-white selection:text-black">
      {/* Navigation */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <a href="/" className="text-2xl font-black tracking-[0.28em]">
          HORNS
        </a>

        <nav className="hidden items-center gap-9 text-sm text-white/55 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden rounded-full px-5 py-2.5 text-sm text-white/70 transition hover:text-white sm:block"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85"
          >
            Get started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-28 pt-24 text-center lg:px-10 lg:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-10 -z-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.045] blur-[130px]" />

        <div className="relative">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs tracking-wide text-white/55">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            YOUR SPACE. YOUR IDENTITY.
          </span>

          <h1 className="max-w-4xl text-6xl font-semibold leading-[1.05] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            More than a
            <br />
            <span className="text-white/40">profile.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
            A place for everything that makes you, you. Bring your links,
            identity and creativity together with HORNS.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.03] hover:bg-white/85"
            >
              Create your profile ↗
            </a>
            <a
              href="#features"
              className="rounded-full border border-white/10 px-8 py-3.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Explore HORNS
            </a>
          </div>
        </div>

        {/* Profile preview */}
        <div className="relative mt-24 w-full max-w-2xl">
          <div className="absolute inset-0 rounded-[32px] bg-white/[0.06] blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#101010] p-5 text-left shadow-2xl sm:p-8">
            <div className="h-36 rounded-2xl border border-white/5 bg-gradient-to-br from-[#292929] via-[#171717] to-[#0d0d0d] sm:h-48" />

            <div className="relative -mt-10 flex items-end justify-between px-4 sm:-mt-12 sm:px-6">
              <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-[#101010] bg-[#292929] text-2xl font-bold sm:h-24 sm:w-24">
                H
              </div>
              <span className="mb-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] tracking-widest text-white/50">
                PROFILE PREVIEW
              </span>
            </div>

            <div className="px-4 pb-3 pt-4 sm:px-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Your Name
              </h2>
              <p className="mt-1 text-sm text-white/35">@yourusername</p>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">
                Your little corner of the internet. Put your world here.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Website", "Socials", "Projects"].map((item) => (
                  <span
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs text-white/65"
                  >
                    {item} ↗
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-white/25">
            A glimpse of what's possible with HORNS.
          </p>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24 lg:px-10"
      >
        <div className="mb-14 max-w-xl">
          <p className="text-xs font-semibold tracking-[0.25em] text-white/35">
            WHAT MAKES HORNS
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Your space.
            <br />
            Your rules.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]"
            >
              <span className="text-xs tracking-widest text-white/30">
                {feature.number}
              </span>
              <h3 className="mt-12 text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/40">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="rounded-[28px] border border-white/[0.08] bg-[#101010] px-7 py-16 text-center sm:px-16">
          <p className="text-xs tracking-[0.25em] text-white/35">
            THE HORNS EXPERIENCE
          </p>
          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            The internet knows your links.
            <span className="text-white/35"> Make it know you.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-white/40">
            HORNS is built around personal expression. One identity, one
            destination, endless possibilities.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24 lg:px-10"
      >
        <div className="mb-14 text-center">
          <p className="text-xs tracking-[0.25em] text-white/35">
            SIMPLE PLANS
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Choose your experience.
          </h2>
          <p className="mt-4 text-sm text-white/40">
            Start free. Upgrade when you're ready.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.featured
                  ? "border-white/30 bg-white/[0.055]"
                  : "border-white/[0.08] bg-white/[0.025]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold tracking-widest text-black">
                    PLUS
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-white/40">
                {plan.description}
              </p>

              <p className="mt-8 text-3xl font-semibold tracking-tight">
                {plan.price}
              </p>

              <div className="my-8 h-px bg-white/10" />

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-white/65"
                  >
                    <span className="text-white/40">✦</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className={`mt-10 block rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-white text-black hover:bg-white/85"
                    : "border border-white/15 text-white hover:bg-white/10"
                }`}
              >
                {plan.featured ? "Coming soon" : "Get started"}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-white/[0.08] px-6 py-9 text-xs text-white/30 sm:flex-row lg:px-10">
        <a href="/" className="font-black tracking-[0.28em] text-white/70">
          HORNS
        </a>
        <p>© {new Date().getFullYear()} HORNS. Your space. Your identity.</p>
        <a href="#top" className="transition hover:text-white">
          Back to top ↑
        </a>
      </footer>
    </main>
  );
}
