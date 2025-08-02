<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 relative overflow-hidden"
  >
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden will-change-transform">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"
        style="animation-delay: 0s"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"
        style="animation-delay: 2s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float"
        style="animation-delay: 4s"
      ></div>
    </div>

    <div class="relative z-10 max-w-2xl w-full animate-fade-scale">
      <!-- Success Animation Container -->
      <div class="text-center mb-8 animate-slide-up">
        <div class="relative inline-block animate-float">
          <div
            class="relative bg-blue-600 text-white text-7xl w-24 h-24 rounded-full flex items-center justify-center shadow-xl animate-glow border-4 border-white"
          >
            <svg
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-blue-900 mt-6 mb-2 animate-slide-up">
          การจองเสร็จสมบูรณ์
        </h1>
        <p
          class="text-gray-700 text-base animate-slide-up"
          style="animation-delay: 0.1s"
        >
          ขอบคุณที่ใช้บริการของเรา
        </p>
      </div>

      <!-- Main Card -->
      <div
        class="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 overflow-hidden hover-lift animate-slide-up"
        style="animation-delay: 0.2s"
      >
        <!-- Header with gradient -->
        <div class="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-5">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="4" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 10h8M8 14h5"
              />
            </svg>
            รายละเอียดการจอง
          </h2>
        </div>

        <!-- Content -->
        <div class="p-8 space-y-5 bg-gray-50">
          <div class="grid gap-3">
            <div
              class="flex justify-between items-center p-3 rounded-xl border border-blue-100 bg-white"
            >
              <span class="text-black font-medium">รหัสออเดอร์:</span>
              <span
                class="text-blue-700 font-semibold text-base bg-blue-50 px-3 py-1 rounded"
                >{{ orderId }}</span
              >
            </div>
            <div
              class="flex justify-between items-center p-3 rounded-xl border border-blue-100 bg-white"
            >
              <span class="text-black font-medium">โซน:</span>
              <span
                class="text-blue-700 font-semibold text-base uppercase bg-blue-50 px-3 py-1 rounded"
                >{{ zone }}</span
              >
            </div>
            <div
              class="flex justify-between items-center p-3 rounded-xl border border-blue-100 bg-white"
            >
              <span class="text-black font-medium">ที่นั่ง:</span>
              <span
                class="text-blue-700 font-semibold text-base bg-blue-50 px-3 py-1 rounded"
                >{{ seats.join(", ") }}</span
              >
            </div>
            <div
              class="flex justify-between items-center p-3 rounded-xl border border-blue-100 bg-white"
            >
              <span class="text-black font-medium">ราคารวม:</span>
              <span
                class="text-green-700 font-bold text-lg bg-green-50 px-4 py-2 rounded"
                >{{ total.toLocaleString() }} บาท</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="mt-8 space-y-4 animate-slide-up"
        style="animation-delay: 0.7s"
      >
        <div
          class="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover-lift"
        >
          <button
            @click="onGenerateTickets"
            :disabled="isGeneratingTickets"
            class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ripple"
          >
            <!-- Background Animation -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <!-- Shine effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            ></div>

            <!-- Content -->
            <div class="relative z-10 flex items-center gap-3">
              <div
                v-if="isGeneratingTickets"
                class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              <svg
                v-else
                class="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
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
              <span class="text-lg">
                {{
                  isGeneratingTickets
                    ? "กำลังสร้างตั๋ว..."
                    : "🎫 สร้างตั๋วทั้งหมด"
                }}
              </span>
            </div>
          </button>
        </div>

        <!-- Back to Home Link -->
        <div class="text-center animate-slide-up" style="animation-delay: 0.8s">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-6 py-3 bg-white/60 hover:bg-white/80 backdrop-blur-sm text-gray-700 hover:text-blue-600 font-medium rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 group"
          >
            <svg
              class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span
              class="group-hover:translate-x-0.5 transition-transform duration-300"
              >กลับหน้าแรก</span
            >
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal สำหรับแสดงตั๋ว -->
    <!--
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
    -->

    <!-- Enhanced Thermal Receipt Modal -->
    <div
      v-if="showThermalModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-scale"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-pulse"
        @click="closeThermalModal"
      ></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full border border-white/20 overflow-hidden hover-lift animate-slide-up"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center animate-pulse"
            >
              📄
            </div>
            <h3 class="text-xl font-bold text-white">
              Thermal Receipt PDF Preview
            </h3>
          </div>
          <button
            @click="closeThermalModal"
            class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white hover:text-gray-200 transition-all duration-200 hover:rotate-90 hover:scale-110"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div
            v-if="thermalPdfError"
            class="text-center py-12 animate-fade-scale"
          >
            <div class="text-6xl mb-4 animate-bounce">⚠️</div>
            <h4 class="text-xl font-bold text-red-600 mb-2">เกิดข้อผิดพลาด</h4>
            <p class="text-gray-600">
              ไม่สามารถแสดงไฟล์ PDF ได้ หรือไฟล์ว่าง/ผิดรูปแบบ
            </p>
          </div>

          <div
            v-else
            class="bg-gray-50 rounded-2xl p-4 border border-gray-200 animate-fade-scale"
          >
            <iframe
              :src="thermalPdfUrl"
              width="100%"
              height="600px"
              style="border: none; border-radius: 12px"
              ref="thermalIframe"
              @load="onThermalIframeLoad"
              class="shadow-inner hover:shadow-lg transition-shadow duration-300"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// นำเข้า utilities และ composables ที่จำเป็น
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useOrder } from "~/composables/useOrder";
import { useElectron } from "~/composables/useElectron";

const { cancelOrder, generateTickets, downloadThermalReceipt } = useOrder();
const { printThermal } = useElectron();
// import TicketDisplay from "~/components/TicketDisplay.vue";

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
// const showTicketModal = ref(false);
const isDownloadingThermal = ref(false);
const showThermalModal = ref(false);
const thermalPdfUrl = ref("");
const thermalPdfError = ref(false);
// ฟังก์ชันสำหรับดาวน์โหลด thermal receipt จาก TicketDisplay
const thermalIframe = ref(null);

// ฟังก์ชัน auto print thermal receipt PDF เมื่อ iframe โหลดเสร็จ (Electron เท่านั้น)
const onThermalIframeLoad = async () => {
  try {
    await printThermal();
  } catch (error) {
    console.error("Error calling printThermal:", error);
  }
};
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
    // เปิด preview thermal receipt PDF อัตโนมัติหลังสร้างตั๋ว
    if (generatedTickets.value.length > 0) {
      await handleDownloadThermal(generatedTickets.value[0].orderId);
    }
  } catch (error) {
    console.error("ไม่สามารถสร้างตั๋วได้:", error);
    const tickets = seats.map((seat, index) => ({
      orderId: orderId,
      seatNumber: seat,
      customerName: `ผู้ซื้อตั๋ว ${index + 1}`,
      showDate: "01/07/2025",
      type: zone.includes("STANDING") ? "STANDING" : "SEAT",
      zone: zone,
    }));
    generatedTickets.value = tickets;
    // alert(`สร้างตั๋วเสร็จสิ้น! จำนวน ${tickets.length} ใบ (ใช้ข้อมูลตัวอย่าง)`);
    if (generatedTickets.value.length > 0) {
      await handleDownloadThermal(generatedTickets.value[0].orderId);
    }
  } finally {
    isGeneratingTickets.value = false;
  }
};

// เรียก onGenerateTickets อัตโนมัติเมื่อหน้าเว็บโหลดเสร็จ
onMounted(() => {
  onGenerateTickets();
});
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Apply animations */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.animate-slide-up {
  animation: slideInUp 0.6s ease-out;
}

.animate-fade-scale {
  animation: fadeInScale 0.5s ease-out;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Custom gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Hover effects */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar for iframe */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Ripple effect for buttons */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple:active::before {
  width: 300px;
  height: 300px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .max-w-2xl {
    max-width: 95%;
  }

  .text-4xl {
    font-size: 2.5rem;
  }

  .text-8xl {
    font-size: 4rem;
  }

  .w-28.h-28 {
    width: 5rem;
    height: 5rem;
  }

  .px-8 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-6 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .gap-4 {
    gap: 0.75rem;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .px-4.py-2 {
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .text-4xl {
    font-size: 2rem;
  }

  .text-8xl {
    font-size: 3rem;
  }

  .w-28.h-28 {
    width: 4rem;
    height: 4rem;
  }

  .p-8 {
    padding: 1rem;
  }

  .gap-3 {
    gap: 0.5rem;
  }

  .text-lg {
    font-size: 1rem;
  }

  .py-4.px-8 {
    padding: 0.75rem 1rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .backdrop-blur-xl {
    background: rgba(30, 41, 59, 0.8);
  }

  .bg-white\/80 {
    background: rgba(30, 41, 59, 0.9);
  }

  .text-gray-800 {
    color: rgb(226, 232, 240);
  }

  .text-gray-700 {
    color: rgb(203, 213, 225);
  }

  .text-gray-600 {
    color: rgb(148, 163, 184);
  }

  .border-white\/20 {
    border-color: rgba(148, 163, 184, 0.2);
  }
}

/* Performance optimizations */
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .backdrop-blur-xl {
    backdrop-filter: none;
    background: white;
  }

  .border-white\/20 {
    border-color: black;
    border-width: 2px;
  }

  .shadow-2xl {
    box-shadow: 0 0 0 4px black;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-bounce,
  .animate-pulse,
  .animate-spin,
  .animate-fade-scale,
  .animate-slide-up,
  .animate-float,
  .animate-glow {
    animation: none;
  }

  .transition-all,
  .transition-transform,
  .transition-opacity,
  .transition-colors,
  .transition-shadow {
    transition: none;
  }

  .hover\:scale-\[1\.02\]:hover,
  .hover\:scale-105:hover,
  .active\:scale-\[0\.98\]:active {
    transform: none;
  }
}
</style>
