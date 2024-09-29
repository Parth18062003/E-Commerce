// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the public routes
const PUBLIC_ROUTES = [
  "/authentication/sign-in",
  "/authentication/sign-up",
  "/authentication/2fa",
  "/",
];

const AUTHENTICATION_ROUTES = [
  "/authentication/sign-in",
  "/authentication/sign-up",
];

// Define the protected routes
const PROTECTED_ROUTES = ["/dashboard", "/dashboard/user"];

const ADMIN_ROUTES = ["/dashboard/adminsken/"];
const USER_ROUTES = ["/dashboard/user/", "/user/profile","/dashboard/admin/"];

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("token");
  const { pathname } = request.nextUrl;
  const token = tokenCookie ? tokenCookie.value : null; // Get the cookie value
  const userRoles = token ? JSON.parse(atob(token.split('.')[1]))?.roles || [] : []; 

  const authenticationRoutes = AUTHENTICATION_ROUTES.includes(pathname);

  if (authenticationRoutes && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // If the route is protected and the token is missing, redirect to sign-in
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/authentication/sign-in", request.url));
  }

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isUserRoute = USER_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute && !userRoles.includes("ROLE_ADMIN")) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect if not admin
  }

  if (isUserRoute && !userRoles.includes("ROLE_USER") && !userRoles.includes("ROLE_ADMIN")) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect if not user
  }
  // Allow the request to continue for all other cases
  return NextResponse.next();
}

// Apply middleware to all routes except API routes and static files
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
