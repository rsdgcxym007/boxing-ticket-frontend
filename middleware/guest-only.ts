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

  console.log("🔐 Guest Only Middleware - Current route:", to.path);
  console.log("🔍 Auth state:", {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    token: process.client ? localStorage.getItem("token") : null,
  });

  // ถ้า login แล้วให้ redirect ไปหน้าที่เหมาะสม
  if (authStore.isAuthenticated) {
    const userRole = authStore.user!.role;

    console.log("✅ User authenticated, role:", userRole);

    // ถ้าเป็น mobile route ให้ redirect ไป mobile dashboard
    if (to.path.includes("/mobile/")) {
      console.log("📱 Mobile route detected, redirecting to mobile dashboard");
      return navigateTo("/mobile");
    }

    // Extract locale จาก path
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";

    // redirect ตาม role สำหรับ desktop
    if (userRole === "admin" || userRole === "staff") {
      console.log("👨‍💼 Admin/Staff user, redirecting to admin panel");
      return navigateTo(`/${locale}/admin`);
    } else {
      console.log("👤 Regular user, redirecting to home");
      return navigateTo(`/${locale}/`); // user ธรรมดาไปหน้าแรก
    }
  }

  console.log("🚪 User not authenticated, allowing access to login page");
});
