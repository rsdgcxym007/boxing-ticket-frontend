<template>
  <div
    class="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4 py-8"
  >
    <div
      class="max-w-xl w-full bg-white shadow-xl rounded-3xl p-8 text-center space-y-6 border border-gray-100"
    >
      <div class="text-green-500 text-6xl animate-bounce">🎉</div>
      <h1 class="text-3xl font-bold text-gray-800">การจองเสร็จสมบูรณ์</h1>

      <div
        class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left space-y-2 shadow-sm"
      >
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Zone:</span>
          <span class="text-blue-700 font-semibold uppercase">{{ zone }}</span>
        </p>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Seats:</span>
          <span class="text-blue-800 font-semibold">{{
            seats.join(", ")
          }}</span>
        </p>
        <p class="text-sm text-gray-700">
          <span class="font-semibold">Total:</span>
          <span class="text-green-600 font-bold"
            >{{ total.toLocaleString() }} บาท</span
          >
        </p>
      </div>

      <div class="space-y-4 mt-6">
        <!-- Generate Tickets Button -->
        <button
          @click="onGenerateTickets"
          :disabled="isGeneratingTickets"
          class="w-full bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full px-6 py-3 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="mdi mdi-ticket" v-if="!isGeneratingTickets"></i>
          <i class="mdi mdi-loading mdi-spin" v-else></i>
          {{
            isGeneratingTickets ? "กำลังสร้างตั๋ว..." : "🎫 สร้างตั๋วทั้งหมด"
          }}
        </button>
      </div>

      <router-link
        to="/"
        class="inline-block mt-8 text-sm text-blue-500 hover:underline"
      >
        ⬅️ กลับหน้าแรก
      </router-link>
    </div>

    <!-- Ticket Display Modal -->
    <TicketDisplay
      v-if="showTicketModal"
      :tickets="generatedTickets"
      @close="showTicketModal = false"
    />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import TicketDisplay from "~/components/TicketDisplay.vue";

const { cancelOrder, generateTickets } = useOrder();
const route = useRoute();

// ✅ Fallback mock data
const orderId = route.query.orderId || "12345";
const zone = route.query.zone || "BACK-RIGHT";
const seats = (route.query.seats || "A1,A2,A3").toString().split(",");
const total = parseInt(route.query.total || "5400");

// Reactive data
const isGeneratingTickets = ref(false);
const generatedTickets = ref([]);
const showTicketModal = ref(false);

// Generate tickets from order data using API
const onGenerateTickets = async () => {
  isGeneratingTickets.value = true;

  try {
    // Use the real API to generate tickets
    const tickets = await generateTickets(orderId);
    console.log("Generated tickets:", tickets);

    // แสดงตั๋วที่ออกมา
    generatedTickets.value = tickets;
    showTicketModal.value = true;

    // Show success message
    alert(`สร้างตั๋วเสร็จสิ้น! จำนวน ${tickets.length} ใบ`);
  } catch (error) {
    console.error("Failed to generate tickets:", error);

    // Fallback to mock data if API fails
    console.log("API failed, using fallback mock data");

    // Create ticket objects from order data
    const tickets = seats.map((seat, index) => ({
      orderId: orderId,
      seatNumber: seat,
      customerName: `ผู้ซื้อตั๋ว ${index + 1}`, // You can customize this
      showDate: "01/07/2025", // You can get this from order data
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
body {
  font-family: "Prompt", sans-serif;
}
</style>
