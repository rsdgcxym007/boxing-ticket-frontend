import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";

/**
 * Admin Only Middleware
 * อนุญาตให้เฉพาะ admin เข้าถึงหน้านี้เท่านั้น
 */
export default defineNuxtRouteMiddleware((to) => {
  // ทำงานใน client side เท่านั้น
  if (!process.client) return;

  const authStore = useAuthStore();

  // initialize auth store เพื่อ load user จาก localStorage
  authStore.initialize();

  // ตรวจสอบ authentication
  if (!authStore.isAuthenticated) {
    // Extract locale จาก path
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";
    return navigateTo(`/${locale}/login`);
  }

  // ตรวจสอบ role - เฉพาะ admin เท่านั้น
  const userRole = authStore.user!.role;

  if (userRole !== "admin") {
    // Extract locale จาก path
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";

    // redirect ตาม role
    if (userRole === "staff") {
      return navigateTo(`/${locale}/admin`); // staff ไป admin หน้าทั่วไป
    } else {
      return navigateTo(`/${locale}/unauthorized`); // user ไป unauthorized
    }
  }
});
