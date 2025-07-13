import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(() => {
  if (!process.client) return;

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const role = parsedUser?.role;

  const notFor = ["admin", "staff"];

  if (notFor.includes(role)) {
    return navigateTo("/dashboard");
  }
});
