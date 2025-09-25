"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOGIN_ROUTE } from "@/constants/clientRoutes";
import { AUTH_COOKIE_KEY } from "@/constants/http";;

export const handleLogout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_KEY);
  redirect(LOGIN_ROUTE);
};
