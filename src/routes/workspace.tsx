import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VoiceRecorder } from "@/components/voice-recorder";
import { Analyzing } from "@/components/analyzing";
import { AuditReport } from "@/components/audit-report";
import { buildReport, type Report } from "@/lib/analysis";

export const Route = createFileRoute("/workspace")({
  component: Workspace,
  head: () => ({
    meta: [
      { title: "Live Voice Check — Record & Audit Your Audio | MicCheck AI" },
      {
        name: "description",
        content:
          "Record straight from your microphone and get an instant audit of background noise, SNR, voice activity, clipping and LUFS loudness.",
      },
      { property: "og:title", content: "Live Voice Check — Record & Audit Your Audio | MicCheck AI" },
      {
        property: "og:description",
        content: "Instant voice quality audit: SNR, voice activity, true peak and LUFS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://miccheck-pro-audio.lovable.app/workspace" }],
  }),
});

type Stage = { kind: "idle" } | { kind: "analyzing"; file: string; size: number } | { kind: "done"; report: Report };


function Workspace() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [remaining, setRemaining] = useState(3);

  const finish = useCallback(() => {
    setStage((s) => {
      if (s.kind !== "analyzing") return s;
      return { kind: "done", report: buildReport(s.file, s.size) };
    });
    setRemaining((r) => Math.max(0, r - 1));
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a take and get a publish-or-re-record verdict in seconds.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
            <Zap className="size-3.5 text-accent" /> Free plan
          </span>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
          <p className="text-sm">
            <span className="font-semibold">{remaining} free analyses remaining</span>
            <span className="text-muted-foreground"> this month.</span>
          </p>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Sparkles className="size-3.5" /> Upgrade to Pro for unlimited checks
          </a>
        </div>

        {stage.kind === "idle" && (
          <VoiceRecorder
            disabled={remaining === 0}
            onComplete={(label, seed) =>
              remaining > 0 ? setStage({ kind: "analyzing", file: label, size: seed }) : undefined
            }
          />
        )}
        {stage.kind === "analyzing" && <Analyzing fileName={stage.file} onDone={finish} />}
        {stage.kind === "done" && (
          <AuditReport report={stage.report} onReset={() => setStage({ kind: "idle" })} />
        )}

        {remaining === 0 && stage.kind === "idle" && (
          <p className="mt-6 text-center text-sm text-destructive">
            You've used all 3 free checks this month. Upgrade to Pro to keep analyzing.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
