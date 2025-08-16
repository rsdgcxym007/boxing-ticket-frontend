import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useApi } from "~/composables/useApi";

export interface User {
  id: string;
  name: string;
  role: string;
  // เพิ่ม field อื่น ๆ ตามต้องการ เช่น email, token ฯลฯ
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const setUser = (newUser: User) => {
    user.value = newUser;
    if (process.client) {
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  const loadUser = () => {
    if (process.client) {
      const saved = localStorage.getItem("user");
      if (saved) {
        user.value = JSON.parse(saved);
      }
    }
    return user.value;
  };

  // Computed สำหรับตรวจสอบว่า login แล้วหรือยัง
  const isAuthenticated = computed(() => {
    const token = process.client ? localStorage.getItem("token") : null;
    const hasUser = !!user.value;
    const hasToken = !!token;

    const result = hasToken && hasUser;

    console.log("🔍 Auth Store isAuthenticated:", {
      hasToken,
      hasUser,
      user: user.value,
      token: token ? "***" + token.slice(-8) : null,
      result,
    });

    return result;
  });

  // เพิ่ม function initialize เพื่อ load ข้อมูลเมื่อเริ่มต้น
  const initialize = () => {
    if (process.client) {
      console.log("🔄 Auth Store: Initializing...");

      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      console.log("🔍 Found in localStorage:", {
        hasToken: !!token,
        token: token ? "***" + token.slice(-8) : null,
        hasUser: !!savedUser,
        savedUser: savedUser ? JSON.parse(savedUser) : null,
      });

      const loadedUser = loadUser();

      console.log("✅ Auth Store initialized:", {
        user: loadedUser,
        isAuthenticated: isAuthenticated.value,
      });
    }
  };

  const logout = () => {
    console.log("🏪 Auth Store: Starting logout...");
    console.log("Current user before logout:", user.value);

    user.value = null;
    if (process.client) {
      console.log("🧹 Auth Store: Clearing localStorage...");

      // Clear all authentication related data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");

      // Clear any other potential auth data
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Clear any cached user preferences that might interfere
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("auth_") || key.startsWith("user_"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => {
        console.log(`Removing key: ${key}`);
        localStorage.removeItem(key);
      });

      console.log("✅ Auth Store: Logout completed");
    }
  };

  const login = async (username: string, password: string, deviceInfo: any) => {
    console.log("🔑 Auth Store: Attempting login with username:", username);

    try {
      // Use the existing useApi composable
      const { post } = useApi();

      // Call the login API - use email instead of username
      const responseData = await post("/api/v1/auth/login", {
        email: username, // Backend expects 'email' field
        password,
        deviceInfo,
      });

      // Save user and token
      const user: User = {
        id: responseData.id,
        name: responseData.name,
        role: responseData.role,
      };

      setUser(user);
      if (process.client) {
        localStorage.setItem("token", responseData.token);
      }

      console.log("✅ Auth Store: Login successful", user);
      return user;
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  return {
    user,
    setUser,
    loadUser,
    logout,
    isAuthenticated,
    initialize,
    login,
  };
});
