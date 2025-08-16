// Webhook endpoint to trigger deployment via Nitro on port 4100
// Path: /api/v1/webhook/deploy (POST)

import { spawn } from "node:child_process";

export default defineEventHandler(async (event) => {
  try {
    // Log the incoming webhook request
    const method = getMethod(event);
    const userAgent = getHeader(event, "user-agent") || "unknown";

    console.log(`[Webhook] ${method} /api/v1/webhook/deploy from ${userAgent}`);

    // Only accept POST requests
    if (method !== "POST") {
      setResponseStatus(event, 405);
      return {
        status: "error",
        message: "Method Not Allowed",
      };
    }

    // Read payload (optional, but log it)
    const payload = await readRawBody(event).catch(() => undefined);
    const payloadStr = payload ? payload.toString() : "";

    if (payloadStr) {
      console.log(`[Webhook] Payload preview: ${payloadStr.slice(0, 200)}...`);
    }

    const APP_DIR = "/var/www/patongboxing-frontend";
    const SCRIPT = `${APP_DIR}/scripts/webhook-deploy.sh`;

    // Check if script exists before spawning
    try {
      const fs = await import("node:fs/promises");
      await fs.access(SCRIPT);
    } catch {
      console.error(`[Webhook] Script not found: ${SCRIPT}`);
      setResponseStatus(event, 500);
      return {
        status: "error",
        message: "Deployment script not found",
      };
    }

    // Fire-and-forget deployment to keep webhook response fast
    console.log(`[Webhook] Starting deployment: ${SCRIPT}`);
    const child = spawn("/bin/bash", [SCRIPT, "deploy"], {
      cwd: APP_DIR,
      detached: true,
      stdio: "ignore",
      env: process.env,
    });
    child.unref();

    setResponseStatus(event, 202);
    return {
      status: "accepted",
      message: "Deployment started",
      timestamp: new Date().toISOString(),
      payload_length: payloadStr.length,
    };
  } catch (err: any) {
    console.error("[Webhook] Error:", err);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: err?.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
});
