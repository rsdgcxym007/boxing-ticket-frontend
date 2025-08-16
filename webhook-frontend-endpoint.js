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

        // Only deploy for specific branch
        if (
          branch === "featues/v1" ||
          branch === "main" ||
          branch === "master"
        ) {
          executeDeploy(webhookData, "frontend");

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
