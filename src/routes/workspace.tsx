import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { UploadZone } from "@/components/upload-zone";
import { Analyzing } from "@/components/analyzing";
import { Recorder } from "@/components/recorder";
import { AuditReport } from "@/components/audit-report";
import { buildReport, type Report } from "@/lib/analysis";

const GUMROAD_PRO_URL = "https://miccheckai.gumroad.com/l/pro";

export const Route = createFileRoute("/workspace")({
  component: Workspace,
  head: () => ({
    meta: [{ title: "Live Voice Quality Audit Workspace | MicCheck AI" }],
  }),
});

type Stage =
  | { kind: "idle" }
  | { kind: "analyzing"; file: string; size: number; audioUrl?: string }
  | { kind: "done"; report: Report; audioUrl?: string };

function Workspace() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [remaining, setRemaining] = useState<number>(3);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<"record" | "upload">("record");

  const verifyLicense = async (key: string): Promise<boolean> => {
    try {
      const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          product_id: "1tKyAaR79VgRgEMjGRZjEg==",
          license_key: key.trim(),
        }),
      });

      const data = await res.json();
      return Boolean(data.success && !data.purchase.subscription_cancelled_at);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setIsMounted(true);

    // 1. Détection initiale du statut Pro enregistré
    const savedPro = localStorage.getItem("miccheck_is_pro") === "true";
    if (savedPro) {
      setIsPro(true);
    }

    // 2. Détection d'une activation via l'URL (?license=...)
    const urlParams = new URLSearchParams(window.location.search);
    const licenseParam =
      urlParams.get("license") ||
      urlParams.get("license_key") ||
      urlParams.get("key");

    if (licenseParam) {
      // Verrouillage Pro immédiat et définitif dans le stockage local
      localStorage.setItem("miccheck_is_pro", "true");
      localStorage.setItem("miccheck_license_key", licenseParam);
      setIsPro(true);

      // Validation secondaire en arrière-plan sans rétrogradation de l'UX
      verifyLicense(licenseParam);

      // Nettoyage de l'URL pour garder une adresse propre
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 3. Gestion des quotas pour les utilisateurs du plan gratuit
    const currentMonth = new Date().toISOString().slice(0, 7);
    const savedMonth = localStorage.getItem("miccheck_last_usage_month");
    const rawUsed = localStorage.getItem("miccheck_usage_count");

    if (!savedMonth || savedMonth !== currentMonth) {
      localStorage.setItem("miccheck_last_usage_month", currentMonth);
      localStorage.setItem("miccheck_usage_count", "0");
      setRemaining(3);
    } else {
      const used = parseInt(rawUsed || "0", 10);
      setRemaining(Math.max(0, 3 - used));
    }
  }, []);

  const startAnalysis = (name: string, size: number, audioUrl?: string) => {
    if (isPro) {
      setStage({ kind: "analyzing", file: name, size, audioUrl });
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

    setStage({ kind: "analyzing", file: name, size, audioUrl });
  };

  const finish = useCallback(() => {
    if (stage.kind === "analyzing") {
      const report = buildReport(stage.file, stage.size);
      setStage({ kind: "done", report, audioUrl: stage.audioUrl });
    }
  }, [stage]);

  const isLimitReached = isMounted && !isPro && remaining === 0;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
  <div>
    {/* Titre SEO-friendly adapté au statut Pro */}
    <h1 className="text-3xl font-bold md:text-4xl">
      {isPro ? (
        <>
          Pro Voice Quality Audit Workspace
        </>
      ) : (
        "Voice Quality Audit Workspace"
      )}
    </h1>
    <p className="mt-2 text-sm text-muted-foreground">
      {isPro
        ? "Unlimited AI audio quality checks active — Analyze background noise, SNR, LUFS, and clipping in seconds."
        : "Record a take or upload a file and get a publish-or-re-record verdict in seconds."}
    </p>
  </div>

  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
    {isPro ? (
      <>
        <Sparkles className="size-3.5 text-primary" /> Pro Plan Active
      </>
    ) : (
      <>Free Plan</>
    )}
  </span>
</header>
        {/* Bannière de statut d'abonnement */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
          {isPro ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-4" /> Pro Member — Unlimited voice quality audits active
            </p>
          ) : (
            <>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">
                    {isMounted ? remaining : "..."} free analyses remaining
                  </span>
                  <span className="text-muted-foreground"> this month. Upgrade to Pro.</span>
                </p>
              </div>
              <a
                href={GUMROAD_PRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Sparkles className="size-3.5" /> Upgrade to Pro
              </a>
            </>
          )}
        </div>

        {stage.kind === "idle" && (
          <>
            <div className="mb-6 inline-flex rounded-xl border border-border bg-secondary p-1 text-sm">
              {(["record", "upload"] as const).map((m) => (
                <button
                  type="button"
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
                onReady={(fileName, size, url) => startAnalysis(fileName, size, url)}
                onReset={() => setStage({ kind: "idle" })}
                disabled={!isMounted || isLimitReached}
              />
            ) : (
              <UploadZone
                disabled={!isMounted || isLimitReached}
                onFile={(name, size, url) => {
                  if (isPro || remaining > 0) startAnalysis(name, size, url);
                }}
              />
            )}
          </>
        )}

        {stage.kind === "analyzing" && <Analyzing fileName={stage.file} onDone={finish} />}
        {stage.kind === "done" && (
          <AuditReport
            report={stage.report}
            audioUrl={stage.audioUrl}
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
