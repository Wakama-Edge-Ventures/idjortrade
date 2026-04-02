import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { buildAnalysePrompt } from "@/lib/prompts/analyse-chart";
import type { AnalyseRequest, AnalyseResponse } from "./types";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

const QUOTAS: Record<string, number> = {
  FREE: 3,
  BASIC: 20,
  PRO: Infinity,
  TRADER: Infinity,
};

export async function POST(req: NextRequest) {
  try {
    const body: AnalyseRequest = await req.json();

    // Validation
    if (!body.imageBase64 || !body.asset || !body.timeframe) {
      return NextResponse.json(
        { error: "imageBase64, asset et timeframe sont requis" },
        { status: 400 }
      );
    }

    // Auth + quota check
    const session = await auth();
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (user) {
        // Reset counter if it's a new day
        const now = new Date();
        const resetAt = new Date(user.analysesResetAt);
        const sameDay =
          now.getFullYear() === resetAt.getFullYear() &&
          now.getMonth() === resetAt.getMonth() &&
          now.getDate() === resetAt.getDate();

        const count = sameDay ? user.analysesToday : 0;
        const quota = QUOTAS[user.plan] ?? 3;

        if (count >= quota) {
          const planLabel = user.plan === "FREE"
            ? 'Passez au plan Basic (5 000 FCFA/mois) pour 20 analyses/jour.'
            : 'Quota journalier atteint.';
          return NextResponse.json(
            { error: `Quota journalier atteint. ${planLabel}` },
            { status: 429 }
          );
        }
      }
    }

    const capitalFCFA = body.capitalFCFA || 100000;
    const risquePct = body.risquePct || 1;
    const ratioRR = body.ratioRR || 2;
    const riskFCFA = Math.round(capitalFCFA * risquePct / 100);

    const prompt = buildAnalysePrompt({ ...body, capitalFCFA, risquePct, ratioRR });

    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: body.imageMediaType || "image/png",
                data: body.imageBase64,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const rawText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Réponse IA invalide — format JSON attendu", raw: rawText.slice(0, 200) },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const slDistance = Math.abs((parsed.entry ?? 0) - (parsed.stopLoss ?? 0));
    const tp1Distance = Math.abs((parsed.tp1 ?? 0) - (parsed.entry ?? 0));
    const tp1RR = slDistance > 0 ? tp1Distance / slDistance : (parsed.rrRatio || ratioRR);
    const gainTP1FCFA = Math.round(riskFCFA * tp1RR);

    let gainTP2FCFA: number | undefined;
    if (parsed.tp2) {
      const tp2Distance = Math.abs(parsed.tp2 - (parsed.entry ?? 0));
      const tp2RR = slDistance > 0 ? tp2Distance / slDistance : tp1RR * 1.5;
      gainTP2FCFA = Math.round(riskFCFA * tp2RR);
    }

    const id = `analyse_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const response: AnalyseResponse = {
      id,
      signal: parsed.signal || "NEUTRE",
      confidence: parsed.confidence ?? 50,
      entry: parsed.entry,
      stopLoss: parsed.stopLoss,
      tp1: parsed.tp1,
      tp2: parsed.tp2 || undefined,
      rrRatio: parsed.rrRatio || ratioRR,
      positionSize: parsed.positionSize,
      positionUnit: parsed.positionUnit || body.asset.split("/")[0],
      riskFCFA,
      gainTP1FCFA,
      gainTP2FCFA,
      reasons: parsed.reasons || [],
      patternDetected: parsed.patternDetected || "Aucun pattern clair",
      tendance: parsed.tendance || "Indéterminée",
      rsiInfo: parsed.rsiInfo || "Non analysé",
      macdInfo: parsed.macdInfo || "Non analysé",
      bollingerInfo: parsed.bollingerInfo || "Non analysé",
      disclaimer: parsed.disclaimer || "Analyse indicative uniquement.",
      timestamp,
      asset: body.asset,
      timeframe: body.timeframe,
      mode: body.mode,
    };

    // Save to DB + increment counter (fire-and-forget, don't block response)
    if (session?.user?.id) {
      const userId = session.user.id;
      const now = new Date();
      prisma.analyse
        .create({
          data: {
            userId,
            asset: body.asset,
            timeframe: body.timeframe,
            mode: body.mode,
            signal: response.signal,
            confidence: response.confidence,
            entry: response.entry,
            stopLoss: response.stopLoss,
            tp1: response.tp1,
            tp2: response.tp2 ?? null,
            rrRatio: response.rrRatio,
            positionSize: response.positionSize ?? 0,
            positionUnit: response.positionUnit,
            riskFCFA: response.riskFCFA,
            gainTP1FCFA: response.gainTP1FCFA,
            gainTP2FCFA: response.gainTP2FCFA ?? null,
            tendance: response.tendance,
            patternDetected: response.patternDetected,
            rsiInfo: response.rsiInfo,
            macdInfo: response.macdInfo,
            bollingerInfo: response.bollingerInfo,
            reasons: response.reasons,
          },
        })
        .then(() =>
          prisma.user.update({
            where: { id: userId },
            data: {
              analysesToday: { increment: 1 },
              analysesResetAt: now,
            },
          })
        )
        .catch(() => {
          // Non-blocking: DB save failure doesn't break the user's flow
        });
    }

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
