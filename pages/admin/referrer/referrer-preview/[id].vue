<template>
  <div class="min-h-screen bg-[#0a1323] text-white">
    <!-- Header with back button -->
    <div
      class="sticky top-0 bg-[#0a1323] border-b border-gray-700 px-4 py-4 z-10"
    >
      <div class="flex items-center justify-between max-w-6xl mx-auto">
        <button
          @click="$router.back()"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300"
        >
          <i class="mdi mdi-arrow-left text-lg"></i>
          ย้อนกลับ
        </button>

        <h1 class="text-lg sm:text-xl font-bold text-center flex-1 mx-4">
          ดูตัวอย่าง PDF รายงานผู้แนะนำ
        </h1>

        <!-- Download button -->
        <button
          v-if="pdfUrl && !isLoading"
          @click="downloadPdf"
          class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300"
        >
          <i class="mdi mdi-download text-lg"></i>
          <span class="hidden sm:inline">ดาวน์โหลด</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col items-center justify-start px-4 py-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"
        ></div>
        <p class="text-gray-300">กำลังโหลด PDF...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <i class="mdi mdi-alert-circle text-red-400 text-4xl mb-4"></i>
        <p class="text-red-400 mb-4">{{ error }}</p>
        <button
          @click="retryFetch"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          ลองใหม่
        </button>
      </div>

      <!-- PDF Viewer -->
      <div v-else-if="pdfUrl" class="w-full max-w-6xl">
        <!-- Desktop PDF Viewer -->
        <div
          v-if="!isMobile"
          class="rounded-xl overflow-hidden shadow-xl border border-gray-700"
        >
          <iframe
            :src="pdfUrl + '#toolbar=1&navpanes=0&scrollbar=1'"
            class="w-full h-[85vh]"
            frameborder="0"
            title="PDF Preview"
          ></iframe>
        </div>

        <!-- Mobile/Tablet PDF Viewer -->
        <div v-else class="space-y-4">
          <!-- PDF.js viewer for better mobile support -->
          <div class="bg-gray-800 rounded-xl p-6 text-center">
            <i class="mdi mdi-file-pdf-box text-red-400 text-6xl mb-4"></i>
            <h3 class="text-lg font-semibold mb-2">รายงานผู้แนะนำ PDF</h3>
            <p class="text-gray-300 mb-4 text-sm">
              คลิกปุ่มด้านล่างเพื่อเปิดไฟล์ PDF ในแอปพลิเคชันที่รองรับ
            </p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                :href="pdfUrl"
                target="_blank"
                class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <i class="mdi mdi-open-in-new"></i>
                เปิดในแท็บใหม่
              </a>

              <button
                @click="downloadPdf"
                class="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <i class="mdi mdi-download"></i>
                ดาวน์โหลด
              </button>
            </div>
          </div>

          <!-- Alternative: Inline PDF preview for modern mobile browsers -->
          <div
            class="rounded-xl overflow-hidden shadow-xl border border-gray-700 bg-white"
          >
            <object
              :data="pdfUrl"
              type="application/pdf"
              class="w-full h-[70vh]"
            >
              <div class="bg-gray-100 p-8 text-center text-gray-600">
                <i class="mdi mdi-file-pdf-box text-4xl mb-2"></i>
                <p>ไม่สามารถแสดง PDF ได้ในเบราว์เซอร์นี้</p>
              </div>
            </object>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// เพิ่ม middleware
definePageMeta({
  middleware: ["only-admin-staff"],
});

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { useReferrer } from "../../../../composables/useReferrer";
import { useReferrerStore } from "../../../../stores/referrerStore";

// เรียกใช้งาน composable และ store
const { getReferrerPdfForPreview, postReferrerOrdersPdfForPreview } =
  useReferrer();
const referrerStore = useReferrerStore();
const router = useRouter();

// ดึง referrer ID จาก route
const route = useRoute();
const referrerId = computed(() =>
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
);

// ตรวจสอบข้อมูลจาก store
const previewData = computed(() => referrerStore.previewData);

// State management
const pdfUrl = ref<string>("");
const isLoading = ref<boolean>(false);
const error = ref<string>("");
const pdfCache = ref<Map<string, { url: string; blob: Blob }>>(new Map());

// ตรวจว่าอุปกรณ์เป็นมือถือหรือแท็บเล็ต
const isMobile = computed(() => {
  // ใช้ computed เพื่อให้ reactive และรองรับ SSR
  if (typeof window !== "undefined") {
    return (
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768
    );
  }
  return false;
});

// สร้าง cache key
const getCacheKey = () => {
  if (!previewData.value) return `${referrerId.value}-default`;
  const { startDate, endDate } = previewData.value.filters;
  return `${referrerId.value}-${startDate}-${endDate}`;
};

// ตรวจสอบข้อมูลและ redirect ถ้าจำเป็น
const validatePreviewData = () => {
  if (!previewData.value || !referrerStore.isDataValid()) {
    alert("ข้อมูลหมดอายุหรือไม่พบข้อมูล กรุณาค้นหาใหม่");
    router.back();
    return false;
  }

  if (previewData.value.referrerId !== referrerId.value) {
    alert("ข้อมูลไม่ตรงกับผู้แนะนำที่เลือก");
    router.back();
    return false;
  }

  return true;
};

// ดึง URL จาก composable แล้วเซ็ตค่าลงใน pdfUrl
const fetchPdf = async () => {
  if (!validatePreviewData()) return;

  const cacheKey = getCacheKey();

  // เช็ค cache ก่อน
  if (pdfCache.value.has(cacheKey)) {
    const cached = pdfCache.value.get(cacheKey)!;
    pdfUrl.value = cached.url;
    console.log("📋 ใช้ PDF จาก cache");
    return;
  }

  try {
    isLoading.value = true;
    error.value = "";

    console.log("📥 กำลังโหลด PDF สำหรับ referrer:", referrerId.value);

    // ใช้ข้อมูลจาก store
    const orderIds = previewData.value!.orders.map((order) => order.id);
    const result = await postReferrerOrdersPdfForPreview(orderIds);

    pdfUrl.value = result.url;

    // เก็บใน cache
    pdfCache.value.set(cacheKey, {
      url: result.url,
      blob: result.blob,
    });

    console.log("✅ โหลด PDF สำเร็จ");
  } catch (err: any) {
    console.error("❌ ไม่สามารถโหลด PDF ได้:", err);
    error.value = err.message || "ไม่สามารถโหลด PDF ได้ กรุณาลองใหม่อีกครั้ง";
  } finally {
    isLoading.value = false;
  }
};

// ฟังก์ชันดาวน์โหลด PDF
const downloadPdf = () => {
  const cacheKey = getCacheKey();
  const cached = pdfCache.value.get(cacheKey);

  // สร้างชื่อไฟล์จากข้อมูลใน store หรือใช้ default
  const fileName = previewData.value
    ? `referrer-report-${previewData.value.filters.startDate}_to_${previewData.value.filters.endDate}.pdf`
    : `referrer-report-${referrerId.value}.pdf`;

  if (cached?.blob) {
    const url = URL.createObjectURL(cached.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else if (pdfUrl.value) {
    // Fallback - ใช้ blob URL ที่มีอยู่
    const link = document.createElement("a");
    link.href = pdfUrl.value;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// ฟังก์ชันลองใหม่
const retryFetch = () => {
  // ล้าง cache สำหรับ key นี้ และล้าง blob URL
  const cacheKey = getCacheKey();
  const cached = pdfCache.value.get(cacheKey);
  if (cached?.url) {
    URL.revokeObjectURL(cached.url); // ล้าง blob URL เพื่อป้องกัน memory leak
  }
  pdfCache.value.delete(cacheKey);
  fetchPdf();
};

// Cleanup function เมื่อ component ถูก unmount
const cleanup = () => {
  // ล้าง blob URLs ทั้งหมดเพื่อป้องกัน memory leak
  pdfCache.value.forEach((cached) => {
    if (cached.url) {
      URL.revokeObjectURL(cached.url);
    }
  });
  pdfCache.value.clear();
};

// โหลดเมื่อหน้าเปิด (เช็ค cache ก่อน)
onMounted(() => {
  fetchPdf();
});

// Cleanup เมื่อ component unmount
onBeforeUnmount(() => {
  cleanup();
  // ล้างข้อมูล store เมื่อออกจากหน้า
  referrerStore.clearPreviewData();
});
</script>
