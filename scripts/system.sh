#!/bin/bash

# 🔧 VPS System Management for Patong Boxing Stadium
# System monitoring, maintenance, and troubleshooting

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}🔧 VPS System Management - Patong Boxing Stadium${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

show_help() {
    echo -e "${YELLOW}Usage: $0 [COMMAND]${NC}"
    echo ""
    echo -e "${BLUE}System Commands:${NC}"
    echo -e "${GREEN}  status      ${NC} Full system status overview"
    echo -e "${GREEN}  update      ${NC} Update system packages"
    echo -e "${GREEN}  clean       ${NC} Clean system (logs, cache, temp files)"
    echo -e "${GREEN}  monitor     ${NC} Real-time system monitoring"
    echo -e "${GREEN}  security    ${NC} Security hardening and firewall"
    echo -e "${GREEN}  backup      ${NC} Backup important system files"
    echo -e "${GREEN}  restore     ${NC} Restore from backup"
    echo ""
    echo -e "${BLUE}Service Commands:${NC}"
    echo -e "${GREEN}  services    ${NC} Show all service status"
    echo -e "${GREEN}  restart-all ${NC} Restart all services"
    echo -e "${GREEN}  logs        ${NC} Show system logs"
    echo ""
    echo -e "${BLUE}Network Commands:${NC}"
    echo -e "${GREEN}  network     ${NC} Network diagnostics"
    echo -e "${GREEN}  firewall    ${NC} Firewall status and rules"
    echo -e "${GREEN}  ports       ${NC} Show open ports"
    echo ""
}

system_status() {
    echo -e "${YELLOW}📊 System Status Overview:${NC}"
    echo ""
    
    # System info
    echo -e "${BLUE}🖥️  System Information:${NC}"
    echo "Hostname: $(hostname)"
    echo "Uptime: $(uptime -p)"
    echo "OS: $(lsb_release -d 2>/dev/null | cut -f2 || cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
    echo "Kernel: $(uname -r)"
    echo ""
    
    # CPU and Memory
    echo -e "${BLUE}💾 Resource Usage:${NC}"
    echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
    echo "Memory Usage:"
    free -h
    echo ""
    
    # Disk usage
    echo -e "${BLUE}💿 Disk Usage:${NC}"
    df -h | grep -E '^/dev/'
    echo ""
    
    # Load average
    echo -e "${BLUE}⚡ Load Average:${NC}"
    cat /proc/loadavg
    echo ""
    
    # Network
    echo -e "${BLUE}🌐 Network Status:${NC}"
    echo "Active connections: $(ss -tuln | wc -l)"
    echo "External IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Unable to fetch')"
    echo ""
    
    # Services status
    echo -e "${BLUE}🔧 Key Services:${NC}"
    for service in nginx pm2 certbot.timer; do
        if systemctl is-active --quiet $service 2>/dev/null; then
            echo -e "${GREEN}✅ $service: Active${NC}"
        else
            echo -e "${RED}❌ $service: Inactive${NC}"
        fi
    done
    
    # PM2 status
    echo ""
    echo -e "${BLUE}🚀 PM2 Applications:${NC}"
    if command -v pm2 &> /dev/null; then
        pm2 status --no-colors 2>/dev/null || echo "No PM2 processes running"
    else
        echo "PM2 not installed"
    fi
}

update_system() {
    echo -e "${YELLOW}📦 Updating system packages...${NC}"
    
    # Update package lists
    sudo apt update
    
    # Show upgradable packages
    echo ""
    echo -e "${BLUE}📋 Upgradable packages:${NC}"
    apt list --upgradable 2>/dev/null | head -20
    
    # Ask for confirmation
    echo ""
    read -p "Proceed with upgrade? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo apt upgrade -y
        sudo apt autoremove -y
        sudo apt autoclean
        echo -e "${GREEN}✅ System updated successfully${NC}"
    else
        echo -e "${YELLOW}Update cancelled${NC}"
    fi
}

clean_system() {
    echo -e "${YELLOW}🧹 Cleaning system...${NC}"
    
    # Clean package cache
    echo -e "${BLUE}Cleaning package cache...${NC}"
    sudo apt autoremove -y
    sudo apt autoclean
    
    # Clean logs
    echo -e "${BLUE}Cleaning old logs...${NC}"
    sudo journalctl --vacuum-time=7d
    
    # Clean temporary files
    echo -e "${BLUE}Cleaning temporary files...${NC}"
    sudo find /tmp -type f -atime +7 -delete 2>/dev/null || true
    sudo find /var/tmp -type f -atime +7 -delete 2>/dev/null || true
    
    # Clean nginx logs (keep last 30 days)
    echo -e "${BLUE}Rotating nginx logs...${NC}"
    sudo find /var/log/nginx -name "*.log" -type f -mtime +30 -delete 2>/dev/null || true
    
    # PM2 log cleanup
    if command -v pm2 &> /dev/null; then
        echo -e "${BLUE}Cleaning PM2 logs...${NC}"
        pm2 flush 2>/dev/null || true
    fi
    
    echo -e "${GREEN}✅ System cleanup completed${NC}"
    
    # Show disk usage after cleanup
    echo ""
    echo -e "${BLUE}Disk usage after cleanup:${NC}"
    df -h | grep -E '^/dev/'
}

monitor_system() {
    echo -e "${YELLOW}📈 Real-time System Monitoring${NC}"
    echo -e "${BLUE}Press Ctrl+C to exit${NC}"
    echo ""
    
    while true; do
        clear
        echo -e "${PURPLE}🔧 VPS System Monitor - $(date)${NC}"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        
        # CPU and Memory
        echo -e "${BLUE}💾 Resources:${NC}"
        echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
        echo "Memory:"
        free -h | head -2
        echo ""
        
        # Load
        echo -e "${BLUE}⚡ Load: $(cat /proc/loadavg | cut -d' ' -f1-3)${NC}"
        echo ""
        
        # Network connections
        echo -e "${BLUE}🌐 Network:${NC}"
        echo "Active connections: $(ss -tuln | wc -l)"
        echo "HTTP connections: $(ss -tuln | grep :80 | wc -l)"
        echo "HTTPS connections: $(ss -tuln | grep :443 | wc -l)"
        echo ""
        
        # Top processes
        echo -e "${BLUE}🔥 Top CPU Processes:${NC}"
        ps aux --sort=-%cpu | head -6
        
        sleep 5
    done
}

security_hardening() {
    echo -e "${YELLOW}🔒 Security Hardening...${NC}"
    
    # Update system first
    sudo apt update && sudo apt upgrade -y
    
    # Install fail2ban
    echo -e "${BLUE}Installing fail2ban...${NC}"
    sudo apt install -y fail2ban
    
    # Configure fail2ban
    sudo tee /etc/fail2ban/jail.local > /dev/null << 'FAIL2BAN'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-req-limit]
enabled = true
filter = nginx-req-limit
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
FAIL2BAN
    
    # Setup UFW firewall
    echo -e "${BLUE}Configuring UFW firewall...${NC}"
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    
    # Restart services
    sudo systemctl enable fail2ban
    sudo systemctl restart fail2ban
    
    echo -e "${GREEN}✅ Security hardening completed${NC}"
}

show_services() {
    echo -e "${YELLOW}🔧 Service Status:${NC}"
    echo ""
    
    services=("nginx" "fail2ban" "ufw" "certbot.timer" "ssh")
    
    for service in "${services[@]}"; do
        echo -n "$service: "
        if systemctl is-active --quiet $service 2>/dev/null; then
            echo -e "${GREEN}Active${NC}"
        else
            echo -e "${RED}Inactive${NC}"
        fi
    done
    
    echo ""
    echo -e "${BLUE}PM2 Status:${NC}"
    if command -v pm2 &> /dev/null; then
        pm2 status
    else
        echo "PM2 not installed"
    fi
}

restart_all_services() {
    echo -e "${YELLOW}🔄 Restarting all services...${NC}"
    
    services=("nginx" "fail2ban")
    
    for service in "${services[@]}"; do
        echo "Restarting $service..."
        sudo systemctl restart $service
        if systemctl is-active --quiet $service; then
            echo -e "${GREEN}✅ $service restarted${NC}"
        else
            echo -e "${RED}❌ $service failed to restart${NC}"
        fi
    done
    
    # Restart PM2 processes
    if command -v pm2 &> /dev/null; then
        echo "Restarting PM2 processes..."
        pm2 restart all
    fi
    
    echo -e "${GREEN}🎉 All services restarted${NC}"
}

show_logs() {
    echo -e "${YELLOW}📝 System Logs:${NC}"
    echo ""
    
    echo -e "${BLUE}System Log (last 20 lines):${NC}"
    sudo journalctl -n 20 --no-pager
    
    echo ""
    echo -e "${BLUE}Auth Log (last 10 lines):${NC}"
    sudo tail -10 /var/log/auth.log
    
    echo ""
    echo -e "${BLUE}Nginx Error Log:${NC}"
    sudo tail -10 /var/log/nginx/error.log 2>/dev/null || echo "No nginx errors"
}

network_diagnostics() {
    echo -e "${YELLOW}🌐 Network Diagnostics:${NC}"
    echo ""
    
    # Network interfaces
    echo -e "${BLUE}Network Interfaces:${NC}"
    ip addr show | grep -E '^[0-9]+:|inet '
    echo ""
    
    # DNS resolution
    echo -e "${BLUE}DNS Resolution:${NC}"
    echo "Resolving google.com..."
    if nslookup google.com > /dev/null 2>&1; then
        echo -e "${GREEN}✅ DNS working${NC}"
    else
        echo -e "${RED}❌ DNS issues${NC}"
    fi
    echo ""
    
    # Internet connectivity
    echo -e "${BLUE}Internet Connectivity:${NC}"
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Internet connection working${NC}"
    else
        echo -e "${RED}❌ No internet connection${NC}"
    fi
    echo ""
    
    # Domain resolution
    echo -e "${BLUE}Domain Resolution:${NC}"
    for domain in "patongboxingstadiumticket.com" "api-patongboxingstadiumticket.com"; do
        echo -n "Checking $domain... "
        if nslookup $domain > /dev/null 2>&1; then
            ip=$(dig +short $domain | tail -n1)
            echo -e "${GREEN}✅ $ip${NC}"
        else
            echo -e "${RED}❌ Failed${NC}"
        fi
    done
}

show_firewall() {
    echo -e "${YELLOW}🔒 Firewall Status:${NC}"
    echo ""
    
    # UFW status
    echo -e "${BLUE}UFW Status:${NC}"
    sudo ufw status verbose
    
    echo ""
    
    # Fail2ban status
    echo -e "${BLUE}Fail2ban Status:${NC}"
    if systemctl is-active --quiet fail2ban; then
        sudo fail2ban-client status
        echo ""
        echo -e "${BLUE}Banned IPs:${NC}"
        sudo fail2ban-client status sshd 2>/dev/null || echo "No banned IPs"
    else
        echo "Fail2ban not running"
    fi
}

show_ports() {
    echo -e "${YELLOW}🔌 Open Ports:${NC}"
    echo ""
    
    echo -e "${BLUE}Listening Ports:${NC}"
    sudo ss -tuln | grep LISTEN
    
    echo ""
    
    echo -e "${BLUE}Active Connections:${NC}"
    sudo ss -tun | head -20
}

# Main script logic
case "${1:-help}" in
    "status")
        system_status
        ;;
    "update")
        update_system
        ;;
    "clean")
        clean_system
        ;;
    "monitor")
        monitor_system
        ;;
    "security")
        security_hardening
        ;;
    "services")
        show_services
        ;;
    "restart-all")
        restart_all_services
        ;;
    "logs")
        show_logs
        ;;
    "network")
        network_diagnostics
        ;;
    "firewall")
        show_firewall
        ;;
    "ports")
        show_ports
        ;;
    "help"|*)
        show_help
        ;;
esac
