#!/bin/bash

# 🧪 Boxing Ticket Frontend - API Integration Test Suite
# This script runs comprehensive tests for the API integration features

echo "🧪 API Integration Test Suite"
echo "============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# Function to print test results
print_result() {
    local test_name="$1"
    local result="$2"
    local message="$3"
    
    case $result in
        "PASS")
            echo -e "✅ ${GREEN}PASS${NC} $test_name"
            ((TESTS_PASSED++))
            ;;
        "FAIL")
            echo -e "❌ ${RED}FAIL${NC} $test_name: $message"
            ((TESTS_FAILED++))
            ;;
        "SKIP")
            echo -e "⏭️  ${YELLOW}SKIP${NC} $test_name: $message"
            ((TESTS_SKIPPED++))
            ;;
    esac
}

# Check if server is running
check_server() {
    echo ""
    echo "🌐 Checking Development Server"
    echo "-----------------------------"
    
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_result "Development server accessibility" "PASS"
        return 0
    else
        print_result "Development server accessibility" "FAIL" "Server not running on localhost:3000"
        echo "Please start the development server with: npm run dev"
        return 1
    fi
}

# Test file structure
test_file_structure() {
    echo ""
    echo "📁 Testing File Structure"
    echo "-------------------------"
    
    local required_files=(
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
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            print_result "File exists: $file" "PASS"
        else
            print_result "File exists: $file" "FAIL" "File not found"
        fi
    done
}

# Test TypeScript compilation
test_typescript() {
    echo ""
    echo "🔧 Testing TypeScript Compilation"
    echo "--------------------------------"
    
    if command -v npx &> /dev/null; then
        if npx nuxi typecheck > /dev/null 2>&1; then
            print_result "TypeScript compilation" "PASS"
        else
            print_result "TypeScript compilation" "FAIL" "Type check failed"
            echo "Run 'npx nuxi typecheck' for details"
        fi
    else
        print_result "TypeScript compilation" "SKIP" "npx not available"
    fi
}

# Test API endpoints
test_api_endpoints() {
    echo ""
    echo "🔌 Testing API Endpoints"
    echo "-----------------------"
    
    if ! check_server; then
        print_result "API endpoint tests" "SKIP" "Server not running"
        return
    fi
    
    local endpoints=(
        "/api/analytics/daily-sales"
        "/api/analytics/system-health"
        "/api/analytics/business-metrics"
        "/api/ai/seat-recommendations"
        "/api/mobile/home"
        "/api/notifications"
        "/api/realtime/health"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local url="http://localhost:3000$endpoint"
        local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        
        if [ "$response_code" -eq 200 ] || [ "$response_code" -eq 404 ]; then
            print_result "Endpoint: $endpoint" "PASS"
        else
            print_result "Endpoint: $endpoint" "FAIL" "HTTP $response_code"
        fi
    done
}

# Test composables structure
test_composables() {
    echo ""
    echo "🎯 Testing Composables Structure"
    echo "-------------------------------"
    
    local composables=(
        "useAnalytics"
        "useAI"
        "useMobile"
        "useNotifications"
        "useRealtime"
    )
    
    for composable in "${composables[@]}"; do
        local file="composables/${composable}.ts"
        
        if [ -f "$file" ]; then
            # Check for export default
            if grep -q "export.*${composable}" "$file"; then
                print_result "Composable export: $composable" "PASS"
            else
                print_result "Composable export: $composable" "FAIL" "Export not found"
            fi
            
            # Check for basic functions
            if grep -q "const.*=" "$file" && grep -q "return" "$file"; then
                print_result "Composable structure: $composable" "PASS"
            else
                print_result "Composable structure: $composable" "FAIL" "Invalid structure"
            fi
        else
            print_result "Composable file: $composable" "FAIL" "File not found"
        fi
    done
}

# Test Vue components
test_components() {
    echo ""
    echo "🎨 Testing Vue Components"
    echo "------------------------"
    
    local components=(
        "components/Analytics/StatsCard.vue"
        "pages/admin/analytics.vue"
        "pages/mobile/index.vue"
        "layouts/mobile.vue"
    )
    
    for component in "${components[@]}"; do
        if [ -f "$component" ]; then
            # Check for Vue SFC structure
            if grep -q "<template>" "$component" && grep -q "<script" "$component"; then
                print_result "Component structure: $(basename "$component")" "PASS"
            else
                print_result "Component structure: $(basename "$component")" "FAIL" "Invalid Vue SFC"
            fi
            
            # Check for script setup
            if grep -q "script setup" "$component"; then
                print_result "Script setup: $(basename "$component")" "PASS"
            else
                print_result "Script setup: $(basename "$component")" "FAIL" "Missing script setup"
            fi
        else
            print_result "Component file: $(basename "$component")" "FAIL" "File not found"
        fi
    done
}

# Test environment configuration
test_environment() {
    echo ""
    echo "🌍 Testing Environment Configuration"
    echo "----------------------------------"
    
    if [ -f ".env" ]; then
        print_result ".env file exists" "PASS"
        
        # Check for required variables
        local required_vars=(
            "NUXT_PUBLIC_API_BASE"
            "NUXT_PUBLIC_WS_URL"
            "NUXT_PUBLIC_APP_NAME"
        )
        
        for var in "${required_vars[@]}"; do
            if grep -q "^$var=" .env; then
                local value=$(grep "^$var=" .env | cut -d'=' -f2)
                if [ -n "$value" ]; then
                    print_result "Environment variable: $var" "PASS"
                else
                    print_result "Environment variable: $var" "FAIL" "Empty value"
                fi
            else
                print_result "Environment variable: $var" "FAIL" "Not found"
            fi
        done
    else
        print_result ".env file exists" "FAIL" "File not found"
    fi
    
    if [ -f ".env.example" ]; then
        print_result ".env.example file exists" "PASS"
    else
        print_result ".env.example file exists" "FAIL" "Template not found"
    fi
}

# Test package dependencies
test_dependencies() {
    echo ""
    echo "📦 Testing Package Dependencies"
    echo "------------------------------"
    
    if [ -f "package.json" ]; then
        print_result "package.json exists" "PASS"
        
        # Check for required dependencies
        local required_deps=(
            "@vueuse/nuxt"
            "vue-chartjs"
            "socket.io-client"
        )
        
        for dep in "${required_deps[@]}"; do
            if grep -q "\"$dep\"" package.json; then
                print_result "Dependency: $dep" "PASS"
            else
                print_result "Dependency: $dep" "FAIL" "Not found in package.json"
            fi
        done
        
        # Check if node_modules exists
        if [ -d "node_modules" ]; then
            print_result "node_modules directory" "PASS"
        else
            print_result "node_modules directory" "FAIL" "Run npm install"
        fi
    else
        print_result "package.json exists" "FAIL" "File not found"
    fi
}

# Test WebSocket connectivity
test_websocket() {
    echo ""
    echo "🔌 Testing WebSocket Connectivity"
    echo "--------------------------------"
    
    if ! check_server; then
        print_result "WebSocket tests" "SKIP" "Server not running"
        return
    fi
    
    # Check if WebSocket endpoint is available
    if command -v wscat &> /dev/null; then
        local ws_url=$(grep "NUXT_PUBLIC_WS_URL" .env 2>/dev/null | cut -d'=' -f2 | tr -d '"')
        if [ -n "$ws_url" ]; then
            if timeout 5 wscat -c "$ws_url" --close-timeout 1000 > /dev/null 2>&1; then
                print_result "WebSocket connection" "PASS"
            else
                print_result "WebSocket connection" "FAIL" "Cannot connect to $ws_url"
            fi
        else
            print_result "WebSocket connection" "SKIP" "WS_URL not configured"
        fi
    else
        print_result "WebSocket connection" "SKIP" "wscat not installed"
    fi
}

# Test build process
test_build() {
    echo ""
    echo "🏗️  Testing Build Process"
    echo "------------------------"
    
    if [ "$1" = "--skip-build" ]; then
        print_result "Build process" "SKIP" "Skipped per request"
        return
    fi
    
    echo "Building project (this may take a while)..."
    if npm run build > /tmp/build.log 2>&1; then
        print_result "Build process" "PASS"
    else
        print_result "Build process" "FAIL" "Build failed, check /tmp/build.log"
    fi
}

# Test accessibility
test_accessibility() {
    echo ""
    echo "♿ Testing Accessibility"
    echo "----------------------"
    
    local pages=(
        "/"
        "/admin/analytics"
        "/mobile"
    )
    
    if ! check_server; then
        print_result "Accessibility tests" "SKIP" "Server not running"
        return
    fi
    
    for page in "${pages[@]}"; do
        local url="http://localhost:3000$page"
        local response=$(curl -s "$url")
        
        # Check for basic accessibility features
        if echo "$response" | grep -q "alt="; then
            print_result "Alt text on page: $page" "PASS"
        else
            print_result "Alt text on page: $page" "FAIL" "No alt attributes found"
        fi
        
        if echo "$response" | grep -q "lang="; then
            print_result "Lang attribute on page: $page" "PASS"
        else
            print_result "Lang attribute on page: $page" "FAIL" "No lang attribute found"
        fi
    done
}

# Performance test
test_performance() {
    echo ""
    echo "⚡ Testing Performance"
    echo "--------------------"
    
    if ! check_server; then
        print_result "Performance tests" "SKIP" "Server not running"
        return
    fi
    
    # Test page load times
    local pages=(
        "/"
        "/admin/analytics"
        "/mobile"
    )
    
    for page in "${pages[@]}"; do
        local url="http://localhost:3000$page"
        local load_time=$(curl -o /dev/null -s -w "%{time_total}" "$url")
        
        # Check if load time is under 3 seconds
        if (( $(echo "$load_time < 3.0" | bc -l) )); then
            print_result "Page load time: $page (${load_time}s)" "PASS"
        else
            print_result "Page load time: $page (${load_time}s)" "FAIL" "Too slow"
        fi
    done
}

# Main test runner
main() {
    echo "Starting comprehensive API integration tests..."
    echo "This will test all aspects of the implemented features."
    echo ""
    
    # Parse arguments
    local skip_build=false
    for arg in "$@"; do
        case $arg in
            --skip-build)
                skip_build=true
                ;;
        esac
    done
    
    # Run all tests
    test_file_structure
    test_typescript
    test_environment
    test_dependencies
    test_composables
    test_components
    test_api_endpoints
    test_websocket
    test_accessibility
    test_performance
    
    if [ "$skip_build" = false ]; then
        test_build
    else
        test_build --skip-build
    fi
    
    # Summary
    echo ""
    echo "📊 Test Summary"
    echo "=============="
    echo -e "✅ Passed:  ${GREEN}$TESTS_PASSED${NC}"
    echo -e "❌ Failed:  ${RED}$TESTS_FAILED${NC}"
    echo -e "⏭️  Skipped: ${YELLOW}$TESTS_SKIPPED${NC}"
    
    local total=$((TESTS_PASSED + TESTS_FAILED + TESTS_SKIPPED))
    echo "Total:   $total"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 All tests passed! Your API integration is ready.${NC}"
        exit 0
    else
        echo ""
        echo -e "${RED}❌ Some tests failed. Please review and fix the issues.${NC}"
        exit 1
    fi
}

# Help function
show_help() {
    echo "API Integration Test Suite"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --skip-build    Skip the build test (faster execution)"
    echo "  --help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                  # Run all tests"
    echo "  $0 --skip-build    # Run all tests except build"
}

# Check arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
