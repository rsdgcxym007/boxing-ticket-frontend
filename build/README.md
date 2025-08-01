# Icon Instructions

This directory should contain the application icons for different platforms:

## Required Icons:

### macOS (icon.icns)
- 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
- File format: .icns

### Windows (icon.ico)
- 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256
- File format: .ico

### Linux (icon.png)
- 512x512 recommended
- File format: .png

## Current Status:
- [ ] icon.icns (macOS)
- [ ] icon.ico (Windows)  
- [ ] icon.png (Linux)

## How to Generate Icons:

You can use online tools or applications like:
- https://cloudconvert.com/png-to-icns
- https://cloudconvert.com/png-to-ico
- Or use the `electron-icon-builder` npm package

## macOS Entitlements:
The `entitlements.mac.plist` file is already configured for macOS builds with appropriate permissions.
