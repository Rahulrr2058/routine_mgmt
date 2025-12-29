import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Function to get user from cookies
function getUser(request: NextRequest): any {
    const user = request.cookies.get("user")?.value;
    return (user && JSON.parse(user)) || "";
}

// Function to get token from cookies
function getUserToken(request: NextRequest): string | null {
    return request.cookies.get("token")?.value || null;
}

function getUserRole(request: NextRequest): string | null {
    return request.cookies.get("role")?.value || null;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl || "";
    const token = getUserToken(request);
    const user = getUser(request);
    const role = getUserRole(request);

    const needsAuth =
        pathname?.startsWith("/dashboard")
    const isLogin = pathname.startsWith("/login");

    if (needsAuth && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Prevent logged-in users from accessing login page again
    if (isLogin && token) {
        if ((user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && pathname !== "/dashboard") {
            return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
        } else if (pathname !== "/") {
            return NextResponse.redirect(new URL("/", request.nextUrl));
        }
    }

    return NextResponse.next();
}

// ✅ Add all paths that require middleware to run
export const config = {
    matcher: ["/", "/login", "/glow-scan", "/cart", "/checkout", "/dashboard/:path*"],
};
