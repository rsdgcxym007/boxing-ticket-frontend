import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-04",
  css: [
    "@/assets/css/fonts.css",
    "@/assets/css/main.css",
    "@fortawesome/fontawesome-free/css/all.min.css",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss", "@pinia/nuxt"],

  // Auto import configuration
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/components/base",
      prefix: "Base",
      pathPrefix: false,
    },
    {
      path: "~/components/charts",
      prefix: "Chart",
      pathPrefix: false,
    },
    {
      path: "~/components/dashboard",
      prefix: "Dashboard",
      pathPrefix: false,
    },
  ],

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
    bundle: {
      optimizeTranslationDirective: false, // แก้ warning
    },
  },

  app: {
    baseURL: "/",
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
      ],
      title: "PATONG BOXING",
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
        },
      ],
    },
  },

  experimental: {
    payloadExtraction: false,
  },

  // การตั้งค่าสำหรับ production deployment
  nitro: {
    preset: "node-server",
    experimental: {
      wasm: true,
    },
    compressPublicAssets: true,
    routeRules: {
      // Static asset caching
      "/_nuxt/**": { headers: { "cache-control": "max-age=31536000" } },
      "/images/**": { headers: { "cache-control": "max-age=31536000" } },
      "/videos/**": { headers: { "cache-control": "max-age=31536000" } },
      "/fonts/**": { headers: { "cache-control": "max-age=31536000" } },
      // CSS and JS files with proper MIME types
      "/**/*.css": {
        headers: {
          "content-type": "text/css; charset=utf-8",
          "cache-control": "max-age=31536000",
        },
      },
      "/**/*.js": {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "max-age=31536000",
        },
      },
      "/**/*.mjs": {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "max-age=31536000",
        },
      },
      "/**/*.svg": {
        headers: {
          "content-type": "image/svg+xml",
          "cache-control": "max-age=31536000",
        },
      },
      "/**/*.woff2": {
        headers: {
          "content-type": "font/woff2",
          "cache-control": "max-age=31536000",
        },
      },
      "/**/*.woff": {
        headers: {
          "content-type": "font/woff",
          "cache-control": "max-age=31536000",
        },
      },
      "/**/*.ttf": {
        headers: {
          "content-type": "font/ttf",
          "cache-control": "max-age=31536000",
        },
      },
    },
  },

  // การตั้งค่าสำหรับ VPS deployment
  router: {
    options: {
      hashMode: false, // ใช้ history mode สำหรับ clean URLs
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000/api",
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
    },
  },

  // Build optimization for production
  build: {
    transpile: [],
  },
});
