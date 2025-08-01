import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  css: [
    "@/assets/css/fonts.css",
    "@/assets/css/main.css",
    "@fortawesome/fontawesome-free/css/all.min.css",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss", "@pinia/nuxt"],

  devtools: { enabled: false },
  ssr: false,

  // Electron specific configuration
  router: {
    options: {
      hashMode: true, // Required for Electron
    },
  },

  imports: {
    dirs: ["composables", "stores", "components", "utils", "vue-i18n", "dayjs"],
  },

  components: [
    {
      path: "@/components",
      pathPrefix: false, // ถ้าอยากให้ใช้ชื่อไฟล์ตรงๆ โดยไม่ต้องพิมพ์ชื่อโฟลเดอร์
    },
  ],

  i18n: {
    defaultLocale: "th",
    detectBrowserLanguage: false,
    strategy: "no_prefix",
    langDir: "./locales/",
    locales: [
      { code: "en", iso: "en-US", file: "en.json" },
      { code: "th", iso: "th-TH", file: "th.json" },
    ],
    customRoutes: "config",
  },

  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      charset: "utf-8",
      title: "PATONG BOXING",
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/images/logo/LOGOFC.svg",
        },

        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000/api",
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
    },
  },
});
