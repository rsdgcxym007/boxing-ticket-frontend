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
        NUXT_PUBLIC_API_BASE: "http://43.229.133.51:4000",
        NUXT_PUBLIC_SOCKET_URL: "http://43.229.133.51:4000",
        NUXT_PUBLIC_WS_URL: "ws://43.229.133.51:4000/realtime",
        NUXT_PUBLIC_APP_NAME: "Patong Boxing Ticket System",
        NUXT_PUBLIC_APP_VERSION: "1.0.31",
        ENABLE_ANALYTICS: true,
        ENABLE_AI_RECOMMENDATIONS: true,
        ENABLE_REALTIME: true,
        ENABLE_MOBILE_APP: true,
        ENABLE_NOTIFICATIONS: true,
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
    {
      name: "boxing-webhook",
      script: "webhook-server.mjs",
      instances: 1,
      exec_mode: "fork",
      cwd: ".",
      env: {
        NODE_ENV: "development",
        PORT: 4300,
        APP_DIR: "/var/www/frontend/boxing-ticket-frontend",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4300,
        APP_DIR: "/var/www/frontend/boxing-ticket-frontend",
      },
      watch: false,
      log_file: "./logs/webhook-combined.log",
      out_file: "./logs/webhook-out.log",
      error_file: "./logs/webhook-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      max_memory_restart: "256M",
      restart_delay: 1000,
      time: true,
    },
  ],

  // Deployment configuration for PM2 deploy
  deploy: {
    production: {
      user: "deploy",
      host: "43.229.133.51",
      ref: "origin/main",
      repo: "git@github.com:your-username/boxing-ticket-frontend.git",
      path: "/var/www/boxing-ticket-frontend",
      "post-deploy":
        "npm ci && npm run build && chmod +x ./pre-deploy-cleanup.sh && ./pre-deploy-cleanup.sh && pm2 start ecosystem.config.cjs --env production && pm2 save",
      ssh_options: "StrictHostKeyChecking=no",
    },
  },
};
