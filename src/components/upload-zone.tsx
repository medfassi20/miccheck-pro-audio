import React, { useRef } from "react";
import { Upload, FileAudio } from "lucide-react";

interface UploadZoneProps {
  onFile: (name: string, size: number) => void;
  disabled?: boolean;
}

export function UploadZone({ onFile, disabled = false }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) {
      onFile(file.name, file.size);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFile(file.name, file.size);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
        disabled
          ? "cursor-not-allowed border-border/50 bg-secondary/30 opacity-50"
          : "cursor-pointer border-border bg-secondary/10 hover:border-primary/50 hover:bg-secondary/20"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {disabled ? <FileAudio className="size-6 text-muted-foreground" /> : <Upload className="size-6" />}
      </div>
      <h3 className="text-base font-semibold">
        {disabled ? "Free limit reached" : "Upload an audio file"}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {disabled
          ? "Upgrade to Pro to upload and analyze more files"
          : "Drag and drop your MP3, WAV, or M4A file here, or click to browse"}
      </p>
    </div>
  );
}
