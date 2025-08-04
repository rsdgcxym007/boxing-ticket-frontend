import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";

/**
 * Admin/Staff Only Middleware
 * อนุญาตให้เฉพาะ admin และ staff เข้าถึงหน้านี้เท่านั้น
 */
export default defineNuxtRouteMiddleware((to) => {
  // ทำงานใน client side เท่านั้น
  if (!process.client) return;

  const authStore = useAuthStore();

  console.log("authStoredqwdqwdwqdqwdwdq", authStore);

  // initialize auth store เพื่อ load user จาก localStorage
  authStore.initialize();

  console.log("authStoredwqdqwdqqqqqqqq", authStore);

  // ตรวจสอบ authentication
  if (!authStore.isAuthenticated) {
    // Extract locale จาก path
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";
    return navigateTo(`/${locale}/login`);
  }

  // ตรวจสอบ role
  const userRole = authStore.user!.role;
  console.log("userRoleuserRoleuserRole", userRole);

  const allowedRoles = ["admin", "staff"];

  if (!allowedRoles.includes(userRole)) {
    // Extract locale จาก path
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";
    return navigateTo(`/${locale}/unauthorized`);
  }
});
