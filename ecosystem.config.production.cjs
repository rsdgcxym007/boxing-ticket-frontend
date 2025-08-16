module.exports = {
  apps: [
    // Main frontend application
    {
      name: "patong-boxing-frontend",
      script: ".output/server/index.mjs",
      instances: 1,
      exec_mode: "fork",
      cwd: "/var/www/patongboxing-frontend",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        NITRO_HOST: "0.0.0.0",
        NITRO_PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NITRO_HOST: "0.0.0.0",
        NITRO_PORT: 3000,
        // API Configuration from Quick Start Guide
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
      // Performance & Monitoring
      max_memory_restart: "1G",
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: "10s",
      autorestart: true,
      // Logging
      log_file: "./logs/frontend-combined.log",
      out_file: "./logs/frontend-out.log",
      error_file: "./logs/frontend-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Advanced options
      node_args: "--max-old-space-size=1024",
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
      time: true,
      source_map_support: true,
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_interval: 5000,
      kill_timeout: 1600,
      wait_ready: true,
      listen_timeout: 3000,
      // Cron restart (restart every day at 3 AM)
      cron_restart: "0 3 * * *",
    },

    // GitHub Webhook Server
    {
      name: "patong-boxing-webhook",
      script: "./scripts/webhook-server-clean.js",
      instances: 1,
      exec_mode: "fork",
      cwd: "/var/www/patongboxing-frontend",
      env: {
        NODE_ENV: "production",
        WEBHOOK_PORT: 4200,
        WEBHOOK_SECRET: "patong-boxing-webhook-secret-2025",
        DEPLOY_SCRIPT: "/var/www/patongboxing-frontend/scripts/auto-deploy.sh",
        DISCORD_WEBHOOK:
          "https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l",
      },
      // Performance settings
      max_memory_restart: "256M",
      restart_delay: 2000,
      max_restarts: 5,
      min_uptime: "10s",
      autorestart: true,
      // Logging
      log_file: "./logs/webhook-combined.log",
      out_file: "./logs/webhook-out.log",
      error_file: "./logs/webhook-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Advanced options
      watch: false,
      merge_logs: true,
      time: true,
      // Health monitoring
      health_check_grace_period: 2000,
      health_check_interval: 10000,
      kill_timeout: 1600,
    },
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: "root",
      host: "43.229.133.51",
      ref: "origin/featues/v1",
      repo: "https://github.com/rsdgcxym007/boxing-ticket-frontend.git",
      path: "/var/www/patongboxing-frontend",
      ssh_options: "StrictHostKeyChecking=no",
      "pre-setup": "apt update && apt install -y git nodejs npm",
      "post-deploy": [
        "npm ci --production=false",
        "npm run build",
        "chmod +x ./scripts/*.sh",
        "mkdir -p logs",
        "pm2 startOrRestart ecosystem.config.cjs --env production",
        "pm2 save",
        "pm2 startup",
      ].join(" && "),
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
