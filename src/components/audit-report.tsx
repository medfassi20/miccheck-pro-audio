import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import type { Report } from "@/lib/analysis";

interface AuditReportProps {
  report: Report;
  onReset: () => void;
}

export function AuditReport({ report, onReset }: AuditReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    const targetElement = reportRef.current;
    if (!targetElement) {
      alert("Erreur : L'élément du rapport est introuvable.");
      return;
    }

    try {
      setIsGenerating(true);

      // 1. Capture du composant avec options de tolérance CORS et dimensions
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#090d16",
        windowWidth: targetElement.scrollWidth,
        windowHeight: targetElement.scrollHeight,
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Le rendu Canvas a généré une image vide.");
      }

      // 2. Conversion du Canvas en image
      const imgData = canvas.toDataURL("image/png");

      // 3. Configuration du document jsPDF (Format A4)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // Largeur A4 en mm
      const pageHeight = 297; // Hauteur A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

      // 4. Déclenchement du téléchargement direct
      pdf.save(`MicCheck_Audit_${Date.now()}.pdf`);

    } catch (error) {
      // Affiche le détail exact de l'erreur dans la console pour le débogage
      console.error("Détail de l'erreur PDF :", error);
      alert("Impossible de générer le PDF. Ouvrez la console du navigateur (F12) pour voir le détail de l'erreur.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone capturée pour le PDF */}
      <div ref={reportRef} className="rounded-2xl border border-border bg-card p-6 shadow-xl">
        <h2 className="text-xl font-bold">Voice Audit Summary</h2>
        <p className="text-sm text-muted-foreground">File: {report.fileName}</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/50 bg-secondary/50 p-4">
            <span className="text-xs text-muted-foreground">Loudness (LUFS)</span>
            <p className="text-lg font-bold">{report.lufs} LUFS</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-secondary/50 p-4">
            <span className="text-xs text-muted-foreground">SNR Ratio</span>
            <p className="text-lg font-bold">{report.snr} dB</p>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleExportPDF}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="size-4" />
              Download Report
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80 cursor-pointer"
        >
          <RefreshCw className="size-4" />
          New Audit
        </button>
      </div>
    </div>
  );
}
