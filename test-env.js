// Simple test to verify environment variables are working correctly
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Test dotenv loading like in main.cjs
try {
  if (process.env.NODE_ENV === "production") {
    require("dotenv").config({
      path: path.join(__dirname, ".env.production"),
    });
  } else {
    require("dotenv").config({ path: path.join(__dirname, ".env") });
  }
  console.log("✅ dotenv loaded successfully");
} catch (error) {
  console.log("⚠️ dotenv not available:", error.message);
}

// Test IPC handler like we added
ipcMain.handle("get-env", () => {
  console.log("📤 Sending env variables to renderer");
  return process.env;
});

console.log("🔍 Environment variables test:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("NUXT_PUBLIC_API_BASE:", process.env.NUXT_PUBLIC_API_BASE);
console.log("NUXT_PUBLIC_SOCKET_URL:", process.env.NUXT_PUBLIC_SOCKET_URL);

app.whenReady().then(() => {
  console.log("✅ Electron app ready - environment test completed");
  app.quit();
});
