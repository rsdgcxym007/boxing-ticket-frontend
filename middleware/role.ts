import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  if (!token || !parsedUser) {
    // Extract locale from path and add to login route
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";
    return navigateTo(`/${locale}/login`);
  }

  const requiredRole = to.meta.role as string | undefined;
  const userRole = parsedUser.role;

  if (requiredRole && userRole !== requiredRole) {
    // Extract locale from path and add to unauthorized route
    const localeMatch = to.path.match(/^\/(th|en)/);
    const locale = localeMatch ? localeMatch[1] : "th";
    return navigateTo(`/${locale}/unauthorized`);
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
