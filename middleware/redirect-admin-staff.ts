import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return;

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const role = parsedUser?.role;

  const notFor = ["admin", "staff"];

  if (notFor.includes(role)) {
    // Extract locale from path and add to dashboard route
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";
    return navigateTo(`/${locale}/dashboard`);
  }
});
