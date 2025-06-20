import { defineStore } from "pinia";
import { ref } from "vue";
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);

  const setUser = (newUser) => {
    user.value = newUser;
    localStorage.setItem("user", JSON.stringify(newUser));
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

  return { user, setUser, loadUser };
});
