import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Clock, RotateCcw, XCircle, Download, Lock, Sparkles } from "lucide-react";
import type { Report } from "@/lib/analysis";

const stateStyles = {
  good: { bar: "bg-success", text: "text-success", label: "Pass" },
  warn: { bar: "bg-warning", text: "text-warning", label: "Check" },
  bad: { bar: "bg-destructive", text: "text-destructive", label: "Fail" },
} as const;

export function AuditReport({ report, onReset }: { report: Report; onReset: () => void }) {
  const pass = report.verdict === "pass";
  const [isPro, setIsPro] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const localPro = localStorage.getItem("miccheck_is_pro") === "true";
    const sessionPro = sessionStorage.getItem("miccheck_is_pro") === "true";
    setIsPro(localPro || sessionPro);
  }, []);

  const handleDownloadPDF = async () => {
    if (!isPro) return;
    setIsGeneratingPdf(true);
    try {
      // Déclenche l'impression/sauvegarde du rapport au format PDF
      window.print();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`glass rounded-3xl p-8 ${pass ? "border-success/40" : "border-destructive/40"}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
                pass ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
              }`}
            >
              {pass ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
              {report.headline}
            </span>
            <h2 className="mt-4 truncate text-2xl font-bold">{report.fileName}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" /> {report.duration} · analyzed just now
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Quality score</p>
              <p className="font-display text-5xl font-bold text-gradient">{report.overall}</p>
            </div>

            {/* Bouton Export PDF Pro */}
            {isPro ? (
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="size-3.5" />
                {isGeneratingPdf ? "Generating PDF..." : "Export PDF Report"}
              </button>
            ) : (
              <a
                href="/#pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/80 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                title="Upgrade to Pro to export PDF reports"
              >
                <Lock className="size-3.5 text-amber-500" />
                <span>Export PDF</span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                  PRO
                </span>
              </a>
            )}
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm text-muted-foreground">{report.summary}</p>

        {/* Message d'incitation Pro si compte gratuit */}
        {!isPro && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500 shrink-0" />
              <span>Need official audio quality validation for clients or podcasts?</span>
            </div>
            <a
              href="/#pricing"
              className="font-bold underline hover:no-underline text-amber-600 dark:text-amber-400"
            >
              Get Pro for PDF Exports →
            </a>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-8">
        <h3 className="text-lg font-semibold">Detailed breakdown</h3>
        <div className="mt-6 space-y-6">
          {report.metrics.map((m) => {
            const s = stateStyles[m.state];
            return (
              <div key={m.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium">{m.label}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`font-semibold ${s.text}`}>{m.value}</span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      target {m.target}
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${s.bar}`}
                    style={{ width: `${Math.max(4, Math.min(100, m.score))}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{m.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-3xl p-8">
        <h3 className="text-lg font-semibold">Flagged moments</h3>
        <ul className="mt-5 space-y-3">
          {report.issues.map((issue, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3"
            >
              <AlertTriangle
                className={`size-5 shrink-0 ${
                  issue.level === "bad" ? "text-destructive" : "text-warning"
                }`}
              />
              <p className="text-sm">
                <span className="font-mono font-semibold">{issue.time}</span>
                <span className="text-muted-foreground"> — {issue.text}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onReset}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 cursor-pointer ${
          pass
            ? "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
            : "bg-destructive text-destructive-foreground shadow-glow ring-2 ring-destructive/40"
        }`}
      >
        <RotateCcw className="size-4" /> {pass ? "Analyze another take" : "Re-record now"}
      </button>
    </div>
  );
}
