/**
 * Authentication Debug Utility
 * Helps identify and log auth state issues
 */

export const authDebug = {
  logAuthState() {
    if (process.client) {
      console.group("🔐 Auth Debug State");
      console.log("Current URL:", window.location.href);
      console.log("Auth Token:", localStorage.getItem("auth_token"));
      console.log("Auth User:", localStorage.getItem("auth_user"));
      console.log("All localStorage keys:", Object.keys(localStorage));
      console.log("All auth-related localStorage:");

      Object.keys(localStorage).forEach((key) => {
        if (
          key.toLowerCase().includes("auth") ||
          key.toLowerCase().includes("token") ||
          key.toLowerCase().includes("user")
        ) {
          console.log(`  ${key}:`, localStorage.getItem(key));
        }
      });

      console.groupEnd();
    }
  },

  clearAllAuthData() {
    if (process.client) {
      console.log("🧹 Clearing all auth data...");
      const keysToRemove = Object.keys(localStorage).filter(
        (key) =>
          key.toLowerCase().includes("auth") ||
          key.toLowerCase().includes("token") ||
          key.toLowerCase().includes("user")
      );

      keysToRemove.forEach((key) => {
        console.log(`Removing: ${key}`);
        localStorage.removeItem(key);
      });

      console.log("✅ Auth data cleared");
    }
  },

  testLoginFlow() {
    if (process.client) {
      console.group("🧪 Testing Login Flow");
      this.logAuthState();

      // Test navigation
      console.log("Current route:", window.location.pathname);

      console.groupEnd();
    }
  },
};

// Make it globally available in development
if (process.client && process.dev) {
  (window as any).authDebug = authDebug;
  console.log("🔧 authDebug utility available as window.authDebug");
}
