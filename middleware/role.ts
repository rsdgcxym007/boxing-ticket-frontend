import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  if (!token || !parsedUser) {
    return navigateTo("/login");
  }

  const requiredRole = to.meta.role as string | undefined;
  const userRole = parsedUser.role;

  if (requiredRole && userRole !== requiredRole) {
    return navigateTo("/unauthorized");
  }
});
// pages/admin/index.vue
// definePageMeta({
//     middleware: ['role'],
//     role: 'admin', // จะถูกดึงจาก to.meta.role
//   })

// definePageMeta({
//   middleware: ["role"],
//   role: "staff",
// });
