// Webhook endpoint to trigger deployment via Nitro on port 3000
// Path: /hooks/deploy-frontend (POST)

import { spawn } from "node:child_process";

export default defineEventHandler(async (event) => {
  try {
    // Read payload (optional)
    const payload = await readRawBody(event).catch(() => undefined);

    const APP_DIR = "/var/www/patongboxing-frontend";
    const SCRIPT = `${APP_DIR}/scripts/webhook-deploy.sh`;

    // Fire-and-forget deployment to keep webhook response fast
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
      length: payload?.length ?? 0,
    };
  } catch (err: any) {
    console.error("Webhook error:", err);
    setResponseStatus(event, 500);
    return {
      status: "error",
      message: err?.message || "Unknown error",
    };
  }
});
