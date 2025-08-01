import { Icon } from "@iconify/vue";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Icon", Icon);
});
