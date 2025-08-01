# Electron Development and Build Guide

## 🚀 Getting Started

### Development

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Start Electron in Development Mode**
   ```bash
   npm run electron:dev
   ```

### Building for Production

1. **Build for All Platforms**
   ```bash
   npm run electron:dist
   ```

2. **Build for Specific Platforms**
   ```bash
   # macOS
   npm run electron:dist:mac
   
   # Windows
   npm run electron:dist:win
   
   # Linux
   npm run electron:dist:linux
   ```

3. **Pack Without Creating Installer**
   ```bash
   npm run electron:pack
   ```

## 📦 Features Implemented

### ✅ Core Electron Features
- [x] Main process with auto-updater
- [x] Preload script for secure IPC
- [x] Window management (minimize, maximize, close)
- [x] Native menus and keyboard shortcuts
- [x] Platform-specific UI adaptations
- [x] Splash screen

### ✅ Auto-Update System
- [x] GitHub releases integration
- [x] Automatic update checking
- [x] Background downloading
- [x] User confirmation dialogs
- [x] Progress indicators
- [x] Silent updates option

### ✅ Native Integrations
- [x] File system dialogs (open/save)
- [x] Native message boxes
- [x] System notifications
- [x] Application menus
- [x] Window controls
- [x] Platform detection

### ✅ UI Components
- [x] ElectronMenuBar - Top menu navigation
- [x] ElectronWindowControls - Window buttons
- [x] ElectronTicketActions - Print/export actions
- [x] ElectronUpdateNotification - Update UI
- [x] Platform-specific styling

### ✅ Navigation Integration
- [x] All existing pages work in Electron
- [x] All modals work in Electron
- [x] Keyboard shortcuts for all pages
- [x] Menu-driven navigation

## 🎯 Page Integration Status

### ✅ Admin Pages
- [x] `/admin/dashboard` - Dashboard (Ctrl+1)
- [x] `/admin/orders` - Orders management (Ctrl+2)
- [x] `/admin/staff` - Staff management (Ctrl+3)
- [x] `/admin/audit` - Audit logs (Ctrl+4)
- [x] `/admin/referrer` - Referrer management (Ctrl+5)

### ✅ Ticket Pages
- [x] `/ringside` - Ringside seat booking (Ctrl+R)
- [x] `/StandingTicketForm` - Standing tickets (Ctrl+S)
- [x] `/confirmation` - Booking confirmation
- [x] `/contacts` - Contact information

### ✅ Modals Supported
- [x] PaymentModal
- [x] SummaryModal  
- [x] StandingTicketModal
- [x] AuditDetailModal
- [x] AuditExportModal
- [x] StaffFormModal
- [x] UserActivityModal
- [x] All other existing modals

## ⌨️ Keyboard Shortcuts

### Navigation
- `Ctrl+1` - Dashboard
- `Ctrl+2` - Orders
- `Ctrl+3` - Staff Management
- `Ctrl+4` - Audit
- `Ctrl+5` - Referrer
- `Ctrl+R` - Ringside Seats
- `Ctrl+S` - Standing Tickets

### Actions
- `Ctrl+N` - New Order
- `Ctrl+P` - Print Ticket
- `F5` - Reload
- `Ctrl+Shift+R` - Force Reload
- `F11` - Toggle Fullscreen
- `Ctrl+M` - Minimize Window
- `Ctrl+W` - Close Window

### Developer
- `Ctrl+Shift+I` - Toggle DevTools

## 🔧 Configuration Files

### electron-builder.json
- App metadata and build configuration
- Platform-specific settings
- Auto-updater configuration
- Signing and notarization setup

### electron/main.js
- Main Electron process
- Window management
- Auto-updater logic
- Menu definitions
- IPC handlers

### electron/preload.js
- Secure API exposure
- IPC communication bridge
- Platform detection

## 🛠️ Development Tools

### Composables
- `useElectron()` - Main Electron integration
- Platform detection
- Window controls
- Update management
- Dialog utilities

### Components
- `ElectronMenuBar` - Application menu
- `ElectronWindowControls` - Window buttons
- `ElectronTicketActions` - Ticket operations
- `ElectronUpdateNotification` - Update UI

## 📱 Platform Support

### macOS
- Native menu bar integration
- Traffic light controls
- DMG installer
- App Store compatibility (with modifications)

### Windows
- NSIS installer
- Portable executable
- Auto-start support
- Native window controls

### Linux
- AppImage format
- Debian package
- System integration

## 🔐 Security

### Enabled Features
- Context isolation
- Node integration disabled in renderer
- Secure preload script
- CSP compliance
- Safe external link handling

## 📊 Performance

### Optimizations
- Lazy loading of components
- Background update downloading
- Efficient IPC communication
- Memory management
- Process isolation

## 🎨 Theming

### Dark/Light Mode
- Automatic OS theme detection
- Manual theme switching
- Consistent styling across platforms
- Platform-specific UI elements

## 🔄 Update Distribution

### GitHub Releases
- Automatic version detection
- Delta updates support
- Rollback capability
- Release notes display

## 🧪 Testing

### Demo Page
- `/electron-demo` - Complete feature showcase
- Dialog testing
- File operations
- Window controls
- Update simulation

## 📋 Todo / Future Enhancements

### Potential Additions
- [ ] System tray integration
- [ ] Deep linking support
- [ ] Multi-window support
- [ ] Background sync
- [ ] Offline mode
- [ ] Crash reporting
- [ ] Analytics integration
- [ ] Custom protocols

## 🚀 Deployment

### Development
```bash
npm run electron:dev
```

### Production Build
```bash
npm run build
npm run electron:dist
```

### Auto-Update Release
```bash
npm run dist  # Builds and publishes to GitHub
```

The application is now fully integrated with Electron and includes:
- ✅ All existing pages and modals working in Electron
- ✅ Complete auto-update system
- ✅ Native menu system with keyboard shortcuts
- ✅ Platform-specific UI adaptations
- ✅ File operations and dialogs
- ✅ Window management
- ✅ Secure IPC communication
- ✅ Professional packaging for all platforms
