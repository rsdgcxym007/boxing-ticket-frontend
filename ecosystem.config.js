module.exports = {
  apps: [
    {
      name: "boxing-ticket-frontend",
      script: ".output/server/index.mjs",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NITRO_HOST: "0.0.0.0",
        NITRO_PORT: 3000,
        NUXT_PUBLIC_API_BASE: "http://43.229.133.51:4000/api",
        NUXT_PUBLIC_SOCKET_URL: "http://43.229.133.51:4000",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NITRO_HOST: "0.0.0.0",
        NITRO_PORT: 3000,
      },
      // Restart configuration
      max_memory_restart: "1G",
      restart_delay: 1000,
      max_restarts: 10,
      min_uptime: "10s",

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

      // Other options
      watch: false,
      ignore_watch: ["node_modules", "logs"],
      merge_logs: true,
      combine_logs: true,
      force: true,
    },
  ],
};
