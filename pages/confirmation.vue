<template>
  <div
    class="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4 py-8"
  >
    <BaseCard
      class="max-w-xl w-full bg-white shadow-xl rounded-3xl p-8 text-center space-y-6 border border-gray-100"
    >
      <!-- ไอคอนการเสร็จสิ้น -->
      <div class="text-green-500 text-6xl animate-bounce">🎉</div>

      <!-- หัวข้อหลัก -->
      <h1 class="text-3xl font-bold text-gray-800">การจองเสร็จสมบูรณ์</h1>

      <!-- ข้อมูลการจอง -->
      <BaseCard class="bg-gray-50 border border-gray-200 text-left space-y-2">
        <template #header>
          <h2 class="text-lg font-semibold text-gray-800">รายละเอียดการจอง</h2>
        </template>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-700 font-medium">รหัสออเดอร์:</span>
            <span class="text-sm text-blue-700 font-semibold">{{
              orderId
            }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-sm text-gray-700 font-medium">โซน:</span>
            <span class="text-sm text-blue-700 font-semibold uppercase">{{
              zone
            }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-sm text-gray-700 font-medium">ที่นั่ง:</span>
            <span class="text-sm text-blue-800 font-semibold">{{
              seats.join(", ")
            }}</span>
          </div>

          <div class="flex justify-between border-t pt-2">
            <span class="text-sm text-gray-700 font-medium">ราคารวม:</span>
            <span class="text-sm text-green-600 font-bold"
              >{{ total.toLocaleString() }} บาท</span
            >
          </div>
        </div>
      </BaseCard>

      <!-- ปุ่มสร้างตั๋ว -->
      <div class="space-y-4 mt-6">
        <BaseButton
          @click="onGenerateTickets"
          :disabled="isGeneratingTickets"
          :loading="isGeneratingTickets"
          variant="success"
          size="large"
          class="w-full"
        >
          <template #icon>
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </template>
          {{
            isGeneratingTickets ? "กำลังสร้างตั๋ว..." : "🎫 สร้างตั๋วทั้งหมด"
          }}
        </BaseButton>
      </div>

      <!-- ปุ่มกลับหน้าแรก -->
      <router-link
        to="/"
        class="inline-block mt-8 text-sm text-blue-500 hover:underline hover:text-blue-700 transition-colors"
      >
        ⬅️ กลับหน้าแรก
      </router-link>
    </BaseCard>

    <!-- Modal สำหรับแสดงตั๋ว -->
    <TicketDisplay
      v-if="showTicketModal"
      :tickets="generatedTickets"
      @close="showTicketModal = false"
      @download-thermal="handleDownloadThermal"
    />
    <div v-if="showTicketModal" class="flex justify-center mt-6">
      <button
        @click="handleDownloadThermal(generatedTickets[0]?.orderId)"
        class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-colors"
        :disabled="isDownloadingThermal || !generatedTickets[0]?.orderId"
      >
        <i class="mdi mdi-file-pdf-box"></i>
        <span v-if="isDownloadingThermal">กำลังโหลด...</span>
        <span v-else>แสดง Thermal Receipt PDF</span>
      </button>
    </div>

    <!-- Modal สำหรับแสดง Thermal Receipt PDF -->
    <div
      v-if="showThermalModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div
        class="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-4 relative flex flex-col items-center"
      >
        <button
          @click="closeThermalModal"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold mb-4 text-center">
          Thermal Receipt PDF Preview
        </h3>
        <div
          v-if="thermalPdfError"
          class="text-red-600 text-center font-bold mb-4"
        >
          ไม่สามารถแสดงไฟล์ PDF ได้ หรือไฟล์ว่าง/ผิดรูปแบบ
        </div>
        <iframe
          v-if="!thermalPdfError"
          :src="thermalPdfUrl"
          width="100%"
          height="600px"
          style="border: none"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
// นำเข้า utilities และ composables ที่จำเป็น
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useOrder } from "~/composables/useOrder";
const { cancelOrder, generateTickets, downloadThermalReceipt } = useOrder();
import TicketDisplay from "~/components/TicketDisplay.vue";

// ตั้งค่า metadata สำหรับหน้า
definePageMeta({
  layout: "default",
  title: "ยืนยันการจอง",
});

// ใช้ composables
const route = useRoute();

// ดึงข้อมูลจาก URL parameters หรือใช้ค่าเริ่มต้น
const orderId = route.query.orderId || "";
const zone = route.query.zone || "";
const seats = (route.query.seats || "").toString().split(",");
const total = parseInt(route.query.total || "0");

// ตัวแปร reactive สำหรับจัดการสถานะ
const isGeneratingTickets = ref(false);
const generatedTickets = ref([]);
const showTicketModal = ref(false);
const isDownloadingThermal = ref(false);
const showThermalModal = ref(false);
const thermalPdfUrl = ref("");
const thermalPdfError = ref(false);
// ฟังก์ชันสำหรับดาวน์โหลด thermal receipt จาก TicketDisplay
const handleDownloadThermal = async (orderId) => {
  isDownloadingThermal.value = true;
  thermalPdfError.value = false;
  try {
    const blob = await downloadThermalReceipt(orderId);
    console.log("Thermal PDF blob:", blob);
    console.log("orderId:", orderId);
    if (!blob || blob.size < 1000) {
      thermalPdfError.value = true;
      thermalPdfUrl.value = "";
      showThermalModal.value = true;
      return;
    }
    const url = window.URL.createObjectURL(blob);
    thermalPdfUrl.value = url;
    showThermalModal.value = true;
  } catch (err) {
    thermalPdfError.value = true;
    thermalPdfUrl.value = "";
    showThermalModal.value = true;
  } finally {
    isDownloadingThermal.value = false;
  }
};

const closeThermalModal = () => {
  showThermalModal.value = false;
  thermalPdfError.value = false;
  if (thermalPdfUrl.value) {
    window.URL.revokeObjectURL(thermalPdfUrl.value);
    thermalPdfUrl.value = "";
  }
};

/**
 * ฟังก์ชันสำหรับสร้างตั๋วจาก API
 * เมื่อไม่สามารถเรียก API ได้จะใช้ข้อมูลตัวอย่าง
 */
const onGenerateTickets = async () => {
  isGeneratingTickets.value = true;

  try {
    // เรียก API สำหรับสร้างตั๋วจริง
    const tickets = await generateTickets(orderId);
    generatedTickets.value = tickets.tickets.map((ticket) => ({
      orderId: ticket.orderId,
      seatNumber: ticket.seatNumber,
      customerName: ticket.customerName || "ผู้ซื้อตั๋ว",
      showDate: ticket.showDate || "01/07/2025",
      type: ticket.type || (zone.includes("STANDING") ? "STANDING" : "SEAT"),
      zone: ticket.zone.name,
    }));
    showTicketModal.value = true;
  } catch (error) {
    console.error("ไม่สามารถสร้างตั๋วได้:", error);
    const tickets = seats.map((seat, index) => ({
      orderId: orderId,
      seatNumber: seat,
      customerName: `ผู้ซื้อตั๋ว ${index + 1}`, // สามารถปรับแต่งได้
      showDate: "01/07/2025", // สามารถดึงจากข้อมูลการจองได้
      type: zone.includes("STANDING") ? "STANDING" : "SEAT",
      zone: zone,
    }));

    generatedTickets.value = tickets;
    showTicketModal.value = true;

    alert(`สร้างตั๋วเสร็จสิ้น! จำนวน ${tickets.length} ใบ (ใช้ข้อมูลตัวอย่าง)`);
  } finally {
    isGeneratingTickets.value = false;
  }
};
</script>

<style scoped>
/* ใช้ฟอนต์ Prompt สำหรับการแสดงผล */
body {
  font-family: "Prompt", sans-serif;
}

/* Animation สำหรับเอฟเฟค hover */
.hover\\:scale-105:hover {
  transform: scale(1.05);
}

/* การเปลี่ยนแปลงที่นุ่มนวล */
.transition-colors {
  transition: color 0.2s ease;
}
</style>
