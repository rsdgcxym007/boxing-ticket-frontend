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
const isDev = require("electron-is-dev");

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

  splashWindow.loadFile(path.join(__dirname, "splash.html"));

  splashWindow.on("closed", () => {
    splashWindow = null;
  });
}

function createWindow() {
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
      webSecurity: !isDev,
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
  });

  // Load the app
  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    if (splashWindow) {
      splashWindow.close();
    }
    mainWindow.show();

    // Check for updates after app is ready
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify();
    }
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

// Create application menu
function createMenu() {
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
  createSplashWindow();

  setTimeout(() => {
    createWindow();
    createMenu();
  }, 2000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Auto updater events
autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
  if (mainWindow) {
    mainWindow.webContents.send("update-status", "checking");
  }
});

autoUpdater.on("update-available", (info) => {
  console.log("Update available.");
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
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
  }
});

autoUpdater.on("update-not-available", (info) => {
  console.log("Update not available.");
  if (mainWindow) {
    mainWindow.webContents.send("update-status", "not-available");
  }
});

autoUpdater.on("error", (err) => {
  console.log("Error in auto-updater. " + err);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", "error", err.message);
  }
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
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
  console.log("Update downloaded");
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
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  }
});

// IPC handlers
ipcMain.handle("app-version", () => {
  return app.getVersion();
});

ipcMain.handle("check-for-updates", () => {
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
  return "Checking for updates...";
});

ipcMain.handle("show-message-box", async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

ipcMain.handle("show-open-dialog", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-save-dialog", async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle("get-platform", () => {
  return process.platform;
});

ipcMain.handle("minimize-window", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle("maximize-window", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle("close-window", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle("is-maximized", () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Handle app protocol for deep linking (optional)
if (!isDev) {
  app.setAsDefaultProtocolClient("patong-boxing");
}
