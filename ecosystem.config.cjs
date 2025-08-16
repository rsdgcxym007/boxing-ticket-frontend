module.exports = {
  apps: [
    {
      name: "boxing-ticket-frontend",
      script: ".output/server/index.mjs",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        NITRO_HOST: "0.0.0.0",
        NITRO_PORT: 3000,
        NUXT_PUBLIC_API_BASE: "http://localhost:4000",
        NUXT_PUBLIC_SOCKET_URL: "http://localhost:4000",
        NUXT_PUBLIC_WS_URL: "ws://localhost:4000/realtime",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NITRO_HOST: "0.0.0.0",
        NITRO_PORT: 3000,
        // Updated API endpoints according to Quick Start Guide
        NUXT_PUBLIC_API_BASE_URL: "https://api.patongboxingstadiumticket.com",
        NUXT_PUBLIC_APP_URL: "https://patongboxingstadiumticket.com",
        API_URL: "https://api.patongboxingstadiumticket.com/api",
        // Legacy compatibility
        NUXT_PUBLIC_API_BASE: "https://api.patongboxingstadiumticket.com",
        NUXT_PUBLIC_SOCKET_URL: "https://api.patongboxingstadiumticket.com",
        NUXT_PUBLIC_WS_URL: "wss://api.patongboxingstadiumticket.com/realtime",
        // QR Scanner configuration
        NUXT_PUBLIC_QR_TIMEOUT: "15000",
        NUXT_PUBLIC_CAMERA_FACING_MODE: "environment",
        NUXT_PUBLIC_DEBUG_MODE: "false",
        // App configuration
        NUXT_PUBLIC_APP_NAME: "Patong Boxing Stadium Ticket System",
        NUXT_PUBLIC_APP_VERSION: "1.0.31",
        // Feature flags
        ENABLE_ANALYTICS: true,
        ENABLE_AI_RECOMMENDATIONS: true,
        ENABLE_REALTIME: true,
        ENABLE_MOBILE_APP: true,
        ENABLE_NOTIFICATIONS: true,
        // Security
        NUXT_JWT_SECRET: "patong-boxing-jwt-secret-production-2025",
        NUXT_API_SECRET: "patong-boxing-api-secret-production-2025",
      },

      // Restart configuration
      max_memory_restart: "1G",
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: "10s",
      autorestart: true,

      // Logging
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Performance
      node_args: "--max-old-space-size=1024",

      // Health monitoring
      health_check_grace_period: 3000,
      health_check_interval: 5000,

      // Graceful shutdown
      kill_timeout: 1600,
      wait_ready: true,
      listen_timeout: 3000,

      // Other options
      watch: false,
      ignore_watch: [
        "node_modules",
        "logs",
        ".git",
        ".nuxt",
        ".output",
        "dist",
      ],
      merge_logs: true,
      combine_logs: true,
      force: true,
      time: true,
      // Instance variable
      instance_var: "INSTANCE_ID",

      // Source map support
      source_map_support: true,

      // Cron restart (restart every day at 3 AM)
      cron_restart: "0 3 * * *",
    },
  ],

  // Deployment configuration for PM2 deploy
  deploy: {
    production: {
      user: "root",
      host: "43.229.133.51",
      ref: "origin/featues/v1", // ใช้ branch ปัจจุบัน
      repo: "https://github.com/rsdgcxym007/boxing-ticket-frontend.git",
      path: "/var/www/patongboxing-frontend",
      "pre-setup": "apt update && apt install -y git nodejs npm",
      "post-deploy":
        "npm ci && npm run build && chmod +x ./scripts/*.sh && pm2 startOrRestart ecosystem.config.cjs --env production && pm2 save && pm2 startup",
      ssh_options: "StrictHostKeyChecking=no",
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
