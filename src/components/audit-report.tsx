import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, RefreshCw } from "lucide-react";
import type { Report } from "@/lib/analysis";

interface AuditReportProps {
  report: Report;
  onReset: () => void;
}

export function AuditReport({ report, onReset }: AuditReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: "#090d16",
      });

      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // Largeur A4 en mm
      const pageHeight = 297; // Hauteur A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

      // 3. Conversion en Blob URL pour ouvrir dans un nouvel onglet
      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);

      // 4. Ouverture dans un nouvel onglet
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone du rapport capturée pour le PDF */}
      <div ref={reportRef} className="rounded-2xl border border-border bg-card p-6 shadow-xl">
        <h2 className="text-xl font-bold">Voice Audit Summary</h2>
        <p className="text-sm text-muted-foreground">File: {report.fileName}</p>
        
        {/* Affichage des métriques (LUFS, SNR, True Peak...) */}
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

      {/* Barre d'actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Download className="size-4" />
          Export PDF
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
