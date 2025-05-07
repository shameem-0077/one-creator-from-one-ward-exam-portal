import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  if (request.nextUrl.pathname === "/") {

    return NextResponse.redirect(
      new URL("/login?action=promocode", request.url)
    );
  }

  const protectedPaths = [ "/entrance", "/entrance/start", "/entrance/questions", "/entrance/completed"];
  const protectedRoutes = ["name", "class", "division"];
  const action = request.nextUrl.searchParams.get("action");
  const isProtectedPath = protectedPaths.includes(request.nextUrl.pathname);
  const isProtectedAction = request.nextUrl.pathname === "/login" && protectedRoutes.includes(action || "");
  const token = request.cookies.get("access_token")?.value;

  if ((isProtectedPath || isProtectedAction) && !token) {
    return NextResponse.redirect(new URL("/protected-warning", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/entrance", "/entrance/start", "/entrance/questions", "/entrance/completed"],
  
};
