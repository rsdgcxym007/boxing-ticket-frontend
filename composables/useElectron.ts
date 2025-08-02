import { ref, computed, readonly, onMounted, onUnmounted } from "vue";

export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  checkForUpdates: () => Promise<string>;
  downloadUpdate: () => Promise<void>;
  installUpdate: () => Promise<void>;
  onUpdateStatus: (
    callback: (event: any, status: string, info?: any) => void
  ) => void;
  onUpdateProgress: (callback: (event: any, progress: any) => void) => void;
  removeAllListeners: (channel: string) => void;
  showMessageBox: (options: any) => Promise<any>;
  showOpenDialog: (options: any) => Promise<any>;
  showSaveDialog: (options: any) => Promise<any>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  onMenuAction: (callback: (event: any, action: string) => void) => void;
  onNavigateTo: (callback: (event: any, route: string) => void) => void;
  removeListener: (channel: string, callback: any) => void;
}

export interface NodeAPI {
  platform: string;
  env: string;
}

export interface CustomWindow extends Window {
  electronAPI?: ElectronAPI;
  nodeAPI?: NodeAPI;
}

export const useElectron = () => {
  const isElectron = computed(() => {
    return (
      typeof window !== "undefined" &&
      (window.process?.type === "renderer" ||
        !!window.process?.versions?.electron ||
        navigator.userAgent.includes("Electron") ||
        !!window.electronAPI)
    );
  });

  const platform = computed(() => {
    if (import.meta.client && window.nodeAPI) {
      return window.nodeAPI.platform;
    }
    return "web";
  });
  const appVersion = ref<string>("");
  const updateStatus = ref<string>("");
  const updateProgress = ref<any>(null);
  const isMaximized = ref<boolean>(false);

  // App Info
  const getAppVersion = async (): Promise<string> => {
    if (isElectron.value && window.electronAPI) {
      try {
        console.log("Attempting to get app version...");
        const version = await window.electronAPI.getAppVersion();
        console.log("App version received: ", version);
        appVersion.value = version;
        return version;
      } catch (error) {
        console.error("Error getting app version:", error);
        // Try alternative method
        try {
          const version = await window.electronAPI.getPlatform();
          console.log("Platform received:", version);
        } catch (altError) {
          console.error("Error getting platform:", altError);
        }
        return "";
      }
    }
    console.log("Not running in Electron or electronAPI not available");
    return "";
  };

  // Updates
  const checkForUpdates = async (): Promise<string> => {
    if (isElectron.value && window.electronAPI) {
      try {
        return await window.electronAPI.checkForUpdates();
      } catch (error) {
        console.error("Error checking for updates:", error);
        return "Error checking for updates";
      }
    }
    return "Not available in web version";
  };

  const downloadUpdate = async (): Promise<void> => {
    if (isElectron.value && window.electronAPI) {
      try {
        await window.electronAPI.downloadUpdate();
      } catch (error) {
        console.error("Error downloading update:", error);
        throw error;
      }
    }
  };

  const installUpdate = async (): Promise<void> => {
    if (isElectron.value && window.electronAPI) {
      try {
        await window.electronAPI.installUpdate();
      } catch (error) {
        console.error("Error installing update:", error);
        throw error;
      }
    }
  };

  const setupUpdateListeners = () => {
    if (isElectron.value && window.electronAPI) {
      window.electronAPI.onUpdateStatus((event: any, statusData: any) => {
        console.log("Update status received:", statusData);
        if (statusData && typeof statusData === "object") {
          if (statusData.type) {
            (updateStatus as any).value = statusData.type;
          }
          // สำหรับ downloading progress
          if (statusData.type === "downloading") {
            (updateProgress as any).value = {
              percent: statusData.percent,
              transferred: statusData.transferred,
              total: statusData.total,
              bytesPerSecond: statusData.bytesPerSecond,
            };
          }
        } else {
          // Legacy support for simple string status
          (updateStatus as any).value = statusData;
        }
      });

      window.electronAPI.onUpdateProgress((event: any, progress: any) => {
        (updateProgress as any).value = progress;
        console.log("Update progress:", progress);
      });
    }
  };

  // Window Controls
  const minimizeWindow = async (): Promise<void> => {
    if (isElectron.value && window.electronAPI) {
      try {
        await window.electronAPI.minimizeWindow();
      } catch (error) {
        console.error("Error minimizing window:", error);
      }
    }
  };

  const maximizeWindow = async (): Promise<void> => {
    if (isElectron.value && window.electronAPI) {
      try {
        await window.electronAPI.maximizeWindow();
        await updateMaximizedState();
      } catch (error) {
        console.error("Error maximizing window:", error);
      }
    }
  };

  const closeWindow = async (): Promise<void> => {
    if (isElectron.value && window.electronAPI) {
      try {
        await window.electronAPI.closeWindow();
      } catch (error) {
        console.error("Error closing window:", error);
      }
    }
  };

  const updateMaximizedState = async (): Promise<void> => {
    if (isElectron.value && window.electronAPI) {
      try {
        console.log("Attempting to check maximized state...");
        isMaximized.value = await window.electronAPI.isMaximized();
        console.log("Maximized state:", isMaximized.value);
      } catch (error) {
        console.error("Error checking maximized state:", error);
        // Set a default value
        isMaximized.value = false;
      }
    }
  };

  // Dialogs
  const showMessageBox = async (options: {
    type?: "none" | "info" | "error" | "question" | "warning";
    title?: string;
    message: string;
    detail?: string;
    buttons?: string[];
    defaultId?: number;
    cancelId?: number;
  }): Promise<{ response: number; checkboxChecked: boolean } | null> => {
    if (isElectron.value && window.electronAPI) {
      try {
        return await window.electronAPI.showMessageBox(options);
      } catch (error) {
        console.error("Error showing message box:", error);
        return null;
      }
    }
    // Fallback for web
    alert(options.message);
    return null;
  };

  const showOpenDialog = async (options: {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
    properties?: Array<
      "openFile" | "openDirectory" | "multiSelections" | "showHiddenFiles"
    >;
  }): Promise<{ canceled: boolean; filePaths: string[] } | null> => {
    if (isElectron.value && window.electronAPI) {
      try {
        return await window.electronAPI.showOpenDialog(options);
      } catch (error) {
        console.error("Error showing open dialog:", error);
        return null;
      }
    }
    return null;
  };

  const showSaveDialog = async (options: {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }): Promise<{ canceled: boolean; filePath?: string } | null> => {
    if (isElectron.value && window.electronAPI) {
      try {
        return await window.electronAPI.showSaveDialog(options);
      } catch (error) {
        console.error("Error showing save dialog:", error);
        return null;
      }
    }
    return null;
  };

  // Menu Actions
  const setupMenuListeners = (router: any) => {
    if (isElectron.value && window.electronAPI) {
      window.electronAPI.onMenuAction((event, action) => {
        console.log("Menu action:", action);
        // Handle menu actions
        switch (action) {
          case "new-order":
            router.push("/admin/orders");
            break;
          case "print-ticket":
            window.print();
            break;
          default:
            console.log("Unhandled menu action:", action);
        }
      });

      window.electronAPI.onNavigateTo((event, route) => {
        console.log("Navigate to:", route);
        router.push(route);
      });
    }
  };

  // Cleanup
  const cleanup = () => {
    if (isElectron.value && window.electronAPI) {
      window.electronAPI.removeAllListeners("update-status");
      window.electronAPI.removeAllListeners("update-progress");
      window.electronAPI.removeAllListeners("menu-action");
      window.electronAPI.removeAllListeners("navigate-to");
    }
  };

  // Auto-initialize on client side
  if (import.meta.client) {
    onMounted(async () => {
      console.log("useElectron mounted, isElectron:", isElectron.value);
      console.log("window.electronAPI:", !!window.electronAPI);

      if (isElectron.value && window.electronAPI) {
        console.log("Setting up Electron listeners and state...");
        setupUpdateListeners();

        // Add delays to prevent rapid-fire calls
        setTimeout(() => {
          updateMaximizedState();
        }, 100);

        setTimeout(() => {
          getAppVersion();
        }, 200);
      } else {
        console.log("Not running in Electron environment");
      }
    });

    onUnmounted(() => {
      cleanup();
    });
  }

  return {
    isElectron: readonly(isElectron),
    platform: readonly(platform),
    appVersion: readonly(appVersion),
    updateStatus,
    updateProgress,
    isMaximized: readonly(isMaximized),

    // Methods
    getAppVersion,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
    setupUpdateListeners,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    updateMaximizedState,
    showMessageBox,
    showOpenDialog,
    showSaveDialog,
    setupMenuListeners,
    cleanup,
  };
};
