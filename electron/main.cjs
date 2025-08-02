const path = require("path");
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  shell,
} = require("electron");

// Import electron-updater with error handling
let autoUpdater;
try {
  const electronUpdater = require("electron-updater");
  autoUpdater = electronUpdater.autoUpdater;
  console.log("[Auto-Updater] ✅ electron-updater loaded successfully");
  console.log(
    "[Auto-Updater] electron-updater version:",
    require("electron-updater/package.json").version
  );
} catch (error) {
  console.error(
    "[Auto-Updater] ❌ CRITICAL: electron-updater not available:",
    error.message
  );
  console.error("[Auto-Updater] This means auto-updates will NOT work!");

  // Create a more verbose fallback for debugging
  autoUpdater = {
    autoDownload: false,
    autoInstallOnAppQuit: true,
    setFeedURL: (config) => {
      console.log(
        "[Auto-Updater] ⚠️ FALLBACK setFeedURL called (not functional):",
        config
      );
    },
    checkForUpdates: () => {
      console.log(
        "[Auto-Updater] ⚠️ FALLBACK checkForUpdates called (not functional)"
      );
      return Promise.resolve(null);
    },
    checkForUpdatesAndNotify: () => {
      console.log(
        "[Auto-Updater] ⚠️ FALLBACK checkForUpdatesAndNotify called (not functional)"
      );
      return Promise.resolve(null);
    },
    downloadUpdate: () => {
      console.log(
        "[Auto-Updater] ⚠️ FALLBACK downloadUpdate called (not functional)"
      );
      return Promise.resolve();
    },
    quitAndInstall: () => {
      console.log(
        "[Auto-Updater] ⚠️ FALLBACK quitAndInstall called (not functional)"
      );
    },
    on: (event, callback) => {
      console.log(
        `[Auto-Updater] ⚠️ FALLBACK event listener for: ${event} (not functional)`
      );
    },
    emit: () => {},
  };
}

// ...existing code...
const fs = require("fs");
try {
  if (process.env.NODE_ENV === "production") {
    require("dotenv").config({
      path: path.join(__dirname, "../.env.production"),
    });
  } else {
    require("dotenv").config({ path: path.join(__dirname, "../.env") });
  }
} catch (error) {
  console.warn("dotenv not available:", error.message);
}
// More reliable development detection
const isDev =
  process.env.NODE_ENV === "development" ||
  process.defaultApp ||
  /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
  /[\\/]electron[\\/]/.test(process.execPath);

console.log("isDevisDevisDev", isDev);

// Keep a global reference of the window object
let mainWindow;
let splashWindow;
let updateCheckInterval;

// Auto updater configuration
console.log("[Auto-Updater] 🔧 Configuring auto-updater...");
console.log("[Auto-Updater] isDev:", isDev);
console.log("[Auto-Updater] NODE_ENV:", process.env.NODE_ENV);
console.log("[Auto-Updater] process.defaultApp:", process.defaultApp);

// Force enable auto-updater even in development for testing
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Force enable in development mode using the correct property
if (isDev) {
  console.log("[Auto-Updater] 🔧 Enabling auto-updater in development mode");
  // Use the correct method to enable dev updates
  autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.logger = console;

  // Set development update configuration
  process.env.ELECTRON_IS_DEV = "0"; // Force non-dev mode for updater

  // Override updater configuration for development
  const originalIsUpdaterActive = autoUpdater.isUpdaterActive;
  autoUpdater.isUpdaterActive = function () {
    return true; // Always return true in development
  };

  // Patch the checkForUpdates method to bypass dev check
  const originalCheckForUpdates = autoUpdater.checkForUpdates;
  autoUpdater.checkForUpdates = function () {
    console.log("[Auto-Updater] 🔧 Bypassing dev check...");

    // Temporarily set to production mode
    const originalDefaultApp = process.defaultApp;
    const originalNodeEnv = process.env.NODE_ENV;

    process.defaultApp = false;
    process.env.NODE_ENV = "production";

    const result = originalCheckForUpdates.call(this);

    // Restore original values
    process.defaultApp = originalDefaultApp;
    process.env.NODE_ENV = originalNodeEnv;

    return result;
  };
}

// Configure GitHub releases for auto-updater
console.log("[Auto-Updater] 🔗 Setting feed URL...");
try {
  const feedConfig = {
    provider: "github",
    owner: "rsdgcxym007",
    repo: "boxing-ticket-frontend",
    private: false,
  };

  // Add platform-specific configuration
  if (process.platform === "win32") {
    feedConfig.releaseType = "release";
    feedConfig.publisherName = "Patong Boxing Ticket System";
  } else if (process.platform === "darwin") {
    feedConfig.releaseType = "release";
  }

  autoUpdater.setFeedURL(feedConfig);
  console.log("[Auto-Updater] ✅ Feed URL set successfully");
  console.log("[Auto-Updater] Feed config:", feedConfig);
} catch (error) {
  console.error("[Auto-Updater] ❌ Error setting feed URL:", error);
}

// Force set update server URL for testing
if (autoUpdater.setFeedURL) {
  console.log("[Auto-Updater] App version:", app.getVersion());
  console.log("[Auto-Updater] Platform:", process.platform);
  console.log("[Auto-Updater] Arch:", process.arch);

  // Test GitHub API endpoint
  console.log(
    "[Auto-Updater] GitHub releases endpoint: https://api.github.com/repos/rsdgcxym007/boxing-ticket-frontend/releases/latest"
  );
}

// Add a test function to verify auto-updater is working
const testAutoUpdater = async () => {
  try {
    console.log("[Auto-Updater] 🧪 Testing auto-updater functionality...");
    console.log("[Auto-Updater] 🧪 App version:", app.getVersion());
    console.log("[Auto-Updater] 🧪 Platform:", process.platform);
    console.log("[Auto-Updater] 🧪 Arch:", process.arch);

    // Test if we can reach GitHub API
    const https = require("https");
    const options = {
      hostname: "api.github.com",
      path: "/repos/rsdgcxym007/boxing-ticket-frontend/releases/latest",
      method: "GET",
      headers: {
        "User-Agent": "Patong-Boxing-Ticket-System",
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const release = JSON.parse(data);
            console.log("[Auto-Updater] 🧪 ✅ GitHub API accessible");
            console.log("[Auto-Updater] 🧪 Latest release:", release.tag_name);
            console.log("[Auto-Updater] 🧪 Current version:", app.getVersion());
            console.log(
              "[Auto-Updater] 🧪 Assets count:",
              release.assets?.length || 0
            );

            // Check if update is needed
            const currentVersion = app.getVersion();
            const latestVersion = release.tag_name.replace("v", "");
            const needsUpdate = currentVersion !== latestVersion;

            console.log("[Auto-Updater] 🧪 Update needed:", needsUpdate);

            resolve(release);
          } catch (e) {
            console.error(
              "[Auto-Updater] 🧪 ❌ Failed to parse GitHub response:",
              e
            );
            reject(e);
          }
        });
      });

      req.on("error", (err) => {
        console.error("[Auto-Updater] 🧪 ❌ GitHub API request failed:", err);
        reject(err);
      });
      req.setTimeout(5000);
      req.end();
    });
  } catch (error) {
    console.error("[Auto-Updater] 🧪 ❌ Test failed:", error);
    throw error;
  }
};

// Set the app user model ID for Windows
if (process.platform === "win32") {
  app.setAppUserModelId("com.patongboxing.ticket.app");
} else if (process.platform === "darwin") {
  // For macOS, set a consistent bundle identifier that matches the built app
  app.setName("Patong Boxing Ticket System");
  // Force the app ID to match what Squirrel expects
  if (isDev) {
    // In development, override the app ID to match production builds
    Object.defineProperty(app, "getName", {
      value: () => "Patong Boxing Ticket System",
      writable: false,
    });
  }
}

function createSplashWindow() {
  console.log("[Electron] Creating splash window");
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const splashPath = path.join(__dirname, "splash.html");
  if (fs.existsSync(splashPath)) {
    splashWindow.loadFile(splashPath);
  } else {
    console.log("[Electron] Splash file not found, skipping splash screen");
    splashWindow = null;
  }

  if (splashWindow) {
    splashWindow.on("closed", () => {
      splashWindow = null;
    });
  }
}

function createWindow() {
  console.log("[Electron] Creating main window");

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until ready-to-show
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: true,
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
  });

  // Load the app
  if (isDev) {
    // Try common dev server ports
    const tryPorts = [3000, 3001, 3002, 3003];
    let currentPortIndex = 0;

    const tryNextPort = () => {
      if (currentPortIndex >= tryPorts.length) {
        console.log(
          "[Electron] All dev ports failed, falling back to production build"
        );
        const distPath = path.join(__dirname, "../.output/public/index.html");
        mainWindow.loadFile(distPath);
        return;
      }

      const port = tryPorts[currentPortIndex];
      console.log(`[Electron] Trying dev server: http://localhost:${port}`);

      mainWindow.loadURL(`http://localhost:${port}`).catch(() => {
        console.log(`[Electron] Port ${port} failed, trying next...`);
        currentPortIndex++;
        tryNextPort();
      });
    };

    tryNextPort();
  } else {
    // For production, load static files
    console.log("[Electron] Loading production files");
    const distPath = path.join(__dirname, "../.output/public/index.html");
    const fileUrl = `file://${distPath}`;
    console.log("[Electron] Loading file:", fileUrl);
    mainWindow.loadFile(path.join(__dirname, "../.output/public/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    console.log("[Electron] Main window ready to show");
    if (splashWindow) {
      splashWindow.close();
    }
    mainWindow.show();

    // Set up periodic update checks only (initial check done at startup)
    setTimeout(() => {
      console.log("[Electron] Setting up periodic update checks...");
      updateCheckInterval = setInterval(() => {
        try {
          console.log(
            "[Electron] Periodic update check... (Running in all environments)"
          );
          autoUpdater.checkForUpdatesAndNotify();
        } catch (err) {
          console.error(
            "[Electron] Error in periodic update check:",
            err.message
          );
        }
      }, 2 * 60 * 60 * 1000); // 2 hours
    }, 5000); // Wait 5 seconds after window is ready
  });

  if (isDev) {
    console.log("[Electron] Opening DevTools");
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on("closed", () => {
    console.log("[Electron] Main window closed");
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.log("[Electron] Opening external URL:", url);
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Prevent new window creation
  mainWindow.webContents.on("new-window", (event, navigationUrl) => {
    event.preventDefault();
    console.log("[Electron] Preventing new window:", navigationUrl);
    shell.openExternal(navigationUrl);
  });

  // Log navigation events
  mainWindow.webContents.on("did-start-loading", () => {
    console.log("[Electron] Started loading");
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("[Electron] Finished loading");
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      console.error(
        "[Electron] Failed to load:",
        errorCode,
        errorDescription,
        validatedURL
      );
    }
  );
}

// Create application menu
function createMenu() {
  const isMac = process.platform === "darwin";

  const template = [
    ...(isMac
      ? [
          {
            label: app.getName(),
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "close" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : []),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "ตรวจสอบอัพเดท",
          click: async () => {
            try {
              console.log("[Electron] Manual update check...");
              const result = await autoUpdater.checkForUpdates();
              console.log("[Electron] Update check result:", result);
            } catch (err) {
              console.log("[Electron] Manual update check error:", err.message);
              if (mainWindow) {
                mainWindow.webContents.send("update-status", {
                  type: "error",
                  message: "ไม่สามารถตรวจสอบอัพเดทได้",
                  error: {
                    message: err.message,
                  },
                });
              }
            }
          },
        },
        { type: "separator" },
        {
          label: "About",
          click: async () => {
            const { shell } = require("electron");
            await shell.openExternal("https://patongboxing.com");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Auto-updater events
console.log("[Auto-Updater] 🎯 Setting up event listeners...");

autoUpdater.on("checking-for-update", () => {
  console.log("[Auto-Updater] 🔍 Checking for update...");
  console.log("[Auto-Updater] Current version:", app.getVersion());
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "checking",
      message: "กำลังตรวจสอบอัพเดทใหม่...",
    });
  }
});

autoUpdater.on("update-available", (info) => {
  console.log("[Auto-Updater] 🎉 UPDATE AVAILABLE!");
  console.log("[Auto-Updater] Current version:", app.getVersion());
  console.log("[Auto-Updater] New version:", info.version);
  console.log("[Auto-Updater] Release info:", info);

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "available",
      message: `พบเวอร์ชันใหม่ ${info.version}`,
      version: info.version,
      info: info,
    });
  }
});

autoUpdater.on("update-not-available", (info) => {
  console.log("[Auto-Updater] ℹ️ No update available");
  console.log("[Auto-Updater] Current version:", app.getVersion());
  console.log("[Auto-Updater] Latest version:", info?.version || "unknown");

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "not-available",
      message: "ใช้เวอร์ชันล่าสุดแล้ว",
      version: info?.version,
    });
  }
});

autoUpdater.on("error", (err) => {
  console.error("[Auto-Updater] Error:", err);
  console.error("[Auto-Updater] Error details:", {
    message: err.message,
    code: err.code,
    stack: err.stack,
    domain: err.domain,
  });

  // Handle specific Squirrel.Mac errors
  if (err.domain === "SQRLUpdaterErrorDomain") {
    console.log(
      "[Auto-Updater] Squirrel.Mac error detected - this is expected in development mode"
    );
    if (isDev) {
      console.log(
        "[Auto-Updater] In development: Squirrel errors are normal and don't affect functionality"
      );
      // Don't send error to UI in development for Squirrel errors
      return;
    }
  }

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "error",
      message: isDev
        ? "ข้อผิดพลาดในการอัพเดท (Development Mode)"
        : "เกิดข้อผิดพลาดในการอัพเดท",
      error: {
        message: err.message,
        stack: err.stack,
        code: err.code,
        domain: err.domain,
      },
    });
  }
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = `Download speed: ${progressObj.bytesPerSecond}`;
  log_message = log_message + ` - Downloaded ${progressObj.percent}%`;
  log_message =
    log_message + ` (${progressObj.transferred}/${progressObj.total})`;
  console.log("[Auto-Updater]", log_message);

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "downloading",
      message: `กำลังดาวน์โหลด ${Math.round(progressObj.percent)}%`,
      percent: progressObj.percent,
      transferred: progressObj.transferred,
      total: progressObj.total,
      bytesPerSecond: progressObj.bytesPerSecond,
    });
  }
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("[Auto-Updater] Update downloaded:", info);

  // Clear any existing proxy servers
  if (autoUpdater.httpExecutor && autoUpdater.httpExecutor.closeServer) {
    try {
      autoUpdater.httpExecutor.closeServer();
    } catch (e) {
      console.log(
        "[Auto-Updater] Note: Could not close proxy server:",
        e.message
      );
    }
  }

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "downloaded",
      message: "ดาวน์โหลดเสร็จแล้ว พร้อมติดตั้ง",
      version: info.version,
      info: info,
    });
  }

  // For development mode, show install dialog immediately
  if (isDev) {
    const { dialog } = require("electron");
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "Update Ready",
        message:
          'Update has been downloaded. Click "Install" to restart and apply the update.',
        buttons: ["Install Now", "Later"],
        defaultId: 0,
      })
      .then((result) => {
        if (result.response === 0) {
          console.log("[Auto-Updater] User chose to install update now");
          try {
            autoUpdater.quitAndInstall(false, true);
          } catch (err) {
            console.error("[Auto-Updater] Error during quitAndInstall:", err);
          }
        }
      });
  }
});

// IPC handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

// IPC handler to send environment variables to renderer
ipcMain.handle("get-env", () => {
  // Only send safe variables, not all secrets
  // You can filter here if needed
  return process.env;
});

ipcMain.handle("app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-platform", () => {
  return process.platform;
});

ipcMain.handle("check-for-updates", async () => {
  try {
    console.log("[IPC] Manual update check requested");
    console.log("[IPC] Current app version:", app.getVersion());
    console.log("[IPC] Platform:", process.platform, "Arch:", process.arch);

    const result = await autoUpdater.checkForUpdates();
    console.log("[IPC] Manual update check result:", result);
    return result;
  } catch (error) {
    console.error("[IPC] Update check error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  }
});

ipcMain.handle("download-update", async () => {
  try {
    console.log("[IPC] Download update requested");
    await autoUpdater.downloadUpdate();
    console.log("[IPC] Download update completed");
  } catch (error) {
    console.error("[IPC] Download update error:", error);
    throw error;
  }
});

ipcMain.handle("install-update", () => {
  try {
    console.log("[IPC] Install update requested");

    if (isDev) {
      // In development mode, show a message that this would install in production
      const { dialog } = require("electron");
      dialog.showMessageBox(mainWindow, {
        type: "info",
        title: "Development Mode",
        message:
          "In development mode, update installation is simulated. In production, the app would restart and update.",
        buttons: ["OK"],
      });
      console.log("[IPC] Development mode: Update installation simulated");
      return { success: true, simulated: true };
    } else {
      // In production, actually install the update
      autoUpdater.quitAndInstall();
      console.log("[IPC] Production mode: Update installation initiated");
    }
  } catch (error) {
    console.error("[IPC] Install update error:", error);
    throw error;
  }
});

ipcMain.handle("show-save-dialog", async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-open-dialog", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-message-box", async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

ipcMain.handle("open-external", async (event, url) => {
  await shell.openExternal(url);
});

// Window control handlers for custom title bar
ipcMain.handle("window-minimize", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle("window-close", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle("window-is-maximized", () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Thermal printing handler
ipcMain.handle("print-thermal", async () => {
  console.log("[IPC] Thermal print requested");
  if (mainWindow) {
    try {
      // ส่งคำสั่งปริ้นไปยัง renderer process
      await mainWindow.webContents.print({
        silent: false, // แสดง print dialog
        printBackground: true,
        color: false, // สำหรับ thermal printer มักจะเป็น black & white
        margins: {
          marginType: "none", // ไม่มี margin สำหรับ thermal receipt
        },
        landscape: false,
        scaleFactor: 100,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        header: "",
        footer: "",
      });
      console.log("[IPC] Thermal print command sent successfully");
    } catch (error) {
      console.error("[IPC] Error printing thermal receipt:", error);
      throw error;
    }
  } else {
    throw new Error("Main window not available");
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log("[Electron] Another instance is already running, quitting...");
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    console.log("[Electron] Second instance attempted, focusing main window");
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// App event handlers
app.whenReady().then(async () => {
  console.log("[Electron] App ready");

  // Set security policies
  app.setAsDefaultProtocolClient("patong-boxing");

  // Create splash window first
  createSplashWindow();

  // Create menu
  createMenu();

  // Create main window
  createWindow();

  // Initial update check when app starts (Always run regardless of environment)
  setTimeout(async () => {
    try {
      console.log(
        "[Electron] Initial update check on app startup... (Running in all environments)"
      );
      console.log("[Electron] Current app version:", app.getVersion());
      console.log("[Electron] Update feed URL configured for GitHub releases");

      // Test auto-updater connectivity first
      await testAutoUpdater();

      const result = await autoUpdater.checkForUpdatesAndNotify();
      console.log("[Electron] Update check result:", result);

      if (!result) {
        console.log(
          "[Electron] No update check result - may be in development mode or no releases available"
        );
      }
    } catch (err) {
      console.error("[Electron] Error in initial update check:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });

      // Send error to renderer for debugging
      if (mainWindow) {
        mainWindow.webContents.send("update-status", {
          type: "error",
          message: "ไม่สามารถตรวจสอบอัพเดทได้",
          error: {
            message: err.message,
            code: err.code,
          },
        });
      }
    }
  }, 2000); // Check 2 seconds after app is ready

  // macOS specific: re-create window when dock icon is clicked
  app.on("activate", () => {
    console.log("[Electron] App activated");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  console.log("[Electron] All windows closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", (event) => {
  console.log("[Electron] Before quit");
  // Clear update check interval
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
});

app.on("will-quit", (event) => {
  console.log("[Electron] Will quit");
});

// Security: Prevent new window creation
app.on("web-contents-created", (event, contents) => {
  contents.on("new-window", (event, navigationUrl) => {
    event.preventDefault();
    console.log("[Electron] Prevented new window:", navigationUrl);
  });

  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const isLocal =
      parsedUrl.protocol === "file:" ||
      (parsedUrl.protocol === "http:" && parsedUrl.hostname === "localhost");

    if (!isLocal) {
      event.preventDefault();
      console.log("[Electron] Prevented navigation to:", navigationUrl);
    }
  });
});

// Handle certificate errors
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    // Allow localhost certificates in development
    if (isDev && url.startsWith("https://localhost")) {
      event.preventDefault();
      callback(true);
    } else {
      callback(false);
    }
  }
);

// Disable hardware acceleration if needed
if (process.platform === "linux") {
  app.disableHardwareAcceleration();
}

console.log("[Electron] Main process initialized");
