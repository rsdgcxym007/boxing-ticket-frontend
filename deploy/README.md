# AWS EC2 Deployment Guide for Boxing Ticket Frontend + Backend

## Prerequisites

1. **AWS EC2 Instance**
   - Ubuntu 20.04 LTS or later
   - t2.small or larger (t2.medium recommended for frontend + backend)
   - Security Group allowing HTTP (80), HTTPS (443), SSH (22), and API port (8000)

2. **Domain/IP**
   - Public IP address or domain name pointing to your EC2 instance

## Step-by-Step Deployment

### 1. Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 2. Upload Project Files

**Option A: Using SCP (Both Frontend and Backend)**
```bash
# From your local machine - upload both projects
scp -i your-key.pem -r boxing-ticket-frontend ubuntu@your-ec2-ip:~/
scp -i your-key.pem -r boxing-ticket-backend ubuntu@your-ec2-ip:~/
```

**Option B: Using Git (Both Projects)**
```bash
# On EC2 instance
git clone https://github.com/your-username/boxing-ticket-frontend.git
git clone https://github.com/your-username/boxing-ticket-backend.git
```

### 3. Run Setup Script

```bash
# Make scripts executable
chmod +x deploy/*.sh
chmod +x *.sh

# Run EC2 setup
./deploy/ec2-setup.sh
```

### 4. Move Projects to Web Directory

```bash
# Create directories for both projects
sudo mkdir -p /var/www/boxing-ticket-frontend
sudo mkdir -p /var/www/boxing-ticket-backend

# Move projects (if uploaded to home directory)
sudo mv ~/boxing-ticket-frontend/* /var/www/boxing-ticket-frontend/
sudo mv ~/boxing-ticket-backend/* /var/www/boxing-ticket-backend/

# Set proper permissions
sudo chown -R $USER:$USER /var/www/boxing-ticket-frontend
sudo chown -R $USER:$USER /var/www/boxing-ticket-backend
```

### 5. Configure Environment Variables

```bash
# Frontend configuration
cd /var/www/boxing-ticket-frontend
cp .env.example .env
nano .env

# Backend configuration
cd /var/www/boxing-ticket-backend
cp .env.example .env
nano .env
```

### 6. Deploy Applications

```bash
# Deploy backend first
cd /var/www/boxing-ticket-backend
./deploy/deploy-backend.sh

# Deploy frontend
cd /var/www/boxing-ticket-frontend
./deploy/deploy.sh
```

### 7. Configure Nginx

```bash
# Configure Nginx reverse proxy
./deploy/configure-nginx.sh
```

### 8. Setup SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

**Frontend (.env)**
```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
NUXT_PUBLIC_WS_URL=ws://localhost:8000

# Application Settings
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

**Backend (.env)**
```env
# Database Configuration
DATABASE_URL=postgresql://boxinguser:password@localhost/boxing_tickets

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Settings
NODE_ENV=production
PORT=8000
HOST=0.0.0.0

# JWT Settings (if applicable)
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=24h

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

## Useful Commands

### PM2 Management
```bash
# View all applications status
pm2 status

# View specific application logs
pm2 logs boxing-ticket-frontend
pm2 logs boxing-ticket-backend

# Restart applications
pm2 restart boxing-ticket-frontend
pm2 restart boxing-ticket-backend

# Monitor real-time
pm2 monit

# Stop applications
pm2 stop boxing-ticket-frontend
pm2 stop boxing-ticket-backend

# Restart all
pm2 restart all
```

### Nginx Management
```bash
# Check status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Check configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### System Monitoring
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check running processes
ps aux | grep node
```

## Security Considerations

1. **Firewall Settings**
   ```bash
   # Enable UFW
   sudo ufw enable
   
   # Allow necessary ports
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw allow 3000  # Frontend (if direct access needed)
   sudo ufw allow 8000  # Backend API (if direct access needed)
   sudo ufw allow 5432  # PostgreSQL (if external access needed)
   sudo ufw allow 6379  # Redis (if external access needed)
   ```

2. **Regular Updates**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade
   
   # Update Node.js dependencies
   npm audit fix
   ```

3. **Backup Strategy**
   - Regular database backups
   - Code repository backups
   - Configuration file backups

## Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   # Check PM2 logs
   pm2 logs boxing-ticket-frontend
   
   # Check if port is in use
   sudo netstat -tlnp | grep 3000
   ```

2. **Nginx 502 Bad Gateway**
   ```bash
   # Check if application is running
   pm2 status
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Memory issues**
   ```bash
   # Check memory usage
   free -h
   
   # Restart application if memory usage is high
   pm2 restart boxing-ticket-frontend
   ```

### Performance Optimization

1. **Enable Gzip compression** (already configured in nginx.conf)
2. **Use CDN** for static assets
3. **Configure caching headers**
4. **Monitor performance** with PM2

## Scaling Considerations

1. **Load Balancer**: Use AWS Application Load Balancer for multiple instances
2. **Auto Scaling**: Configure EC2 Auto Scaling Groups
3. **Database**: Use managed database services (RDS)
4. **CDN**: Use CloudFront for static asset delivery

## Support

For issues or questions, check:
- Application logs: `pm2 logs boxing-ticket-frontend`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u nginx`
