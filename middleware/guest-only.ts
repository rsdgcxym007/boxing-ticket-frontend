import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";

/**
 * Guest Only Middleware
 * อนุญาตให้เฉพาะผู้ใช้ที่ยังไม่ได้ login เข้าถึงหน้านี้
 * เช่น หน้า login, register
 */
export default defineNuxtRouteMiddleware((to) => {
  // ทำงานใน client side เท่านั้น
  if (!process.client) return;

  const authStore = useAuthStore();

  // initialize auth store เพื่อ load user จาก localStorage
  authStore.initialize();

  // ถ้า login แล้วให้ redirect ไปหน้าที่เหมาะสม
  if (authStore.isAuthenticated) {
    const userRole = authStore.user!.role;

    // Extract locale จาก path
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";

    // redirect ตาม role
    if (userRole === "admin" || userRole === "staff") {
      return navigateTo(`/${locale}/admin`);
    } else {
      return navigateTo(`/${locale}/`); // user ธรรมดาไปหน้าแรก
    }
  }
});
