module.exports = {
  apps: [
    {
      name: "boxing-ticket-frontend",
      port: "3000",
      exec_mode: "cluster",
      instances: "max", // Use all available CPU cores
      script: "./.output/server/index.mjs",
      cwd: "/var/www/boxing-ticket-frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
      },
      // Logging
      log_file: "/var/log/pm2/boxing-ticket-frontend.log",
      out_file: "/var/log/pm2/boxing-ticket-frontend-out.log",
      error_file: "/var/log/pm2/boxing-ticket-frontend-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Auto restart settings
      watch: false,
      ignore_watch: ["node_modules", "logs"],
      max_restarts: 10,
      min_uptime: "10s",

      // Memory and CPU settings
      max_memory_restart: "1G",

      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
    },
  ],
};
