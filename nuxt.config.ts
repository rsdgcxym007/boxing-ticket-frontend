import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  css: [
    "@/assets/css/tailwind.css",
    "@fortawesome/fontawesome-free/css/all.min.css",
  ],
  modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss"],
  devtools: { enabled: false },
  ssr: false,
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
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
        },
      ],
    },
  },
});
