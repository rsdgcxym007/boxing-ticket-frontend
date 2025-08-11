import { defineNuxtPlugin } from "nuxt/app";

/**
 * Authentication Plugin
 * Initializes the authentication system when the app starts
 * Handles token expiration and cleanup
 */

export default defineNuxtPlugin({
  name: "auth-init",
  parallel: true,
  async setup(nuxtApp) {
    // Only run on client side
    if (process.client) {
      const { useAuth } = await import("@/composables/useAuth");
      const auth = useAuth();

      // Initialize authentication system
      auth.initializeAuth();

      console.log("🔐 Authentication system initialized");

      // Set up automatic token expiration checking
      const checkTokenExpiration = () => {
        if (auth.isTokenExpired()) {
          console.log("🕒 Token expired during app usage, logging out...");
          auth.initializeAuth(); // This will trigger logout if expired
        }
      };

      // Check token expiration every 30 seconds
      const tokenCheckInterval = setInterval(checkTokenExpiration, 30000);

      // Clean up interval when the page is unloaded
      if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
          clearInterval(tokenCheckInterval);
        });
      }
    }
  },
});
