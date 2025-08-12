# 📊 Enhanced Deployment Logging System

## Overview
The deployment system now includes comprehensive logging with step-by-step tracking, error reporting, and real-time monitoring capabilities.

## Log Types

### 1. Console Output
- **Real-time colored output** during deployment
- **Step progress indicators** (🚀 STEP, ✅ COMPLETED, ❌ FAILED)
- **Command tracking** (🔧 COMMAND)
- **Status updates** (ℹ️ INFO, ✅ SUCCESS, ⚠️ WARNING, ❌ ERROR)

### 2. Log Files
- **Deployment Log**: `/var/log/frontend/deployment.log`
- **Webhook Log**: `/var/log/frontend/webhook.log`
- **PM2 Logs**: `/var/log/frontend/{out,error,combined}.log`

## Logging Features

### Detailed Step Tracking
```bash
[2025-08-13 15:30:00] STEP_START: Pulling latest code from repository
[2025-08-13 15:30:05] COMMAND: git fetch origin
[2025-08-13 15:30:07] SUCCESS: Git fetch completed
[2025-08-13 15:30:08] STEP_END: Pulling latest code from repository - SUCCESS
```

### Error Detection & Debugging
```bash
[2025-08-13 15:30:15] ERROR: npm install failed
[2025-08-13 15:30:15] STEP_END: Installing dependencies - FAILED: npm install failed
[2025-08-13 15:30:15] COMMAND: pm2 list
[2025-08-13 15:30:16] WARNING: App not found in PM2
```

### Deployment IDs
Each deployment gets a unique ID for tracking:
```bash
============================================
🚀 DEPLOYMENT STARTED: DEPLOY_20250813_153000
============================================
```

## Usage Commands

### Deploy with Logging
```bash
# Start deployment (full logging)
./deploy.sh deploy

# Deploy specific branch
./deploy.sh deploy refs/heads/feature/new-feature
```

### Watch Logs in Real-time
```bash
# Follow deployment logs live
./watch-logs.sh live

# Show last deployment only
./watch-logs.sh last

# Show errors and warnings only
./watch-logs.sh errors

# Show step progress
./watch-logs.sh steps

# Show webhook logs
./watch-logs.sh webhook
```

### Quick Log Commands
```bash
# Via deploy.sh
./deploy.sh watch-logs           # Real-time logs
./deploy.sh watch-logs errors    # Errors only
./deploy.sh watch-logs last      # Last deployment

# Direct commands
./watch-logs.sh live             # Follow live
./watch-logs.sh clear            # Clear all logs
```

## Log Structure

### Deployment Steps Tracked
1. ✅ Check permissions
2. ✅ Check prerequisites (Node.js, npm, PM2, git)
3. ✅ Cleanup PM2 duplicates
4. ✅ Backup current deployment
5. ✅ Pull latest code (git fetch, checkout, pull)
6. ✅ Generate lockfile (package-lock.json)
7. ✅ Cleanup mobile conflicts
8. ✅ Create missing components
9. ✅ Install dependencies (npm ci/install)
10. ✅ Cleanup old files
11. ✅ Build application (npm run build)
12. ✅ Manage PM2 (stop, start, save)
13. ✅ Health check (30 attempts, debugging on fail)

### Each Step Includes
- **Start timestamp**
- **Command execution** with full command logging
- **Success/failure status**
- **Error details** if failed
- **End timestamp**

## Error Debugging

### Automatic Debugging Info
When steps fail, the system automatically logs:
- **PM2 status**: `pm2 list`
- **Port status**: `netstat -tulpn | grep :3000`
- **Health responses**: Actual HTTP responses
- **File existence**: Critical files and directories

### Log Analysis
```bash
# Find all errors in deployment
grep "ERROR\|FAILED" /var/log/frontend/deployment.log

# Find specific deployment
grep "DEPLOY_20250813" /var/log/frontend/deployment.log

# Check last step that failed
tail -20 /var/log/frontend/deployment.log | grep "STEP_END.*FAILED"
```

## Discord Integration

Enhanced Discord notifications include:
- **Deployment ID** in messages
- **Step progress** updates
- **Error details** when failures occur
- **Success metrics** (duration, performance)

## File Locations

```
/var/log/frontend/
├── deployment.log          # Main deployment log
├── webhook.log            # Webhook server log
├── out.log               # PM2 stdout
├── error.log             # PM2 stderr
├── combined.log          # PM2 combined
└── health-check.sh       # Health check script
```

## Benefits

### For Development
- **Real-time feedback** during deployment
- **Detailed error context** for quick debugging
- **Step-by-step progress** tracking

### For Operations
- **Historical deployment tracking**
- **Error pattern analysis**
- **Performance monitoring**
- **Automated debugging info**

### For Monitoring
- **Discord notifications** with context
- **Log file persistence**
- **Easy log analysis** with colored output
- **Multiple log views** (live, errors, steps)

## Example Usage

### During Deployment Issues
```bash
# Terminal 1: Start deployment
./deploy.sh deploy

# Terminal 2: Watch logs
./watch-logs.sh live

# If error occurs, check specifics
./watch-logs.sh errors
./watch-logs.sh last
```

### After Failed Deployment
```bash
# Check what failed
./watch-logs.sh errors

# See full last deployment
./watch-logs.sh last

# Check step progress
./watch-logs.sh steps
```

This system provides complete visibility into every aspect of the deployment process! 🎯
