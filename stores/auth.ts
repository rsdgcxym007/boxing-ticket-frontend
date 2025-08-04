import { ref } from "vue";
import { defineStore } from "pinia";

export interface User {
  id: string;
  name: string;
  role: string;
  // เพิ่ม field อื่น ๆ ตามต้องการ เช่น email, token ฯลฯ
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null); // ✅ แก้ตรงนี้

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

  const logout = () => {
    console.log("🏪 Auth Store: Starting logout...");
    console.log("Current user before logout:", user.value);

    user.value = null;
    if (process.client) {
      console.log("🧹 Auth Store: Clearing localStorage...");

      // Clear all authentication related data
      localStorage.removeItem("user");
      localStorage.removeItem("token");

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

  return { user, setUser, loadUser, logout };
});
