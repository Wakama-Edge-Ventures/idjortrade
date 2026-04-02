"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Upload, X, ImageIcon, CheckCircle2 } from "lucide-react";

export type ChartUploadRef = {
  getImageData: () => { base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp" } | null;
};

interface ChartUploadZoneProps {
  onFileSelect?: (file: File) => void;
  accentColor?: string;
}

const MAX_MB = 10;

const ChartUploadZone = forwardRef<ChartUploadRef, ChartUploadZoneProps>(
  function ChartUploadZone({ onFileSelect, accentColor = "#00FF88" }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageData, setImageData] = useState<{ base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp" } | null>(null);

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
        // Strip data URL prefix: "data:image/png;base64,..."
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

    if (preview) {
      return (
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
                {fileSize && <span className="text-[10px]" style={{ color: "var(--on-surface-dim)" }}>{fileSize}</span>}
              </div>
              <button onClick={clear}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
                style={{ background: "rgba(255,59,92,0.15)", color: "#FF3B5C" }}>
                <X size={12} />
                Supprimer
              </button>
            </div>
          </div>
          {/* Ready badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)" }}>
            <CheckCircle2 size={14} style={{ color: "#00FF88" }} />
            <span className="text-xs font-semibold" style={{ color: "#00FF88" }}>
              ✓ Chart prêt pour l'analyse
            </span>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div
          className="rounded-2xl flex flex-col items-center justify-center gap-4 py-12 px-6 cursor-pointer transition-all"
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
            <p className="text-xs" style={{ color: "var(--on-surface-dim)" }}>
              PNG, JPG, WEBP — max {MAX_MB} Mo
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-xs font-medium" style={{ color: "#FF3B5C" }}>{error}</p>
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
