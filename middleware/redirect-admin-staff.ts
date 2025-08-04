import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";

/**
 * Redirect Admin/Staff Middleware
 * redirect admin และ staff ไปหน้า dashboard แทนที่จะอยู่หน้าปกติ
 */
export default defineNuxtRouteMiddleware((to) => {
  // ทำงานใน client side เท่านั้น
  if (!process.client) return;

  const authStore = useAuthStore();

  // initialize auth store เพื่อ load user จาก localStorage
  authStore.initialize();

  // ถ้าไม่มี user ให้ผ่านไป (จะถูกจัดการโดย auth.global.ts)
  if (!authStore.user) return;

  const userRole = authStore.user.role;
  const restrictedRoles = ["admin", "staff"];

  // ถ้าเป็น admin หรือ staff ให้ redirect ไป dashboard
  if (restrictedRoles.includes(userRole)) {
    // Extract locale จาก path
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";

    // redirect ไป admin dashboard
    return navigateTo(`/${locale}/admin`);
  }
});
