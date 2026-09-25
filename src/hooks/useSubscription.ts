import { useState, useEffect } from "react";

const PRO_KEY = "miccheck_is_pro";
const LICENSE_KEY = "miccheck_license_key";
const USAGE_KEY = "miccheck_free_usage";
const RESET_DATE_KEY = "miccheck_usage_reset_date";

export function useSubscription() {
  // 1. LECTURE SYNCHRONE : Évite le flash de Free vers Pro au chargement
  const [isPro, setIsPro] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;

    // Détection d'un paramètre d'URL venant de Gumroad (?pro=true ou ?license=...)
    const params = new URLSearchParams(window.location.search);
    if (params.get("pro") === "true" || params.get("license") || params.get("success") === "true") {
      localStorage.setItem(PRO_KEY, "true");
      if (params.get("license")) {
        localStorage.setItem(LICENSE_KEY, params.get("license")!);
      }
      return true;
    }

    return localStorage.getItem(PRO_KEY) === "true";
  });

  const [usageCount, setUsageCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    
    // Vérification du Reset Mensuel (30 jours)
    const lastReset = localStorage.getItem(RESET_DATE_KEY);
    const now = new Date().getTime();
    
    if (!lastReset || now - parseInt(lastReset, 10) > 30 * 24 * 60 * 60 * 1000) {
      localStorage.setItem(USAGE_KEY, "0");
      localStorage.setItem(RESET_DATE_KEY, now.toString());
      return 0;
    }

    return parseInt(localStorage.getItem(USAGE_KEY) || "0", 10);
  });

  // Nettoyage de l'URL si on est arrivé via un lien de confirmation Gumroad
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pro") || params.get("license") || params.get("success")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Action : Basculer vers le Plan Gratuit
  const returnToFree = () => {
    localStorage.removeItem(PRO_KEY);
    localStorage.removeItem(LICENSE_KEY);
    setIsPro(false);
  };

  // Action : Consommer un essai gratuit (retourne false si limite atteinte)
  const consumeFreeTrial = (): boolean => {
    if (isPro) return true; // Illimité pour les Pro

    if (usageCount >= 3) {
      return false; // Bloqué : 3 essais épuisés
    }

    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem(USAGE_KEY, newCount.toString());
    return true;
  };

  const remainingTrials = Math.max(0, 3 - usageCount);

  return {
    isPro,
    remainingTrials,
    usageCount,
    returnToFree,
    consumeFreeTrial,
  };
}
