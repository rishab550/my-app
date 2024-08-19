import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { decode } from "next-auth/jwt";
decode;

export async function middleware(request: NextRequest) {
  const tokenSecret = process.env.TOKEN_SECRET!;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
  const token = request.cookies.get("token")?.value || "";
  const refreshToken = request.cookies.get("refreshToken")?.value || "";
  const path = request.nextUrl.pathname;
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value || "";

  const isPublicPath =
    path === "/signin" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/password/reset" ||
    path === "/password";

  // Handle public paths
  if (isPublicPath) {
    if (token && refreshToken) {
      try {
        // Verify both tokens
        await jwtVerify(token, new TextEncoder().encode(tokenSecret));
        await jwtVerify(
          refreshToken,
          new TextEncoder().encode(refreshTokenSecret)
        );
        return NextResponse.redirect(new URL("/home", request.nextUrl));
      } catch (error) {
        console.log("Invalid token or refresh token, allowing public access.");
      }
    }
  }

  // Handle authenticated paths
  if (!isPublicPath && (token || refreshToken)) {
    try {
      await jwtVerify(token, new TextEncoder().encode(tokenSecret));
      await jwtVerify(
        refreshToken,
        new TextEncoder().encode(refreshTokenSecret)
      );

      // Update the token to ensure it's fresh
      try {
        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (response.ok) {
          const { token: newToken } = await response.json();
          const newResponse = NextResponse.next();
          newResponse.cookies.set("token", newToken, { httpOnly: true });
          return newResponse;
        } else {
          console.log("Token refresh failed.");
          return NextResponse.redirect(new URL("/signin", request.nextUrl));
        }
      } catch (error) {
        console.log("Error during token refresh:", error);
        return NextResponse.redirect(new URL("/signin", request.nextUrl));
      }
    } catch (error) {
      console.log("Token verification failed, redirecting to sign-in.");
      return NextResponse.redirect(new URL("/signin", request.nextUrl));
    }
  }

  if (!isPublicPath) {
    if (sessionToken) {
      try {
        await decode({
          token: sessionToken,
          secret: process.env.NEXTAUTH_SECRET!,
        });
      } catch (error) {
        return NextResponse.redirect(new URL("/signin", request.nextUrl));
      }
    } else {
      return NextResponse.redirect(new URL("/signin", request.nextUrl));
    }

    console.log(token, "Session Response");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signup",
    "/signin",
    "/home",
    "/verifyemail",
    "/password/:path*",
  ],
};
