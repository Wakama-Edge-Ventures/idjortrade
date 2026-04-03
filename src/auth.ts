export const runtime = "nodejs";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("authorize called:", credentials?.email);
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          console.log("user found:", !!user);
          if (!user) return null;

          const match = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          console.log("password match:", match);
          if (!match) return null;

          if (!user.emailVerified) {
            // NextAuth v5 swallows thrown errors from authorize() —
            // return a sentinel object instead so the jwt callback can detect it
            return {
              id: 'unverified',
              email: user.email,
              name: '',
              prenom: '',
              plan: 'FREE' as const,
              emailNotVerified: true,
            };
          }

          return {
            id: user.id,
            email: user.email,
            name: user.prenom,
            prenom: user.prenom,
            plan: user.plan,
          };
        } catch (error) {
          console.error("authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-authjs.session-token' 
        : 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' 
          ? '.wickox.com' 
          : 'localhost',
      },
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (user.id === 'unverified') {
          token.id = 'unverified';
          token.emailNotVerified = true;
          token.prenom = '';
          token.plan = 'FREE';
        } else {
          token.id = user.id as string;
          token.plan = user.plan;
          token.prenom = user.prenom;
          token.emailNotVerified = false;
        }
      }
      // When update() is called from the client with new data
      if (trigger === "update" && session) {
        if (session.prenom) token.prenom = session.prenom;
        if (session.plan) token.plan = session.plan;
      }
      return token;
    },
    async session({ session, token }) {
      // Unverified sentinel — expose flag, skip Prisma lookup
      if (token.id === 'unverified' || token.emailNotVerified) {
        session.user.id = 'unverified';
        session.user.emailNotVerified = true;
        session.user.prenom = '';
        session.user.plan = 'FREE';
        return session;
      }
      if (token.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { prenom: true, plan: true },
        });
        if (user) {
          session.user.id = token.sub;
          session.user.prenom = user.prenom;
          session.user.plan = user.plan;
          session.user.emailNotVerified = false;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
