#!/bin/bash

# Build script for macOS with proper code signature handling
# This script helps avoid code signature validation errors

echo "🚀 Building Patong Boxing Ticket System for macOS..."

# Set environment variables to disable code signing for local builds
export CSC_IDENTITY_AUTO_DISCOVERY=false
export CSC_LINK=""
export CSC_KEY_PASSWORD=""
export APPLE_ID=""
export APPLE_ID_PASS=""
export APPLE_TEAM_ID=""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist-electron
rm -rf .output

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Nuxt app
echo "🏗️  Building Nuxt application..."
npm run generate

# Build Electron app
echo "⚡ Building Electron application..."
npx electron-builder --mac --publish=never

echo "✅ Build completed! Check dist-electron folder for your app."
echo "📁 Files created:"
find dist-electron -name "*.dmg" -o -name "*.zip" | head -5
