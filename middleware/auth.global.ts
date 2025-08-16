import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";

/**
 * Global Authentication Middleware
 * บังคับให้ทุกหน้าต้อง login ยกเว้นหน้า login เท่านั้น
 * รองรับ token expiration checking
 */
export default defineNuxtRouteMiddleware((to) => {
  // Prevent /th/admin routing issue by redirecting early
  if (to.path === "/th/admin") {
    return navigateTo("/admin");
  }

  // หน้าที่ไม่ต้อง login (หน้าสาธารณะ)
  const publicPages = [
    "/",
    "/login",
    "/mobile/login",
    "/StandingTicketForm",
    "/ringside",
    "/contacts",
    "/about",
    "/schedule",
    "/news",
    "/gallery",
    "/rules",
  ];

  // หน้าที่ต้อง login เฉพาะ admin/staff
  const protectedPages = ["/admin", "/mobile"];

  // ลบ locale prefix สำหรับการตรวจสอบ (รองรับ prefix_except_default)
  let cleanPath = to.path;

  // ถ้าขึ้นต้นด้วย /en (เพราะ th เป็น default ไม่มี prefix)
  if (cleanPath.startsWith("/en/")) {
    cleanPath = cleanPath.replace(/^\/en/, "") || "/";
  }

  // Remove any remaining double slashes
  cleanPath = cleanPath.replace(/\/+/g, "/");

  // Ensure starts with /
  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }

  const isPublicPage = publicPages.some(
    (page) => cleanPath === page || cleanPath.startsWith(page + "/")
  );

  const isProtectedPage = protectedPages.some((page) =>
    cleanPath.startsWith(page)
  );

  // ถ้าเป็นหน้า public ให้ผ่านไปได้
  if (isPublicPage && !isProtectedPage) {
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

    // สำหรับหน้า mobile/scanner และ mobile/scanner/check-in ต้อง check role
    if (cleanPath.startsWith("/mobile/scanner")) {
      if (!authStore.isAuthenticated || !token || isTokenExpired()) {
        console.log("❌ Authentication required for scanner");
        // redirect ไป mobile login
        return navigateTo("/mobile/login");
      }

      // สำหรับหน้า scanner ต้องมี role admin หรือ staff เท่านั้น
      if (!["admin", "staff"].includes(authStore.user?.role)) {
        console.log("❌ Insufficient permissions for scanner, user role:", authStore.user?.role);
        return navigateTo("/mobile/login");
      }

      console.log("✅ Scanner access granted for user:", authStore.user?.role);
      return; // อนุญาตให้เข้าได้
    }

    // สำหรับหน้า admin ต้อง login และมี role
    if (cleanPath.startsWith("/admin")) {
      if (!authStore.isAuthenticated || !token || isTokenExpired()) {
        console.log("❌ Authentication required for admin");

        if (token && isTokenExpired()) {
          console.log("🕒 Token expired, clearing auth data...");
          authStore.logout();
        }

        // ปรับปรุงการ redirect เพื่อป้องกันการสร้าง /th/admin
        return navigateTo("/login");
      }

      // ตรวจสอบ role สำหรับ admin
      if (!["admin", "staff"].includes(authStore.user?.role)) {
        console.log("❌ Insufficient permissions for admin area");
        return navigateTo("/");
      }
    }
  }
});
