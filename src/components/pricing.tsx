import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Enough to sanity-check the episodes that matter.",
    features: [
      "3 analyses per month",
      "SNR, peak & loudness checks",
      "Pass / re-record verdict",
      "Files up to 30 minutes",
    ],
    cta: "Start analyzing",
    highlight: false,
    href: "/workspace",
  },
  {
    name: "Pro",
    price: "$9",
    cadence: "per month",
    blurb: "For weekly shows and client voice-over delivery.",
    features: [
      "Unlimited analyses",
      "Advanced noise reports with timestamps",
      "Per-platform loudness targets",
      "Batch uploads & export to PDF",
      "Priority processing",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
    href: "https://miccheckai.gumroad.com/l/pro",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Simple pricing</h2>
        <p className="mt-3 text-muted-foreground">
          Start free. Upgrade when checking your audio becomes part of the routine.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-3xl p-8 transition-transform hover:-translate-y-1 ${
              tier.highlight
                ? "glass border-primary/40 shadow-glow"
                : "glass"
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-8 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Sparkles className="size-3" /> Most popular
              </span>
            )}
            <h3 className="text-xl font-semibold">{tier.name} Tier</h3>
            <p className="mt-1 text-sm text-muted-foreground">{tier.blurb}</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold">{tier.price}</span>
              <span className="text-sm text-muted-foreground">{tier.cadence}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              {...(tier.highlight ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`mt-8 inline-block text-center rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                tier.highlight
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "border border-border bg-secondary text-secondary-foreground"
              }`}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
