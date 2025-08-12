<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0f1f3c] via-[#1a2b4d] to-[#0f1f3c] text-white px-4 py-6"
  >
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Audit Log
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            ติดตามและตรวจสอบกิจกรรมของระบบ
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="exportAuditLogs"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon icon="mdi:download" class="inline mr-2" />
            ส่งออก
          </button>
          <button
            @click="showSearchModal = true"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon icon="mdi:magnify" class="inline mr-2" />
            ค้นหา
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-600 rounded-lg">
            <Icon icon="mdi:account-multiple" class="text-2xl text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">
              {{ stats.userActions }}
            </div>
            <div class="text-sm text-gray-400">การกระทำของผู้ใช้</div>
          </div>
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-600 rounded-lg">
            <Icon icon="mdi:shield-account" class="text-2xl text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">
              {{ stats.adminActions }}
            </div>
            <div class="text-sm text-gray-400">การกระทำของแอดมิน</div>
          </div>
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3">
          <div class="p-3 bg-red-600 rounded-lg">
            <Icon icon="mdi:alert-circle" class="text-2xl text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">
              {{ stats.securityEvents }}
            </div>
            <div class="text-sm text-gray-400">เหตุการณ์ความปลอดภัย</div>
          </div>
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3">
          <div class="p-3 bg-purple-600 rounded-lg">
            <Icon icon="mdi:database" class="text-2xl text-white" />
          </div>
          <div>
            <div class="text-2xl font-bold text-white">
              {{ stats.systemEvents }}
            </div>
            <div class="text-sm text-gray-400">เหตุการณ์ระบบ</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8"
    >
      <h2 class="text-lg font-semibold text-white mb-4">ตัวกรอง</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >ประเภทเหตุการณ์</label
          >
          <select
            v-model="filters.eventType"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทั้งหมด</option>
            <option value="user">ผู้ใช้</option>
            <option value="admin">แอดมิน</option>
            <option value="system">ระบบ</option>
            <option value="security">ความปลอดภัย</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >การกระทำ</label
          >
          <select
            v-model="filters.action"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทั้งหมด</option>
            <option value="login">เข้าสู่ระบบ</option>
            <option value="logout">ออกจากระบบ</option>
            <option value="create">สร้าง</option>
            <option value="update">แก้ไข</option>
            <option value="delete">ลบ</option>
            <option value="view">ดู</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >วันที่เริ่มต้น</label
          >
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >วันที่สิ้นสุด</label
          >
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex gap-3 mt-4">
        <button
          @click="applyFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ใช้ตัวกรอง
        </button>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ล้างตัวกรอง
        </button>
      </div>
    </div>

    <!-- Audit Log Table -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
    >
      <div class="p-6 border-b border-white/20">
        <h2 class="text-lg font-semibold text-white">รายการ Audit Log</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-white/5">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                เวลา
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                ผู้ใช้
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                การกระทำ
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                รายละเอียด
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                IP Address
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                สถานะ
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="hover:bg-white/5 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ formatDateTime(log.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div
                      class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center"
                    >
                      <Icon icon="mdi:account" class="text-gray-300" />
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-white">
                      {{ log.user.name }}
                    </div>
                    <div class="text-sm text-gray-400">
                      {{ log.user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getActionBadgeClass(log.action)"
                >
                  {{ getActionLabel(log.action) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                {{ log.details }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {{ log.ipAddress }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusBadgeClass(log.status)"
                >
                  {{ getStatusLabel(log.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewLogDetails(log)"
                  class="text-blue-400 hover:text-blue-300 mr-3"
                >
                  ดูรายละเอียด
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-3 bg-white/5 border-t border-white/20">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-400">
            แสดง {{ (currentPage - 1) * itemsPerPage + 1 }} ถึง
            {{ Math.min(currentPage * itemsPerPage, totalItems) }} จากทั้งหมด
            {{ totalItems }} รายการ
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage > 1 && currentPage--"
              :disabled="currentPage <= 1"
              class="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              ก่อนหน้า
            </button>
            <span class="px-3 py-1 bg-blue-600 text-white rounded">
              {{ currentPage }}
            </span>
            <button
              @click="currentPage < totalPages && currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Modal -->
    <div
      v-if="showSearchModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-white mb-6">ค้นหา Audit Log</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >คำค้นหา</label
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ชื่อผู้ใช้, การกระทำ, หรือรายละเอียด"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >IP Address</label
            >
            <input
              v-model="searchIP"
              type="text"
              placeholder="192.168.1.1"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="performSearch"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ค้นหา
          </button>
          <button
            @click="showSearchModal = false"
            class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">รายละเอียด Audit Log</h3>
          <button
            @click="showDetailsModal = false"
            class="text-gray-400 hover:text-white"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>

        <div v-if="selectedLog" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >เวลา</label
              >
              <div class="text-white">
                {{ formatDateTime(selectedLog.timestamp) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >ผู้ใช้</label
              >
              <div class="text-white">
                {{ selectedLog.user.name }} ({{ selectedLog.user.email }})
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >การกระทำ</label
              >
              <div class="text-white">
                {{ getActionLabel(selectedLog.action) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >สถานะ</label
              >
              <div class="text-white">
                {{ getStatusLabel(selectedLog.status) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >IP Address</label
              >
              <div class="text-white">{{ selectedLog.ipAddress }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >User Agent</label
              >
              <div class="text-white text-sm break-all">
                {{ selectedLog.userAgent }}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >รายละเอียด</label
            >
            <div class="text-white bg-gray-700 p-3 rounded-lg">
              {{ selectedLog.details }}
            </div>
          </div>

          <div v-if="selectedLog.metadata">
            <label class="block text-sm font-medium text-gray-300 mb-1"
              >Metadata</label
            >
            <div class="text-white bg-gray-700 p-3 rounded-lg">
              <pre class="text-sm">{{
                JSON.stringify(selectedLog.metadata, null, 2)
              }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Page meta
definePageMeta({
  middleware: ["auth", "admin-only"],
  layout: "admin",
});

// Reactive data
const showSearchModal = ref(false);
const showDetailsModal = ref(false);
const searchQuery = ref("");
const searchIP = ref("");
const selectedLog = ref(null);
const currentPage = ref(1);
const itemsPerPage = 20;

const filters = ref({
  eventType: "",
  action: "",
  startDate: "",
  endDate: "",
});

const stats = ref({
  userActions: 1247,
  adminActions: 89,
  securityEvents: 12,
  systemEvents: 156,
});

// Mock data
const auditLogs = ref([
  {
    id: 1,
    timestamp: "2024-01-15T14:30:00Z",
    user: { name: "สมชาย ใจดี", email: "somchai@example.com" },
    action: "login",
    details: "ผู้ใช้เข้าสู่ระบบสำเร็จ",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success",
    metadata: { sessionId: "sess_123456", device: "desktop" },
  },
  {
    id: 2,
    timestamp: "2024-01-15T14:25:00Z",
    user: { name: "Admin User", email: "admin@example.com" },
    action: "create",
    details: "สร้างผู้ใช้ใหม่: สมชาย ใจดี",
    ipAddress: "10.0.0.1",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "success",
    metadata: { newUserId: 1001, role: "user" },
  },
  {
    id: 3,
    timestamp: "2024-01-15T14:20:00Z",
    user: { name: "มาลี สวยงาม", email: "malee@example.com" },
    action: "update",
    details: "แก้ไขข้อมูลโปรไฟล์",
    ipAddress: "192.168.1.101",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    status: "success",
    metadata: { updatedFields: ["phone", "address"] },
  },
  {
    id: 4,
    timestamp: "2024-01-15T14:15:00Z",
    user: { name: "Hacker", email: "hacker@malicious.com" },
    action: "login",
    details: "ความพยายามเข้าสู่ระบบที่ล้มเหลว - รหัสผ่านไม่ถูกต้อง",
    ipAddress: "203.0.113.1",
    userAgent: "curl/7.68.0",
    status: "failed",
    metadata: { attempts: 5, blocked: true },
  },
  {
    id: 5,
    timestamp: "2024-01-15T14:10:00Z",
    user: { name: "Staff User", email: "staff@example.com" },
    action: "view",
    details: "ดูรายงานยอดขาย",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "success",
    metadata: { reportType: "sales", dateRange: "2024-01-01_2024-01-15" },
  },
]);

// Computed
const filteredLogs = computed(() => {
  let logs = auditLogs.value;

  if (filters.value.eventType) {
    logs = logs.filter((log) => {
      switch (filters.value.eventType) {
        case "user":
          return ["login", "logout", "view"].includes(log.action);
        case "admin":
          return ["create", "update", "delete"].includes(log.action);
        case "system":
          return log.action === "system";
        case "security":
          return log.status === "failed";
        default:
          return true;
      }
    });
  }

  if (filters.value.action) {
    logs = logs.filter((log) => log.action === filters.value.action);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    logs = logs.filter(
      (log) =>
        log.user.name.toLowerCase().includes(query) ||
        log.user.email.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query)
    );
  }

  if (searchIP.value) {
    logs = logs.filter((log) => log.ipAddress.includes(searchIP.value));
  }

  return logs;
});

const totalItems = computed(() => filteredLogs.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

// Methods
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getActionLabel = (action) => {
  const labels = {
    login: "เข้าสู่ระบบ",
    logout: "ออกจากระบบ",
    create: "สร้าง",
    update: "แก้ไข",
    delete: "ลบ",
    view: "ดู",
    system: "ระบบ",
  };
  return labels[action] || action;
};

const getActionBadgeClass = (action) => {
  const classes = {
    login: "bg-green-100 text-green-800",
    logout: "bg-gray-100 text-gray-800",
    create: "bg-blue-100 text-blue-800",
    update: "bg-yellow-100 text-yellow-800",
    delete: "bg-red-100 text-red-800",
    view: "bg-purple-100 text-purple-800",
    system: "bg-indigo-100 text-indigo-800",
  };
  return classes[action] || "bg-gray-100 text-gray-800";
};

const getStatusLabel = (status) => {
  const labels = {
    success: "สำเร็จ",
    failed: "ล้มเหลว",
    warning: "คำเตือน",
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status) => {
  const classes = {
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const applyFilters = () => {
  currentPage.value = 1;
  // Filters are automatically applied through computed property
};

const clearFilters = () => {
  filters.value = {
    eventType: "",
    action: "",
    startDate: "",
    endDate: "",
  };
  searchQuery.value = "";
  searchIP.value = "";
  currentPage.value = 1;
};

const performSearch = () => {
  showSearchModal.value = false;
  currentPage.value = 1;
};

const viewLogDetails = (log) => {
  selectedLog.value = log;
  showDetailsModal.value = true;
};

const exportAuditLogs = () => {
  // Simulate export
  const exportData = {
    timestamp: new Date().toISOString(),
    filters: filters.value,
    logs: filteredLogs.value,
  };

  console.log("Exporting audit logs:", exportData);
  alert("กำลังส่งออก Audit Logs...");
};

// SEO
useSeoMeta({
  title: "Audit Log - Admin Panel",
  description: "System audit trail and activity monitoring",
});
</script>
