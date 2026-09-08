import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { CHECKS } from "@/lib/analysis";

export function Analyzing({ fileName, onDone }: { fileName: string; onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= CHECKS.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, onDone]);

  const progress = Math.round((step / CHECKS.length) * 100);

  return (
    <div className="glass rounded-3xl p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Analyzing…</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{fileName}</p>
        </div>
        <span className="font-display text-3xl font-bold text-gradient">{progress}%</span>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-primary transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 flex h-16 items-end justify-center gap-1.5">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-gradient-primary opacity-80 animate-pulse"
            style={{
              height: `${20 + Math.abs(Math.sin(i * 0.7)) * 80}%`,
              animationDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>

      <ul className="mt-8 space-y-3">
        {CHECKS.map((c, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={c.id}
              className={`flex items-center gap-3 rounded-2xl border border-border px-4 py-3 transition-opacity ${
                done || active ? "opacity-100" : "opacity-40"
              }`}
            >
              {done ? (
                <Check className="size-5 text-success" />
              ) : active ? (
                <Loader2 className="size-5 animate-spin text-primary" />
              ) : (
                <span className="size-5 rounded-full border border-border" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium">{c.label}</p>
                <p className="truncate text-xs text-muted-foreground">{c.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
