module.exports = {
  apps: [
    {
      name: "frontend-webhook-server",
      script:
        "/var/www/patongboxing-frontend/scripts/frontend-webhook-server.js",
      cwd: "/var/www/patongboxing-frontend",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        WEBHOOK_PORT: "4300",
        WEBHOOK_SECRET: "webhook-secret-key-2025",
      },
      log_file: "/var/log/pm2/frontend-webhook-server.log",
      out_file: "/var/log/pm2/frontend-webhook-server-out.log",
      error_file: "/var/log/pm2/frontend-webhook-server-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "100M",
      node_args: "--max-old-space-size=128",
      restart_delay: 5000,
      cron_restart: "0 3 * * *", // Restart daily at 3 AM
    },
  ],
};
