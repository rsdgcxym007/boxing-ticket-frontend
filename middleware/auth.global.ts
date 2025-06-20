import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to) => {
  const publicPages = ["/", "/login", "/register", "/about"];
  const isPublic = publicPages.includes(to.path);

  if (isPublic) return;

  const token = localStorage.getItem("token");
  if (!token) return navigateTo("/login");
});
