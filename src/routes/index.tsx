import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AudioLines, Gauge, ShieldCheck, Waves } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Pricing } from "@/components/pricing";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "MicCheck AI - AI Audio Quality Checker & Voice Tester" },
      {
        name: "description",
        content:
          "Instantly check your voice recordings for background noise, SNR, VAD, and LUFS loudness before publishing.",
      },
      { property: "og:title", content: "MicCheck AI - AI Audio Quality Checker & Voice Tester" },
      {
        property: "og:description",
        content:
          "Instantly check your voice recordings for background noise, SNR, VAD, and LUFS loudness before publishing.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://miccheck-pro-audio.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://miccheck-pro-audio.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "MicCheck AI",
          applicationCategory: "MultimediaApplication",
          description:
            "AI audio checker for podcasters and voice-over artists: SNR, VAD, true peak and LUFS.",
          offers: [
            { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
            { "@type": "Offer", price: "9", priceCurrency: "USD", name: "Pro" },
          ],
        }),
      },
    ],
  }),
});

const features = [
  {
    icon: Waves,
    title: "Noise floor & SNR",
    body: "We separate your voice from room tone and hum, and tell you exactly when the noise wins.",
  },
  {
    icon: Activity,
    title: "Voice activity mapping",
    body: "Speech-vs-silence ratio so you know if the take drags or feels rushed.",
  },
  {
    icon: Gauge,
    title: "Peaks & LUFS",
    body: "True-peak clipping detection and integrated loudness against the -16 LUFS podcast target.",
  },
  {
    icon: ShieldCheck,
    title: "One clear verdict",
    body: "Ready to publish, or re-record — with timestamps for every flagged moment.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="hero-glow relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-5 pb-24 pt-24 text-center md:pt-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs text-muted-foreground">
              <AudioLines className="size-3.5 text-accent" /> AI audio QA for creators
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] md:text-6xl">
              Instantly analyze your audio for{" "}
              <span className="text-gradient">background noise, clipping and loudness</span> before
              you publish.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Drop in an MP3 or WAV. MicCheck AI runs the same checks a mastering engineer would and
              hands back a plain-English verdict in seconds.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/workspace"
                className="rounded-xl bg-gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Try for free — upload a file
              </Link>
              <a
                href="#pricing"
                className="rounded-xl border border-border bg-secondary px-7 py-3.5 font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5"
              >
                See pricing
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              3 free analyses every month. No credit card.
            </p>

            <div className="mt-16 flex h-24 items-end justify-center gap-1.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-primary"
                  style={{
                    height: `${15 + Math.abs(Math.sin(i * 0.45)) * 85}%`,
                    opacity: 0.25 + Math.abs(Math.sin(i * 0.45)) * 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Every check, before the upload</h2>
            <p className="mt-3 text-muted-foreground">
              Four passes over your waveform, one honest answer.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass rounded-3xl p-6 transition-transform hover:-translate-y-1"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                  <f.icon className="size-5 text-primary-foreground" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Pricing />
      </main>

      <SiteFooter />
    </div>
  );
}
