import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient, Plan } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const hashed = await bcrypt.hash("Test1234!", 12);

  const user = await prisma.user.upsert({
    where: { email: "test@idjortrade.com" },
    update: {},
    create: {
      email: "test@idjortrade.com",
      password: hashed,
      prenom: "Kofi",
      plan: Plan.PRO,
      profile: {
        create: {
          pays: "Côte d'Ivoire",
          ville: "Abidjan",
          niveauTrading: "intermédiaire",
          anneesExperience: "2-3 ans",
          marchePrefere: "Crypto",
          styleTrading: "swing",
          marchesTraites: ["Crypto", "Forex"],
          capitalRange: "500k-2M FCFA",
          risquePct: 1.5,
          objectifMensuel: "15-25%",
          profilPsycho: "équilibré",
          heuresParJour: "2-4h",
          sessionsPreferees: ["Londres", "New York"],
          objectifPrincipal: "revenus complémentaires",
          onboardingDone: true,
        },
      },
    },
  });

  console.log(`✅ User created: ${user.email} (plan: ${user.plan})`);

  // Seed 5 analyses
  const signals = ["BUY", "SELL", "BUY", "NEUTRE", "BUY"] as const;
  const assets = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "EUR/USD", "BNB/USDT"];
  const modes = ["swing", "scalp", "swing", "swing", "scalp"] as const;

  for (let i = 0; i < 5; i++) {
    const entry = 100 + Math.random() * 900;
    const sl = entry * 0.98;
    const tp1 = entry * 1.02;

    const analyse = await prisma.analyse.create({
      data: {
        userId: user.id,
        asset: assets[i],
        timeframe: i % 2 === 0 ? "D1" : "M15",
        mode: modes[i],
        signal: signals[i],
        confidence: 60 + Math.floor(Math.random() * 35),
        entry,
        stopLoss: sl,
        tp1,
        rrRatio: 2,
        positionSize: 0.5,
        positionUnit: assets[i].split("/")[0],
        riskFCFA: 2500,
        gainTP1FCFA: 5000,
        tendance: signals[i] === "SELL" ? "Baissière" : "Haussière",
        patternDetected: i === 0 ? "Double bottom" : i === 2 ? "Bull flag" : "Aucun pattern clair",
        reasons: [
          { type: "positive", text: "RSI en zone de survente" },
          { type: "warning", text: "Volume faible — attendre confirmation" },
        ],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      },
    });

    // Seed matching trade for first 3
    if (i < 3) {
      await prisma.trade.create({
        data: {
          userId: user.id,
          analyseId: analyse.id,
          asset: assets[i],
          direction: signals[i] === "SELL" ? "SHORT" : "LONG",
          entry,
          exit: i < 2 ? entry * (signals[i] === "SELL" ? 0.97 : 1.03) : null,
          pnlFCFA: i < 2 ? (i === 0 ? 4200 : -1800) : null,
          status: i < 2 ? "closed" : "open",
          closedAt: i < 2 ? new Date(Date.now() - i * 24 * 60 * 60 * 1000) : null,
          openedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log("✅ 5 analyses + 3 trades seeded");
  console.log("\n📋 Credentials:");
  console.log("   Email: test@idjortrade.com");
  console.log("   Password: Test1234!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
