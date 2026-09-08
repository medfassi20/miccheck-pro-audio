import { useEffect, useRef, useState } from "react";
import { Mic, RotateCcw, Square } from "lucide-react";

type Props = {
  onComplete: (label: string, seed: number) => void;
  disabled?: boolean;
};

const BARS = 48;

export function VoiceRecorder({ onComplete, disabled }: Props) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(4));

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const energyRef = useRef(0);
  const framesRef = useRef(0);
  const startedRef = useRef(0);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
  };

  useEffect(() => cleanup, []);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      energyRef.current = 0;
      framesRef.current = 0;
      startedRef.current = Date.now();
      setSeconds(0);
      setRecording(true);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = ((data[i] ?? 128) - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        energyRef.current += rms;
        framesRef.current += 1;
        setLevels((prev) => [...prev.slice(1), Math.max(4, Math.min(100, rms * 320))]);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Microphone access was blocked. Allow the mic in your browser, then try again.");
    }
  };

  const stop = () => {
    const secs = Math.max(1, Math.round((Date.now() - startedRef.current) / 1000));
    const avg = framesRef.current ? energyRef.current / framesRef.current : 0.05;
    cleanup();
    setRecording(false);
    setLevels(Array(BARS).fill(4));
    onComplete(`Live recording · ${secs}s`, Math.round(avg * 10000) + secs);
  };

  const reset = () => {
    cleanup();
    setRecording(false);
    setSeconds(0);
    setError(null);
    setLevels(Array(BARS).fill(4));
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="glass rounded-3xl p-8 text-center">
      <span
        className={`mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-primary shadow-glow ${
          recording ? "animate-pulse" : ""
        }`}
      >
        <Mic className="size-8 text-primary-foreground" />
      </span>
      <h3 className="mt-6 text-xl font-semibold">
        {recording ? "Recording…" : "Record a live voice check"}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        {recording
          ? "Speak normally for 10–20 seconds, then stop to run the audit."
          : "Nothing leaves your device — we only read the waveform from your microphone."}
      </p>

      <div className="mt-6 flex h-24 items-end justify-center gap-1">
        {levels.map((h, i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-gradient-primary transition-[height] duration-100"
            style={{ height: `${h}%`, opacity: recording ? 0.9 : 0.3 }}
          />
        ))}
      </div>

      <p className="mt-4 font-mono text-2xl font-semibold text-gradient">{mmss}</p>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {!recording ? (
          <button
            onClick={start}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Mic className="size-4" /> Start Recording
          </button>
        ) : (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-xl bg-destructive px-6 py-3 text-sm font-semibold text-destructive-foreground transition-transform hover:-translate-y-0.5"
          >
            <Square className="size-4" /> Stop Recording
          </button>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5"
        >
          <RotateCcw className="size-4" /> Re-record
        </button>
      </div>
    </div>
  );
}
