import React, { useState, useEffect } from "react";
import { CheckCircle2, Sparkles, Upload, Volume2, ShieldAlert, BarChart3 } from "lucide-react";

export default function Workspace() {
  const [isPro, setIsPro] = useState(false);
  const [remaining, setRemaining] = useState(3);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. Détection et sauvegarde du statut Pro
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

    // 2. Réinitialisation mensuelle des 3 crédits gratuits
    const currentMonth = new Date().toISOString().slice(0, 7);
    const savedMonth = localStorage.getItem("miccheck_last_usage_month");

    if (savedMonth !== currentMonth) {
      localStorage.setItem("miccheck_last_usage_month", currentMonth);
      localStorage.setItem("miccheck_usage_count", "0");
      setRemaining(3);
    } else {
      const used = parseInt(localStorage.getItem("miccheck_usage_count") || "0", 10);
      setRemaining(Math.max(0, 3 - used));
    }
  }, []);

  const handleSwitchToFree = () => {
    sessionStorage.removeItem("miccheck_is_pro");
    setIsPro(false);
  };

  const handleAnalyzeAudio = () => {
    if (!isPro) {
      if (remaining <= 0) {
        alert("You have reached your limit of 3 free analyses for this month. Upgrade to Pro for unlimited audits!");
        return;
      }
      const newUsed = parseInt(localStorage.getItem("miccheck_usage_count") || "0", 10) + 1;
      localStorage.setItem("miccheck_usage_count", newUsed.toString());
      setRemaining(Math.max(0, 3 - newUsed));
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Audio Quality Workspace</h1>
          <p className="text-muted-foreground text-sm">
            Analyze your voice clarity, background noise, peak levels, and compliance.
          </p>
        </header>

        {/* Banner de statut dynamique */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
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

        {/* Section Zone de Dépose / Audit */}
        <section className="border-2 border-dashed border-border rounded-2xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors bg-card">
          <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Upload className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Upload your audio file</h3>
            <p className="text-xs text-muted-foreground mt-1">Supports WAV, MP3, M4A up to 50MB</p>
          </div>
          <button
            onClick={handleAnalyzeAudio}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <BarChart3 className="size-4" />
            Start Quality Audit
          </button>
        </section>

        {/* Section Fonctionnalités & Cartes d'Analyse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Volume2 className="size-4" />
              <span>Loudness & Peaks</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Calculates integrated LUFS and peak levels to ensure broadcast and podcast standards compliance.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
            <div className="flex items-center gap-2 text-primary font-medium">
              <ShieldAlert className="size-4" />
              <span>Noise Floor & Clarity</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Detects room hum, background noise, clipping distortion, and overall speech clarity score.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
