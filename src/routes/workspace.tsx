import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Sparkles, Zap, CheckCircle2 } from "lucide-react";
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
  const [remaining, setRemaining] = useState<number>(3);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<"record" | "upload">("record");

  // Synchronisation au montage : statut Pro et crédits mensuels
  useEffect(() => {
    setIsMounted(true);

    // 1. Détection du statut Pro
    const urlParams = new URLSearchParams(window.location.search);
    const hasProParam = urlParams.get("pro") === "true";

    if (hasProParam) {
      sessionStorage.setItem("miccheck_is_pro", "true");
      setIsPro(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const savedPro = sessionStorage.getItem("miccheck_is_pro");
      setIsPro(savedPro === "true");
    }

    // 2. Gestion stricte de la réinitialisation mensuelle
    const currentMonth = new Date().toISOString().slice(0, 7); // Ex: "2026-09"
    const savedMonth = localStorage.getItem("miccheck_last_usage_month");
    const rawUsed = localStorage.getItem("miccheck_usage_count");

    if (!savedMonth) {
      // Première utilisation absolue : on initialise le mois et le compteur existant s'il existe
      localStorage.setItem("miccheck_last_usage_month", currentMonth);
      const used = parseInt(rawUsed || "0", 10);
      setRemaining(Math.max(0, 3 - used));
    } else if (savedMonth !== currentMonth) {
      // Le mois a REELLEMENT changé : réinitialisation à 0
      localStorage.setItem("miccheck_last_usage_month", currentMonth);
      localStorage.setItem("miccheck_usage_count", "0");
      setRemaining(3);
    } else {
      // Même mois : lecture stricte de la consommation actuelle
      const used = parseInt(rawUsed || "0", 10);
      setRemaining(Math.max(0, 3 - used));
    }
  }, []);

  const finish = useCallback(() => {
    setStage((s) => {
      if (s.kind !== "analyzing") return s;
      return { kind: "done", report: buildReport(s.file, s.size) };
    });
  }, []);

  const startAnalysis = (name: string, size: number) => {
    if (isPro) {
      setStage({ kind: "analyzing", file: name, size });
      return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const used = parseInt(localStorage.getItem("miccheck_usage_count") || "0", 10);
    const currentRemaining = Math.max(0, 3 - used);

    if (currentRemaining <= 0) {
      setRemaining(0);
      return;
    }

    const nextUsed = used + 1;
    localStorage.setItem("miccheck_last_usage_month", currentMonth);
    localStorage.setItem("miccheck_usage_count", nextUsed.toString());
    setRemaining(Math.max(0, 3 - nextUsed));

    setStage({ kind: "analyzing", file: name, size });
  };

  const handleSwitchToFree = () => {
    sessionStorage.removeItem("miccheck_is_pro");
    setIsPro(false);
  };

  const isLimitReached = isMounted && !isPro && remaining === 0;

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
            {isPro ? (
              <>
                <Sparkles className="size-3.5 text-primary" /> Pro Plan
              </>
            ) : (
              <>
                <Zap className="size-3.5 text-accent" /> Free plan
              </>
            )}
          </span>
        </header>

        {/* Banner de statut */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
          {isPro ? (
            <>
              <p className="text-sm font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="size-4" /> Pro Member — Unlimited voice quality audits active
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-bold text-primary border border-primary/30">
                  <CheckCircle2 className="size-3.5" /> Already Subscribed
                </span>
                <button
                  onClick={handleSwitchToFree}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
                >
                  Revenir au plan Gratuit
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm">
                <span className="font-semibold">
                  {isMounted ? remaining : "..."} free analyses remaining
                </span>
                <span className="text-muted-foreground"> this month. Upgrade to Pro.</span>
              </p>
              <a
                href="https://miccheckai.gumroad.com/l/pro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Sparkles className="size-3.5" /> Upgrade to Pro for unlimited checks
              </a>
            </>
          )}
        </div>

        {stage.kind === "idle" && (
          <>
            <div className="mb-6 inline-flex rounded-xl border border-border bg-secondary p-1 text-sm">
              {(["record", "upload"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
                    isLimitReached ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  } ${
                    mode === m
                      ? "bg-gradient-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={isLimitReached ? "No remaining free checks" : undefined}
                >
                  {m === "record" ? "Record live" : "Upload a file"}
                </button>
              ))}
            </div>
            {mode === "record" ? (
              <Recorder
                onReady={startAnalysis}
                onReset={() => setStage({ kind: "idle" })}
                disabled={!isMounted || isLimitReached}
              />
            ) : (
              <UploadZone
                disabled={!isMounted || isLimitReached}
                onFile={(name, size) => {
                  if (isPro || remaining > 0) startAnalysis(name, size);
                }}
              />
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

        {isLimitReached && stage.kind === "idle" && (
          <p className="mt-6 text-center text-sm font-medium text-destructive">
            You've used all 3 free checks this month. Upgrade to Pro to keep analyzing.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
