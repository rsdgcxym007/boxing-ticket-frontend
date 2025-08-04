import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";

/**
 * Global Authentication Middleware
 * ตรวจสอบการ authentication ทุกหน้า ยกเว้นหน้า public
 */
export default defineNuxtRouteMiddleware((to) => {
  // หน้าที่ไม่ต้อง login
  const publicPages = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contacts",
    "/ringside",
    "/components-demo",
  ];

  // ลบ locale prefix สำหรับการตรวจสอบ
  const cleanPath = to.path.replace(/^\/(th|en)/, "") || "/";
  const isPublicPage = publicPages.includes(cleanPath);

  console.log("🔍 Auth Global Debug:", {
    originalPath: to.path,
    cleanPath,
    isPublicPage,
    publicPages,
  });

  // ถ้าเป็นหน้า public ให้ผ่านไปได้
  if (isPublicPage) {
    console.log("✅ Public page - allowing access");
    return;
  }

  // ตรวจสอบ authentication ใน client side เท่านั้น
  if (process.client) {
    const authStore = useAuthStore();

    // initialize auth store เพื่อ load user จาก localStorage
    authStore.initialize();

    const token = localStorage.getItem("token");
    console.log("🔍 Auth Check:", {
      hasToken: !!token,
      hasUser: !!authStore.user,
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.user,
    });

    // ถ้าไม่ได้ login
    if (!authStore.isAuthenticated) {
      console.log("❌ Not authenticated - redirecting to login");
      // Extract locale จาก path
      const localeMatch = to.path.match(/^\/(th|en)/);
      const locale = localeMatch ? localeMatch[1] : "th";

      // redirect ไปหน้า login พร้อม locale
      return navigateTo(`/${locale}/login`);
    } else {
      console.log("✅ Authenticated - allowing access");
    }
  }
});
