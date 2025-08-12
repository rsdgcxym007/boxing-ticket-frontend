<template>
  <div
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
    >
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Icon icon="mdi:history" class="text-2xl" />
            <h3 class="text-lg font-semibold">ประวัติการสแกน</h3>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Scan History List -->
        <div
          v-if="scanHistory.length > 0"
          class="space-y-4 max-h-96 overflow-y-auto"
        >
          <div
            v-for="(scan, index) in scanHistory"
            :key="index"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <!-- Status Icon -->
                <div class="flex items-center space-x-2 mb-2">
                  <Icon
                    :icon="getStatusIcon(scan.status)"
                    :class="getStatusColor(scan.status)"
                    class="text-lg"
                  />
                  <span class="font-medium text-gray-900">
                    {{ getStatusText(scan.status) }}
                  </span>
                </div>

                <!-- Ticket Info -->
                <div v-if="scan.ticket" class="text-sm text-gray-600 space-y-1">
                  <p><strong>รหัส:</strong> {{ scan.ticket.ticketNumber }}</p>
                  <p>
                    <strong>ประเภท:</strong>
                    {{ getTicketTypeName(scan.ticket.type) }}
                  </p>
                  <p>
                    <strong>ราคา:</strong> ฿{{ formatPrice(scan.ticket.price) }}
                  </p>
                </div>

                <!-- Error Message -->
                <p v-else-if="scan.message" class="text-sm text-gray-600">
                  {{ scan.message }}
                </p>

                <!-- Timestamp -->
                <p class="text-xs text-gray-400 mt-2">
                  {{ formatDateTime(scan.timestamp) }}
                </p>
              </div>

              <!-- Action Button -->
              <button
                v-if="scan.status === 'error'"
                @click="retryScan(scan)"
                class="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <Icon
            icon="mdi:history"
            class="text-6xl text-gray-300 mx-auto mb-4"
          />
          <h4 class="text-lg font-medium text-gray-900 mb-2">
            ยังไม่มีประวัติการสแกน
          </h4>
          <p class="text-gray-500">เริ่มสแกน QR Code เพื่อดูประวัติ</p>
        </div>

        <!-- Footer Actions -->
        <div class="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            v-if="scanHistory.length > 0"
            @click="clearHistory"
            class="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
          >
            ลบประวัติ
          </button>
          <button
            @click="$emit('close')"
            class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import { useQRScannerStore } from "@/stores/qrScanner";

// Composables
const qrStore = useQRScannerStore();

// Emits
defineEmits(["close"]);

// Computed
const scanHistory = computed(() => qrStore.scanHistory || []);

// Methods
const getStatusIcon = (status) => {
  const icons = {
    success: "mdi:check-circle",
    error: "mdi:alert-circle",
    warning: "mdi:alert",
  };
  return icons[status] || "mdi:help-circle";
};

const getStatusColor = (status) => {
  const colors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
  };
  return colors[status] || "text-gray-600";
};

const getStatusText = (status) => {
  const texts = {
    success: "สแกนสำเร็จ",
    error: "เกิดข้อผิดพลาด",
    warning: "คำเตือน",
  };
  return texts[status] || "ไม่ทราบสถานะ";
};

const getTicketTypeName = (type) => {
  const types = {
    ringside: "ริงไซด์",
    vip: "วีไอพี",
    class_a: "ชั้น A",
    class_b: "ชั้น B",
    class_c: "ชั้น C",
    standing: "ยืน",
  };
  return types[type] || type;
};

const formatPrice = (price) => {
  if (!price) return "0";
  return Number(price).toLocaleString();
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const retryScan = (scan) => {
  // Emit event to parent to retry scan with the same data
  qrStore.retryFailedScan(scan);
};

const clearHistory = () => {
  if (confirm("คุณต้องการลบประวัติการสแกนทั้งหมดหรือไม่?")) {
    qrStore.clearScanHistory();
  }
};
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
