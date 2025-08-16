#!/usr/bin/env node
/**
 * Patong Boxing Stadium - GitHub Webhook Server with Discord Notifications
 * Auto Deploy System for Production
 */

const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

// Configuration
const WEBHOOK_PORT = 9000;
const WEBHOOK_SECRET = 'patong-boxing-webhook-secret-2025';
const DEPLOY_SCRIPT = '/var/www/patongboxing-frontend/scripts/auto-deploy.sh';
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l';

// Discord notification function
async function sendDiscordNotification(message, color = 3447003, title = 'Webhook Event') {
    return new Promise((resolve, reject) => {
        try {
            const data = JSON.stringify({
                embeds: [{
                    title: title,
                    description: message,
                    color: color,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'Patong Boxing Auto Deploy'
                    }
                }]
            });

            const url = new URL(DISCORD_WEBHOOK);
            const options = {
                hostname: url.hostname,
                port: 443,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            const req = https.request(options, (res) => {
                resolve();
            });

            req.on('error', (error) => {
                console.error('Discord notification failed:', error.message);
                resolve(); // Don't reject to prevent blocking
            });

            req.write(data);
            req.end();
        } catch (error) {
            console.error('Discord notification failed:', error.message);
            resolve();
        }
    });
}

// Verify GitHub signature
function verifySignature(payload, signature) {
    if (!WEBHOOK_SECRET) return true;
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');
    
    return crypto.timingSafeEqual(digest, checksum);
}

// Log function
async function log(message, level = 'INFO', sendToDiscord = false) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}`;
    console.log(logMessage);
    
    // Log to file
    try {
        fs.appendFileSync('/var/log/webhook-server.log', logMessage + '\n');
    } catch (error) {
        console.error('Failed to write to log file:', error.message);
    }
    
    // Send to Discord if requested
    if (sendToDiscord) {
        await sendDiscordNotification(message, 3447003, level);
    }
}

// Execute deployment
async function executeDeployment(webhookData) {
    try {
        await log('Starting deployment...', 'INFO', true);
        
        // Send Discord notification
        await sendDiscordNotification(
            `**Auto Deployment Triggered**\n\n` +
            `**Repository:** ${webhookData.repository}\n` +
            `**Branch:** ${webhookData.branch}\n` +
            `**Pusher:** ${webhookData.pusher}\n` +
            `**Commit:** \`${webhookData.commit}\`\n\n` +
            `**Executing deployment script...**`,
            3447003,
            'GitHub Push Detected'
        );
        
        // Execute deployment script in background
        setTimeout(async () => {
            try {
                execSync(`chmod +x ${DEPLOY_SCRIPT} && ${DEPLOY_SCRIPT}`, {
                    encoding: 'utf8',
                    timeout: 300000,
                    stdio: 'inherit'
                });
                await log('Deployment completed successfully', 'SUCCESS', true);
            } catch (error) {
                await log(`Deployment failed: ${error.message}`, 'ERROR', true);
                await sendDiscordNotification(
                    `**Deployment Failed**\n\n**Error:** ${error.message}`,
                    15158332,
                    'Deployment Error'
                );
            }
        }, 1000);
        
    } catch (error) {
        await log(`Deployment initialization failed: ${error.message}`, 'ERROR', true);
    }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/webhook') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Patong Boxing Webhook Server - POST /webhook to trigger deployment');
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const signature = req.headers['x-hub-signature-256'];
            const event = req.headers['x-github-event'];
            
            // Verify GitHub signature if provided
            if (signature && !verifySignature(body, signature)) {
                await log('Invalid signature', 'ERROR', true);
                res.writeHead(401, {'Content-Type': 'text/plain'});
                res.end('Unauthorized');
                return;
            }

            const payload = JSON.parse(body);
            
            // Handle ping event
            if (event === 'ping') {
                await log('Webhook ping received', 'INFO');
                await sendDiscordNotification(
                    `**Webhook Connected!**\n\nGitHub webhook is now connected and working properly.`,
                    65280,
                    'Webhook Test'
                );
                
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'Webhook configured successfully' }));
                return;
            }
            
            // Handle push event
            if (event === 'push' && payload.ref === 'refs/heads/featues/v1') {
                const webhookData = {
                    repository: payload.repository?.name || 'unknown',
                    branch: 'featues/v1',
                    pusher: payload.pusher?.name || 'unknown',
                    commit: payload.head_commit?.message || 'No commit message',
                    author: payload.head_commit?.author?.name || 'unknown'
                };
                
                await log(`Valid push to featues/v1 branch detected`, 'INFO');
                await log(`Commit: ${webhookData.commit}`, 'INFO');
                await log(`Author: ${webhookData.author}`, 'INFO');
                
                // Execute deployment
                executeDeployment(webhookData);
                
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    status: 'success',
                    message: 'Deployment triggered successfully',
                    data: webhookData
                }));
                
            } else if (event === 'push') {
                await log(`Push to ${payload.ref} ignored (not target branch)`, 'INFO');
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'Push ignored (not target branch)' }));
                
            } else {
                await log(`${event} event ignored`, 'INFO');
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: `${event} event ignored` }));
            }

        } catch (error) {
            await log(`Webhook processing failed: ${error.message}`, 'ERROR', true);
            
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ error: 'Webhook processing failed' }));
        }
    });
});

// Start server
server.listen(WEBHOOK_PORT, '0.0.0.0', async () => {
    await log(`GitHub Webhook Server started on port ${WEBHOOK_PORT}`, 'INFO', true);
    await log(`GitHub webhook URL: http://43.229.133.51:${WEBHOOK_PORT}/webhook`, 'INFO');
    await log(`Monitoring branch: featues/v1`, 'INFO');
    await log(`Deploy script: ${DEPLOY_SCRIPT}`, 'INFO');
    
    await sendDiscordNotification(
        `**Webhook Server Started**\n\n` +
        `**Port:** ${WEBHOOK_PORT}\n` +
        `**URL:** http://43.229.133.51:${WEBHOOK_PORT}/webhook\n` +
        `**Branch:** featues/v1\n` +
        `**Deploy Script:** ${DEPLOY_SCRIPT}\n\n` +
        `**Ready to receive GitHub webhooks!**`,
        3447003,
        'Webhook Server Online'
    );
});

// Handle server errors
server.on('error', async (error) => {
    await log(`Server error: ${error.message}`, 'ERROR', true);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await log('Shutting down webhook server...', 'INFO', true);
    await sendDiscordNotification(
        `**Webhook Server Shutting Down**\n\nServer is being stopped.`,
        16776960,
        'Server Shutdown'
    );
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    await log('Received SIGTERM, shutting down webhook server...', 'INFO', true);
    server.close(() => {
        process.exit(0);
    });
});
