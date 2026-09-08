import { useRef, useState } from "react";
import { FileAudio, UploadCloud } from "lucide-react";

export function UploadZone({ onFile }: { onFile: (name: string, size: number) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    onFile(file.name, file.size);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-20 text-center transition-all ${
        dragging
          ? "border-primary bg-primary/10 shadow-glow"
          : "border-border glass hover:border-primary/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/wav,.mp3,.wav"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <span className="grid size-16 place-items-center rounded-2xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
        <UploadCloud className="size-8 text-primary-foreground" />
      </span>
      <h3 className="mt-6 text-xl font-semibold">Drop your audio file here</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        MP3 or WAV, up to 30 minutes. Nothing is published — we only read the waveform.
      </p>
      <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs text-muted-foreground">
        <FileAudio className="size-4" /> or click to browse your files
      </div>
    </div>
  );
}
