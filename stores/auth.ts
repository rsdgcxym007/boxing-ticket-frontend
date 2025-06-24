import { defineStore } from "pinia";
import { ref } from "vue";

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
    if (import.meta.client) {
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  const loadUser = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem("user");
      if (saved) {
        user.value = JSON.parse(saved);
      }
    }
    return user.value;
  };

  const logout = () => {
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  return { user, setUser, loadUser, logout };
});
