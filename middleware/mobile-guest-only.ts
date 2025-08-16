import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "@/stores/auth";

/**
 * Mobile Guest Only Middleware
 * อนุญาตให้เฉพาะผู้ใช้ที่ยังไม่ได้ login เข้าถึงหน้า mobile login
 * ถ้า login แล้วให้ redirect ไป mobile dashboard
 */
export default defineNuxtRouteMiddleware((to) => {
  // ทำงานใน client side เท่านั้น
  if (!process.client) return;

  const authStore = useAuthStore();

  // initialize auth store เพื่อ load user จาก localStorage
  authStore.initialize();

  console.log("🔐 Mobile Guest Only Middleware - Checking auth state:", {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    token: process.client ? localStorage.getItem("token") : null,
  });

  // ถ้า login แล้วให้ redirect ไปหน้า mobile dashboard
  if (authStore.isAuthenticated) {
    console.log("✅ User already authenticated, redirecting to mobile dashboard");
    return navigateTo("/mobile");
  }

  console.log("🚪 User not authenticated, allowing access to mobile login");
});
