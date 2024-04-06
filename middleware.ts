import { getSession } from "./lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/auth/login", "/auth/register"];

export default async function middleware(req: NextRequest) {
  const isAuth = await getSession();

  if (!isAuth && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  console.log(isAuth && authRoutes.includes(req.nextUrl.pathname));

  if (isAuth && authRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*", "/profile"],
};
