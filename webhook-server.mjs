#!/usr/bin/env node
import http from "node:http";
import { spawn } from "node:child_process";

const PORT = process.env.PORT || 4300;
const APP_DIR =
  process.env.APP_DIR || "/var/www/frontend/boxing-ticket-frontend";
const LOG_FILE =
  process.env.WEBHOOK_LOG || "/var/log/boxing-ticket-webhook.log";

function log(line) {
  const ts = new Date().toISOString();
  const msg = `[${ts}] ${line}\n`;
  try {
    process.stdout.write(msg);
  } catch {}
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    log(`Webhook received: ${body.slice(0, 200)}`);

    const sh = spawn("/bin/bash", [`${APP_DIR}/webhook-handler.sh`, "deploy"], {
      cwd: APP_DIR,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    sh.stdout.on("data", (d) => log(`[deploy] ${d.toString()}`));
    sh.stderr.on("data", (d) => log(`[deploy:err] ${d.toString()}`));
    sh.on("close", (code) => {
      log(`Deployment finished with code ${code}`);
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  });
});

server.listen(PORT, () => {
  log(`Webhook server listening on :${PORT}`);
});
