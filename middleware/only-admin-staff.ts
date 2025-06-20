import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(() => {
  if (!process.client) return;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const role = parsedUser?.role;

  if (!token || !parsedUser) {
    return navigateTo("/login");
  }

  if (role !== "admin" && role !== "staff") {
    return navigateTo("/unauthorized");
  }
});

// definePageMeta({
//   middleware: ["only-admin-staff"],
// });
