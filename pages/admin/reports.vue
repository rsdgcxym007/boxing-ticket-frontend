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
            ส่งออกรายงาน
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            สร้างและดาวน์โหลดรายงานต่างๆ ของระบบ
          </p>
        </div>
      </div>
    </div>

    <!-- Report Templates -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        v-for="report in reportTemplates"
        :key="report.id"
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-colors"
      >
        <div class="flex items-start gap-4 mb-4">
          <div :class="['p-3 rounded-lg', report.color]">
            <Icon :icon="report.icon" class="text-2xl text-white" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white mb-2">
              {{ report.title }}
            </h3>
            <p class="text-gray-300 text-sm">{{ report.description }}</p>
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">รูปแบบ:</span>
            <span class="text-white">{{ report.formats.join(", ") }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">ข้อมูลล่าสุด:</span>
            <span class="text-white">{{
              formatDate(report.lastGenerated)
            }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">ขนาดโดยประมาณ:</span>
            <span class="text-white">{{ report.estimatedSize }}</span>
          </div>
        </div>

        <button
          @click="generateReport(report)"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:download" class="text-lg" />
          สร้างรายงาน
        </button>
      </div>
    </div>

    <!-- Custom Report Builder -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8"
    >
      <h2 class="text-xl font-semibold text-white mb-6">สร้างรายงานกำหนดเอง</h2>

      <form @submit.prevent="generateCustomReport" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ชื่อรายงาน</label
            >
            <input
              v-model="customReport.title"
              type="text"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ระบุชื่อรายงาน"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >รูปแบบไฟล์</label
            >
            <select
              v-model="customReport.format"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >วันที่เริ่มต้น</label
            >
            <input
              v-model="customReport.startDate"
              type="date"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >วันที่สิ้นสุด</label
            >
            <input
              v-model="customReport.endDate"
              type="date"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-300 text-sm font-medium mb-3"
            >เลือกข้อมูลที่ต้องการ</label
          >
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <label
              v-for="field in availableFields"
              :key="field.id"
              class="flex items-center space-x-2 cursor-pointer"
            >
              <input
                v-model="customReport.selectedFields"
                :value="field.id"
                type="checkbox"
                class="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span class="text-gray-300 text-sm">{{ field.label }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-gray-300 text-sm font-medium mb-2"
            >ตัวกรองเพิ่มเติม (ไม่บังคับ)</label
          >
          <textarea
            v-model="customReport.filters"
            class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="ระบุเงื่อนไขการกรองข้อมูล เช่น ราคาตั๋วมากกว่า 1000 บาท"
          ></textarea>
        </div>

        <button
          type="submit"
          class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Icon icon="mdi:file-export" class="text-lg" />
          สร้างรายงานกำหนดเอง
        </button>
      </form>
    </div>

    <!-- Report History -->
    <div
      class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
    >
      <h2 class="text-xl font-semibold text-white mb-6">
        ประวัติการสร้างรายงาน
      </h2>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/20">
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ชื่อรายงาน
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                รูปแบบ
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                วันที่สร้าง
              </th>
              <th class="text-left py-3 px-4 text-gray-300 font-medium">
                ขนาดไฟล์
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
              v-for="history in reportHistory"
              :key="history.id"
              class="border-b border-white/10 hover:bg-white/5"
            >
              <td class="py-3 px-4 text-white">{{ history.name }}</td>
              <td class="py-3 px-4 text-white">
                {{ history.format.toUpperCase() }}
              </td>
              <td class="py-3 px-4 text-white">
                {{ formatDateTime(history.createdAt) }}
              </td>
              <td class="py-3 px-4 text-white">{{ history.fileSize }}</td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    history.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : history.status === 'processing'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400',
                  ]"
                >
                  {{ getStatusText(history.status) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex gap-2">
                  <button
                    v-if="history.status === 'completed'"
                    @click="downloadReport(history.id)"
                    class="text-blue-400 hover:text-blue-300"
                  >
                    <Icon icon="mdi:download" class="text-lg" />
                  </button>
                  <button
                    @click="deleteReport(history.id)"
                    class="text-red-400 hover:text-red-300"
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

    <!-- Generation Progress Modal -->
    <div
      v-if="showProgressModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-white mb-6">กำลังสร้างรายงาน</h3>

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
const progressPercent = ref(0);
const progressMessage = ref("");

const customReport = ref({
  title: "",
  format: "pdf",
  startDate: "",
  endDate: "",
  selectedFields: [],
  filters: "",
});

// Mock data
const reportTemplates = ref([
  {
    id: 1,
    title: "รายงานยอดขายรายวัน",
    description: "สรุปยอดขายตั๋วและรายได้รายวัน",
    icon: "mdi:chart-line",
    color: "bg-blue-600",
    formats: ["PDF", "Excel"],
    lastGenerated: "2024-01-15",
    estimatedSize: "2.5 MB",
  },
  {
    id: 2,
    title: "รายงานลูกค้า",
    description: "ข้อมูลลูกค้าและพฤติกรรมการซื้อ",
    icon: "mdi:account-group",
    color: "bg-green-600",
    formats: ["PDF", "CSV"],
    lastGenerated: "2024-01-14",
    estimatedSize: "1.8 MB",
  },
  {
    id: 3,
    title: "รายงานการเงิน",
    description: "สรุปรายรับ-รายจ่ายและกำไรขาดทุน",
    icon: "mdi:cash",
    color: "bg-purple-600",
    formats: ["PDF", "Excel"],
    lastGenerated: "2024-01-13",
    estimatedSize: "3.2 MB",
  },
  {
    id: 4,
    title: "รายงานการใช้งานระบบ",
    description: "สถิติการใช้งานและประสิทธิภาพระบบ",
    icon: "mdi:monitor-dashboard",
    color: "bg-orange-600",
    formats: ["PDF", "JSON"],
    lastGenerated: "2024-01-12",
    estimatedSize: "1.2 MB",
  },
  {
    id: 5,
    title: "รายงานสต็อกตั๋ว",
    description: "สถานะตั๋วคงเหลือและการจองล่วงหน้า",
    icon: "mdi:ticket",
    color: "bg-red-600",
    formats: ["PDF", "Excel", "CSV"],
    lastGenerated: "2024-01-11",
    estimatedSize: "0.8 MB",
  },
  {
    id: 6,
    title: "รายงานความปลอดภัย",
    description: "บันทึกการเข้าถึงและกิจกรรมที่ผิดปกติ",
    icon: "mdi:shield-check",
    color: "bg-yellow-600",
    formats: ["PDF", "CSV"],
    lastGenerated: "2024-01-10",
    estimatedSize: "0.5 MB",
  },
]);

const availableFields = ref([
  { id: "orders", label: "ข้อมูลคำสั่งซื้อ" },
  { id: "customers", label: "ข้อมูลลูกค้า" },
  { id: "tickets", label: "ข้อมูลตั๋ว" },
  { id: "payments", label: "ข้อมูลการชำระเงิน" },
  { id: "events", label: "ข้อมูลการแข่งขัน" },
  { id: "seats", label: "ข้อมูลที่นั่ง" },
  { id: "referrers", label: "ข้อมูลผู้แนะนำ" },
  { id: "staff", label: "ข้อมูลพนักงาน" },
  { id: "analytics", label: "ข้อมูลการวิเคราะห์" },
]);

const reportHistory = ref([
  {
    id: 1,
    name: "รายงานยอดขายเดือนมกราคม",
    format: "pdf",
    createdAt: "2024-01-15T10:30:00",
    fileSize: "2.5 MB",
    status: "completed",
  },
  {
    id: 2,
    name: "รายงานลูกค้าใหม่",
    format: "excel",
    createdAt: "2024-01-14T14:20:00",
    fileSize: "1.8 MB",
    status: "completed",
  },
  {
    id: 3,
    name: "รายงานการเงินรายสัปดาห์",
    format: "pdf",
    createdAt: "2024-01-13T09:15:00",
    fileSize: "3.2 MB",
    status: "processing",
  },
]);

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusText = (status) => {
  switch (status) {
    case "completed":
      return "เสร็จสิ้น";
    case "processing":
      return "กำลังประมวลผล";
    case "failed":
      return "ล้มเหลว";
    default:
      return status;
  }
};

const generateReport = async (report) => {
  showProgressModal.value = true;
  progressPercent.value = 0;
  progressMessage.value = "เริ่มต้นการสร้างรายงาน...";

  // Simulate report generation
  const steps = [
    "กำลังเตรียมข้อมูล...",
    "กำลังประมวลผลข้อมูล...",
    "กำลังสร้างไฟล์รายงาน...",
    "กำลังบีบอัดไฟล์...",
    "เสร็จสิ้น!",
  ];

  for (let i = 0; i < steps.length; i++) {
    progressMessage.value = steps[i];
    progressPercent.value = ((i + 1) / steps.length) * 100;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Add to history
  const newReport = {
    id: Date.now(),
    name: report.title,
    format: report.formats[0].toLowerCase(),
    createdAt: new Date().toISOString(),
    fileSize: report.estimatedSize,
    status: "completed",
  };
  reportHistory.value.unshift(newReport);

  showProgressModal.value = false;
  alert("สร้างรายงานเสร็จสิ้น!");
};

const generateCustomReport = async () => {
  if (customReport.value.selectedFields.length === 0) {
    alert("กรุณาเลือกข้อมูลที่ต้องการอย่างน้อย 1 รายการ");
    return;
  }

  await generateReport({
    title: customReport.value.title,
    formats: [customReport.value.format.toUpperCase()],
    estimatedSize: "1.5 MB",
  });

  // Reset form
  customReport.value = {
    title: "",
    format: "pdf",
    startDate: "",
    endDate: "",
    selectedFields: [],
    filters: "",
  };
};

const downloadReport = (reportId) => {
  // Simulate download
  alert("กำลังดาวน์โหลดรายงาน...");
};

const deleteReport = (reportId) => {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบรายงานนี้?")) {
    const index = reportHistory.value.findIndex((r) => r.id === reportId);
    if (index !== -1) {
      reportHistory.value.splice(index, 1);
    }
  }
};

// Set default dates
onMounted(() => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  customReport.value.endDate = today.toISOString().split("T")[0];
  customReport.value.startDate = lastMonth.toISOString().split("T")[0];
});

// SEO
useSeoMeta({
  title: "Export Reports - Admin Panel",
  description: "Generate and download various system reports",
});
</script>
