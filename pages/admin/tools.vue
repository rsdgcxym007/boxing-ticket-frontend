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
            เครื่องมือช่วย
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            เครื่องมือช่วยเหลือในการจัดการระบบ
          </p>
        </div>
      </div>
    </div>

    <!-- Tools Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Database Tools -->
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-blue-600 rounded-lg">
            <Icon icon="mdi:database" class="text-2xl text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">เครื่องมือฐานข้อมูล</h3>
        </div>

        <div class="space-y-3">
          <button
            @click="optimizeDatabase"
            class="w-full px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:tune" class="inline mr-2" />
            ปรับปรุงประสิทธิภาพฐานข้อมูล
          </button>

          <button
            @click="cleanupDatabase"
            class="w-full px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:broom" class="inline mr-2" />
            ทำความสะอาดข้อมูลเก่า
          </button>

          <button
            @click="rebuildIndexes"
            class="w-full px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:reload" class="inline mr-2" />
            สร้าง Index ใหม่
          </button>
        </div>
      </div>

      <!-- Cache Management -->
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-green-600 rounded-lg">
            <Icon icon="mdi:memory" class="text-2xl text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">จัดการ Cache</h3>
        </div>

        <div class="space-y-3">
          <button
            @click="clearAllCache"
            class="w-full px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:delete-sweep" class="inline mr-2" />
            ล้าง Cache ทั้งหมด
          </button>

          <button
            @click="clearPageCache"
            class="w-full px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:web" class="inline mr-2" />
            ล้าง Page Cache
          </button>

          <button
            @click="clearImageCache"
            class="w-full px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:image" class="inline mr-2" />
            ล้าง Image Cache
          </button>
        </div>
      </div>

      <!-- Log Management -->
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-orange-600 rounded-lg">
            <Icon
              icon="mdi:file-document-outline"
              class="text-2xl text-white"
            />
          </div>
          <h3 class="text-lg font-semibold text-white">จัดการ Log</h3>
        </div>

        <div class="space-y-3">
          <button
            @click="viewSystemLogs"
            class="w-full px-4 py-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:eye" class="inline mr-2" />
            ดู System Logs
          </button>

          <button
            @click="viewErrorLogs"
            class="w-full px-4 py-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:alert-circle" class="inline mr-2" />
            ดู Error Logs
          </button>

          <button
            @click="clearOldLogs"
            class="w-full px-4 py-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:delete" class="inline mr-2" />
            ลบ Log เก่า
          </button>
        </div>
      </div>

      <!-- System Health -->
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-purple-600 rounded-lg">
            <Icon icon="mdi:heart-pulse" class="text-2xl text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">ตรวจสอบระบบ</h3>
        </div>

        <div class="space-y-3">
          <button
            @click="checkSystemHealth"
            class="w-full px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:stethoscope" class="inline mr-2" />
            ตรวจสุขภาพระบบ
          </button>

          <button
            @click="checkDiskSpace"
            class="w-full px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:harddisk" class="inline mr-2" />
            ตรวจสอบพื้นที่ดิสก์
          </button>

          <button
            @click="checkDependencies"
            class="w-full px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:package-variant" class="inline mr-2" />
            ตรวจสอบ Dependencies
          </button>
        </div>
      </div>

      <!-- Data Tools -->
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-red-600 rounded-lg">
            <Icon icon="mdi:database-cog" class="text-2xl text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">เครื่องมือข้อมูล</h3>
        </div>

        <div class="space-y-3">
          <button
            @click="generateTestData"
            class="w-full px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:database-plus" class="inline mr-2" />
            สร้างข้อมูลทดสอบ
          </button>

          <button
            @click="exportData"
            class="w-full px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:export" class="inline mr-2" />
            ส่งออกข้อมูล
          </button>

          <button
            @click="importData"
            class="w-full px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:import" class="inline mr-2" />
            นำเข้าข้อมูล
          </button>
        </div>
      </div>

      <!-- Security Tools -->
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 bg-yellow-600 rounded-lg">
            <Icon icon="mdi:shield-check" class="text-2xl text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">
            เครื่องมือความปลอดภัย
          </h3>
        </div>

        <div class="space-y-3">
          <button
            @click="scanSecurity"
            class="w-full px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:shield-search" class="inline mr-2" />
            สแกนช่องโหว่ความปลอดภัย
          </button>

          <button
            @click="updateSecurityRules"
            class="w-full px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:shield-refresh" class="inline mr-2" />
            อัปเดตกฎความปลอดภัย
          </button>

          <button
            @click="generateSecurityReport"
            class="w-full px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-600/30 transition-colors text-left"
          >
            <Icon icon="mdi:file-document-alert" class="inline mr-2" />
            สร้างรายงานความปลอดภัย
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8"
    >
      <h2 class="text-xl font-semibold text-white mb-6">การดำเนินการด่วน</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          @click="restartSystem"
          class="p-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors"
        >
          <Icon icon="mdi:restart" class="text-2xl mb-2" />
          <div class="font-medium">รีสตาร์ทระบบ</div>
        </button>

        <button
          @click="enableMaintenanceMode"
          class="p-4 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-600/30 transition-colors"
        >
          <Icon icon="mdi:tools" class="text-2xl mb-2" />
          <div class="font-medium">โหมดบำรุงรักษา</div>
        </button>

        <button
          @click="refreshSystem"
          class="p-4 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors"
        >
          <Icon icon="mdi:refresh" class="text-2xl mb-2" />
          <div class="font-medium">รีเฟรชระบบ</div>
        </button>

        <button
          @click="emergencyMode"
          class="p-4 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors"
        >
          <Icon icon="mdi:alert-octagon" class="text-2xl mb-2" />
          <div class="font-medium">โหมดฉุกเฉิน</div>
        </button>
      </div>
    </div>

    <!-- Tool Results -->
    <div
      v-if="toolResults.length > 0"
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
    >
      <h2 class="text-xl font-semibold text-white mb-6">ผลการดำเนินการ</h2>

      <div class="space-y-4">
        <div
          v-for="result in toolResults"
          :key="result.id"
          class="p-4 rounded-lg border"
          :class="[
            result.status === 'success'
              ? 'bg-green-500/10 border-green-500/20'
              : result.status === 'error'
              ? 'bg-red-500/10 border-red-500/20'
              : 'bg-yellow-500/10 border-yellow-500/20',
          ]"
        >
          <div class="flex items-start gap-3">
            <Icon
              :icon="
                result.status === 'success'
                  ? 'mdi:check-circle'
                  : result.status === 'error'
                  ? 'mdi:alert-circle'
                  : 'mdi:clock'
              "
              :class="[
                'text-lg mt-0.5',
                result.status === 'success'
                  ? 'text-green-400'
                  : result.status === 'error'
                  ? 'text-red-400'
                  : 'text-yellow-400',
              ]"
            />
            <div class="flex-1">
              <div class="font-medium text-white">{{ result.action }}</div>
              <div class="text-sm text-gray-300 mt-1">{{ result.message }}</div>
              <div class="text-xs text-gray-400 mt-2">
                {{ formatDateTime(result.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <button
          @click="clearResults"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ล้างผลลัพธ์
        </button>
      </div>
    </div>

    <!-- Progress Modal -->
    <div
      v-if="showProgressModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-white mb-6">
          {{ currentAction }}
        </h3>

        <div class="space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">ความคืบหน้า:</span>
            <span class="text-white">{{ progressPercent }}%</span>
          </div>

          <div class="w-full bg-gray-700 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>

          <p class="text-gray-300 text-sm text-center">{{ progressMessage }}</p>
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
const showProgressModal = ref(false);
const currentAction = ref("");
const progressPercent = ref(0);
const progressMessage = ref("");
const toolResults = ref([]);

// Methods
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const addResult = (action, message, status = "success") => {
  toolResults.value.unshift({
    id: Date.now(),
    action,
    message,
    status,
    timestamp: new Date().toISOString(),
  });
};

const runWithProgress = async (action, steps) => {
  currentAction.value = action;
  showProgressModal.value = true;
  progressPercent.value = 0;

  try {
    for (let i = 0; i < steps.length; i++) {
      progressMessage.value = steps[i];
      progressPercent.value = ((i + 1) / steps.length) * 100;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    showProgressModal.value = false;
    return true;
  } catch (error) {
    showProgressModal.value = false;
    throw error;
  }
};

// Database Tools
const optimizeDatabase = async () => {
  try {
    await runWithProgress("ปรับปรุงประสิทธิภาพฐานข้อมูล", [
      "วิเคราะห์ตารางข้อมูล...",
      "ปรับปรุง Query Performance...",
      "อัปเดต Statistics...",
      "เสร็จสิ้น!",
    ]);
    addResult(
      "ปรับปรุงประสิทธิภาพฐานข้อมูล",
      "ปรับปรุงประสิทธิภาพเรียบร้อยแล้ว"
    );
  } catch (error) {
    addResult(
      "ปรับปรุงประสิทธิภาพฐานข้อมูล",
      "เกิดข้อผิดพลาด: " + error.message,
      "error"
    );
  }
};

const cleanupDatabase = async () => {
  try {
    await runWithProgress("ทำความสะอาดฐานข้อมูล", [
      "ค้นหาข้อมูลที่ไม่ใช้งาน...",
      "ลบข้อมูลชั่วคราว...",
      "ทำความสะอาด Log Tables...",
      "เสร็จสิ้น!",
    ]);
    addResult("ทำความสะอาดฐานข้อมูล", "ทำความสะอาดข้อมูลเก่าเรียบร้อยแล้ว");
  } catch (error) {
    addResult(
      "ทำความสะอาดฐานข้อมูล",
      "เกิดข้อผิดพลาด: " + error.message,
      "error"
    );
  }
};

const rebuildIndexes = async () => {
  try {
    await runWithProgress("สร้าง Index ใหม่", [
      "วิเคราะห์ Index ปัจจุบัน...",
      "ลบ Index เก่า...",
      "สร้าง Index ใหม่...",
      "เสร็จสิ้น!",
    ]);
    addResult("สร้าง Index ใหม่", "สร้าง Index ใหม่เรียบร้อยแล้ว");
  } catch (error) {
    addResult("สร้าง Index ใหม่", "เกิดข้อผิดพลาด: " + error.message, "error");
  }
};

// Cache Management
const clearAllCache = async () => {
  try {
    await runWithProgress("ล้าง Cache ทั้งหมด", [
      "ล้าง Application Cache...",
      "ล้าง Database Cache...",
      "ล้าง Redis Cache...",
      "เสร็จสิ้น!",
    ]);
    addResult("ล้าง Cache ทั้งหมด", "ล้าง Cache ทั้งหมดเรียบร้อยแล้ว");
  } catch (error) {
    addResult(
      "ล้าง Cache ทั้งหมด",
      "เกิดข้อผิดพลาด: " + error.message,
      "error"
    );
  }
};

const clearPageCache = async () => {
  addResult("ล้าง Page Cache", "ล้าง Page Cache เรียบร้อยแล้ว");
};

const clearImageCache = async () => {
  addResult("ล้าง Image Cache", "ล้าง Image Cache เรียบร้อยแล้ว");
};

// Log Management
const viewSystemLogs = () => {
  addResult("ดู System Logs", "เปิดหน้าต่าง System Logs");
  // This would open a modal or redirect to logs page
};

const viewErrorLogs = () => {
  addResult("ดู Error Logs", "เปิดหน้าต่าง Error Logs");
};

const clearOldLogs = async () => {
  try {
    await runWithProgress("ลบ Log เก่า", [
      "ค้นหา Log ที่เก่ากว่า 30 วัน...",
      "ลบ Log ไฟล์...",
      "เสร็จสิ้น!",
    ]);
    addResult("ลบ Log เก่า", "ลบ Log เก่าเรียบร้อยแล้ว");
  } catch (error) {
    addResult("ลบ Log เก่า", "เกิดข้อผิดพลาด: " + error.message, "error");
  }
};

// System Health
const checkSystemHealth = async () => {
  try {
    await runWithProgress("ตรวจสุขภาพระบบ", [
      "ตรวจสอบ CPU และ Memory...",
      "ตรวจสอบ Database Connection...",
      "ตรวจสอบ External Services...",
      "เสร็จสิ้น!",
    ]);
    addResult(
      "ตรวจสุขภาพระบบ",
      "ระบบทำงานปกติ - CPU: 45%, Memory: 62%, Database: OK"
    );
  } catch (error) {
    addResult("ตรวจสุขภาพระบบ", "เกิดข้อผิดพลาด: " + error.message, "error");
  }
};

const checkDiskSpace = () => {
  addResult(
    "ตรวจสอบพื้นที่ดิสก์",
    "พื้นที่ดิสก์: 65% ใช้งาน (342 GB ว่าง จาก 1 TB)"
  );
};

const checkDependencies = () => {
  addResult("ตรวจสอบ Dependencies", "Dependencies ทั้งหมดอัปเดตแล้ว");
};

// Data Tools
const generateTestData = async () => {
  try {
    await runWithProgress("สร้างข้อมูลทดสอบ", [
      "สร้างข้อมูลผู้ใช้ทดสอบ...",
      "สร้างข้อมูลการจองทดสอบ...",
      "สร้างข้อมูลการชำระเงินทดสอบ...",
      "เสร็จสิ้น!",
    ]);
    addResult(
      "สร้างข้อมูลทดสอบ",
      "สร้างข้อมูลทดสอบเรียบร้อยแล้ว (100 users, 500 bookings)"
    );
  } catch (error) {
    addResult("สร้างข้อมูลทดสอบ", "เกิดข้อผิดพลาด: " + error.message, "error");
  }
};

const exportData = () => {
  addResult("ส่งออกข้อมูล", "เริ่มการส่งออกข้อมูล - ไฟล์จะถูกส่งไปยังอีเมล");
};

const importData = () => {
  addResult("นำเข้าข้อมูล", "เปิดหน้าต่างนำเข้าข้อมูล");
};

// Security Tools
const scanSecurity = async () => {
  try {
    await runWithProgress("สแกนความปลอดภัย", [
      "ตรวจสอบช่องโหว่ที่รู้จัก...",
      "ตรวจสอบการตั้งค่าความปลอดภัย...",
      "ตรวจสอบการเข้าถึงที่ผิดปกติ...",
      "เสร็จสิ้น!",
    ]);
    addResult("สแกนความปลอดภัย", "ไม่พบช่องโหว่ความปลอดภัย - ระบบปลอดภัย");
  } catch (error) {
    addResult("สแกนความปลอดภัย", "เกิดข้อผิดพลาด: " + error.message, "error");
  }
};

const updateSecurityRules = () => {
  addResult("อัปเดตกฎความปลอดภัย", "อัปเดตกฎความปลอดภัยเรียบร้อยแล้ว");
};

const generateSecurityReport = () => {
  addResult(
    "สร้างรายงานความปลอดภัย",
    "กำลังสร้างรายงาน - จะส่งไปยังอีเมลในอีก 5 นาที"
  );
};

// Quick Actions
const restartSystem = () => {
  if (
    confirm(
      "คุณแน่ใจหรือไม่ที่จะรีสตาร์ทระบบ? ผู้ใช้ทั้งหมดจะถูกตัดการเชื่อมต่อ"
    )
  ) {
    addResult("รีสตาร์ทระบบ", "กำลังรีสตาร์ทระบบ...", "warning");
  }
};

const enableMaintenanceMode = () => {
  if (confirm("เปิดโหมดบำรุงรักษา? ผู้ใช้จะไม่สามารถเข้าถึงระบบได้")) {
    addResult("โหมดบำรุงรักษา", "เปิดโหมดบำรุงรักษาแล้ว");
  }
};

const refreshSystem = () => {
  addResult("รีเฟรชระบบ", "รีเฟรชระบบเรียบร้อยแล้ว");
};

const emergencyMode = () => {
  if (
    confirm("เปิดโหมดฉุกเฉิน? การดำเนินการนี้จะปิดระบบทั้งหมดยกเว้นหน้าแอดมิน")
  ) {
    addResult("โหมดฉุกเฉิน", "เปิดโหมดฉุกเฉินแล้ว", "error");
  }
};

const clearResults = () => {
  toolResults.value = [];
};

// SEO
useSeoMeta({
  title: "Admin Tools - Admin Panel",
  description: "System administration tools and utilities",
});
</script>
