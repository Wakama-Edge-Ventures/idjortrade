export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { buildAnalysePrompt } from "@/lib/prompts/analyse-chart";
import type { AnalyseRequest, AnalyseResponse } from "./types";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { fetchQuote } from "@/lib/twelvedata";
import { FRESHNESS_LIMITS } from "@/lib/timeframes";

export const maxDuration = 60;

// ── Quotas par plan ──────────────────────────────────────────────────────────
const QUOTAS: Record<string, number> = {
  FREE:    1,
  STARTER: 3,
  BASIC:   10,
  PRO:     30,
  TRADER:  Infinity,
};

// Plans avec résultats complets (Entry/SL/TP/Sizing)
const FULL_RESULT_PLANS = new Set(["STARTER", "BASIC", "PRO", "TRADER"]);

// Timeframes valides par style
const STYLE_TIMEFRAMES: Record<string, string[]> = {
  scalp:    ["1m", "3m", "5m", "15m", "30m"],
  day:      ["1H", "2H", "4H"],
  swing:    ["1D", "3D", "1W", "2W"],
  position: ["1M", "3M", "6M", "1Y"],
};

function getStyleForTimeframe(tf: string): string | null {
  for (const [style, frames] of Object.entries(STYLE_TIMEFRAMES)) {
    if (frames.includes(tf)) return style;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyseRequest = await req.json();

    if (!body.imageBase64 || !body.asset || !body.timeframe) {
      return NextResponse.json(
        { error: "imageBase64, asset et timeframe sont requis" },
        { status: 400 }
      );
    }

    // ── Auth + quota ──────────────────────────────────────────────────────────
    let plan = "FREE";
    const session = await auth();
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (user) {
        plan = user.plan ?? "FREE";
        const now = new Date();
        const resetAt = new Date(user.analysesResetAt);
        const sameDay =
          now.getFullYear() === resetAt.getFullYear() &&
          now.getMonth()    === resetAt.getMonth()    &&
          now.getDate()     === resetAt.getDate();

        const count = sameDay ? user.analysesToday : 0;
        const quota = QUOTAS[plan] ?? 1;

        if (count >= quota) {
          const upgrade =
            plan === "FREE"
              ? "Passez au plan Starter (2 900 FCFA/mois) pour 3 analyses/jour avec Entry, SL et TP."
              : `Quota journalier atteint (${quota} analyses). Passez au plan supérieur.`;
          return NextResponse.json(
            { error: `Quota journalier atteint. ${upgrade}` },
            { status: 429 }
          );
        }
      }
    }

    // ── Validation timeframe / style ─────────────────────────────────────────
    let timeframeWarning: { warning: string; warningMessage: string } | null = null;
    const expectedFrames = STYLE_TIMEFRAMES[body.mode] ?? [];
    if (body.timeframe && body.mode && !expectedFrames.includes(body.timeframe)) {
      const suggestedStyle = getStyleForTimeframe(body.timeframe) ?? "swing";
      timeframeWarning = {
        warning: "TIMEFRAME_STYLE_MISMATCH",
        warningMessage: `Vous avez sélectionné le style "${body.mode}" mais le timeframe "${body.timeframe}" correspond plutôt au style "${suggestedStyle}". L'analyse continue mais vérifiez vos paramètres.`,
      };
    }

    const capitalFCFA = body.capitalFCFA || 100000;
    const risquePct   = body.risquePct   || 1;
    const ratioRR     = body.ratioRR     || 2;
    const riskFCFA    = Math.round(capitalFCFA * risquePct / 100);

    // ── ÉTAPE A : vérifier que c'est bien un chart ───────────────────────────
    const validationMsg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: body.imageMediaType || "image/png", data: body.imageBase64 } },
          { type: "text", text: 'Cette image est-elle un graphique de trading financier (candlesticks/bougies japonaises) avec des indicateurs techniques ? Réponds UNIQUEMENT par JSON: { "isChart": true/false, "reason": string }' },
        ],
      }],
    });

    const validationText = validationMsg.content.filter(b => b.type === "text").map(b => (b as { type: "text"; text: string }).text).join("");
    let isChart = true;
    try {
      const vMatch = validationText.match(/\{[\s\S]*\}/);
      if (vMatch) { const vParsed = JSON.parse(vMatch[0]); isChart = vParsed.isChart !== false; }
    } catch { /* keep isChart = true */ }

    if (!isChart) {
      return NextResponse.json(
        { error: "NOT_A_CHART", message: "Veuillez uploader un graphique de trading avec des bougies japonaises et des indicateurs techniques (RSI, MACD, Bollinger)." },
        { status: 400 }
      );
    }

    // ── ÉTAPE B : fraîcheur du chart ─────────────────────────────────────────
    const freshnessMsg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: body.imageMediaType || "image/png", data: body.imageBase64 } },
          { type: "text", text: 'Regarde la date/heure visible sur ce graphique. Quel est le timestamp de la dernière bougie ? Réponds UNIQUEMENT par JSON: { "lastCandleDate": string (format ISO ou "unknown"), "timeframeDetected": string, "isRecent": boolean }' },
        ],
      }],
    });

    const freshnessText = freshnessMsg.content.filter(b => b.type === "text").map(b => (b as { type: "text"; text: string }).text).join("");
    try {
      const fMatch = freshnessText.match(/\{[\s\S]*\}/);
      if (fMatch) {
        const fParsed = JSON.parse(fMatch[0]);
        const lastCandleDate = fParsed.lastCandleDate as string;
        if (lastCandleDate && lastCandleDate !== "unknown") {
          const ageMin = (Date.now() - new Date(lastCandleDate).getTime()) / 60000;
          const limit = FRESHNESS_LIMITS[body.timeframe] ?? Infinity;
          if (ageMin > limit) {
            return NextResponse.json(
              { error: "CHART_TOO_OLD", message: `Ce graphique semble trop ancien pour un timeframe ${body.timeframe}. Veuillez capturer un graphique récent.` },
              { status: 400 }
            );
          }
        }
      }
    } catch { /* skip */ }

    // ── ÉTAPE C : prix actuel (body.currentPrice prioritaire) ───────────────
    let currentPrice: number | null = body.currentPrice ?? null;
    if (!currentPrice) {
      try {
        const quote = await fetchQuote(body.asset);
        currentPrice = quote?.price ?? null;
      } catch { /* skip */ }
    }

    const prompt = buildAnalysePrompt({ ...body, capitalFCFA, risquePct, ratioRR }, currentPrice);

    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: body.modeAnalyse === "approfondi" ? 2000 : 1500,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: body.imageMediaType || "image/png", data: body.imageBase64 } },
          { type: "text", text: prompt },
        ],
      }],
    });

    const rawText = message.content.filter(b => b.type === "text").map(b => (b as { type: "text"; text: string }).text).join("");
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Réponse IA invalide — format JSON attendu", raw: rawText.slice(0, 200) }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const slDistance  = Math.abs((parsed.entry ?? 0) - (parsed.stopLoss ?? 0));
    const tp1Distance = Math.abs((parsed.tp1 ?? 0) - (parsed.entry ?? 0));
    const tp1RR       = slDistance > 0 ? tp1Distance / slDistance : (parsed.rrRatio || ratioRR);
    const gainTP1FCFA = Math.round(riskFCFA * tp1RR);

    let gainTP2FCFA: number | undefined;
    if (parsed.tp2) {
      const tp2Distance = Math.abs(parsed.tp2 - (parsed.entry ?? 0));
      const tp2RR = slDistance > 0 ? tp2Distance / slDistance : tp1RR * 1.5;
      gainTP2FCFA = Math.round(riskFCFA * tp2RR);
    }

    const timestamp = new Date().toISOString();

    // ── Sauvegarder en DB ─────────────────────────────────────────────────────
    let analyseId = `analyse_${Date.now()}`;
    if (session?.user?.id) {
      const userId = session.user.id;
      const now = new Date();
      try {
        const saved = await prisma.analyse.create({
          data: {
            userId, asset: body.asset, timeframe: body.timeframe, mode: body.mode,
            signal: parsed.signal || "NEUTRE", confidence: parsed.confidence ?? 50,
            entry: parsed.entry, stopLoss: parsed.stopLoss, tp1: parsed.tp1, tp2: parsed.tp2 ?? null,
            rrRatio: parsed.rrRatio || ratioRR, positionSize: parsed.positionSize ?? 0,
            positionUnit: parsed.positionUnit || body.asset.split("/")[0],
            riskFCFA, gainTP1FCFA, gainTP2FCFA: gainTP2FCFA ?? null,
            tendance: parsed.tendance || "Indéterminée",
            patternDetected: parsed.patternDetected || "Aucun pattern clair",
            rsiInfo: parsed.rsiInfo || "Non analysé", macdInfo: parsed.macdInfo || "Non analysé",
            bollingerInfo: parsed.bollingerInfo || "Non analysé", reasons: parsed.reasons || [],
          },
        });
        analyseId = saved.id;
        prisma.user.update({ where: { id: userId }, data: { analysesToday: { increment: 1 }, analysesResetAt: now } }).catch(() => {});
      } catch { /* DB failure non-bloquante */ }
    }

    // ── Construire réponse ────────────────────────────────────────────────────
    const isSignalOnly = !FULL_RESULT_PLANS.has(plan);

    const response: AnalyseResponse = {
      id: analyseId,
      signal: parsed.signal || "NEUTRE",
      confidence: parsed.confidence ?? 50,
      entry:        isSignalOnly ? 0 : (parsed.entry ?? 0),
      stopLoss:     isSignalOnly ? 0 : (parsed.stopLoss ?? 0),
      tp1:          isSignalOnly ? 0 : (parsed.tp1 ?? 0),
      tp2:          isSignalOnly ? undefined : (parsed.tp2 || undefined),
      rrRatio:      isSignalOnly ? 0 : (parsed.rrRatio || ratioRR),
      positionSize: isSignalOnly ? 0 : (parsed.positionSize ?? 0),
      positionUnit: parsed.positionUnit || body.asset.split("/")[0],
      riskFCFA:     isSignalOnly ? 0 : riskFCFA,
      gainTP1FCFA:  isSignalOnly ? 0 : gainTP1FCFA,
      gainTP2FCFA:  isSignalOnly ? undefined : gainTP2FCFA,
      reasons: parsed.reasons || [],
      patternDetected: parsed.patternDetected || "Aucun pattern clair",
      tendance: parsed.tendance || "Indéterminée",
      rsiInfo: parsed.rsiInfo || "Non analysé",
      macdInfo: parsed.macdInfo || "Non analysé",
      bollingerInfo: parsed.bollingerInfo || "Non analysé",
      disclaimer: parsed.disclaimer || "Analyse indicative uniquement.",
      timestamp, asset: body.asset, timeframe: body.timeframe, mode: body.mode,
      signalOnly: isSignalOnly || undefined,
      ...(timeframeWarning ?? {}),
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
