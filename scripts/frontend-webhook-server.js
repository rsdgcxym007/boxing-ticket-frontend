#!/usr/bin/env node

// GitHub Webhook Server for Frontend Auto-Deploy
// Listens for GitHub push events and triggers frontend deployment

const http = require("http");
const crypto = require("crypto");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration
const PORT = process.env.WEBHOOK_PORT || 4300;
const SECRET = process.env.WEBHOOK_SECRET || "webhook-secret-key-2025";
const FRONTEND_DEPLOY_SCRIPT =
  "/var/www/patongboxing-frontend/scripts/webhook-deploy.sh";
const LOG_FILE = "/var/log/frontend-webhook-server.log";

// Discord webhook
const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l";

// Logging function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  console.log(logMessage.trim());

  try {
    fs.appendFileSync(LOG_FILE, logMessage);
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
}

// Send Discord notification
async function sendDiscordNotification(
  title,
  description,
  color = 3447003,
  fields = []
) {
  const payload = {
    embeds: [
      {
        title: `🎨 ${title}`,
        description: description,
        color: color,
        fields: fields,
        footer: {
          text: `Frontend Webhook Server | ${new Date().toISOString()}`,
        },
      },
    ],
  };

  try {
    const https = require("https");
    const url = require("url");

    const webhookUrl = new URL(DISCORD_WEBHOOK);
    const postData = JSON.stringify(payload);

    const options = {
      hostname: webhookUrl.hostname,
      port: 443,
      path: webhookUrl.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options);
    req.on("error", (err) => {
      log(`Discord notification error: ${err.message}`);
    });

    req.write(postData);
    req.end();
  } catch (err) {
    log(`Failed to send Discord notification: ${err.message}`);
  }
}

// Verify GitHub signature
function verifySignature(body, signature) {
  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(body, "utf8")
    .digest("hex");

  const actualSignature = signature.replace("sha256=", "");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(actualSignature, "hex")
  );
}

// Execute frontend deployment
function executeFrontendDeploy(webhookData) {
  log("Starting FRONTEND deployment process...");

  const { repository, commits, pusher, ref } = webhookData;
  const branch = ref.replace("refs/heads/", "");

  // Send deployment start notification
  sendDiscordNotification(
    "FRONTEND Deployment Triggered",
    "GitHub push event received and frontend deployment is starting.",
    16776960, // Yellow
    [
      { name: "Project", value: "FRONTEND", inline: true },
      { name: "Repository", value: repository.full_name, inline: true },
      { name: "Branch", value: branch, inline: true },
      { name: "Pusher", value: pusher.name, inline: true },
      { name: "Commits", value: commits.length.toString(), inline: true },
    ]
  );

  // Execute deployment script
  exec(`bash ${FRONTEND_DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
    if (error) {
      log(`Frontend deployment error: ${error.message}`);
      sendDiscordNotification(
        "FRONTEND Deployment Failed",
        "Frontend deployment script execution failed.",
        15158332, // Red
        [
          {
            name: "Error",
            value: error.message.substring(0, 1000),
            inline: false,
          },
          { name: "Project", value: "FRONTEND", inline: true },
        ]
      );
      return;
    }

    if (stderr) {
      log(`Frontend deployment stderr: ${stderr}`);
    }

    log(`Frontend deployment stdout: ${stdout}`);

    // Send success notification
    sendDiscordNotification(
      "FRONTEND Deployment Success",
      "Frontend deployment completed successfully! 🎉",
      5763719, // Green
      [
        { name: "Project", value: "FRONTEND", inline: true },
        { name: "Repository", value: repository.full_name, inline: true },
        { name: "Branch", value: branch, inline: true },
      ]
    );

    log("Frontend deployment completed successfully");
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Hub-Signature-256, X-GitHub-Event"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "frontend-webhook-server",
        port: PORT,
      })
    );
    return;
  }

  // Status endpoint
  if (req.url === "/status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "running",
        port: PORT,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: "frontend-webhook-server",
      })
    );
    return;
  }

  // GitHub webhook endpoint for frontend
  if (req.url === "/hooks/deploy-frontend" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const signature = req.headers["x-hub-signature-256"];
        const event = req.headers["x-github-event"];

        log(
          `Received frontend webhook: event=${event}, signature=${
            signature ? "present" : "missing"
          }`
        );

        // Verify signature
        if (!verifySignature(body, signature)) {
          log("Invalid signature");
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid signature" }));
          return;
        }

        // Parse webhook data
        const webhookData = JSON.parse(body);

        // Handle push events
        if (event === "push") {
          const branch = webhookData.ref.replace("refs/heads/", "");
          log(`Frontend push event received for branch: ${branch}`);

          // Only deploy for specific branches
          if (
            branch === "featues/v1" ||
            branch === "main" ||
            branch === "master"
          ) {
            executeFrontendDeploy(webhookData);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Frontend deployment triggered successfully",
                branch: branch,
                timestamp: new Date().toISOString(),
              })
            );
          } else {
            log(`Ignored frontend push to branch: ${branch}`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Branch not configured for deployment",
                branch: branch,
              })
            );
          }
        } else {
          log(`Ignored frontend event: ${event}`);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Event ignored", event: event }));
        }
      } catch (err) {
        log(`Error processing frontend webhook: ${err.message}`);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });

    return;
  }

  // 404 for other routes
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({ error: "Not found", service: "frontend-webhook-server" })
  );
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  log(`Frontend webhook server started on port ${PORT}`);

  // Send startup notification
  sendDiscordNotification(
    "Frontend Webhook Server Started",
    "Frontend GitHub webhook server is now listening for deployment events.",
    5763719, // Green
    [
      { name: "Port", value: PORT.toString(), inline: true },
      { name: "Endpoint", value: "/hooks/deploy-frontend", inline: true },
      { name: "Status", value: "Active", inline: true },
    ]
  );
});

// Handle server errors
server.on("error", (err) => {
  log(`Frontend webhook server error: ${err.message}`);
  sendDiscordNotification(
    "Frontend Webhook Server Error",
    "Frontend webhook server encountered an error.",
    15158332, // Red
    [{ name: "Error", value: err.message, inline: false }]
  );
});

// Handle process termination
process.on("SIGTERM", () => {
  log("Received SIGTERM, shutting down gracefully...");
  sendDiscordNotification(
    "Frontend Webhook Server Shutdown",
    "Frontend webhook server is shutting down.",
    16776960 // Yellow
  );

  server.close(() => {
    log("Frontend webhook server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  log("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  log(`Uncaught exception: ${err.message}`);
  sendDiscordNotification(
    "Frontend Webhook Server Critical Error",
    "Frontend webhook server encountered a critical error.",
    15158332, // Red
    [
      { name: "Error", value: err.message, inline: false },
      {
        name: "Stack",
        value: err.stack ? err.stack.substring(0, 1000) : "No stack trace",
        inline: false,
      },
    ]
  );
  process.exit(1);
});

log("Frontend webhook server initialized and ready to receive GitHub events");
