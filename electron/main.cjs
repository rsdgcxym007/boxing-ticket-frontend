const path = require("path");
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  shell,
} = require("electron");
const { autoUpdater } = require("electron-updater");
// ...existing code...
const fs = require("fs");
if (process.env.NODE_ENV === "production") {
  require("dotenv").config({
    path: path.join(__dirname, "../.env.production"),
  });
} else {
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
}
// More reliable development detection
const isDev =
  process.env.NODE_ENV === "development" ||
  process.defaultApp ||
  /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
  /[\\/]electron[\\/]/.test(process.execPath);

// Keep a global reference of the window object
let mainWindow;
let splashWindow;

// Auto updater configuration
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Set the app user model ID for Windows
if (process.platform === "win32") {
  app.setAppUserModelId("com.patongboxing.ticket.app");
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
    console.log("[Electron] Loading dev server: http://localhost:3000");
    mainWindow.loadURL("http://localhost:3000");
  } else {
    // For production, load static files
    console.log("[Electron] Loading production files");
    const distPath = path.join(__dirname, "../.output/public/index.html");
    const fileUrl = `file://${distPath}`;
    console.log("[Electron] Loading file:", fileUrl);
    mainWindow.loadFile(path.join(__dirname, "../.output/public/index.html"));
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    console.log("[Electron] Main window ready to show");
    if (splashWindow) {
      splashWindow.close();
    }
    mainWindow.show();

    // Check for updates after app is ready
    if (!isDev) {
      try {
        console.log("[Electron] Checking for updates...");
        autoUpdater.checkForUpdatesAndNotify();
      } catch (err) {
        console.log("[Electron] Error checking for updates:", err.message);
      }
    }
  });

  // Open DevTools in development
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
autoUpdater.on("checking-for-update", () => {
  console.log("[Auto-Updater] Checking for update...");
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "checking",
      message: "กำลังตรวจสอบอัพเดทใหม่...",
    });
  }
});

autoUpdater.on("update-available", (info) => {
  console.log("[Auto-Updater] Update available:", info);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "available",
      message: `พบเวอร์ชันใหม่ ${info.version}`,
      version: info.version,
    });
  }

  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      title: "มีอัพเดทใหม่",
      message: `พบเวอร์ชันใหม่ ${info.version}\nจะดาวน์โหลดในพื้นหลัง`,
      buttons: ["ตกลง", "ข้าม"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on("update-not-available", (info) => {
  console.log("[Auto-Updater] Update not available:", info);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "not-available",
      message: "ใช้เวอร์ชันล่าสุดแล้ว",
    });
  }
});

autoUpdater.on("error", (err) => {
  console.error("[Auto-Updater] Error:", err);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "error",
      message: "เกิดข้อผิดพลาดในการอัพเดท",
      error: err.message,
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
    });
  }
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("[Auto-Updater] Update downloaded:", info);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      type: "downloaded",
      message: "ดาวน์โหลดเสร็จแล้ว พร้อมติดตั้ง",
      version: info.version,
    });
  }

  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      title: "อัพเดทพร้อมติดตั้ง",
      message: `ดาวน์โหลดเวอร์ชัน ${info.version} เสร็จแล้ว\nต้องการรีสตาร์ทแอปเพื่อติดตั้งหรือไม่?`,
      buttons: ["รีสตาร์ทตอนนี้", "ติดตั้งทีหลัง"],
      defaultId: 0,
      cancelId: 1,
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
});

// IPC handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("check-for-updates", async () => {
  if (!isDev) {
    return await autoUpdater.checkForUpdates();
  }
  return null;
});

ipcMain.handle("download-update", () => {
  if (!isDev) {
    autoUpdater.downloadUpdate();
  }
});

ipcMain.handle("install-update", () => {
  if (!isDev) {
    autoUpdater.quitAndInstall();
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
