<template>
  <div class="min-h-screen bg-[#0f1f3c] text-white">
    <div class="p-6 w-full mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <i class="mdi mdi-arrow-left"></i>
            ย้อนกลับ
          </button>
          <h1 class="text-2xl font-bold text-white">
            ตัวอย่าง PDF รายงานออเดอร์
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="downloadPDF"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <i class="mdi mdi-download"></i>
            ดาวน์โหลด PDF
          </button>
          <button
            @click="generatePDF"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <i class="mdi mdi-refresh"></i>
            สร้างใหม่
          </button>
        </div>
      </div>

      <!-- Filter Summary -->
      <BaseCard
        class="mb-6 bg-gradient-to-r from-[#0f1f3c] to-[#1a2b4d] border-[#3a6ea5]"
      >
        <template #header>
          <h2 class="text-lg font-semibold text-white">
            เงื่อนไขการกรองข้อมูล
          </h2>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div v-if="filters.status">
            <span class="text-gray-300">สถานะ:</span>
            <span class="text-white font-medium ml-2">{{
              getStatusLabel(filters.status)
            }}</span>
          </div>
          <div v-if="filters.paymentMethod">
            <span class="text-gray-300">วิธีชำระเงิน:</span>
            <span class="text-white font-medium ml-2">{{
              getPaymentMethodLabel(filters.paymentMethod)
            }}</span>
          </div>
          <div v-if="filters.purchaseType">
            <span class="text-gray-300">ประเภทการซื้อ:</span>
            <span class="text-white font-medium ml-2">{{
              getPurchaseTypeLabel(filters.purchaseType)
            }}</span>
          </div>
          <div v-if="filters.attendanceStatus">
            <span class="text-gray-300">สถานะการเข้าร่วม:</span>
            <span class="text-white font-medium ml-2">{{
              getAttendanceStatusLabel(filters.attendanceStatus)
            }}</span>
          </div>
          <div v-if="filters.showDate">
            <span class="text-gray-300">วันที่แสดง:</span>
            <span class="text-white font-medium ml-2">{{
              filters.showDate
            }}</span>
          </div>
          <div v-if="filters.search">
            <span class="text-gray-300">ค้นหา:</span>
            <span class="text-white font-medium ml-2">{{
              filters.search
            }}</span>
          </div>
        </div>
      </BaseCard>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <BaseSpinner size="large" />
        <p class="ml-4 text-gray-300">กำลังสร้าง PDF...</p>
      </div>

      <!-- PDF Preview -->
      <div
        v-else-if="pdfUrl"
        class="bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div class="bg-gray-100 px-4 py-3 border-b">
          <h3 class="text-lg font-semibold text-gray-800">ตัวอย่าง PDF</h3>
        </div>
        <div class="p-4">
          <iframe
            :src="pdfUrl"
            width="100%"
            height="800px"
            style="border: none; min-height: 800px"
            class="rounded border shadow-sm"
          ></iframe>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-400 mb-4">
          <i class="mdi mdi-alert-circle text-4xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">เกิดข้อผิดพลาด</h3>
        <p class="text-gray-300 mb-4">{{ error }}</p>
        <button
          @click="generatePDF"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          ลองอีกครั้ง
        </button>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <i class="mdi mdi-file-pdf-box text-6xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">พร้อมสร้าง PDF</h3>
        <p class="text-gray-300 mb-4">
          คลิกปุ่ม "สร้างใหม่" เพื่อสร้างรายงาน PDF
        </p>
        <button
          @click="generatePDF"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
        >
          สร้าง PDF รายงาน
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrder } from "~/composables/useOrder";
import { useSingleToast } from "~/composables/useSingleToast";
import {
  orderStatusOptions,
  paymentMethodOptions,
  purchaseTypeOptions,
  attendanceStatusOptions,
} from "~/utils/orderOptions";
import BaseSpinner from "~/components/base/BaseSpinner.vue";
import BaseCard from "~/components/base/BaseCard.vue";

// Meta and layout
definePageMeta({
  layout: "default",
  middleware: "only-admin-staff",
  title: "ส่งออก PDF รายงานออเดอร์",
});

// Composables
const route = useRoute();
const router = useRouter();
const { showToast } = useSingleToast();

// Reactive state
const loading = ref(false);
const pdfUrl = ref("");
const error = ref("");

// Get filters from query params
const filters = computed(() => ({
  status: route.query.status || null,
  search: route.query.search || null,
  createdBy: route.query.createdBy || null,
  showDate: route.query.showDate || null,
  paymentMethod: route.query.paymentMethod || null,
  purchaseType: route.query.purchaseType || null,
  attendanceStatus: route.query.attendanceStatus || null,
}));

// Helper functions for labels
const getStatusLabel = (value) => {
  return orderStatusOptions.find((s) => s.value === value)?.label || value;
};

const getPaymentMethodLabel = (value) => {
  return paymentMethodOptions.find((s) => s.value === value)?.label || value;
};

const getPurchaseTypeLabel = (value) => {
  return purchaseTypeOptions.find((s) => s.value === value)?.label || value;
};

const getAttendanceStatusLabel = (value) => {
  return attendanceStatusOptions.find((s) => s.value === value)?.label || value;
};

// Methods
const goBack = () => {
  router.back();
};

const generatePDF = async () => {
  try {
    loading.value = true;
    error.value = "";
    const { getExportPdfOrder } = useOrder();
    // ส่ง filters ไปยัง API
    const query = { ...filters.value };
    Object.keys(query).forEach(
      (key) => query[key] === null && delete query[key]
    );
    const result = await getExportPdfOrder(query);
    if (!result || !result.success || !result.url) {
      error.value = "ไม่สามารถสร้าง PDF ได้ กรุณาลองอีกครั้ง";
      showToast("error", "เกิดข้อผิดพลาดในการสร้าง PDF");
      loading.value = false;
      return;
    }
    pdfUrl.value = result.url;
    showToast("success", "สร้าง PDF สำเร็จ");
  } catch (err) {
    error.value = "ไม่สามารถสร้าง PDF ได้ กรุณาลองอีกครั้ง";
    showToast("error", "เกิดข้อผิดพลาดในการสร้าง PDF");
  } finally {
    loading.value = false;
  }
};

const downloadPDF = () => {
  if (!pdfUrl.value) {
    showToast("warning", "กรุณาสร้าง PDF ก่อน");
    return;
  }

  // Create download link
  const link = document.createElement("a");
  link.href = pdfUrl.value;
  link.download = `orders-report-${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("success", "ดาวน์โหลด PDF สำเร็จ");
};

// Cleanup
onUnmounted(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
  }
});

// Auto-generate PDF on mount if filters are present
onMounted(() => {
  const hasFilters = Object.values(filters.value).some(
    (value) => value !== null
  );
  if (hasFilters) {
    generatePDF();
  }
});
</script>

<style scoped>
/* PDF viewer specific styles */
iframe {
  background: white;
}

.BaseCard {
  background: linear-gradient(135deg, #0f1f3c, #1a2b4d);
  border: 1px solid #2a4a6e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
</style>
