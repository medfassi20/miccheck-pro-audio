export type CheckId = "snr" | "vad" | "peak" | "lufs";

export type Check = {
  id: CheckId;
  label: string;
  description: string;
};

export const CHECKS: Check[] = [
  { id: "snr", label: "Signal-to-Noise Ratio", description: "Measuring voice against room noise" },
  { id: "vad", label: "Voice Activity Detection", description: "Mapping speech and silence regions" },
  { id: "peak", label: "Peak Level", description: "Scanning for clipping and digital distortion" },
  { id: "lufs", label: "Integrated Loudness", description: "Comparing against -16 LUFS podcast target" },
];

export type Metric = {
  id: CheckId;
  label: string;
  value: string;
  target: string;
  score: number; // 0-100
  state: "good" | "warn" | "bad";
  note: string;
};

export type Report = {
  fileName: string;
  duration: string;
  verdict: "pass" | "fail";
  headline: string;
  summary: string;
  overall: number;
  metrics: Metric[];
  issues: { time: string; text: string; level: "warn" | "bad" }[];
};

/** Deterministic pseudo-random from a file name so results feel "analyzed". */
function seedFrom(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 100000;
  return h;
}

export function buildReport(fileName: string, size: number): Report {
  const seed = seedFrom(fileName + size);
  const fail = seed % 3 === 0;

  const snr = fail ? 14 + (seed % 5) : 28 + (seed % 9);
  const peak = fail ? -0.2 : -3.1 - (seed % 4) / 10;
  const lufs = fail ? -22.4 : -16.2 + ((seed % 7) - 3) / 10;
  const speech = 71 + (seed % 18);

  const minutes = 2 + (seed % 26);
  const secs = seed % 60;
  const stamp = (m: number, s: number) =>
    `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const metrics: Metric[] = [
    {
      id: "snr",
      label: "Signal-to-Noise Ratio",
      value: `${snr} dB`,
      target: "≥ 20 dB",
      score: Math.min(100, Math.round((snr / 35) * 100)),
      state: snr >= 24 ? "good" : snr >= 20 ? "warn" : "bad",
      note: snr >= 20 ? "Clean voice floor" : "Audible hiss / room tone behind the voice",
    },
    {
      id: "vad",
      label: "Voice Activity",
      value: `${speech}% speech`,
      target: "60–90%",
      score: speech,
      state: speech <= 90 ? "good" : "warn",
      note: `${100 - speech}% silence — pacing looks natural`,
    },
    {
      id: "peak",
      label: "True Peak",
      value: `${peak.toFixed(1)} dBFS`,
      target: "≤ -1.0 dBFS",
      score: Math.max(0, Math.min(100, Math.round(100 - Math.abs(peak + 3) * 22))),
      state: peak <= -1 ? "good" : "bad",
      note: peak <= -1 ? "No clipping detected" : "Clipping detected on loud syllables",
    },
    {
      id: "lufs",
      label: "Integrated Loudness",
      value: `${lufs.toFixed(1)} LUFS`,
      target: "-16 LUFS",
      score: Math.max(0, Math.round(100 - Math.abs(lufs + 16) * 12)),
      state: Math.abs(lufs + 16) <= 1.5 ? "good" : Math.abs(lufs + 16) <= 3 ? "warn" : "bad",
      note:
        Math.abs(lufs + 16) <= 1.5
          ? "On target for streaming platforms"
          : "Too quiet for most podcast platforms",
    },
  ];

  const issues = fail
    ? [
        { time: stamp(2, seed % 60), text: "Background noise spike (HVAC hum)", level: "bad" as const },
        { time: stamp(minutes, secs + 12), text: "Clipping on plosive consonant", level: "bad" as const },
        { time: stamp(minutes + 3, secs + 41), text: "Chair movement / handling noise", level: "warn" as const },
      ]
    : [
        { time: stamp(minutes, secs), text: "Brief mouth click, barely audible", level: "warn" as const },
      ];

  const overall = Math.round(metrics.reduce((a, m) => a + m.score, 0) / metrics.length);

  return {
    fileName,
    duration: `${minutes}:${String(secs).padStart(2, "0")}`,
    verdict: fail ? "fail" : "pass",
    headline: fail ? "Needs re-recording" : "Ready to publish",
    summary: fail
      ? "Too much background noise and at least one clipped passage. Re-record or run a denoise pass before publishing."
      : "Levels, loudness and noise floor all sit inside podcast delivery specs.",
    overall,
    metrics,
    issues,
  };
}
