import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: string;
      prenom: string;
    } & DefaultSession["user"];
  }

  interface User {
    plan: string;
    prenom: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan: string;
    prenom: string;
  }
}
