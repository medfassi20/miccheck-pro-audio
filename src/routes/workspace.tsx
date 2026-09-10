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

  // Synchronisation au montage : vérification du statut Pro et des crédits
  useEffect(() => {
    // 1. Détection du retour d'achat Gumroad via l'URL (?pro=true)
    const urlParams = new URLSearchParams(window.location.search);
    const hasProParam = urlParams.get("pro") === "true";

    if (hasProParam) {
      localStorage.setItem("miccheck_is_pro", "true");
      setIsPro(true);
      // Nettoie proprement le paramètre de la barre d'adresse
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const savedPro = localStorage.getItem("miccheck_is_pro");
      if (savedPro === "true") {
        setIsPro(true);
      }
    }

    // 2. Gestion des crédits gratuits
    const savedCredits = localStorage.getItem("miccheck_free_credits");
    if (savedCredits !== null) {
      setRemaining(parseInt(savedCredits, 10));
    } else {
      localStorage.setItem("miccheck_free_credits", "3");
    }

    setIsMounted(true);
  }, []);

  const finish = useCallback(() => {
    setStage((s) => {
      if (s.kind !== "analyzing") return s;
      return { kind: "done", report: buildReport(s.file, s.size) };
    });
  }, []);

  const startAnalysis = (name: string, size: number) => {
    // Si l'utilisateur est Pro, accès illimité sans décompte
    if (isPro) {
      setStage({ kind: "analyzing", file: name, size });
      return;
    }

    const currentSaved = localStorage.getItem("miccheck_free_credits");
    const actualRemaining = currentSaved !== null ? parseInt(currentSaved, 10) : remaining;

    if (actualRemaining <= 0) {
      setRemaining(0);
      return;
    }

    const nextCount = actualRemaining - 1;
    setRemaining(nextCount);
    localStorage.setItem("miccheck_free_credits", nextCount.toString());

    setStage({ kind: "analyzing", file: name, size });
  };

  // Bloqué uniquement si non-Pro ET crédits épuisés
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
              {/* Bouton de réinitialisation de session Pro */}
              <button
                onClick={() => {
                  localStorage.removeItem("miccheck_is_pro");
                  setIsPro(false);
                  window.location.reload();
                }}
                className="text-xs text-muted-foreground underline hover:text-foreground transition-colors cursor-pointer"
                title="Click if you canceled your subscription on Gumroad to update local status"
              >
                Reset session
              </button>
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
