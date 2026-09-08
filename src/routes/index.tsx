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
          "Instantly check your voice recordings for background noise, SNR, VAD, and LUFS loudness before publishing. Free online audio auditor for creators.",
      },
      { property: "og:title", content: "MicCheck AI - AI Audio Quality Checker & Voice Tester" },
      {
        property: "og:description",
        content:
          "Instantly check your voice recordings for background noise, SNR, VAD, and LUFS loudness before publishing. Free online audio auditor for creators.",
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
          operatingSystem: "Web",
          description:
            "AI audio checker that analyzes voice recordings for background noise, SNR, voice activity, clipping and LUFS loudness.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
              Record straight from your microphone. MicCheck AI runs the same checks a mastering
              engineer would and hands back a plain-English verdict in seconds.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/workspace"
                className="rounded-xl bg-gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Start Live Check
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
            <h2 className="text-3xl font-bold md:text-4xl">Every check, before you publish</h2>
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

        <section id="how-it-works" className="mx-auto max-w-4xl px-5 py-20">
          <h2 className="text-3xl font-bold md:text-4xl">
            How the real-time AI audio checker works
          </h2>
          <p className="mt-4 text-muted-foreground">
            MicCheck AI is a free online voice quality audit you run from the browser. Press record,
            speak for fifteen seconds, and the analyzer listens to the live waveform from your
            microphone and grades it against the specs podcast and voice-over platforms expect. Four
            measurements decide whether a take is clean or needs re-recording.
          </p>

          <div className="mt-10 space-y-8">
            <article>
              <h3 className="text-xl font-semibold">SNR — signal-to-noise ratio</h3>
              <p className="mt-2 text-muted-foreground">
                SNR compares the level of your voice with the level of the room behind it: fans,
                traffic, air conditioning, computer hum. Anything above 20 dB reads as clean;
                below that, listeners hear the room as much as they hear you.
              </p>
            </article>
            <article>
              <h3 className="text-xl font-semibold">VAD — voice activity detection</h3>
              <p className="mt-2 text-muted-foreground">
                Voice activity detection separates speech from silence across the recording, so you
                can see whether the take drags with dead air or rushes without breathing room. It
                also tells the noise measurement which parts of the file are pure room tone.
              </p>
            </article>
            <article>
              <h3 className="text-xl font-semibold">Peak level & clipping</h3>
              <p className="mt-2 text-muted-foreground">
                True-peak detection catches moments where the signal slams into the ceiling of the
                digital scale and distorts — usually plosives or a laugh. Keeping peaks at or below
                -1.0 dBFS leaves headroom for mastering and lossy encoding.
              </p>
            </article>
            <article>
              <h3 className="text-xl font-semibold">Loudness — LUFS</h3>
              <p className="mt-2 text-muted-foreground">
                Integrated loudness measures perceived volume across the whole take. The podcast
                target is around -16 LUFS; drift far from it and your episode is noticeably quieter
                or louder than everything else in a listener&apos;s feed.
              </p>
            </article>
          </div>
        </section>

        <Pricing />

      </main>

      <SiteFooter />
    </div>
  );
}
