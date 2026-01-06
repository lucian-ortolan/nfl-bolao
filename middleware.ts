import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/rodadas", "/rodada", "/ranking", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!PROTECTED.some((p) => pathname.startsWith(p)))
    return NextResponse.next();

  const token = req.cookies.get("session")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/rodadas/:path*",
    "/rodada/:path*",
    "/ranking/:path*",
    "/admin/:path*",
  ],
};
