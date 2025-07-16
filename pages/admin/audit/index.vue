<template>
  <div
    class="audit-management-page min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-6"
  >
    <!-- Header Section -->
    <div class="mb-8">
      <!-- Modern Header with Glassmorphism -->
      <div
        class="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl mx-auto max-w-7xl px-8 py-8 mb-8 shadow-lg"
      >
        <div
          class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6"
        >
          <div class="flex items-center gap-6">
            <div class="relative">
              <div
                class="p-4 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white rounded-2xl shadow-lg"
              >
                <i class="mdi mdi-shield-search text-3xl"></i>
              </div>
              <div
                class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
              >
                <i class="mdi mdi-check text-white text-xs"></i>
              </div>
            </div>
            <div>
              <h1
                class="text-4xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent"
              >
                ระบบตรวจสอบ Audit
              </h1>
              <div class="flex items-center gap-4 mt-2">
                <p class="text-gray-600 text-lg">
                  ติดตามและตรวจสอบกิจกรรมทั้งหมดในระบบ
                </p>
                <span
                  class="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-semibold shadow-sm"
                >
                  {{ stats?.totalLogs || 0 }} รายการ
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <BaseButton
              @click="loadAuditLogs"
              variant="secondary"
              color="gray"
              size="lg"
              class="flex items-center gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              <i class="mdi mdi-refresh"></i>
              <span class="hidden sm:inline">รีเฟรช</span>
            </BaseButton>
            <BaseButton
              @click="showExportModal = true"
              size="lg"
              class="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
            >
              <i class="mdi mdi-download"></i>
              ส่งออกรายงาน
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div
        class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        <AuditStatsCard
          title="รายการทั้งหมด"
          :value="stats?.totalLogs || 0"
          icon="mdi-database"
          color="blue"
          trend="+12%"
        />
        <AuditStatsCard
          title="ผู้ใช้ที่ใช้งาน"
          :value="stats?.activeUsers || 0"
          icon="mdi-account-multiple"
          color="green"
          trend="+5%"
        />
        <AuditStatsCard
          title="กิจกรรมน่าสงสัย"
          :value="stats?.suspiciousActivities || 0"
          icon="mdi-alert-circle"
          color="red"
          trend="-2%"
        />
        <AuditStatsCard
          title="วันนี้"
          :value="stats?.todayLogs || 0"
          icon="mdi-calendar-today"
          color="orange"
          trend="+8%"
        />
        <AuditStatsCard
          title="สัปดาห์นี้"
          :value="stats?.weeklyLogs || 0"
          icon="mdi-calendar-week"
          color="purple"
          trend="+15%"
        />
        <AuditStatsCard
          title="เดือนนี้"
          :value="stats?.monthlyLogs || 0"
          icon="mdi-calendar-month"
          color="indigo"
          trend="+22%"
        />
      </div>

      <!-- Quick Actions -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            @click="showAdvancedSearchModal = true"
            class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-blue-200 cursor-pointer hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
              >
                <i class="mdi mdi-magnify text-xl"></i>
              </div>
              <div>
                <h3
                  class="font-bold text-gray-900 group-hover:text-blue-700 transition-colors"
                >
                  ค้นหาขั้นสูง
                </h3>
                <p class="text-sm text-gray-600">กรองข้อมูลตามเงื่อนไข</p>
              </div>
            </div>
          </div>

          <div
            @click="showUserActivityModal = true"
            class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-green-200 cursor-pointer hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
              >
                <i class="mdi mdi-account-clock text-xl"></i>
              </div>
              <div>
                <h3
                  class="font-bold text-gray-900 group-hover:text-green-700 transition-colors"
                >
                  กิจกรรมผู้ใช้
                </h3>
                <p class="text-sm text-gray-600">ติดตามการใช้งาน</p>
              </div>
            </div>
          </div>

          <div
            @click="loadSuspiciousActivities"
            class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-red-200 cursor-pointer hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
              >
                <i class="mdi mdi-shield-alert text-xl"></i>
              </div>
              <div>
                <h3
                  class="font-bold text-gray-900 group-hover:text-red-700 transition-colors"
                >
                  กิจกรรมเสี่ยง
                </h3>
                <p class="text-sm text-gray-600">ตรวจสอบความผิดปกติ</p>
              </div>
            </div>
          </div>

          <div
            @click="showExportModal = true"
            class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-purple-200 cursor-pointer hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
              >
                <i class="mdi mdi-file-export text-xl"></i>
              </div>
              <div>
                <h3
                  class="font-bold text-gray-900 group-hover:text-purple-700 transition-colors"
                >
                  ส่งออกรายงาน
                </h3>
                <p class="text-sm text-gray-600">CSV, PDF, Excel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="max-w-7xl mx-auto mb-8">
      <div
        class="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl px-6 py-6 shadow-lg"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-3">
            <div
              class="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-lg"
            >
              <i class="mdi mdi-filter-variant text-lg"></i>
            </div>
            ตัวกรองข้อมูล
          </h3>
          <BaseButton
            @click="clearFilters"
            variant="secondary"
            color="gray"
            size="sm"
            class="flex items-center gap-2"
          >
            <i class="mdi mdi-filter-remove"></i>
            ล้างตัวกรอง
          </BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="relative">
            <BaseInput
              v-model="filters.query"
              label="ค้นหา"
              placeholder="ค้นหากิจกรรม, ผู้ใช้, หรือ IP"
              class="pl-10"
            />
            <i class="mdi mdi-magnify absolute left-3 top-9 text-gray-400"></i>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >ประเภทการกระทำ</label
            >
            <select
              v-model="filters.action"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">เลือกประเภท</option>
              <option
                v-for="option in actionOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <BaseInput
              v-model="filters.startDate"
              type="date"
              label="วันที่เริ่มต้น"
            />
          </div>

          <div>
            <BaseInput
              v-model="filters.endDate"
              type="date"
              label="วันที่สิ้นสุด"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Audit Logs Table -->
    <div class="max-w-7xl mx-auto">
      <div
        class="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div
                class="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-lg"
              >
                <i class="mdi mdi-format-list-bulleted text-lg"></i>
              </div>
              บันทึกการตรวจสอบ
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="mdi mdi-information-outline"></i>
              แสดง {{ auditLogs.length }} จาก {{ pagination.total }} รายการ
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="space-y-4">
            <div v-for="n in 5" :key="n" class="animate-pulse">
              <div class="bg-gray-200 rounded-xl p-6">
                <div class="flex justify-between items-start mb-4">
                  <div class="h-5 bg-gray-300 rounded w-1/3"></div>
                  <div class="h-4 bg-gray-300 rounded w-16"></div>
                </div>
                <div class="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
                <div class="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="auditLogs.length === 0" class="text-center py-16">
            <div class="bg-white rounded-xl p-12 shadow-sm max-w-md mx-auto">
              <div
                class="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <i
                  class="mdi mdi-database-search-outline text-3xl text-purple-600"
                ></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                ไม่พบข้อมูล Audit
              </h3>
              <p class="text-gray-600 mb-6">
                ไม่มีบันทึกการตรวจสอบที่ตรงกับเงื่อนไขที่กำหนด
              </p>
              <BaseButton
                @click="clearFilters"
                color="purple"
                class="flex items-center gap-2 mx-auto"
              >
                <i class="mdi mdi-refresh"></i>
                รีเซ็ตตัวกรอง
              </BaseButton>
            </div>
          </div>

          <!-- Audit Logs List -->
          <div v-else class="space-y-4">
            <div
              v-for="log in auditLogs"
              :key="log.id"
              class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group hover:border-purple-200"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md"
                  >
                    <i class="mdi mdi-shield-check text-white text-lg"></i>
                  </div>
                  <div>
                    <h4
                      class="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors text-lg"
                    >
                      {{ log.action }}
                    </h4>
                    <p class="text-sm text-gray-600">
                      {{ log.user?.name || "ระบบ" }} •
                      {{ formatDateTime(log.timestamp) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border',
                      getActionColor(log.action),
                    ]"
                  >
                    {{ getActionLabel(log.action) }}
                  </span>
                  <BaseButton
                    @click="showAuditDetail(log)"
                    variant="secondary"
                    color="purple"
                    size="sm"
                    class="flex items-center gap-2"
                  >
                    <i class="mdi mdi-eye text-sm"></i>
                    ดูรายละเอียด
                  </BaseButton>
                </div>
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm"
              >
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-folder-outline text-gray-400"></i>
                  <span class="text-gray-600">ประเภท:</span>
                  <span class="font-semibold">{{
                    log.entityType || "ไม่ระบุ"
                  }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <i class="mdi mdi-ip-network text-gray-400"></i>
                  <span class="text-gray-600">IP Address:</span>
                  <span
                    class="font-mono text-xs bg-gray-100 px-2 py-1 rounded"
                    >{{ log.ipAddress || "N/A" }}</span
                  >
                </div>

                <div class="flex items-center gap-2">
                  <i class="mdi mdi-web text-gray-400"></i>
                  <span class="text-gray-600">User Agent:</span>
                  <span
                    class="text-xs text-gray-800 truncate"
                    :title="log.userAgent"
                  >
                    {{ truncateUserAgent(log.userAgent) }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <i class="mdi mdi-identifier text-gray-400"></i>
                  <span class="text-gray-600">Entity ID:</span>
                  <span
                    class="font-mono text-xs bg-gray-100 px-2 py-1 rounded"
                    >{{ log.entityId || "N/A" }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.totalPages > 1" class="mt-8">
            <AuditPagination
              :current-page="pagination.page"
              :total-pages="pagination.totalPages"
              :total-items="pagination.total"
              @page-change="changePage"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AuditDetailModal
      :isOpen="showDetailModal"
      :audit-log="selectedLog"
      @close="onClose"
    />

    <AuditExportModal v-model="showExportModal" @export="handleExport" />

    <UserActivityModal v-model="showUserActivityModal" />

    <AuditSearchModal
      v-model="showAdvancedSearchModal"
      @search="handleAdvancedSearch"
    />

    <!-- Suspicious Activities Section -->
    <SuspiciousActivitiesSection
      v-if="suspiciousActivities.length > 0"
      :activities="suspiciousActivities"
      @update-status="handleUpdateSuspiciousStatus"
      class="mt-8 max-w-7xl mx-auto"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import {
  useAudit,
  type AuditStats,
  type SuspiciousActivity,
} from "../../../composables/useAudit";
import { useDebounceFn } from "@vueuse/core";
import dayjs from "dayjs";

// Define page meta
// definePageMeta({
//   title: "Audit Management",
//   layout: "default",
// });

// Composables
const {
  loading,
  auditLogs,
  stats,
  suspiciousActivities,
  getAuditLogs,
  getAuditStats,
  getSuspiciousActivities,
  exportAuditReport,
  updateSuspiciousActivityStatus,
} = useAudit();

// State
const showDetailModal = ref(false);
const showExportModal = ref(false);
const showUserActivityModal = ref(false);
const showAdvancedSearchModal = ref(false);
const selectedLog = ref(null);

// Filters
const filters = reactive({
  query: "",
  action: "",
  startDate: "",
  endDate: "",
  userId: "",
  entityType: "",
  ipAddress: "",
});

// Pagination
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
});

// Options
const actionOptions = [
  { label: "เข้าสู่ระบบ", value: "login" },
  { label: "ออกจากระบบ", value: "logout" },
  { label: "สร้าง", value: "create" },
  { label: "อัปเดต", value: "update" },
  { label: "ลบ", value: "delete" },
  { label: "ดู", value: "view" },
  { label: "ส่งออก", value: "export" },
];

// Computed
const debouncedLoadAuditLogs = useDebounceFn(loadAuditLogs, 400);

// Methods
async function loadAuditLogs() {
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    };

    const result = await getAuditLogs(params);
    pagination.total = result.total;
    pagination.totalPages = result.totalPages;
  } catch (error) {
    console.error("Failed to load audit logs:", error);
  }
}

async function loadStats() {
  try {
    await getAuditStats();
  } catch (error) {
    console.error("Failed to load audit stats:", error);
  }
}

async function loadSuspiciousActivities() {
  try {
    await getSuspiciousActivities();
  } catch (error) {
    console.error("Failed to load suspicious activities:", error);
  }
}

async function refreshData() {
  await Promise.all([loadAuditLogs(), loadStats(), loadSuspiciousActivities()]);
}

function clearFilters() {
  Object.assign(filters, {
    query: "",
    action: "",
    startDate: "",
    endDate: "",
    userId: "",
    entityType: "",
    ipAddress: "",
  });
  pagination.page = 1;
  loadAuditLogs();
}

function changePage(newPage: any) {
  pagination.page = newPage;
  loadAuditLogs();
}

function showAuditDetail(log: any) {
  selectedLog.value = log;
  showDetailModal.value = true;
}

const onClose = () => {
  showDetailModal.value = false;
  selectedLog.value = null;
};
async function handleExport(params: any) {
  try {
    await exportAuditReport(params);
  } catch (error) {
    console.error("Failed to export audit report:", error);
  }
}

function handleAdvancedSearch(searchParams: any) {
  Object.assign(filters, searchParams);
  pagination.page = 1;
  loadAuditLogs();
}

async function handleUpdateSuspiciousStatus(id: any, status: any) {
  try {
    await updateSuspiciousActivityStatus(id, status);
    await loadSuspiciousActivities();
  } catch (error) {
    console.error("Failed to update suspicious activity status:", error);
  }
}

function getActionColor(action: any) {
  const colorMap = {
    login: "bg-green-50 text-green-700 border-green-200",
    logout: "bg-gray-50 text-gray-700 border-gray-200",
    create: "bg-blue-50 text-blue-700 border-blue-200",
    update: "bg-yellow-50 text-yellow-700 border-yellow-200",
    delete: "bg-red-50 text-red-700 border-red-200",
    view: "bg-purple-50 text-purple-700 border-purple-200",
    export: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    colorMap[action?.toLowerCase()] ||
    "bg-gray-50 text-gray-700 border-gray-200"
  );
}

function getActionLabel(action: any) {
  const labelMap = {
    login: "เข้าสู่ระบบ",
    logout: "ออกจากระบบ",
    create: "สร้าง",
    update: "อัปเดต",
    delete: "ลบ",
    view: "ดู",
    export: "ส่งออก",
  };

  return labelMap[action?.toLowerCase()] || action || "ไม่ระบุ";
}

function truncateUserAgent(userAgent: any) {
  if (!userAgent) return "N/A";
  return userAgent.length > 30 ? userAgent.substring(0, 30) + "..." : userAgent;
}

function formatDateTime(timestamp: any) {
  return dayjs(timestamp).format("DD/MM/YYYY HH:mm:ss");
}

// Watchers
watch(
  () => [filters.query, filters.action, filters.startDate, filters.endDate],
  () => {
    pagination.page = 1;
    debouncedLoadAuditLogs();
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.audit-management-page {
  min-height: 100vh;
}

@media (max-width: 768px) {
  .audit-management-page {
    padding: 1rem;
  }
}
</style>
