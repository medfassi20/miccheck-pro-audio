import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AudioLines, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  // 1. Initialisation SYNCHRONE : Élimine le flash "Try for free" au chargement
  const [isPro, setIsPro] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;

    // Vérification prioritaire si un paramètre Gumroad est dans l'URL
    const params = new URLSearchParams(window.location.search);
    const hasProParam =
      params.get("pro") === "true" ||
      params.get("success") === "true" ||
      Boolean(params.get("license")) ||
      Boolean(params.get("license_key"));

    if (hasProParam) return true;

    // Vérification du stockage local et de session
    const localPro = localStorage.getItem("miccheck_is_pro") === "true";
    const sessionPro = sessionStorage.getItem("miccheck_is_pro") === "true";
    return localPro || sessionPro;
  });

  useEffect(() => {
    // Synchronisation en cas de changement dans d'autres onglets
    const checkProStatus = () => {
      const localPro = localStorage.getItem("miccheck_is_pro") === "true";
      const sessionPro = sessionStorage.getItem("miccheck_is_pro") === "true";
      setIsPro(localPro || sessionPro);
    };

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

        {/* Section actions avec le bouton Dark/Light Mode */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Affichage instantané selon le statut Pro */}
          {isPro ? (
            <Link
              to="/workspace"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-sm transition-all hover:bg-amber-500/20"
            >
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Pro Access</span>
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
