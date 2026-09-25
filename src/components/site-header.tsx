import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AudioLines, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const [isPro, setIsPro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Étape 1 : Vérification synchrone du statut Pro côté client uniquement
    const checkProStatus = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hasProUrl =
        urlParams.get("pro") === "true" ||
        urlParams.get("success") === "true" ||
        Boolean(urlParams.get("license")) ||
        Boolean(urlParams.get("license_key")) ||
        Boolean(urlParams.get("key"));

      const localPro = localStorage.getItem("miccheck_is_pro") === "true";
      const sessionPro = sessionStorage.getItem("miccheck_is_pro") === "true";

      if (hasProUrl) {
        localStorage.setItem("miccheck_is_pro", "true");
        setIsPro(true);
      } else {
        setIsPro(localPro || sessionPro);
      }
    };

    checkProStatus();
    setMounted(true); // Signale que l'hydratation client est terminée

    // Étape 2 : Écouteur pour les mises à jour en direct
    window.addEventListener("storage", checkProStatus);
    return () => window.removeEventListener("storage", checkProStatus);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <AudioLines className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold">MicCheck AI</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#features" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="/#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Rendu conditionnel strict post-hydratation pour bloquer tout flash */}
          {!mounted ? (
            // Placeholder invisible de la même taille exacte pendant les 50ms d'hydratation
            <div className="h-9 w-28 rounded-xl bg-secondary/50 animate-pulse" />
          ) : isPro ? (
            <Link
              to="/workspace"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-sm transition-all hover:bg-amber-500/20"
            >
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Pro Workspace</span>
            </Link>
          ) : (
            <Link
              to="/workspace"
              className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Try for free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
