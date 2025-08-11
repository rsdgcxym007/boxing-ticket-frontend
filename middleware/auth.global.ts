import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";

/**
 * Global Authentication Middleware
 * บังคับให้ทุกหน้าต้อง login ยกเว้นหน้า login เท่านั้น
 * รองรับ token expiration checking
 */
export default defineNuxtRouteMiddleware((to) => {
  // หน้าที่ไม่ต้อง login (เหลือแค่หน้า login เท่านั้น)
  const publicPages = ["/login"];

  // ลบ locale prefix สำหรับการตรวจสอบ (รองรับ prefix_except_default)
  let cleanPath = to.path;

  // ถ้าขึ้นต้นด้วย /en (เพราะ th เป็น default ไม่มี prefix)
  if (cleanPath.startsWith("/en/")) {
    cleanPath = cleanPath.replace(/^\/en/, "") || "/";
  }

  const isPublicPage = publicPages.includes(cleanPath);

  // ถ้าเป็นหน้า public ให้ผ่านไปได้
  if (isPublicPage) {
    return;
  }

  // ตรวจสอบ authentication ใน client side เท่านั้น
  if (process.client) {
    const authStore = useAuthStore();

    // initialize auth store เพื่อ load user จาก localStorage
    authStore.initialize();

    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    // ตรวจสอบว่า token หมดอายุหรือไม่
    const isTokenExpired = () => {
      if (!tokenExpiration) return true;
      return Date.now() > parseInt(tokenExpiration);
    };

    // ถ้าไม่ได้ login หรือ token หมดอายุ
    if (!authStore.isAuthenticated || !token || isTokenExpired()) {
      console.log("❌ Authentication failed:", {
        hasUser: !!authStore.user,
        hasToken: !!token,
        isExpired: isTokenExpired(),
        tokenExpiration: tokenExpiration
          ? new Date(parseInt(tokenExpiration)).toISOString()
          : null,
      });

      // ถ้า token หมดอายุ ให้ clear ข้อมูล authentication
      if (token && isTokenExpired()) {
        console.log("🕒 Token expired, clearing auth data...");
        authStore.logout();
      }

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
