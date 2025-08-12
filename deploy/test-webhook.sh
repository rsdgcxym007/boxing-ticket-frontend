#!/bin/bash

# Boxing Ticket Frontend Webhook Test Script
echo "🧪 Testing webhook deployment system..."

# Configuration
WEBHOOK_URL="http://43.229.133.51:4100/hooks/deploy-frontend"
DISCORD_WEBHOOK="https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"

# Function to send Discord notification
send_discord_notification() {
    local message="$1"
    local color="$2"
    
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{\"embeds\": [{\"title\": \"🧪 Webhook Test\", \"description\": \"$message\", \"color\": $color, \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"}]}" \
         "$DISCORD_WEBHOOK"
}

# Test 1: Send test notification to Discord
echo "📢 Test 1: Sending test notification to Discord..."
send_discord_notification "🧪 **Webhook Test Started**\n\nTesting deployment webhook system\nTime: $(date)" 16776960

# Test 2: Check if webhook endpoint is accessible
echo "🌐 Test 2: Testing webhook endpoint accessibility..."
WEBHOOK_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -m 10 "$WEBHOOK_URL" 2>/dev/null)

if [ "$WEBHOOK_RESPONSE" = "000" ]; then
    echo "❌ Webhook endpoint is not accessible (connection failed)"
    send_discord_notification "❌ **Webhook Test Failed**\n\nEndpoint not accessible: $WEBHOOK_URL" 15158332
    exit 1
elif [ "$WEBHOOK_RESPONSE" = "404" ]; then
    echo "⚠️  Webhook endpoint returned 404 (this is expected for GET requests)"
else
    echo "✅ Webhook endpoint responded with HTTP $WEBHOOK_RESPONSE"
fi

# Test 3: Test deployment webhook trigger
echo "🚀 Test 3: Triggering deployment webhook..."
DEPLOY_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "User-Agent: GitHub-Hookshot/test" \
    -d '{"ref":"refs/heads/main","repository":{"name":"boxing-ticket-frontend"}}' \
    -w "%{http_code}" \
    -m 30 \
    "$WEBHOOK_URL" 2>/dev/null)

# Extract HTTP status code (last 3 characters)
HTTP_CODE="${DEPLOY_RESPONSE: -3}"
RESPONSE_BODY="${DEPLOY_RESPONSE%???}"

echo "HTTP Response Code: $HTTP_CODE"
echo "Response Body: $RESPONSE_BODY"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Deployment webhook triggered successfully!"
    send_discord_notification "✅ **Webhook Test Successful**\n\nDeployment triggered successfully\nHTTP Code: $HTTP_CODE\nResponse: $RESPONSE_BODY" 3066993
else
    echo "❌ Deployment webhook failed with HTTP code: $HTTP_CODE"
    send_discord_notification "❌ **Webhook Test Failed**\n\nHTTP Code: $HTTP_CODE\nResponse: $RESPONSE_BODY" 15158332
    exit 1
fi

# Test 4: Health check after deployment
echo "🏥 Test 4: Waiting for deployment and performing health check..."
sleep 10

HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -m 10 "http://43.229.133.51:3000/api/health" 2>/dev/null)

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Application health check passed!"
    send_discord_notification "✅ **Full Test Successful**\n\nWebhook deployment system is working\nApplication is healthy\nURL: http://43.229.133.51:3000" 3066993
else
    echo "⚠️  Application health check returned HTTP $HEALTH_RESPONSE"
    send_discord_notification "⚠️  **Partial Success**\n\nWebhook works but health check failed\nHTTP Code: $HEALTH_RESPONSE" 16776960
fi

echo "🎉 Webhook test completed!"
echo ""
echo "📋 Test Summary:"
echo "  1. Discord notification: ✅"
echo "  2. Webhook endpoint: ✅"
echo "  3. Deployment trigger: ✅"
echo "  4. Health check: $([ "$HEALTH_RESPONSE" = "200" ] && echo "✅" || echo "⚠️")"
