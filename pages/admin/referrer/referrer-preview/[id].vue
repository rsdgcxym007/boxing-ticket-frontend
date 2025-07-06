<template>
  <button
    @click="$router.back()"
    class="inline-flex items-center ml-5 gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 mt-6 sm:mt-0"
  >
    <i class="mdi mdi-arrow-left text-lg"></i>
    ย้อนกลับ
  </button>
  <div
    class="min-h-screen bg-[#0a1323] text-white flex flex-col items-center justify-start px-4 py-10"
  >
    <h1 class="text-xl sm:text-2xl font-bold mb-6 text-center">
      ดูตัวอย่าง PDF รายงานผู้แนะนำ
    </h1>

    <div
      class="w-full max-w-6xl rounded-xl overflow-hidden shadow-xl border border-gray-700"
    >
      <!-- ✅ สำหรับ Desktop -->
      <object
        v-if="!isMobile && pdfUrl"
        :data="pdfUrl"
        type="application/pdf"
        class="w-full h-[80vh]"
      >
        <div class="text-center text-sm text-gray-300 p-4">
          ไม่สามารถแสดง PDF ได้ในอุปกรณ์นี้
          <a
            :href="pdfUrl"
            target="_blank"
            class="underline text-blue-400 ml-1"
          >
            คลิกเพื่อเปิดไฟล์
          </a>
        </div>
      </object>

      <!-- ✅ สำหรับมือถือ -->
      <div v-else class="text-center text-sm text-gray-300 p-4">
        ไม่สามารถแสดง PDF ได้ในอุปกรณ์นี้
        <a :href="pdfUrl" target="_blank" class="underline text-blue-400 ml-1">
          คลิกเพื่อเปิดไฟล์
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useReferrer } from "../../../../composables/useReferrer";

// เรียกใช้งาน composable
const { exportReferrerReport } = useReferrer();

// ดึง referrer ID จาก route
const route = useRoute();
const referrerId = computed(() =>
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
);

// วันที่เริ่มต้น-สิ้นสุด เป็นวันนี้
const startDate = dayjs().format("YYYY-MM-DD");
const endDate = dayjs().format("YYYY-MM-DD");

// เก็บ URL ไว้ใน ref เพื่อใช้ใน template
const pdfUrl = ref<string>("");

// ดึง URL จาก composable แล้วเซ็ตค่าลงใน pdfUrl
const fetchPdf = async () => {
  try {
    const result = await exportReferrerReport(referrerId.value, {
      startDate,
      endDate,
    });
    pdfUrl.value = result.url;
  } catch (error) {
    console.error("ไม่สามารถโหลด PDF ได้:", error);
  }
};

// โหลดเมื่อหน้าเปิด
onMounted(() => {
  fetchPdf();
});

// ตรวจว่าอุปกรณ์เป็นมือถือหรือแท็บเล็ต
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
</script>
