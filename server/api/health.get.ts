// Health check endpoint for Boxing Ticket Frontend
// This endpoint provides comprehensive health information

export default defineEventHandler(async (event) => {
  try {
    const startTime = Date.now();
    const config = useRuntimeConfig();

    // Basic health information
    const healthInfo = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: config.public.appVersion || "1.0.31",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid,
    };

    // Check system resources
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };

    // Check API connectivity
    let apiHealth = "unknown";
    let apiResponseTime = 0;

    try {
      const apiStartTime = Date.now();
      const apiBase = config.public.apiBase as string;

      if (apiBase && apiBase !== "http://localhost:4000") {
        // Only check external API in production
        const response = await fetch(`${apiBase}/health`, {
          timeout: 5000,
          headers: {
            "User-Agent": "Boxing-Ticket-Frontend-HealthCheck",
          },
        });

        apiResponseTime = Date.now() - apiStartTime;
        apiHealth = response.ok ? "healthy" : "unhealthy";
      } else {
        apiHealth = "local";
      }
    } catch (error) {
      apiHealth = "error";
      console.warn("API health check failed:", error);
    }

    // Check WebSocket connectivity
    let wsHealth = "unknown";
    try {
      const wsUrl =
        (config.public.wsUrl as string) || (config.public.socketUrl as string);
      if (wsUrl && wsUrl.includes("43.229.133.51")) {
        // Only check external WebSocket in production
        wsHealth = "configured";
      } else {
        wsHealth = "local";
      }
    } catch (error) {
      wsHealth = "error";
    }

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Determine overall health status
    let overallStatus = "healthy";
    const warnings = [];
    const errors = [];

    // Memory warnings
    if (memoryUsageMB.heapUsed > 500) {
      warnings.push("High memory usage detected");
    }

    if (memoryUsageMB.heapUsed > 800) {
      overallStatus = "degraded";
      errors.push("Critical memory usage");
    }

    // API health
    if (apiHealth === "error") {
      warnings.push("API connectivity issues");
    }

    // Response time warnings
    if (responseTime > 1000) {
      warnings.push("Slow response time");
    }

    // Build final health response
    const healthResponse = {
      ...healthInfo,
      status: overallStatus,
      checks: {
        api: {
          status: apiHealth,
          responseTime: apiResponseTime,
          url: config.public.apiBase,
        },
        websocket: {
          status: wsHealth,
          url: config.public.wsUrl || config.public.socketUrl,
        },
        memory: {
          status:
            memoryUsageMB.heapUsed > 800
              ? "critical"
              : memoryUsageMB.heapUsed > 500
              ? "warning"
              : "healthy",
          usage: memoryUsageMB,
        },
        performance: {
          status: responseTime > 1000 ? "slow" : "fast",
          responseTime,
        },
      },
      warnings,
      errors,
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        hostname: process.env.HOSTNAME || "unknown",
        deployment: {
          lastDeploy: process.env.DEPLOY_TIME || "unknown",
          commit: process.env.DEPLOY_COMMIT || "unknown",
          branch: process.env.DEPLOY_BRANCH || "main",
        },
      },
    };

    // Set appropriate HTTP status
    let httpStatus = 200;
    if (overallStatus === "degraded") {
      httpStatus = 200; // Still OK but with warnings
    } else if (overallStatus === "unhealthy") {
      httpStatus = 503; // Service Unavailable
    }

    // Set response headers
    setHeader(event, "Content-Type", "application/json");
    setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate");
    setHeader(event, "X-Health-Check", "true");

    // Set status code
    if (httpStatus !== 200) {
      setResponseStatus(event, httpStatus);
    }

    return healthResponse;
  } catch (error) {
    console.error("Health check error:", error);

    setResponseStatus(event, 503);
    setHeader(event, "Content-Type", "application/json");

    return {
      status: "error",
      timestamp: new Date().toISOString(),
      error: {
        message: "Health check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      version: useRuntimeConfig().public.appVersion || "1.0.31",
    };
  }
});
