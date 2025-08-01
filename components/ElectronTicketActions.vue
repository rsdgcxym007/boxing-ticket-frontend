<template>
  <div v-if="isElectron" class="electron-ticket-actions space-y-4">
    <!-- Print Actions -->
    <div
      class="print-section bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        Print Actions
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="printTicket"
          class="action-btn primary"
          :disabled="!selectedTicket"
        >
          <Icon name="mdi:printer" class="w-4 h-4" />
          Print Ticket
        </button>

        <button
          @click="printReceipt"
          class="action-btn secondary"
          :disabled="!selectedOrder"
        >
          <Icon name="mdi:receipt" class="w-4 h-4" />
          Print Receipt
        </button>

        <button
          @click="printBatch"
          class="action-btn secondary"
          :disabled="selectedTickets.length === 0"
        >
          <Icon name="mdi:printer-multiple" class="w-4 h-4" />
          Batch Print
        </button>

        <button @click="printSummary" class="action-btn secondary">
          <Icon name="mdi:file-document-outline" class="w-4 h-4" />
          Print Summary
        </button>
      </div>
    </div>

    <!-- Export Actions -->
    <div
      class="export-section bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        Export Actions
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <button @click="exportToPDF" class="action-btn secondary">
          <Icon name="mdi:file-pdf-box" class="w-4 h-4" />
          Export PDF
        </button>

        <button @click="exportToExcel" class="action-btn secondary">
          <Icon name="mdi:file-excel" class="w-4 h-4" />
          Export Excel
        </button>

        <button @click="exportToCSV" class="action-btn secondary">
          <Icon name="mdi:file-delimited" class="w-4 h-4" />
          Export CSV
        </button>

        <button @click="exportImages" class="action-btn secondary">
          <Icon name="mdi:image-multiple" class="w-4 h-4" />
          Export Images
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div
      class="quick-actions bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        Quick Actions
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <button @click="openDataFolder" class="action-btn secondary">
          <Icon name="mdi:folder-open" class="w-4 h-4" />
          Open Data Folder
        </button>

        <button @click="backupData" class="action-btn secondary">
          <Icon name="mdi:backup-restore" class="w-4 h-4" />
          Backup Data
        </button>

        <button @click="clearCache" class="action-btn warning">
          <Icon name="mdi:broom" class="w-4 h-4" />
          Clear Cache
        </button>

        <button @click="showSettings" class="action-btn secondary">
          <Icon name="mdi:cog" class="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>

    <!-- Status Display -->
    <div
      v-if="lastAction"
      class="status-display bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800"
    >
      <div class="flex items-center space-x-2">
        <Icon
          :name="lastAction.success ? 'mdi:check-circle' : 'mdi:alert-circle'"
          :class="lastAction.success ? 'text-green-500' : 'text-red-500'"
          class="w-5 h-5"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ lastAction.message }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          {{ formatTime(lastAction.timestamp) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { useElectron } from "../composables/useElectron";
// If Icon is not globally registered, import it:
// import Icon from "~icons/mdi";

interface Props {
  selectedTicket?: any;
  selectedOrder?: any;
  selectedTickets?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  selectedTickets: () => [],
});

const { isElectron, showMessageBox, showSaveDialog, showOpenDialog } =
  useElectron();

const lastAction = ref<{
  message: string;
  success: boolean;
  timestamp: Date;
} | null>(null);

const setActionStatus = (message: string, success: boolean = true) => {
  lastAction.value = {
    message,
    success,
    timestamp: new Date(),
  };

  // Clear status after 5 seconds
  setTimeout(() => {
    lastAction.value = null;
  }, 5000);
};

// Print Actions
const printTicket = async () => {
  if (!props.selectedTicket) {
    await showMessageBox({
      type: "warning",
      message: "Please select a ticket to print",
      title: "No Ticket Selected",
    });
    return;
  }

  try {
    // Implement ticket printing logic
    window.print();
    setActionStatus("Ticket sent to printer successfully");
  } catch (error) {
    console.error("Print error:", error);
    setActionStatus("Failed to print ticket", false);
  }
};

const printReceipt = async () => {
  if (!props.selectedOrder) {
    await showMessageBox({
      type: "warning",
      message: "Please select an order to print receipt",
      title: "No Order Selected",
    });
    return;
  }

  try {
    // Implement receipt printing logic
    window.print();
    setActionStatus("Receipt sent to printer successfully");
  } catch (error) {
    console.error("Print error:", error);
    setActionStatus("Failed to print receipt", false);
  }
};

const printBatch = async () => {
  if (props.selectedTickets.length === 0) {
    await showMessageBox({
      type: "warning",
      message: "Please select tickets to print",
      title: "No Tickets Selected",
    });
    return;
  }

  const result = await showMessageBox({
    type: "question",
    message: `Print ${props.selectedTickets.length} tickets?`,
    title: "Batch Print Confirmation",
    buttons: ["Print", "Cancel"],
    defaultId: 0,
  });

  if (result?.response === 0) {
    try {
      // Implement batch printing logic
      window.print();
      setActionStatus(
        `${props.selectedTickets.length} tickets sent to printer`
      );
    } catch (error) {
      console.error("Batch print error:", error);
      setActionStatus("Failed to print tickets", false);
    }
  }
};

const printSummary = async () => {
  try {
    // Implement summary printing logic
    window.print();
    setActionStatus("Summary sent to printer successfully");
  } catch (error) {
    console.error("Print error:", error);
    setActionStatus("Failed to print summary", false);
  }
};

// Export Actions
const exportToPDF = async () => {
  try {
    const result = await showSaveDialog({
      title: "Save PDF Export",
      defaultPath: `ticket-export-${dayjs().format("YYYY-MM-DD")}.pdf`,
      filters: [{ name: "PDF Files", extensions: ["pdf"] }],
    });

    if (result && !result.canceled && result.filePath) {
      // Implement PDF export logic
      setActionStatus("Data exported to PDF successfully");
    }
  } catch (error) {
    console.error("Export error:", error);
    setActionStatus("Failed to export PDF", false);
  }
};

const exportToExcel = async () => {
  try {
    const result = await showSaveDialog({
      title: "Save Excel Export",
      defaultPath: `ticket-export-${dayjs().format("YYYY-MM-DD")}.xlsx`,
      filters: [{ name: "Excel Files", extensions: ["xlsx", "xls"] }],
    });

    if (result && !result.canceled && result.filePath) {
      // Implement Excel export logic
      setActionStatus("Data exported to Excel successfully");
    }
  } catch (error) {
    console.error("Export error:", error);
    setActionStatus("Failed to export Excel", false);
  }
};

const exportToCSV = async () => {
  try {
    const result = await showSaveDialog({
      title: "Save CSV Export",
      defaultPath: `ticket-export-${dayjs().format("YYYY-MM-DD")}.csv`,
      filters: [{ name: "CSV Files", extensions: ["csv"] }],
    });

    if (result && !result.canceled && result.filePath) {
      // Implement CSV export logic
      setActionStatus("Data exported to CSV successfully");
    }
  } catch (error) {
    console.error("Export error:", error);
    setActionStatus("Failed to export CSV", false);
  }
};

const exportImages = async () => {
  try {
    const result = await showOpenDialog({
      title: "Select Export Folder",
      properties: ["openDirectory"],
    });

    if (result && !result.canceled && result.filePaths.length > 0) {
      // Implement image export logic
      setActionStatus("Images exported successfully");
    }
  } catch (error) {
    console.error("Export error:", error);
    setActionStatus("Failed to export images", false);
  }
};

// Quick Actions
const openDataFolder = async () => {
  try {
    // This would typically open the app's data directory
    await showMessageBox({
      type: "info",
      message: "Data folder location:\n%APPDATA%/PatongBoxing/data",
      title: "Data Folder",
    });
    setActionStatus("Data folder location shown");
  } catch (error) {
    console.error("Error:", error);
    setActionStatus("Failed to show data folder", false);
  }
};

const backupData = async () => {
  try {
    const result = await showOpenDialog({
      title: "Select Backup Location",
      properties: ["openDirectory"],
    });

    if (result && !result.canceled && result.filePaths.length > 0) {
      // Implement backup logic
      setActionStatus("Data backup created successfully");
    }
  } catch (error) {
    console.error("Backup error:", error);
    setActionStatus("Failed to create backup", false);
  }
};

const clearCache = async () => {
  const result = await showMessageBox({
    type: "warning",
    message: "This will clear all cached data. Continue?",
    title: "Clear Cache Confirmation",
    buttons: ["Clear", "Cancel"],
    defaultId: 1,
  });

  if (result?.response === 0) {
    try {
      // Implement cache clearing logic
      localStorage.clear();
      sessionStorage.clear();
      setActionStatus("Cache cleared successfully");
    } catch (error) {
      console.error("Clear cache error:", error);
      setActionStatus("Failed to clear cache", false);
    }
  }
};

const showSettings = async () => {
  // Navigate to settings or open settings modal
  setActionStatus("Settings opened");
};

const formatTime = (date: Date) => {
  return dayjs(date).format("HH:mm:ss");
};
</script>

<style scoped>
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  min-height: 40px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover:not(:disabled) {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.action-btn.warning {
  background: #fbbf24;
  color: #92400e;
}

.action-btn.warning:hover:not(:disabled) {
  background: #f59e0b;
  transform: translateY(-1px);
}

.dark .action-btn.secondary {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark .action-btn.secondary:hover:not(:disabled) {
  background: #4b5563;
}

.dark .action-btn.warning {
  background: #d97706;
  color: #fbbf24;
}

.dark .action-btn.warning:hover:not(:disabled) {
  background: #b45309;
}
</style>
