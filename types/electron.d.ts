// Electron API types for useElectron composable

export interface ElectronDialogOptions {
  type?: "none" | "info" | "error" | "question" | "warning";
  title?: string;
  message: string;
  detail?: string;
  buttons?: string[];
}

export interface ElectronOpenDialogOptions {
  title?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: Array<"openFile" | "openDirectory" | "multiSelections">;
}

export interface ElectronSaveDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
}

export interface ElectronDialogResult {
  canceled: boolean;
  filePaths: string[];
  filePath?: string;
  response?: number;
}

export interface UseElectron {
  isElectron: boolean;
  platform: string;
  appVersion: string;
  updateStatus: string;
  isMaximized: boolean;
  checkForUpdates: () => Promise<void>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  showMessageBox: (
    options: ElectronDialogOptions
  ) => Promise<ElectronDialogResult>;
  showOpenDialog: (
    options: ElectronOpenDialogOptions
  ) => Promise<ElectronDialogResult>;
  showSaveDialog: (
    options: ElectronSaveDialogOptions
  ) => Promise<ElectronDialogResult>;
}

// You can extend this type as needed for additional Electron APIs
