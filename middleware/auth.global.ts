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
    "/StandingTicketForm",
  ];

  // ลบ locale prefix สำหรับการตรวจสอบ (รองรับ prefix_except_default)
  let cleanPath = to.path;

  // ถ้าขึ้นต้นด้วย /en (เพราะ th เป็น default ไม่มี prefix)
  if (cleanPath.startsWith("/en/")) {
    cleanPath = cleanPath.replace(/^\/en/, "") || "/";
  }

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

      // สำหรับ prefix_except_default: th ไม่มี prefix, en มี /en/
      const currentLocale = to.path.startsWith("/en/") ? "en" : "th";
      const loginPath = currentLocale === "en" ? "/en/login" : "/login";

      // redirect ไปหน้า login
      return navigateTo(loginPath);
    } else {
      console.log("✅ Authenticated - allowing access");
    }
  }
});
