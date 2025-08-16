// Debug Authentication State
// เพิ่มที่ browser console เพื่อตรวจสอบ auth state

window.debugAuth = {
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
    console.log("All auth-related keys:", authKeys);
  },

  // ตรวจสอบ Pinia Store
  checkStore() {
    const authStore = useAuthStore();
    console.log("=== Auth Store Debug ===");
    console.log("User:", authStore.user);
    console.log("Is Authenticated:", authStore.isAuthenticated);
    console.log("Store State:", JSON.stringify(authStore.$state, null, 2));
  },

  // ล้างข้อมูล authentication ทั้งหมด
  clearAuth() {
    console.log("=== Clearing All Auth Data ===");
    const authStore = useAuthStore();
    authStore.logout();

    // Clear additional keys that might interfere
    const keys = ["staff_credentials", "remember_credentials"];
    keys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`Removed: ${key}`);
    });

    console.log("✅ All auth data cleared");
  },

  // จำลอง login เพื่อ test
  mockLogin() {
    console.log("=== Mock Login ===");
    const authStore = useAuthStore();
    const mockUser = {
      id: "test123",
      name: "Test Staff",
      role: "staff",
    };

    authStore.setUser(mockUser);
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

  // Run all checks
  runAll() {
    this.checkLocalStorage();
    this.checkStore();
    this.checkRoutes();
  },
};

// เรียกใช้อัตโนมัติ
if (typeof window !== "undefined") {
  console.log(
    "🔧 Auth Debug Tools loaded. Use window.debugAuth.runAll() to check everything"
  );
}

export default window.debugAuth;
