"use client";

import { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from "react";
import { Upload, X, ImageIcon, CheckCircle2, ChevronDown, ChevronUp, Clipboard } from "lucide-react";
import { useLang } from "@/lib/LangContext";

export type ChartUploadRef = {
  getImageData: () => { base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp" } | null;
};

interface ChartUploadZoneProps {
  onFileSelect?: (file: File) => void;
  onClipboardImageLoaded?: () => void;
  accentColor?: string;
}

const MAX_MB = 10;
const GUIDE_KEY = "chart_guide_seen";

const ChartUploadZone = forwardRef<ChartUploadRef, ChartUploadZoneProps>(
  function ChartUploadZone({ onFileSelect, onClipboardImageLoaded, accentColor = "var(--bullish)" }, ref) {
    const { t } = useLang();
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview]       = useState<string | null>(null);
    const [fileName, setFileName]     = useState<string | null>(null);
    const [fileSize, setFileSize]     = useState<string | null>(null);
    const [dragging, setDragging]     = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [imageData, setImageData]   = useState<{ base64: string; mediaType: "image/jpeg" | "image/png" | "image/webp" } | null>(null);
    const [guideCollapsed, setGuideCollapsed] = useState(false);
    const [clipboardToast, setClipboardToast] = useState(false);
    const [clipboardBlob, setClipboardBlob]   = useState<Blob | null>(null);
    const toastDismissed = useRef(false);

    useEffect(() => {
      try { if (localStorage.getItem(GUIDE_KEY) === "true") setGuideCollapsed(true); } catch { /* ignore */ }
    }, []);

    function toggleGuide() {
      const next = !guideCollapsed;
      setGuideCollapsed(next);
      try { if (next) localStorage.setItem(GUIDE_KEY, "true"); } catch { /* ignore */ }
    }

    useImperativeHandle(ref, () => ({ getImageData: () => imageData }));

    function handleFile(file: File) {
      setError(null);
      if (file.size > MAX_MB * 1024 * 1024) { setError(t("upload.error.size")); return; }
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + " Mo");
      setPreview(URL.createObjectURL(file));
      const mediaType = (file.type || "image/png") as "image/jpeg" | "image/png" | "image/webp";
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageData({ base64: result.split(",")[1], mediaType });
      };
      reader.readAsDataURL(file);
      onFileSelect?.(file);
    }

    const checkClipboard = useCallback(async () => {
      if (toastDismissed.current || preview) return;
      if (typeof navigator === "undefined" || !navigator.clipboard?.read) return;
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find(t => t.startsWith("image/"));
          if (imageType) {
            const blob = await item.getType(imageType);
            setClipboardBlob(blob);
            setClipboardToast(true);
            return;
          }
        }
      } catch { /* NotAllowedError — silent fallback */ }
    }, [preview]);

    useEffect(() => { checkClipboard(); }, [checkClipboard]);

    useEffect(() => {
      function onVisibility() { if (document.visibilityState === "visible") checkClipboard(); }
      document.addEventListener("visibilitychange", onVisibility);
      return () => document.removeEventListener("visibilitychange", onVisibility);
    }, [checkClipboard]);

    useEffect(() => {
      function onPaste(e: ClipboardEvent) {
        if (!e.clipboardData) return;
        const imageItem = Array.from(e.clipboardData.items).find(i => i.type.startsWith("image/"));
        if (!imageItem) return;
        e.preventDefault();
        const file = imageItem.getAsFile();
        if (!file) return;
        setClipboardToast(false); setClipboardBlob(null); toastDismissed.current = true;
        handleFile(file); onClipboardImageLoaded?.();
      }
      document.addEventListener("paste", onPaste);
      return () => document.removeEventListener("paste", onPaste);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClipboardImageLoaded]);

    function acceptClipboard() {
      if (!clipboardBlob) return;
      const ext = clipboardBlob.type.split("/")[1] || "png";
      const file = new File([clipboardBlob], `clipboard.${ext}`, { type: clipboardBlob.type });
      setClipboardToast(false); setClipboardBlob(null); toastDismissed.current = true;
      handleFile(file); onClipboardImageLoaded?.();
    }

    function dismissClipboard() {
      setClipboardToast(false); setClipboardBlob(null); toastDismissed.current = true;
    }

    function handleDrop(e: React.DragEvent) {
      e.preventDefault(); setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    }

    function clear() {
      setPreview(null); setFileName(null); setFileSize(null); setError(null); setImageData(null);
      toastDismissed.current = false;
      if (inputRef.current) inputRef.current.value = "";
    }

    const checkItems = [
      t("upload.guide.item1"),
      t("upload.guide.item2"),
      t("upload.guide.item3"),
      t("upload.guide.item4"),
    ];

    return (
      <div className="space-y-3">

        {/* Toast clipboard */}
        {clipboardToast && !preview && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl animate-fade-in"
            style={{ background: "rgba(153,69,255,0.10)", border: "1px solid rgba(153,69,255,0.30)" }}>
            <div className="flex items-center gap-2.5 min-w-0">
              <Clipboard size={15} style={{ color: "var(--sol-purple)", flexShrink: 0 }} />
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {t("upload.clipboard.toast")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={acceptClipboard}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{ background: "rgba(153,69,255,0.20)", color: "var(--sol-purple)", border: "1px solid rgba(153,69,255,0.35)" }}>
                {t("upload.yes")}
              </button>
              <button onClick={dismissClipboard}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "transparent", color: "var(--text-tertiary)" }}>
                {t("upload.ignore")}
              </button>
            </div>
          </div>
        )}

        {/* Guide */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface-high)", border: "1px solid rgba(245,166,35,0.2)" }}>
          <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={toggleGuide}>
            <span className="text-xs font-bold text-white">{t("upload.guide.title")}</span>
            <button className="text-[10px] font-semibold flex items-center gap-1 transition-colors"
              style={{ color: "var(--text-secondary)" }} type="button">
              {guideCollapsed ? (
                <>{t("upload.guide.show")} <ChevronDown size={12} /></>
              ) : (
                <>{t("upload.guide.hide")} <ChevronUp size={12} /></>
              )}
            </button>
          </div>
          {!guideCollapsed && (
            <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: "rgba(245,166,35,0.1)" }}>
              {checkItems.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0 mt-0.5">✅</span>
                  <span className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone upload */}
        {preview ? (
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden" style={{ border: `1px solid ${accentColor}33` }}>
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
                  {t("upload.delete")}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "rgba(20,241,149,0.06)", border: "1px solid rgba(20,241,149,0.15)" }}>
              <CheckCircle2 size={14} style={{ color: "var(--bullish)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--bullish)" }}>
                {t("upload.ready")}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="rounded-2xl flex flex-col items-center justify-center gap-4 py-10 px-6 cursor-pointer transition-all"
              style={{
                border: `2px dashed ${dragging ? accentColor : `${accentColor}40`}`,
                background: dragging ? `${accentColor}06` : "var(--surface-high)",
              }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${accentColor}12`, color: accentColor }}>
                <Upload size={22} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-white">
                  <span className="hidden md:inline">{t("upload.drag")}</span>
                  <span className="md:hidden">{t("upload.photo")}</span>
                  <span style={{ color: accentColor }}>{t("upload.choose")}</span>
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{t("upload.formats")}</p>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{t("upload.paste.hint")}</p>
              </div>
            </div>
            {error && <p className="mt-2 text-xs font-medium" style={{ color: "var(--bearish)" }}>{error}</p>}
          </div>
        )}

        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={e => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />
      </div>
    );
  }
);

export default ChartUploadZone;
