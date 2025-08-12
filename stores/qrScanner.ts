import { defineStore } from "pinia";

interface ScanRecord {
  id: string;
  orderId?: string;
  qrData: string;
  result: "success" | "failed";
  timestamp: Date;
  location?: string;
  deviceId?: string;
  error?: string;
  customerName?: string;
  staffId?: string;
  staffName?: string;
}

interface ScanResult {
  success: boolean;
  data?: {
    orderId: string;
    isValid: boolean;
    attendanceStatus: "PENDING" | "CHECKED_IN";
    customerName: string;
    customerPhone?: string;
    ticketType: "seated" | "standing";
    seats?: string[];
    amount?: number;
    showDate?: string;
    validUntil?: string;
    checkInTime?: string;
  };
  message: string;
  timestamp: string;
  scanRecord?: any;
}

interface ScanStats {
  totalScans: number;
  successfulScans: number;
  failedScans: number;
  todayScans: number;
  uniqueOrders: number;
}

export const useQRScannerStore = defineStore("qrScanner", {
  state: () => ({
    // Scan history
    scanHistory: [] as ScanRecord[],

    // Current scan state
    isScanning: false,
    currentScan: null as ScanResult | null,

    // Statistics
    stats: {
      totalScans: 0,
      successfulScans: 0,
      failedScans: 0,
      todayScans: 0,
      uniqueOrders: 0,
    } as ScanStats,

    // Settings
    settings: {
      location: "Stadium Gate",
      deviceId: "",
      autoVibrate: true,
      autoSound: true,
      saveHistory: true,
      maxHistoryItems: 100,
    },

    // Loading states
    isLoading: false,
    isSyncing: false,

    // Offline support
    offlineQueue: [] as ScanRecord[],
    isOffline: false,
    lastSyncTime: null as Date | null,
  }),

  getters: {
    recentScans: (state) => {
      return state.scanHistory
        .slice(0, 10)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    },

    todayScans: (state) => {
      const today = new Date().toDateString();
      return state.scanHistory.filter(
        (scan) => new Date(scan.timestamp).toDateString() === today
      );
    },

    successRate: (state) => {
      if (state.stats.totalScans === 0) return 0;
      return Math.round(
        (state.stats.successfulScans / state.stats.totalScans) * 100
      );
    },

    hasOfflineData: (state) => {
      return state.offlineQueue.length > 0;
    },

    canSync: (state) => {
      return !state.isOffline && state.offlineQueue.length > 0;
    },
  },

  actions: {
    /**
     * 📱 สแกน QR Code หลัก
     */
    async scanQRCode(qrData: string): Promise<ScanResult> {
      if (this.isScanning) {
        throw new Error("กำลังสแกนอยู่ กรุณารอสักครู่");
      }

      try {
        this.isScanning = true;
        this.isLoading = true;

        console.log("📱 Starting QR scan process...");

        // Validate QR data format
        if (!qrData || typeof qrData !== "string") {
          throw new Error("QR Code ไม่ถูกต้อง");
        }

        // Generate scan ID
        const scanId = `scan_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Prepare scan data
        const scanData = {
          qrData: qrData.trim(),
          location: this.settings.location,
          deviceId: this.getDeviceId(),
          scanId,
          timestamp: new Date().toISOString(),
        };

        console.log("📡 Sending scan request:", {
          ...scanData,
          qrData: qrData.substring(0, 20) + "...",
        });

        let result: ScanResult;

        if (this.isOffline) {
          // Handle offline scanning
          result = await this.handleOfflineScan(scanData);
        } else {
          // Online scanning
          result = await this.performOnlineScan(scanData);
        }

        // Save to history
        await this.saveScanToHistory(result, scanData);

        // Update statistics
        this.updateStats(result);

        // Feedback
        this.provideFeedback(result);

        console.log(
          "✅ Scan completed:",
          result.success ? "SUCCESS" : "FAILED"
        );

        this.currentScan = result;
        return result;
      } catch (error: any) {
        console.error("❌ Scan failed:", error);

        const errorResult: ScanResult = {
          success: false,
          message: error?.message || "เกิดข้อผิดพลาดในการสแกน",
          timestamp: new Date().toISOString(),
        };

        // Save error to history
        await this.saveScanToHistory(errorResult, {
          qrData,
          error: error?.message,
        });

        this.updateStats(errorResult);
        this.provideFeedback(errorResult);

        throw error;
      } finally {
        this.isScanning = false;
        this.isLoading = false;
      }
    },

    /**
     * 🌐 ส่งข้อมูลไปยัง API
     */
    async performOnlineScan(scanData: any): Promise<ScanResult> {
      try {
        // Mock successful scan for demo - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockResult: ScanResult = {
          success: true,
          data: {
            orderId:
              this.extractOrderIdFromQR(scanData.qrData) || "ORD-" + Date.now(),
            isValid: true,
            attendanceStatus: "CHECKED_IN",
            customerName: "ลูกค้าทดสอบ",
            customerPhone: "081-234-5678",
            ticketType: "seated",
            seats: ["A1", "A2"],
            checkInTime: new Date().toISOString(),
          },
          message: "✅ เช็คอินสำเร็จ",
          timestamp: new Date().toISOString(),
        };

        return mockResult;
      } catch (error: any) {
        console.error("🌐 Online scan failed:", error);

        // Check if it's a network error
        if (process.client && !navigator.onLine) {
          this.isOffline = true;
          console.log("📴 Switched to offline mode");
          return this.handleOfflineScan(scanData);
        }

        throw error;
      }
    },

    /**
     * 📴 จัดการการสแกนแบบออฟไลน์
     */
    async handleOfflineScan(scanData: any): Promise<ScanResult> {
      console.log("📴 Processing offline scan...");

      // Basic QR validation
      const isValidFormat = this.validateQRFormat(scanData.qrData);

      if (!isValidFormat) {
        throw new Error("รูปแบบ QR Code ไม่ถูกต้อง");
      }

      // Create offline scan record
      const offlineRecord: ScanRecord = {
        id: scanData.scanId,
        qrData: scanData.qrData,
        result: "success", // Assume success for offline
        timestamp: new Date(),
        location: scanData.location,
        deviceId: scanData.deviceId,
        staffId: "offline_staff",
        staffName: "Offline Staff",
      };

      // Add to offline queue
      this.offlineQueue.push(offlineRecord);

      // Mock successful result for offline
      const mockResult: ScanResult = {
        success: true,
        data: {
          orderId:
            this.extractOrderIdFromQR(scanData.qrData) ||
            "OFFLINE-" + Date.now(),
          isValid: true,
          attendanceStatus: "CHECKED_IN",
          customerName: "ลูกค้า (ออฟไลน์)",
          ticketType: "seated",
          checkInTime: new Date().toISOString(),
        },
        message: "✅ เช็คอินสำเร็จ (ออฟไลน์)",
        timestamp: new Date().toISOString(),
        scanRecord: offlineRecord,
      };

      return mockResult;
    },

    /**
     * 💾 บันทึกประวัติการสแกน
     */
    async saveScanToHistory(result: ScanResult, scanData: any) {
      if (!this.settings.saveHistory) return;

      const scanRecord: ScanRecord = {
        id: scanData.scanId || `scan_${Date.now()}`,
        orderId: result.data?.orderId,
        qrData: scanData.qrData,
        result: result.success ? "success" : "failed",
        timestamp: new Date(),
        location: scanData.location,
        deviceId: scanData.deviceId,
        error: result.success ? undefined : result.message,
        customerName: result.data?.customerName,
        staffId: "current_staff",
        staffName: "Current Staff",
      };

      // Add to history
      this.scanHistory.unshift(scanRecord);

      // Limit history size
      if (this.scanHistory.length > this.settings.maxHistoryItems) {
        this.scanHistory = this.scanHistory.slice(
          0,
          this.settings.maxHistoryItems
        );
      }

      // Save to localStorage
      if (process.client) {
        this.saveHistoryToStorage();
      }
    },

    /**
     * 📊 อัปเดตสถิติ
     */
    updateStats(result: ScanResult) {
      this.stats.totalScans++;

      if (result.success) {
        this.stats.successfulScans++;
      } else {
        this.stats.failedScans++;
      }

      // Count today's scans
      const today = new Date().toDateString();
      this.stats.todayScans = this.scanHistory.filter(
        (scan) => new Date(scan.timestamp).toDateString() === today
      ).length;

      // Count unique orders
      const uniqueOrders = new Set(
        this.scanHistory
          .filter((scan) => scan.orderId)
          .map((scan) => scan.orderId)
      );
      this.stats.uniqueOrders = uniqueOrders.size;
    },

    /**
     * 🔊 ให้ Feedback แก่ผู้ใช้
     */
    provideFeedback(result: ScanResult) {
      if (!process.client) return;

      // Vibration feedback
      if (
        this.settings.autoVibrate &&
        typeof navigator !== "undefined" &&
        "vibrate" in navigator
      ) {
        try {
          if (result.success) {
            (navigator as any).vibrate([200, 100, 200]); // Success pattern
          } else {
            (navigator as any).vibrate([100, 100, 100, 100, 100]); // Error pattern
          }
        } catch (error) {
          // Ignore vibration errors
        }
      }

      // Audio feedback
      if (this.settings.autoSound) {
        this.playFeedbackSound(result.success);
      }
    },

    /**
     * 🔊 เล่นเสียง Feedback
     */
    playFeedbackSound(success: boolean) {
      if (!process.client) return;

      try {
        const audioFile = success
          ? "/sounds/scan-success.mp3"
          : "/sounds/scan-error.mp3";
        const win = globalThis as any;
        if (win && "Audio" in win) {
          const audio = new win.Audio(audioFile);
          audio.volume = 0.3;
          audio.play().catch(() => {
            // Ignore audio play errors
            console.log("Audio feedback not available");
          });
        }
      } catch (error) {
        // Ignore audio errors
      }
    },

    /**
     * 🔄 ซิงค์ข้อมูลออฟไลน์
     */
    async syncOfflineData() {
      if (this.isSyncing || this.offlineQueue.length === 0) {
        return;
      }

      try {
        this.isSyncing = true;
        console.log("🔄 Syncing offline data...");

        // Mock sync response - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("✅ Sync successful");

        // Clear offline queue
        this.offlineQueue = [];
        this.lastSyncTime = new Date();
        this.isOffline = false;
      } catch (error) {
        console.error("❌ Sync failed:", error);
        throw error;
      } finally {
        this.isSyncing = false;
      }
    },

    /**
     * 📱 ตั้งค่าอุปกรณ์
     */
    initializeDevice() {
      if (!process.client) return;

      // Generate device ID if not exists
      if (!this.settings.deviceId) {
        this.settings.deviceId = this.generateDeviceId();
      }

      // Load settings from storage
      this.loadSettingsFromStorage();

      // Load history from storage
      this.loadHistoryFromStorage();

      // Check network status
      this.updateNetworkStatus();

      // Listen for network changes
      if (process.client) {
        const win = globalThis as any;
        if (win.addEventListener) {
          win.addEventListener("online", () => {
            console.log("🌐 Network online");
            this.isOffline = false;

            // Auto-sync when back online
            if (this.offlineQueue.length > 0) {
              this.syncOfflineData().catch(console.error);
            }
          });

          win.addEventListener("offline", () => {
            console.log("📴 Network offline");
            this.isOffline = true;
          });
        }
      }
    },

    /**
     * 🛠️ Utility Methods
     */
    validateQRFormat(qrData: string): boolean {
      // Basic validation - can be enhanced
      return !!(qrData && qrData.length > 10 && typeof qrData === "string");
    },

    extractOrderIdFromQR(qrData: string): string | null {
      try {
        // Try to extract order ID from QR data
        // This depends on QR format - adjust as needed
        const matches = qrData.match(/ORD-[A-Z0-9-]+/);
        return matches ? matches[0] : null;
      } catch {
        return null;
      }
    },

    generateDeviceId(): string {
      return `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    getDeviceId(): string {
      return this.settings.deviceId || this.generateDeviceId();
    },

    updateNetworkStatus() {
      if (process.client && typeof navigator !== "undefined") {
        this.isOffline = !navigator.onLine;
      }
    },

    /**
     * 💾 Storage Management
     */
    saveHistoryToStorage() {
      if (!process.client) return;

      try {
        const data = {
          history: this.scanHistory.slice(0, 50), // Save only recent 50
          stats: this.stats,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem("qr_scan_history", JSON.stringify(data));
      } catch (error) {
        console.warn("Failed to save history:", error);
      }
    },

    loadHistoryFromStorage() {
      if (!process.client) return;

      try {
        const saved = localStorage.getItem("qr_scan_history");
        if (saved) {
          const data = JSON.parse(saved);
          this.scanHistory = data.history || [];
          this.stats = { ...this.stats, ...data.stats };
        }
      } catch (error) {
        console.warn("Failed to load history:", error);
      }
    },

    saveSettingsToStorage() {
      if (!process.client) return;

      try {
        localStorage.setItem(
          "qr_scanner_settings",
          JSON.stringify(this.settings)
        );
      } catch (error) {
        console.warn("Failed to save settings:", error);
      }
    },

    loadSettingsFromStorage() {
      if (!process.client) return;

      try {
        const saved = localStorage.getItem("qr_scanner_settings");
        if (saved) {
          const settings = JSON.parse(saved);
          this.settings = { ...this.settings, ...settings };
        }
      } catch (error) {
        console.warn("Failed to load settings:", error);
      }
    },

    /**
     * 🗑️ Data Management
     */
    clearHistory() {
      this.scanHistory = [];
      this.stats = {
        totalScans: 0,
        successfulScans: 0,
        failedScans: 0,
        todayScans: 0,
        uniqueOrders: 0,
      };
      if (process.client) {
        localStorage.removeItem("qr_scan_history");
      }
    },

    clearOfflineQueue() {
      this.offlineQueue = [];
    },

    /**
     * ⚙️ Settings Management
     */
    updateSettings(newSettings: Partial<typeof this.settings>) {
      this.settings = { ...this.settings, ...newSettings };
      if (process.client) {
        this.saveSettingsToStorage();
      }
    },

    /**
     * 📊 Statistics
     */
    async fetchRemoteStats() {
      try {
        // Mock stats response - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockStats = {
          totalScans: this.stats.totalScans + 100,
          successfulScans: this.stats.successfulScans + 90,
          failedScans: this.stats.failedScans + 10,
          todayScans: this.stats.todayScans,
          uniqueOrders: this.stats.uniqueOrders + 50,
        };

        this.stats = { ...this.stats, ...mockStats };
        return mockStats;
      } catch (error) {
        console.error("Failed to fetch remote stats:", error);
      }
    },
  },
});
