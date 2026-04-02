import type { Metadata } from "next";
import OnboardingShell from "@/components/onboarding/OnboardingShell";

export const metadata: Metadata = {
  title: "IdjorTrade — Configurer mon profil",
};

export default function OnboardingPage() {
  return <OnboardingShell />;
}
