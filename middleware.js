import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;
  const token = await getToken({
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
    req,
    secret: process.env.JWT_SECRET,
  });

  if (pathname.startsWith("/_next/") || pathname.includes(".")) {
    return;
  }

  if (pathname.startsWith("/api/auth") || token) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
