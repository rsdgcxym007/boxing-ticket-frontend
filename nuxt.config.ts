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
  ssr: true,
  i18n: {
    locales: [
      { code: "th", file: "th.json" },
      { code: "en", file: "en.json" },
    ],
    defaultLocale: "th",
    strategy: "prefix",
    langDir: "locales/",
    detectBrowserLanguage: false,
    lazy: true,
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000, // เพิ่มขีดจำกัดคำเตือนเป็น 1MB
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-vue": ["vue", "vue-router"],
            "vendor-ui": ["@headlessui/vue", "lucide-vue-next"],
            "vendor-utils": ["date-fns", "lodash"],
            "vendor-chart": ["chart.js"],
          },
        },
      },
    },
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || "./", // ใช้ relative path สำหรับ Electron
    buildAssetsDir: "_nuxt/", // โฟลเดอร์ asset ตามค่าเริ่มต้น
    cdnURL: process.env.NUXT_APP_BASE_URL || "./", // สำคัญ: ทำให้ assets เป็น relative
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
          href: "./images/logo/LOGOFC.svg", // Fixed for Electron
        },

        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
        },
      ],
    },
  },

  experimental: {
    payloadExtraction: false, // ป้องกันปัญหา payload ใน static build
  },

  // ถ้าต้องการใช้ hashMode เฉพาะ Electron ให้ใช้ process.env.IS_ELECTRON
  router: process.env.IS_ELECTRON
    ? {
        options: {
          hashMode: true,
        },
      }
    : {},

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000/api",
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
    },
  },
});
