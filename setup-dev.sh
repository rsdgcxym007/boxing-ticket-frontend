#!/bin/bash

# 🚀 Boxing Ticket Frontend - Development Setup Script
# This script sets up the development environment for API integration

echo "🎫 Boxing Ticket Frontend - Development Setup"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Install additional API integration dependencies
echo ""
echo "🔧 Installing API integration dependencies..."
npm install @vueuse/nuxt vue-chartjs chart.js socket.io-client

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update the values as needed."
else
    echo "✅ .env file already exists"
fi

# Create necessary directories if they don't exist
echo ""
echo "📁 Creating project directories..."

mkdir -p components/Analytics
mkdir -p components/Mobile
mkdir -p components/Realtime
mkdir -p pages/admin
mkdir -p pages/mobile
mkdir -p layouts
mkdir -p plugins
mkdir -p types
mkdir -p utils

echo "✅ Project directories created"

# Check if all required files exist
echo ""
echo "🔍 Checking required files..."

REQUIRED_FILES=(
    "composables/useAnalytics.ts"
    "composables/useAI.ts"
    "composables/useMobile.ts"
    "composables/useNotifications.ts"
    "composables/useRealtime.ts"
    "components/Analytics/StatsCard.vue"
    "pages/admin/analytics.vue"
    "pages/mobile/index.vue"
    "layouts/mobile.vue"
    "plugins/socket.client.ts"
    "types/api.ts"
    "utils/errorHandler.ts"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo "✅ All required files are present"
else
    echo "⚠️  Missing files detected:"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "Please ensure all API integration files are created before continuing."
fi

# TypeScript configuration check
echo ""
echo "🔧 Checking TypeScript configuration..."

if grep -q "\"~/*\"" tsconfig.json; then
    echo "✅ TypeScript path aliases configured"
else
    echo "⚠️  TypeScript path aliases may need configuration"
    echo "   Add this to tsconfig.json compilerOptions.paths:"
    echo "   \"~/*\": [\"./*\"]"
fi

# Nuxt configuration check
echo ""
echo "⚙️  Checking Nuxt configuration..."

if grep -q "socket" nuxt.config.ts; then
    echo "✅ Nuxt Socket.IO configuration detected"
else
    echo "⚠️  Socket.IO plugin may need to be added to nuxt.config.ts"
fi

# Package.json scripts check
echo ""
echo "📜 Available scripts:"
npm run --silent | grep -E "(dev|build|preview|start)" | sed 's/^/   /'

# Environment variables check
echo ""
echo "🌍 Environment configuration:"

if [ -f .env ]; then
    echo "✅ .env file exists"
    
    # Check critical environment variables
    if grep -q "NUXT_PUBLIC_API_BASE" .env; then
        API_BASE=$(grep "NUXT_PUBLIC_API_BASE" .env | cut -d'=' -f2)
        echo "   API Base URL: $API_BASE"
    else
        echo "⚠️  NUXT_PUBLIC_API_BASE not set"
    fi
    
    if grep -q "NUXT_PUBLIC_WS_URL" .env; then
        WS_URL=$(grep "NUXT_PUBLIC_WS_URL" .env | cut -d'=' -f2)
        echo "   WebSocket URL: $WS_URL"
    else
        echo "⚠️  NUXT_PUBLIC_WS_URL not set"
    fi
else
    echo "❌ .env file not found"
fi

# Development server check
echo ""
echo "🚀 Development server setup:"

echo "To start the development server:"
echo "   npm run dev"
echo ""
echo "To build for production:"
echo "   npm run build"
echo "   npm run start"

# API Integration test
echo ""
echo "🧪 API Integration test:"
echo "After starting the server, test the following:"
echo "   - Analytics Dashboard: http://localhost:3000/admin/analytics"
echo "   - Mobile Interface: http://localhost:3000/mobile"
echo "   - WebSocket connection in browser console"

# Health check function
echo ""
echo "🏥 Health check script:"
cat > health-check-dev.sh << 'EOL'
#!/bin/bash

echo "🏥 Development Health Check"
echo "========================="

# Check if development server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running"
else
    echo "❌ Development server is not running"
    echo "   Run: npm run dev"
    exit 1
fi

# Check API endpoints
echo ""
echo "🔌 API Endpoints:"

ENDPOINTS=(
    "/api/analytics/daily-sales"
    "/api/analytics/system-health"
    "/api/ai/seat-recommendations"
    "/api/mobile/home"
    "/api/notifications"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if curl -s "http://localhost:3000$endpoint" > /dev/null; then
        echo "✅ $endpoint"
    else
        echo "❌ $endpoint"
    fi
done

echo ""
echo "🔌 WebSocket connection test:"
echo "Open browser console and check for WebSocket connection logs"

echo ""
echo "✅ Health check complete"
EOL

chmod +x health-check-dev.sh
echo "✅ Created health-check-dev.sh script"

# Summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your API endpoints"
echo "2. Start development server: npm run dev"
echo "3. Run health check: ./health-check-dev.sh"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - API Integration Guide: API_INTEGRATION_README.md"
echo "   - Original README: README.md"
echo ""
echo "🔧 Troubleshooting:"
echo "   - Check console for any TypeScript errors"
echo "   - Verify API backend is running"
echo "   - Check WebSocket connection in Network tab"
echo ""
echo "Happy coding! 🚀"
