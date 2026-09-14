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
    if (!targetElement) return;

    try {
      setIsGenerating(true);

      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#090d16",
        // Nettoyage des couleurs OKLCH pour html2canvas
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el);
            
            // Forcer les couleurs calculées au format standard RGB/HEX
            if (computedStyle.color && computedStyle.color.includes("oklch")) {
              (el as HTMLElement).style.color = "#ffffff";
            }
            if (
              computedStyle.backgroundColor &&
              computedStyle.backgroundColor.includes("oklch")
            ) {
              (el as HTMLElement).style.backgroundColor = "#0d1322";
            }
            if (
              computedStyle.borderColor &&
              computedStyle.borderColor.includes("oklch")
            ) {
              (el as HTMLElement).style.borderColor = "#1e293b";
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`MicCheck_Audit_${Date.now()}.pdf`);

    } catch (error) {
      console.error("Détail de l'erreur PDF :", error);
      alert("Erreur lors de la génération. Réessayez.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
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
