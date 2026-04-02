import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = pathname === "/";
  const isApi = pathname.startsWith("/api");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isStatic =
    pathname.startsWith("/_next") || pathname.includes("favicon");

  if (isPublic || isApi || isAuthPage || isStatic) {
    return NextResponse.next();
  }

  // NextAuth v5 utilise "authjs.*", v4 utilisait "next-auth.*"
  const sessionToken =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token") ||
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
