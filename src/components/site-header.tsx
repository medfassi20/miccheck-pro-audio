import { Link } from "@tanstack/react-router";
import { AudioLines } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle"; // Import du composant

export function SiteHeader() {
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
          <Link
            to="/workspace"
            className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Try for free
          </Link>
        </div>
      </div>
    </header>
  );
}
