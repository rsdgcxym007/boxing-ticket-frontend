#!/bin/bash

DISCORD_WEBHOOK="https://discord.com/api/webhooks/1401691307402985582/BqMKIzaY3AeYKd9q5PQJk-fAS5zf6321zY4_1pvaA_ihTb4KLvjWUHSS8lB4LCLaGvkM"

notify() {
  curl -H "Content-Type: application/json" -X POST \
    -d "{\"content\": \"$1\"}" \
    "$DISCORD_WEBHOOK"
}

notify "🚀 [Frontend] Start deployment..."

cd /var/www/frontend/boxing-ticket-frontend || {
  notify "❌ [Frontend] Failed to cd to project folder"
  exit 1
}

notify "🔄 [Frontend] Resetting local changes..."
git reset --hard HEAD
git clean -fd

notify "📦 [Frontend] Pulling latest changes..."
git pull origin master || {
  notify "❌ [Frontend] git pull failed"
  exit 1
}

notify "🔐 [Frontend] Backing up .env"
cp .env .env.bak

notify "📥 [Frontend] Installing dependencies..."
npm install || {
  notify "❌ [Frontend] npm install failed"
  exit 1
}

notify "🛠️ [Frontend] Building project..."
npm run build || {
  notify "❌ [Frontend] Build failed"
  exit 1
}

notify "🔁 [Frontend] Restarting pm2 process..."
pm2 start .output/server/index.mjs \
  --name boxing-ticket-frontend \
  --max-memory-restart 1G -f || {
  notify "❌ [Frontend] pm2 restart failed"
  exit 1
}

COMMIT=$(git log -1 --pretty=format:"%h - %s by %an")
notify "✅ [Frontend] Deployed successfully: $COMMIT"