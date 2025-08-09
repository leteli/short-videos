import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendServerHttpRequest } from "./utils/http/sendServerHttpRequest";
import { AUTH_COOKIE_KEY, HttpRequestMethods } from "./constants/http";
import { API_VERIFY_TOKEN } from "./constants/serverHttp";
import { LOGIN_ROUTE } from "./constants/clientRoutes";

export const config = {
  matcher: ["/chats/:path*", "/login"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  try {
    const token = req.cookies.get(AUTH_COOKIE_KEY)?.value;

    if (!token && pathname !== LOGIN_ROUTE) {
      return NextResponse.redirect(new URL(LOGIN_ROUTE, req.nextUrl));
    }
    if (!token) {
      return;
    }

    const result = await sendServerHttpRequest<
      void,
      { id: string; username: string }
    >({
      url: API_VERIFY_TOKEN,
      method: HttpRequestMethods.Get,
      headers: {
        Cookie: `${AUTH_COOKIE_KEY}=${token}`,
      },
    });
    if (!result?.data?.id) {
      (await cookies()).delete(AUTH_COOKIE_KEY);
      return NextResponse.redirect(new URL(LOGIN_ROUTE, req.nextUrl));
    }
    if (pathname === LOGIN_ROUTE) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    const searchParams = new URLSearchParams(result.data);

    const url = new URL(`${pathname}?${searchParams}`, req.nextUrl);
    return NextResponse.rewrite(url);
  } catch (error: unknown) {
    console.error(
      `[middleware] Error at path ${req.nextUrl.pathname}: ${error}`
    );
    (await cookies()).delete(AUTH_COOKIE_KEY);
    if (req.nextUrl.pathname !== LOGIN_ROUTE) {
      return NextResponse.redirect(new URL(LOGIN_ROUTE, req.nextUrl));
    }
  }
}
