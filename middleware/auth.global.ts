import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to) => {
  const publicPages = ["/", "/login", "/register", "/about"];

  // Remove locale prefix for checking
  const cleanPath = to.path.replace(/^\/(th|en)/, "") || "/";
  const isPublic = publicPages.includes(cleanPath);

  if (isPublic) return;

  const token = localStorage.getItem("token");
  if (!token) {
    // Extract locale from path and add to login route
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";
    return navigateTo(`/${locale}/login`);
  }
});
