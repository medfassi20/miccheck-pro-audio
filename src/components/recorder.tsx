import { useEffect, useRef, useState } from "react";
import { Mic, RotateCcw, Square, Play } from "lucide-react";

type Props = {
  onReady: (name: string, size: number) => void;
  onReset: () => void;
  disabled?: boolean;
};

export function Recorder({ onReady, onReset, disabled }: Props) {
  const [state, setState] = useState<"idle" | "recording" | "recorded" | "error">("idle");
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const start = async () => {
    setMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        blobRef.current = blob;
        setUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        setState("recorded");
      };
      rec.start();
      recorderRef.current = rec;
      setSeconds(0);
      setState("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setState("error");
      setMessage("We couldn't reach your microphone. Allow access and try again.");
    }
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    blobRef.current = null;
    chunksRef.current = [];
    setSeconds(0);
    setMessage(null);
    setState("idle");
    onReset();
  };

  const analyze = () => {
    const blob = blobRef.current;
    if (!blob) return;
    onReady(`live-take-${new Date().toISOString().slice(11, 19).replace(/:/g, "")}.webm`, blob.size);
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <section className="glass rounded-3xl p-8 text-center">
      <h2 className="text-xl font-semibold">Live voice quality audit</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Record straight from your mic, then run the AI audio checker on the take.
      </p>

      <div className="mt-8 flex h-20 items-end justify-center gap-1.5">
        {Array.from({ length: 44 }).map((_, i) => (
          <span
            key={i}
            className={`w-1.5 rounded-full bg-gradient-primary ${
              state === "recording" ? "animate-pulse" : "opacity-40"
            }`}
            style={{
              height: `${15 + Math.abs(Math.sin(i * 0.5 + (state === "recording" ? seconds : 0))) * 85}%`,
              animationDelay: `${i * 35}ms`,
            }}
          />
        ))}
      </div>

      <p className="mt-4 font-mono text-2xl font-semibold">{mmss}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {state !== "recording" && state !== "recorded" && (
          <button
            onClick={start}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Mic className="size-4" /> Start Recording
          </button>
        )}

        {state === "recording" && (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-xl bg-destructive px-6 py-3 font-semibold text-destructive-foreground transition-transform hover:-translate-y-0.5"
          >
            <Square className="size-4" /> Stop
          </button>
        )}

        {state === "recorded" && (
          <button
            onClick={analyze}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Play className="size-4" /> Analyze this take
          </button>
        )}

        <button
          onClick={reset}
          disabled={state === "idle"}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40"
        >
          <RotateCcw className="size-4" /> Re-record
        </button>
      </div>

      {url && state === "recorded" && (
        <audio controls src={url} className="mx-auto mt-6 w-full max-w-md" />
      )}
      {message && <p className="mt-4 text-sm text-destructive">{message}</p>}
    </section>
  );
}
