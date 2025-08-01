const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  shell,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");

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
  console.log("[Electron] Loading splash:", splashPath);
  splashWindow.loadFile(splashPath);

  splashWindow.on("closed", () => {
    console.log("[Electron] Splash window closed");
    splashWindow = null;
  });
}

function createWindow() {
  console.log("[Electron] Creating main window");
  console.log("[Electron] isDev:", isDev);
  console.log(
    "[Electron] Directory path:",
    path.join(__dirname, "../.output/public")
  );

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon: path.join(__dirname, "../public/favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: isDev ? true : false, // Enable security in dev, disable in production for local files
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
  });

  // Load the app
  if (isDev) {
    console.log("[Electron] Loading dev server: http://localhost:3000");
    mainWindow.loadURL("http://localhost:3000");
  } else {
    console.log("[Electron] Production mode detected");
    console.log("[Electron] process.execPath:", process.execPath);
    console.log("[Electron] __dirname:", __dirname);
    console.log("[Electron] app.isPackaged:", app.isPackaged);
    console.log("[Electron] process.defaultApp:", process.defaultApp);

    // Try multiple possible locations for the build files
    const possiblePaths = [
      path.join(__dirname, ".output", "public"), // In asar
      path.join(__dirname, "../.output/public"), // Source relative
      path.join(__dirname, "../../.output/public"), // Alternative source
      path.join(process.resourcesPath, "app", ".output", "public"), // Resources
      path.join(process.resourcesPath, ".output", "public"), // Direct resources
    ];

    let staticDir = null;
    let indexPath = null;

    for (const testPath of possiblePaths) {
      console.log("[Electron] Testing path:", testPath);
      if (fs.existsSync(testPath)) {
        const testIndexPath = path.join(testPath, "index.html");
        if (fs.existsSync(testIndexPath)) {
          console.log("[Electron] Found valid build at:", testPath);
          staticDir = testPath;
          indexPath = testIndexPath;
          break;
        } else {
          console.log("[Electron] Path exists but no index.html:", testPath);
        }
      } else {
        console.log("[Electron] Path does not exist:", testPath);
      }
    }

    if (staticDir && indexPath) {
      console.log("[Electron] Loading file:", indexPath);
      mainWindow.loadFile(indexPath);
    } else {
      console.error("[Electron] No valid build found, showing error page");
      mainWindow.loadURL(
        "data:text/html,<h1>Build directory not found. Please run 'npm run build' first.</h1>"
      );
    }
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
    console.log("[Electron] External link opened:", url);
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// Create application menu
// Debug: log menu creation
function createMenu() {
  console.log("[Electron] Creating application menu");
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Order",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("menu-action", "new-order");
          },
        },
        {
          label: "Print Ticket",
          accelerator: "CmdOrCtrl+P",
          click: () => {
            mainWindow.webContents.send("menu-action", "print-ticket");
          },
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Dashboard",
          accelerator: "CmdOrCtrl+1",
          click: () => {
            mainWindow.webContents.send("navigate-to", "/admin/dashboard");
          },
        },
        {
          label: "Orders",
          accelerator: "CmdOrCtrl+2",
          click: () => {
            mainWindow.webContents.send("navigate-to", "/admin/orders");
          },
        },
        {
          label: "Staff Management",
          accelerator: "CmdOrCtrl+3",
          click: () => {
            mainWindow.webContents.send("navigate-to", "/admin/staff");
          },
        },
        {
          label: "Audit",
          accelerator: "CmdOrCtrl+4",
          click: () => {
            mainWindow.webContents.send("navigate-to", "/admin/audit");
          },
        },
        {
          label: "Referrer",
          accelerator: "CmdOrCtrl+5",
          click: () => {
            mainWindow.webContents.send("navigate-to", "/admin/referrer");
          },
        },
        { type: "separator" },
        {
          label: "Ringside Seats",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            mainWindow.webContents.send("navigate-to", "/ringside");
          },
        },
        {
          label: "Standing Tickets",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            mainWindow.webContents.send("navigate-to", "/StandingTicketForm");
          },
        },
        { type: "separator" },
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            mainWindow.webContents.reload();
          },
        },
        {
          label: "Force Reload",
          accelerator: "CmdOrCtrl+Shift+R",
          click: () => {
            mainWindow.webContents.reloadIgnoringCache();
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator:
            process.platform === "darwin" ? "Alt+Cmd+I" : "Ctrl+Shift+I",
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Minimize",
          accelerator: "CmdOrCtrl+M",
          click: () => {
            mainWindow.minimize();
          },
        },
        {
          label: "Close",
          accelerator: "CmdOrCtrl+W",
          click: () => {
            mainWindow.close();
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About",
              message: "Patong Boxing Ticket System",
              detail: "Version 1.0.0\nBuilt with Electron and Nuxt.js",
            });
          },
        },
        {
          label: "Check for Updates",
          click: () => {
            autoUpdater.checkForUpdatesAndNotify();
          },
        },
      ],
    },
  ];

  // macOS specific menu adjustments
  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: "About " + app.getName(),
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About",
              message: "Patong Boxing Ticket System",
              detail: "Version 1.0.0\nBuilt with Electron and Nuxt.js",
            });
          },
        },
        { type: "separator" },
        {
          label: "Services",
          submenu: [],
        },
        { type: "separator" },
        {
          label: "Hide " + app.getName(),
          accelerator: "Command+H",
          click: () => app.hide(),
        },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          click: () => app.hideOthers(),
        },
        {
          label: "Show All",
          click: () => app.showAll(),
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => app.quit(),
        },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  console.log("[Electron] App ready");
  createSplashWindow();

  setTimeout(() => {
    console.log("[Electron] Creating main window and menu after splash");
    createWindow();
    createMenu();
  }, 2000);

  app.on("activate", () => {
    console.log("[Electron] App activate");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  console.log("[Electron] All windows closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Auto updater events
autoUpdater.on("checking-for-update", () => {
  console.log("[Electron] Checking for update...");
  if (mainWindow) {
    mainWindow.webContents.send("update-status", "checking");
  }
});

autoUpdater.on("update-available", (info) => {
  console.log("[Electron] Update available.", info);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", "available", info);
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "Update Available",
        message: "A new version is available. Do you want to download it now?",
        buttons: ["Yes", "Later"],
        defaultId: 0,
      })
      .then((result) => {
        console.log("[Electron] Update dialog result:", result);
        if (result.response === 0) {
          console.log("[Electron] User chose to download update");
          autoUpdater.downloadUpdate();
        }
      });
  }
});

autoUpdater.on("update-not-available", (info) => {
  console.log("[Electron] Update not available.", info);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", "not-available");
  }
});

autoUpdater.on("error", (err) => {
  console.log("[Electron] Error in auto-updater:", err);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", "error", err.message);
  }
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message =
    "[Electron] Download speed: " +
    progressObj.bytesPerSecond +
    " - Downloaded " +
    progressObj.percent +
    "% (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  console.log(log_message);

  if (mainWindow) {
    mainWindow.webContents.send("update-progress", progressObj);
  }
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("[Electron] Update downloaded", info);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", "downloaded");
    dialog
      .showMessageBox(mainWindow, {
        type: "info",
        title: "Update Ready",
        message:
          "Update downloaded. Application will restart to apply the update.",
        buttons: ["Restart Now", "Later"],
        defaultId: 0,
      })
      .then((result) => {
        console.log("[Electron] Update ready dialog result:", result);
        if (result.response === 0) {
          console.log("[Electron] Restarting to install update");
          autoUpdater.quitAndInstall();
        }
      });
  }
});

// IPC handlers
ipcMain.handle("app-version", () => {
  console.log("[Electron] IPC: app-version");
  return app.getVersion();
});

ipcMain.handle("check-for-updates", () => {
  console.log("[Electron] IPC: check-for-updates");
  if (!isDev) {
    try {
      autoUpdater.checkForUpdatesAndNotify();
    } catch (err) {
      console.log("[Electron] Error checking for updates:", err.message);
    }
  }
  return "Checking for updates...";
});

ipcMain.handle("show-message-box", async (event, options) => {
  console.log("[Electron] IPC: show-message-box", options);
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

ipcMain.handle("show-open-dialog", async (event, options) => {
  console.log("[Electron] IPC: show-open-dialog", options);
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-save-dialog", async (event, options) => {
  console.log("[Electron] IPC: show-save-dialog", options);
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle("get-platform", () => {
  console.log("[Electron] IPC: get-platform");
  return process.platform;
});

ipcMain.handle("minimize-window", () => {
  console.log("[Electron] IPC: minimize-window");
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle("maximize-window", () => {
  console.log("[Electron] IPC: maximize-window");
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle("close-window", () => {
  console.log("[Electron] IPC: close-window");
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle("is-maximized", () => {
  console.log("[Electron] IPC: is-maximized");
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Handle app protocol for deep linking (optional)
if (!isDev) {
  app.setAsDefaultProtocolClient("patong-boxing");
}
