import { defineNuxtPlugin } from "nuxt/app";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    toastClassName: "custom-toast",
    timeout: 5000,
    position: "top-center",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    hideProgressBar: false,
    transition: "Vue-Toastification__fade",
    maxToasts: 5,
    newestOnTop: true,
  });
});
