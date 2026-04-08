"use client";

import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Upload, X, ImageIcon, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export type ChartUploadRef = {
  getImageData: () => { base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp" } | null;
};

interface ChartUploadZoneProps {
  onFileSelect?: (file: File) => void;
  accentColor?: string;
}

const MAX_MB = 10;

const GUIDE_KEY = "chart_guide_seen";

const ChartUploadZone = forwardRef<ChartUploadRef, ChartUploadZoneProps>(
  function ChartUploadZone({ onFileSelect, accentColor = "var(--bullish)" }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageData, setImageData] = useState<{ base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp" } | null>(null);
    const [guideCollapsed, setGuideCollapsed] = useState(false);

    useEffect(() => {
      try {
        const seen = localStorage.getItem(GUIDE_KEY);
        if (seen === "true") setGuideCollapsed(true);
      } catch {
        // ignore
      }
    }, []);

    function toggleGuide() {
      const next = !guideCollapsed;
      setGuideCollapsed(next);
      try {
        if (next) localStorage.setItem(GUIDE_KEY, "true");
      } catch {
        // ignore
      }
    }

    useImperativeHandle(ref, () => ({
      getImageData: () => imageData,
    }));

    function handleFile(file: File) {
      setError(null);
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`Fichier trop lourd (max ${MAX_MB} Mo)`);
        return;
      }
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + " Mo");
      setPreview(URL.createObjectURL(file));

      const mediaType = (file.type || "image/png") as "image/jpeg" | "image/png" | "image/webp";
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(",")[1];
        setImageData({ base64, mediaType });
      };
      reader.readAsDataURL(file);

      onFileSelect?.(file);
    }

    function handleDrop(e: React.DragEvent) {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    }

    function clear() {
      setPreview(null);
      setFileName(null);
      setFileSize(null);
      setError(null);
      setImageData(null);
      if (inputRef.current) inputRef.current.value = "";
    }

    const checkItems = [
      "RSI + MACD + Bollinger activés et visibles",
      "Screenshot plein écran, haute résolution",
      "Asset et timeframe correspondent exactement",
      "Indicateurs lisibles (pas trop zoomé)",
    ];

    return (
      <div className="space-y-3">
        {/* Guide encadré */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--surface-high)",
            border: "1px solid rgba(245,166,35,0.2)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer"
            onClick={toggleGuide}
          >
            <span className="text-xs font-bold text-white">
              📋 Avant d&apos;uploader ton chart
            </span>
            <button
              className="text-[10px] font-semibold flex items-center gap-1 transition-colors"
              style={{ color: "var(--text-secondary)" }}
              type="button"
            >
              {guideCollapsed ? (
                <>Revoir le guide <ChevronDown size={12} /></>
              ) : (
                <>Masquer le guide <ChevronUp size={12} /></>
              )}
            </button>
          </div>

          {!guideCollapsed && (
            <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: "rgba(245,166,35,0.1)" }}>
              {checkItems.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0 mt-0.5">✅</span>
                  <span className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone upload */}
        {preview ? (
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${accentColor}33` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="chart" className="w-full object-cover" style={{ maxHeight: "192px" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <ImageIcon size={14} style={{ color: accentColor }} />
                  <span className="text-xs font-medium text-white truncate max-w-[180px]">{fileName}</span>
                  {fileSize && <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{fileSize}</span>}
                </div>
                <button onClick={clear}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
                  style={{ background: "rgba(244,63,94,0.15)", color: "var(--bearish)" }}>
                  <X size={12} />
                  Supprimer
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "rgba(20,241,149,0.06)", border: "1px solid rgba(20,241,149,0.15)" }}>
              <CheckCircle2 size={14} style={{ color: "var(--bullish)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--bullish)" }}>
                ✓ Chart prêt pour l&apos;analyse
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div
              className="rounded-2xl flex flex-col items-center justify-center gap-4 py-10 px-6 cursor-pointer transition-all"
              style={{
                border: `2px dashed ${dragging ? accentColor : `${accentColor}40`}`,
                background: dragging ? `${accentColor}06` : "var(--surface-high)",
              }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${accentColor}12`, color: accentColor }}>
                <Upload size={22} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-white">
                  <span className="hidden md:inline">Glisser le chart ici ou </span>
                  <span className="md:hidden">📷 Prendre une photo ou </span>
                  <span style={{ color: accentColor }}>choisir un fichier</span>
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  PNG, JPG, WEBP — max {MAX_MB} Mo
                </p>
              </div>
            </div>

            {error && (
              <p className="mt-2 text-xs font-medium" style={{ color: "var(--bearish)" }}>{error}</p>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    );
  }
);

export default ChartUploadZone;
