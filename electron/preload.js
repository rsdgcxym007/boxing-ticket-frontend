const { contextBridge, ipcRenderer } = require("electron");

console.log("[Preload] Setting up contextBridge for electronAPI");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getPlatform: () => ipcRenderer.invoke("get-platform"),
  getEnv: () => ipcRenderer.invoke("get-env"),

  // Updates
  checkForUpdates: () => {
    console.log("[Preload] checkForUpdates called");
    return ipcRenderer.invoke("check-for-updates");
  },
  downloadUpdate: () => {
    console.log("[Preload] downloadUpdate called");
    return ipcRenderer.invoke("download-update");
  },
  installUpdate: () => {
    console.log("[Preload] installUpdate called");
    return ipcRenderer.invoke("install-update");
  },
  onUpdateStatus: (callback) => {
    console.log("[Preload] Setting up onUpdateStatus listener");
    ipcRenderer.on("update-status", callback);
  },
  onUpdateProgress: (callback) => {
    console.log("[Preload] Setting up onUpdateProgress listener");
    ipcRenderer.on("update-progress", callback);
  },
  removeAllListeners: (channel) => {
    console.log("[Preload] Removing all listeners for channel:", channel);
    ipcRenderer.removeAllListeners(channel);
  },

  // Dialog methods
  showMessageBox: (options) => ipcRenderer.invoke("show-message-box", options),
  showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke("window-minimize"),
  maximizeWindow: () => ipcRenderer.invoke("window-maximize"),
  closeWindow: () => ipcRenderer.invoke("window-close"),
  isMaximized: () => ipcRenderer.invoke("window-is-maximized"),

  // Thermal printing
  printThermal: () => ipcRenderer.invoke("print-thermal"),

  // Menu actions
  onMenuAction: (callback) => ipcRenderer.on("menu-action", callback),
  onNavigateTo: (callback) => ipcRenderer.on("navigate-to", callback),

  // Remove listeners
  removeListener: (channel, callback) =>
    ipcRenderer.removeListener(channel, callback),
});

// Expose a limited set of Node.js APIs safely
contextBridge.exposeInMainWorld("nodeAPI", {
  platform: process.platform,
  env: process.env.NODE_ENV || "production",
});

console.log("[Preload] ✅ electronAPI and nodeAPI exposed successfully");

// Handle window controls for different platforms
window.addEventListener("DOMContentLoaded", () => {
  const platform = process.platform;

  if (platform === "darwin") {
    // macOS specific styling
    document.body.classList.add("platform-darwin");
  } else if (platform === "win32") {
    // Windows specific styling
    document.body.classList.add("platform-win32");
  } else {
    // Linux specific styling
    document.body.classList.add("platform-linux");
  }
});
