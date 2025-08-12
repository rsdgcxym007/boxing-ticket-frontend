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
    strategy: "prefix_except_default",
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
          href: "/images/logo/LOGOFC.svg",
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
    inlineRouteRules: true,
    viewTransition: false,
    typedPages: false,
  },

  // การตั้งค่าสำหรับ production deployment
  nitro: {
    preset: "node-server",
    experimental: {
      wasm: true,
    },
    compressPublicAssets: true,
    routeRules: {
      // Static asset caching - ป้องกันไม่ให้มี locale prefix
      "/_nuxt/**": {
        headers: { "cache-control": "max-age=31536000" },
        prerender: false,
      },
      "/images/**": {
        headers: { "cache-control": "max-age=31536000" },
        prerender: false,
      },
      "/videos/**": {
        headers: { "cache-control": "max-age=31536000" },
        prerender: false,
      },
      "/fonts/**": {
        headers: { "cache-control": "max-age=31536000" },
        prerender: false,
      },
      // CSS and JS files with proper MIME types
      "/**/*.css": {
        headers: {
          "content-type": "text/css; charset=utf-8",
          "cache-control": "max-age=31536000",
        },
        prerender: false,
      },
      "/**/*.js": {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "max-age=31536000",
        },
        prerender: false,
      },
      "/**/*.mjs": {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "max-age=31536000",
        },
        prerender: false,
      },
      "/**/*.svg": {
        headers: {
          "content-type": "image/svg+xml",
          "cache-control": "max-age=31536000",
        },
        prerender: false,
      },
      "/**/*.woff2": {
        headers: {
          "content-type": "font/woff2",
          "cache-control": "max-age=31536000",
        },
        prerender: false,
      },
      "/**/*.woff": {
        headers: {
          "content-type": "font/woff",
          "cache-control": "max-age=31536000",
        },
        prerender: false,
      },
      "/**/*.ttf": {
        headers: {
          "content-type": "font/ttf",
          "cache-control": "max-age=31536000",
        },
        prerender: false,
      },

      // API Route Rules for caching
      // Analytics data - cache for 5 minutes
      "/api/analytics/**": { isr: 300 },
      // Mobile API - cache for 10 minutes
      "/api/mobile/home": { isr: 600 },
      // AI recommendations - cache for 15 minutes
      "/api/ai-recommendations/**": { isr: 900 },
      // User-specific data - no cache
      "/api/notifications/**": { headers: { "cache-control": "no-cache" } },
      "/api/mobile/settings/**": { headers: { "cache-control": "no-cache" } },
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000",
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || "ws://localhost:4000/realtime",
      appName:
        process.env.NUXT_PUBLIC_APP_NAME || "Patong Boxing Ticket System",
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || "1.0.31",
      environment: process.env.NODE_ENV || "development",
    },
    // Server-side only
    apiSecret: process.env.NUXT_API_SECRET || "",
    jwtSecret: process.env.NUXT_JWT_SECRET || "",
  },

  // Development server configuration
  devServer: {
    port: 3000,
    host: "localhost",
  },

  // Build optimization for production
  build: {
    transpile: [],
  },

  // Vite configuration
  vite: {
    server: {
      fs: {
        allow: [".."],
      },
    },
    css: {
      preprocessorOptions: {
        css: {
          charset: false,
        },
      },
    },
  },

  alias: {
    composables: "<rootDir>/composables",
  },
});
