// Debug Authentication State
// เพิ่มที่ browser console เพื่อตรวจสอบ auth state

export const authDebug = {
  // ตรวจสอบ localStorage
  checkLocalStorage() {
    console.log("=== Local Storage Debug ===");
    console.log("Token:", localStorage.getItem("token"));
    console.log("User:", localStorage.getItem("user"));
    console.log("Token Expiration:", localStorage.getItem("tokenExpiration"));

    // แสดง key ทั้งหมดที่เกี่ยวข้องกับ auth
    const authKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes("auth") || key.includes("user") || key.includes("token"))
      ) {
        authKeys.push({ key, value: localStorage.getItem(key) });
      }
    }

    console.log("Auth-related keys:", authKeys);
  },

  // ตรวจสอบ Store state  
  checkStore() {
    console.log("=== Store Debug ===");
    console.log("Note: Store debug needs to be called from component context");
  },

  // Clear auth data
  clearAuth() {
    console.log("=== Clear Auth Data ===");

    // Clear additional keys that might interfere
    const keys = ["staff_credentials", "remember_credentials", "token", "user", "tokenExpiration"];
    keys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`Removed: ${key}`);
    });

    console.log("✅ All auth data cleared");
  },

  // จำลอง login เพื่อ test
  mockLogin() {
    console.log("=== Mock Login ===");
    const mockUser = {
      id: "test123",
      name: "Test Staff",
      role: "staff",
    };

    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", "mock-token-12345");

    console.log("✅ Mock login completed");
    this.checkStore();
  },

  // ตรวจสอบ route state
  checkRoutes() {
    console.log("=== Route Debug ===");
    console.log("Current Route:", location.pathname);
    console.log("Referrer:", document.referrer);
    console.log("User Agent:", navigator.userAgent);
  },

  // Log auth state (main function used in components)
  logAuthState() {
    if (process.client) {
      console.group("🔐 Auth Debug State");
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

  // Run all checks
  runAll() {
    this.checkLocalStorage();
    this.checkStore();
    this.checkRoutes();
  }
};

// เรียกใช้อัตโนมัติ
if (typeof window !== "undefined") {
  window.debugAuth = authDebug;
  console.log(
    "🔧 Auth Debug Tools loaded. Use window.debugAuth.runAll() to check everything"
  );
}