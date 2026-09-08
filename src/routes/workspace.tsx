import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { UploadZone } from "@/components/upload-zone";
import { Analyzing } from "@/components/analyzing";
import { Recorder } from "@/components/recorder";
import { AuditReport } from "@/components/audit-report";
import { buildReport, type Report } from "@/lib/analysis";

export const Route = createFileRoute("/workspace")({
  component: Workspace,
  head: () => ({
    meta: [
      { title: "Live Voice Quality Audit Workspace | MicCheck AI" },
      {
        name: "description",
        content:
          "Record your voice or upload a file and get an instant audit of SNR, voice activity, true peak and LUFS loudness.",
      },
      { property: "og:title", content: "Live Voice Quality Audit Workspace | MicCheck AI" },
      {
        property: "og:description",
        content: "Instant voice quality audit: SNR, voice activity, true peak and LUFS.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://miccheck-pro-audio.lovable.app/workspace" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://miccheck-pro-audio.lovable.app/workspace" }],
  }),
});

type Stage = { kind: "idle" } | { kind: "analyzing"; file: string; size: number } | { kind: "done"; report: Report };

function Workspace() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [remaining, setRemaining] = useState(3);
  const [mode, setMode] = useState<"record" | "upload">("record");

  const finish = useCallback(() => {
    setStage((s) => {
      if (s.kind !== "analyzing") return s;
      return { kind: "done", report: buildReport(s.file, s.size) };
    });
    setRemaining((r) => Math.max(0, r - 1));
  }, []);

  const startAnalysis = (name: string, size: number) => {
    if (remaining > 0) setStage({ kind: "analyzing", file: name, size });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Voice quality audit workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Record a take or upload a file and get a publish-or-re-record verdict in seconds.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
            <Zap className="size-3.5 text-accent" /> Free plan
          </span>
        </header>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
          <p className="text-sm">
            <span className="font-semibold">{remaining} free analyses remaining</span>
            <span className="text-muted-foreground"> this month. Upgrade to Pro.</span>
          </p>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Sparkles className="size-3.5" /> Upgrade to Pro for unlimited checks
          </a>
        </div>

        {stage.kind === "idle" && (
          <>
            <div className="mb-6 inline-flex rounded-xl border border-border bg-secondary p-1 text-sm">
              {(["record", "upload"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
                    mode === m
                      ? "bg-gradient-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "record" ? "Record live" : "Upload a file"}
                </button>
              ))}
            </div>
            {mode === "record" ? (
              <Recorder
                onReady={startAnalysis}
                onReset={() => setStage({ kind: "idle" })}
                disabled={remaining === 0}
              />
            ) : (
              <UploadZone onFile={startAnalysis} />
            )}
          </>
        )}
        {stage.kind === "analyzing" && <Analyzing fileName={stage.file} onDone={finish} />}
        {stage.kind === "done" && (
          <AuditReport
            report={stage.report}
            onReset={() => {
              setMode("record");
              setStage({ kind: "idle" });
            }}
          />
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
