#!/usr/bin/env node
import express from 'express';
import { spawn } from 'node:child_process';

const app = express();
const PORT = process.env.PORT || 4300;
const APP_DIR = '/var/www/frontend/boxing-ticket-frontend';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/x-www-form-urlencoded' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'boxing-ticket-webhook'
  });
});

// Webhook endpoints
app.post('/hooks/deploy-frontend', handleDeploy);
app.post('/api/v1/webhook/deploy', handleDeploy);

async function handleDeploy(req, res) {
  try {
    console.log('[Webhook] Deploy request received');
    
    // Log payload preview
    if (req.body) {
      const bodyStr = JSON.stringify(req.body).slice(0, 200);
      console.log('[Webhook] Payload preview:', bodyStr);
    }

    const deployScript = `${APP_DIR}/deploy.sh`;
    
    // Check if deploy script exists
    try {
      const fs = await import('node:fs/promises');
      await fs.access(deployScript);
    } catch (err) {
      console.error('[Webhook] Deploy script not found:', deployScript);
      return res.status(500).json({
        status: 'error',
        message: 'Deploy script not found'
      });
    }

    // Run deployment in background
    console.log('[Webhook] Starting deployment...');
    const child = spawn('/bin/bash', [deployScript, 'deploy'], {
      cwd: APP_DIR,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env
    });

    // Log deployment output (optional)
    child.stdout?.on('data', (data) => {
      console.log('[Deploy]', data.toString().trim());
    });

    child.stderr?.on('data', (data) => {
      console.error('[Deploy Error]', data.toString().trim());
    });

    child.on('close', (code) => {
      console.log(`[Deploy] Finished with code: ${code}`);
    });

    child.unref();

    // Respond immediately
    res.status(202).json({
      status: 'accepted',
      message: 'Deployment started',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Webhook] Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('[Server Error]:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Webhook Server] Listening on port ${PORT}`);
  console.log(`[Webhook Server] Endpoints:`);
  console.log(`  POST /hooks/deploy-frontend`);
  console.log(`  POST /api/v1/webhook/deploy`);
  console.log(`  GET  /health`);
});
