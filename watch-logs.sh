#!/bin/bash

# 📊 Real-time Deployment Log Viewer
# Shows deployment logs with color coding and filtering

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
LOG_FILE="/var/log/patongboxing/deployment.log"
WEBHOOK_LOG="/var/log/patongboxing/webhook.log"

show_help() {
    echo "📊 Deployment Log Viewer"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  live          Follow deployment logs in real-time (default)"
    echo "  last          Show last deployment only"
    echo "  errors        Show errors and warnings only"
    echo "  steps         Show step progress only"
    echo "  all           Show all logs"
    echo "  webhook       Show webhook logs"
    echo "  clear         Clear all logs"
    echo "  help          Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 live       # Follow logs in real-time"
    echo "  $0 last       # Show last deployment"
    echo "  $0 errors     # Show only errors"
}

# Color code log entries
colorize_logs() {
    sed -E \
        -e "s/.*ERROR.*/$(printf $RED)&$(printf $NC)/g" \
        -e "s/.*FAILED.*/$(printf $RED)&$(printf $NC)/g" \
        -e "s/.*SUCCESS.*/$(printf $GREEN)&$(printf $NC)/g" \
        -e "s/.*COMPLETED.*/$(printf $GREEN)&$(printf $NC)/g" \
        -e "s/.*WARNING.*/$(printf $YELLOW)&$(printf $NC)/g" \
        -e "s/.*STEP_START.*/$(printf $BLUE)&$(printf $NC)/g" \
        -e "s/.*STEP_END.*/$(printf $CYAN)&$(printf $NC)/g" \
        -e "s/.*DEPLOYMENT STARTED.*/$(printf $PURPLE)&$(printf $NC)/g" \
        -e "s/.*DEPLOYMENT SUCCESS.*/$(printf $GREEN)&$(printf $NC)/g" \
        -e "s/.*COMMAND.*/$(printf $CYAN)&$(printf $NC)/g"
}

# Show live logs
show_live() {
    echo "📊 Following deployment logs in real-time..."
    echo "Press Ctrl+C to stop"
    echo "Log file: $LOG_FILE"
    echo ""
    
    # Create log file if it doesn't exist
    sudo mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true
    sudo touch "$LOG_FILE" 2>/dev/null || true
    sudo chown -R "$USER:$USER" "$(dirname "$LOG_FILE")" 2>/dev/null || true
    
    tail -f "$LOG_FILE" 2>/dev/null | colorize_logs || {
        echo "❌ Cannot access log file: $LOG_FILE"
        echo "Try running with sudo or check permissions"
        exit 1
    }
}

# Show last deployment
show_last() {
    echo "📋 Last deployment logs:"
    echo ""
    
    if [ ! -f "$LOG_FILE" ]; then
        echo "❌ No deployment log found"
        exit 1
    fi
    
    # Find last deployment block
    tac "$LOG_FILE" | sed '/DEPLOYMENT STARTED/q' | tac | colorize_logs
}

# Show errors only
show_errors() {
    echo "❌ Errors and warnings:"
    echo ""
    
    if [ ! -f "$LOG_FILE" ]; then
        echo "❌ No deployment log found"
        exit 1
    fi
    
    grep -E "(ERROR|WARNING|FAILED)" "$LOG_FILE" | colorize_logs || {
        echo "✅ No errors or warnings found"
    }
}

# Show step progress
show_steps() {
    echo "📋 Step progress:"
    echo ""
    
    if [ ! -f "$LOG_FILE" ]; then
        echo "❌ No deployment log found"
        exit 1
    fi
    
    grep -E "(STEP_START|STEP_END|DEPLOYMENT)" "$LOG_FILE" | colorize_logs
}

# Show webhook logs
show_webhook() {
    echo "🎣 Webhook logs:"
    echo "Log file: $WEBHOOK_LOG"
    echo ""
    
    if [ ! -f "$WEBHOOK_LOG" ]; then
        echo "❌ No webhook log found"
        echo "Start webhook server: sudo systemctl start boxing-webhook"
        exit 1
    fi
    
    tail -50 "$WEBHOOK_LOG" | colorize_logs
}

# Clear logs
clear_logs() {
    echo "🧹 Clearing deployment logs..."
    
    sudo rm -f "$LOG_FILE" 2>/dev/null || true
    sudo rm -f "$WEBHOOK_LOG" 2>/dev/null || true
    
    echo "✅ Logs cleared"
}

# Check if log file exists
check_logs() {
    if [ ! -f "$LOG_FILE" ]; then
        echo "ℹ️  No deployment logs found yet"
        echo "Run a deployment to generate logs: ./deploy.sh deploy"
        return 1
    fi
    return 0
}

# Main
case "${1:-live}" in
    live)
        show_live
        ;;
    last)
        check_logs && show_last
        ;;
    errors)
        check_logs && show_errors
        ;;
    steps)
        check_logs && show_steps
        ;;
    all)
        if check_logs; then
            echo "📊 All deployment logs:"
            echo ""
            cat "$LOG_FILE" | colorize_logs
        fi
        ;;
    webhook)
        show_webhook
        ;;
    clear)
        clear_logs
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown option: $1"
        show_help
        exit 1
        ;;
esac
