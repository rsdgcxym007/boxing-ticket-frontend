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
            สำรองข้อมูล
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            จัดการการสำรองและกู้คืนข้อมูลระบบ
          </p>
        </div>
        <button
          @click="createBackup"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Icon icon="mdi:plus" class="text-lg" />
          สำรองข้อมูลใหม่
        </button>
      </div>
    </div>

    <!-- Backup Status -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">การสำรองล่าสุด</p>
            <p class="text-lg font-bold text-white">
              {{ formatDateTime(lastBackupTime) }}
            </p>
          </div>
          <Icon icon="mdi:clock" class="text-3xl text-blue-400" />
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">จำนวนไฟล์สำรอง</p>
            <p class="text-lg font-bold text-white">{{ backupFiles.length }}</p>
          </div>
          <Icon icon="mdi:database" class="text-3xl text-green-400" />
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-300 text-sm">พื้นที่ใช้งาน</p>
            <p class="text-lg font-bold text-white">{{ totalBackupSize }}</p>
          </div>
          <Icon icon="mdi:harddisk" class="text-3xl text-purple-400" />
        </div>
      </div>
    </div>

    <!-- Automatic Backup Settings -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8"
    >
      <h2 class="text-xl font-semibold text-white mb-6">
        การตั้งค่าการสำรองอัตโนมัติ
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="flex items-center space-x-3 cursor-pointer mb-4">
            <input
              v-model="autoBackupSettings.enabled"
              type="checkbox"
              class="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span class="text-gray-300">เปิดใช้งานการสำรองอัตโนมัติ</span>
          </label>

          <div v-if="autoBackupSettings.enabled" class="space-y-4">
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >ความถี่ในการสำรอง</label
              >
              <select
                v-model="autoBackupSettings.frequency"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">ทุกวัน</option>
                <option value="weekly">ทุกสัปดาห์</option>
                <option value="monthly">ทุกเดือน</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >เวลาในการสำรอง</label
              >
              <input
                v-model="autoBackupSettings.time"
                type="time"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2"
            >จำนวนไฟล์สำรองที่เก็บไว้</label
          >
          <input
            v-model.number="autoBackupSettings.retentionCount"
            type="number"
            min="1"
            max="30"
            class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-gray-400 text-xs mt-1">
            ไฟล์เก่าจะถูกลบอัตโนมัติเมื่อเกินจำนวนที่กำหนด
          </p>
        </div>
      </div>

      <div class="mt-6">
        <button
          @click="saveAutoBackupSettings"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>

    <!-- Backup Files List -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
    >
      <h2 class="text-xl font-semibold text-white mb-6">ไฟล์สำรองข้อมูล</h2>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/20">
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ชื่อไฟล์
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                วันที่สร้าง
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ขนาดไฟล์
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ประเภท
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                สถานะ
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="backup in backupFiles"
              :key="backup.id"
              class="border-b border-white/10 hover:bg-white/5"
            >
              <td class="py-3 px-4 text-white">{{ backup.filename }}</td>
              <td class="py-3 px-4 text-white">
                {{ formatDateTime(backup.createdAt) }}
              </td>
              <td class="py-3 px-4 text-white">{{ backup.size }}</td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    backup.type === 'full'
                      ? 'bg-blue-500/20 text-blue-400'
                      : backup.type === 'incremental'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400',
                  ]"
                >
                  {{ getBackupTypeText(backup.type) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    backup.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : backup.status === 'failed'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400',
                  ]"
                >
                  {{ getStatusText(backup.status) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex gap-2">
                  <button
                    v-if="backup.status === 'completed'"
                    @click="downloadBackup(backup.id)"
                    class="text-blue-400 hover:text-blue-300"
                    title="ดาวน์โหลด"
                  >
                    <Icon icon="mdi:download" class="text-lg" />
                  </button>
                  <button
                    v-if="backup.status === 'completed'"
                    @click="restoreBackup(backup.id)"
                    class="text-green-400 hover:text-green-300"
                    title="กู้คืนข้อมูล"
                  >
                    <Icon icon="mdi:restore" class="text-lg" />
                  </button>
                  <button
                    @click="deleteBackup(backup.id)"
                    class="text-red-400 hover:text-red-300"
                    title="ลบ"
                  >
                    <Icon icon="mdi:delete" class="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Backup Progress Modal -->
    <div
      v-if="showBackupProgress"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-white mb-6">กำลังสำรองข้อมูล</h3>

        <div class="space-y-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">ความคืบหน้า:</span>
            <span class="text-white">{{ backupProgress }}%</span>
          </div>

          <div class="w-full bg-gray-700 rounded-full h-2">
            <div
              class="bg-green-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${backupProgress}%` }"
            ></div>
          </div>

          <p class="text-gray-300 text-sm text-center">
            {{ backupProgressMessage }}
          </p>
        </div>

        <div class="mt-6 text-center">
          <button
            v-if="backupProgress === 100"
            @click="showBackupProgress = false"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>

    <!-- Restore Confirmation Modal -->
    <div
      v-if="showRestoreModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-white mb-6">
          ยืนยันการกู้คืนข้อมูล
        </h3>

        <div class="mb-6">
          <div
            class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4"
          >
            <div class="flex items-center gap-2 text-red-400 mb-2">
              <Icon icon="mdi:alert" class="text-lg" />
              <span class="font-semibold">คำเตือน!</span>
            </div>
            <p class="text-red-300 text-sm">
              การกู้คืนข้อมูลจะเขียนทับข้อมูลปัจจุบันทั้งหมด
              การดำเนินการนี้ไม่สามารถยกเลิกได้
            </p>
          </div>

          <p class="text-gray-300 text-sm">
            คุณแน่ใจหรือไม่ที่จะกู้คืนข้อมูลจากไฟล์:
            <strong>{{ selectedBackupFile?.filename }}</strong>
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showRestoreModal = false"
            class="flex-1 px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            @click="confirmRestore"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ยืนยันการกู้คืน
          </button>
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
const showBackupProgress = ref(false);
const showRestoreModal = ref(false);
const backupProgress = ref(0);
const backupProgressMessage = ref("");
const selectedBackupFile = ref(null);

const autoBackupSettings = ref({
  enabled: true,
  frequency: "daily",
  time: "02:00",
  retentionCount: 7,
});

const lastBackupTime = ref("2024-01-15T02:00:00");
const totalBackupSize = ref("25.6 GB");

// Mock backup files
const backupFiles = ref([
  {
    id: 1,
    filename: "backup_2024-01-15_02-00-00.sql.gz",
    createdAt: "2024-01-15T02:00:00",
    size: "4.2 GB",
    type: "full",
    status: "completed",
  },
  {
    id: 2,
    filename: "backup_2024-01-14_02-00-00.sql.gz",
    createdAt: "2024-01-14T02:00:00",
    size: "4.1 GB",
    type: "full",
    status: "completed",
  },
  {
    id: 3,
    filename: "backup_2024-01-13_02-00-00.sql.gz",
    createdAt: "2024-01-13T02:00:00",
    size: "3.9 GB",
    type: "full",
    status: "completed",
  },
  {
    id: 4,
    filename: "backup_2024-01-12_14-30-00.sql.gz",
    createdAt: "2024-01-12T14:30:00",
    size: "150 MB",
    type: "incremental",
    status: "completed",
  },
  {
    id: 5,
    filename: "backup_2024-01-11_02-00-00.sql.gz",
    createdAt: "2024-01-11T02:00:00",
    size: "3.8 GB",
    type: "full",
    status: "failed",
  },
]);

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

const getBackupTypeText = (type) => {
  switch (type) {
    case "full":
      return "เต็มระบบ";
    case "incremental":
      return "เพิ่มเติม";
    case "differential":
      return "ส่วนต่าง";
    default:
      return type;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "completed":
      return "เสร็จสิ้น";
    case "failed":
      return "ล้มเหลว";
    case "in_progress":
      return "กำลังดำเนินการ";
    default:
      return status;
  }
};

const createBackup = async () => {
  showBackupProgress.value = true;
  backupProgress.value = 0;

  const steps = [
    "เตรียมระบบสำหรับการสำรอง...",
    "กำลังสำรองข้อมูลผู้ใช้...",
    "กำลังสำรองข้อมูลการจอง...",
    "กำลังสำรองข้อมูลการชำระเงิน...",
    "กำลังบีบอัดไฟล์...",
    "เสร็จสิ้น!",
  ];

  for (let i = 0; i < steps.length; i++) {
    backupProgressMessage.value = steps[i];
    backupProgress.value = ((i + 1) / steps.length) * 100;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  // Add new backup to list
  const newBackup = {
    id: Date.now(),
    filename: `backup_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:-]/g, "-")
      .replace("T", "_")}.sql.gz`,
    createdAt: new Date().toISOString(),
    size: "4.3 GB",
    type: "full",
    status: "completed",
  };
  backupFiles.value.unshift(newBackup);
  lastBackupTime.value = new Date().toISOString();
};

const downloadBackup = (backupId) => {
  const backup = backupFiles.value.find((b) => b.id === backupId);
  if (backup) {
    alert(`กำลังดาวน์โหลด ${backup.filename}...`);
  }
};

const restoreBackup = (backupId) => {
  selectedBackupFile.value = backupFiles.value.find((b) => b.id === backupId);
  showRestoreModal.value = true;
};

const confirmRestore = async () => {
  showRestoreModal.value = false;
  alert("เริ่มต้นการกู้คืนข้อมูล... กระบวนการนี้อาจใช้เวลาหลายนาที");

  // Simulate restore process
  await new Promise((resolve) => setTimeout(resolve, 2000));
  alert("กู้คืนข้อมูลเสร็จสิ้น!");
};

const deleteBackup = (backupId) => {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบไฟล์สำรองนี้?")) {
    const index = backupFiles.value.findIndex((b) => b.id === backupId);
    if (index !== -1) {
      backupFiles.value.splice(index, 1);
    }
  }
};

const saveAutoBackupSettings = () => {
  alert("บันทึกการตั้งค่าการสำรองอัตโนมัติเรียบร้อยแล้ว");
};

// SEO
useSeoMeta({
  title: "Backup Management - Admin Panel",
  description: "Manage system backups and data recovery",
});
</script>
