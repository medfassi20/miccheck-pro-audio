import React, { useState, useRef } from "react";
import { Mic, Square, RefreshCw } from "lucide-react";

interface RecorderProps {
  onReady: (fileName: string, size: number) => void;
  onReset?: () => void;
  disabled?: boolean;
}

export function Recorder({ onReady, onReset, disabled = false }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onReady("live_recording.webm", blob.size);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleReRecord = () => {
    if (disabled) return;
    setAudioUrl(null);
    if (onReset) onReset();
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-secondary/10 p-10 text-center">
      {!isRecording && !audioUrl && (
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            className={`flex size-16 items-center justify-center rounded-full transition-all ${
              disabled
                ? "cursor-not-allowed border border-border bg-secondary/40 text-muted-foreground opacity-50"
                : "cursor-pointer bg-gradient-primary text-primary-foreground hover:scale-105"
            }`}
            title={disabled ? "Free limit reached" : "Start recording"}
          >
            <Mic className="size-7" />
          </button>
          <p className="mt-4 text-sm font-semibold">
            {disabled ? "Free limit reached" : "Click to start recording"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {disabled
              ? "Upgrade to Pro to keep recording live audio"
              : "Allow microphone access when prompted"}
          </p>
        </div>
      )}

      {isRecording && (
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={stopRecording}
            className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground animate-pulse"
            title="Stop recording"
          >
            <Square className="size-7" />
          </button>
          <p className="mt-4 text-sm font-semibold text-destructive">Recording in progress...</p>
          <p className="mt-1 text-xs text-muted-foreground">Click the button above to finish</p>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex flex-col items-center gap-4">
          <audio src={audioUrl} controls className="max-w-xs" />
          <button
            type="button"
            onClick={handleReRecord}
            disabled={disabled}
            className={`inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-semibold transition-colors ${
              disabled
                ? "cursor-not-allowed bg-secondary/30 text-muted-foreground opacity-50"
                : "cursor-pointer bg-secondary hover:bg-secondary/80 text-foreground"
            }`}
            title={disabled ? "Free limit reached" : "Re-record audio"}
          >
            <RefreshCw className="size-3.5" /> Re-record
          </button>
        </div>
      )}
    </div>
  );
}
