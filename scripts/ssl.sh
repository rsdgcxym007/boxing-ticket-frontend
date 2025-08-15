#!/bin/bash

# 🔒 SSL Certificate Management for Patong Boxing Stadium
# Certbot and SSL certificate management

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
FRONTEND_DOMAIN="patongboxingstadiumticket.com"
BACKEND_DOMAIN="api-patongboxingstadiumticket.com"
EMAIL="info@patongboxing.com"

echo -e "${PURPLE}🔒 SSL Management - Patong Boxing Stadium${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

show_help() {
    echo -e "${YELLOW}Usage: $0 [COMMAND]${NC}"
    echo ""
    echo -e "${BLUE}Commands:${NC}"
    echo -e "${GREEN}  install     ${NC} Install SSL certificates"
    echo -e "${GREEN}  renew       ${NC} Renew all certificates"
    echo -e "${GREEN}  status      ${NC} Show certificate status"
    echo -e "${GREEN}  test        ${NC} Test auto-renewal"
    echo -e "${GREEN}  force       ${NC} Force certificate renewal"
    echo -e "${GREEN}  remove      ${NC} Remove certificates"
    echo -e "${GREEN}  backup      ${NC} Backup certificates"
    echo -e "${GREEN}  restore     ${NC} Restore certificates"
    echo ""
}

install_ssl() {
    echo -e "${YELLOW}🔒 Installing SSL certificates...${NC}"
    
    # Install certbot if not installed
    if ! command -v certbot &> /dev/null; then
        echo -e "${BLUE}📦 Installing Certbot...${NC}"
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Check if nginx is running
    if ! systemctl is-active --quiet nginx; then
        echo -e "${RED}❌ Nginx is not running. Start it first.${NC}"
        return 1
    fi
    
    # Test nginx configuration
    if ! sudo nginx -t; then
        echo -e "${RED}❌ Nginx configuration has errors. Fix them first.${NC}"
        return 1
    fi
    
    # Get certificates
    echo -e "${BLUE}🔐 Obtaining certificates for all domains...${NC}"
    sudo certbot --nginx \
        -d "$FRONTEND_DOMAIN" \
        -d "www.$FRONTEND_DOMAIN" \
        -d "$BACKEND_DOMAIN" \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        --redirect
    
    # Setup auto-renewal
    setup_auto_renewal
    
    echo -e "${GREEN}✅ SSL certificates installed successfully!${NC}"
}

renew_certificates() {
    echo -e "${YELLOW}🔄 Renewing SSL certificates...${NC}"
    
    sudo certbot renew --nginx
    
    echo -e "${GREEN}✅ Certificate renewal completed${NC}"
}

test_renewal() {
    echo -e "${YELLOW}🧪 Testing SSL auto-renewal...${NC}"
    
    sudo certbot renew --dry-run
    
    echo -e "${GREEN}✅ Auto-renewal test successful${NC}"
}

force_renew() {
    echo -e "${YELLOW}⚡ Force renewing SSL certificates...${NC}"
    
    sudo certbot renew --force-renewal --nginx
    
    echo -e "${GREEN}✅ Forced renewal completed${NC}"
}

show_status() {
    echo -e "${YELLOW}📊 SSL Certificate Status:${NC}"
    echo ""
    
    # List all certificates
    sudo certbot certificates
    
    echo ""
    
    # Check expiration dates
    echo -e "${BLUE}Certificate Expiration:${NC}"
    for domain in "$FRONTEND_DOMAIN" "$BACKEND_DOMAIN"; do
        echo -n "Checking $domain... "
        if timeout 10 openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
            echo -e "${GREEN}✅ Valid${NC}"
        else
            echo -e "${YELLOW}⚠️  No valid certificate${NC}"
        fi
    done
    
    echo ""
    
    # Auto-renewal status
    echo -e "${BLUE}Auto-renewal Status:${NC}"
    systemctl status certbot.timer --no-pager
}

setup_auto_renewal() {
    echo -e "${YELLOW}⚙️  Setting up auto-renewal...${NC}"
    
    # Enable and start certbot timer
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    
    # Create renewal hook for nginx reload
    sudo mkdir -p /etc/letsencrypt/renewal-hooks/post
    sudo tee /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh > /dev/null << 'HOOK'
#!/bin/bash
systemctl reload nginx
HOOK
    sudo chmod +x /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh
    
    echo -e "${GREEN}✅ Auto-renewal configured${NC}"
}

backup_certificates() {
    echo -e "${YELLOW}📦 Backing up SSL certificates...${NC}"
    
    BACKUP_NAME="ssl-certificates-$(date +%Y%m%d_%H%M%S).tar.gz"
    
    sudo tar -czf "/tmp/$BACKUP_NAME" \
        /etc/letsencrypt \
        2>/dev/null || true
    
    echo -e "${GREEN}✅ Backup created: /tmp/$BACKUP_NAME${NC}"
    echo -e "${BLUE}💡 Download with: scp user@server:/tmp/$BACKUP_NAME ./${NC}"
}

remove_certificates() {
    echo -e "${YELLOW}🗑️  Removing SSL certificates...${NC}"
    
    echo -e "${RED}⚠️  This will remove ALL SSL certificates!${NC}"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Cancelled${NC}"
        return
    fi
    
    # Backup before removing
    backup_certificates
    
    # Remove certificates
    for domain in "$FRONTEND_DOMAIN" "$BACKEND_DOMAIN"; do
        sudo certbot delete --cert-name "$domain" 2>/dev/null || true
    done
    
    echo -e "${GREEN}✅ Certificates removed${NC}"
}

check_ssl_health() {
    echo -e "${YELLOW}🔍 SSL Health Check:${NC}"
    echo ""
    
    for domain in "$FRONTEND_DOMAIN" "$BACKEND_DOMAIN"; do
        echo -e "${BLUE}Checking $domain...${NC}"
        
        # Check certificate validity
        if curl -s --head "https://$domain" > /dev/null; then
            echo -e "${GREEN}✅ HTTPS working${NC}"
            
            # Get certificate info
            cert_info=$(echo | openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
            if [ $? -eq 0 ]; then
                echo -e "${BLUE}Certificate dates:${NC}"
                echo "$cert_info"
            fi
        else
            echo -e "${RED}❌ HTTPS not working${NC}"
        fi
        echo ""
    done
}

# Main script logic
case "${1:-help}" in
    "install")
        install_ssl
        ;;
    "renew")
        renew_certificates
        ;;
    "status")
        show_status
        ;;
    "test")
        test_renewal
        ;;
    "force")
        force_renew
        ;;
    "remove")
        remove_certificates
        ;;
    "backup")
        backup_certificates
        ;;
    "health")
        check_ssl_health
        ;;
    "help"|*)
        show_help
        ;;
esac
