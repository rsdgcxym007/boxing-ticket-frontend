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

      <div class="grid gap-3 mt-4">
        <button
          v-for="seat in seats"
          :key="seat"
          @click="generatePDF(seat)"
          class="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full px-5 py-2 font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          🎫 ดาวน์โหลดตั๋ว: ที่นั่ง {{ seat }}
        </button>
      </div>

      <router-link
        to="/"
        class="inline-block mt-8 text-sm text-blue-500 hover:underline"
      >
        ⬅️ กลับหน้าแรก
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import jsPDF from "jspdf";

const route = useRoute();

// ✅ Fallback mock data
const zone = route.query.zone || "BACK-RIGHT";
const seats = (route.query.seats || "A1,A2,A3").toString().split(",");
const total = parseInt(route.query.total || "5400");

function generatePDF() {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a5", // A5 ขนาด 210 x 148 mm
  });

  // 🟥 Background ซ้าย
  doc.setFillColor(155, 0, 0);
  doc.rect(0, 0, 148, 148, "F");

  // ⬛️ Background ขวา
  doc.setFillColor(17, 17, 17);
  doc.rect(148, 0, 62, 148, "F");

  // 🖼 โลโก้
  const logo = new Image();
  logo.src = "/images/logo/logonew.png"; // ✅ ปรับ path ตามที่อยู่จริง
  logo.onload = () => {
    doc.addImage(logo, "PNG", 10, 10, 30, 30);

    // 🏷 TITLE
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("SAINAMYEN", 45, 20);
    doc.text("BOXING STADIUM", 45, 30);

    // 📅 รายละเอียด
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Date:", 10, 60);
    doc.text("Zone:", 10, 70);
    doc.text("Seat:", 10, 80);
    doc.text("Price:", 10, 90);

    doc.setFont("helvetica", "bold");
    doc.text("30 June 2025", 35, 60);
    doc.text("BACK-RIGHT", 35, 70);
    doc.text("417", 35, 80);
    doc.text("1,800 Baht", 35, 90);

    // 🟢 ปุ่มแนวนอน
    drawPill(doc, "ENTRANCE", 10, 110);
    drawPill(doc, "ZONE", 50, 110);
    drawPill(doc, "SEAT", 90, 110);

    // 🔴 ปุ่มขวาแนวตั้ง
    drawRedPill(doc, "ENTRANCE", 155, 20);
    drawRedPill(doc, "ZONE: BACK-RIGHT", 155, 35);
    drawRedPill(doc, "SEAT: 417", 155, 50);

    // 🟨 QR CODE
    const qr = new Image();
    qr.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=SAINAMYEN-417";
    qr.onload = () => {
      doc.addImage(qr, "PNG", 160, 70, 40, 40);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(160);
      doc.setFont("helvetica", "normal");
      doc.text("Issued by: www.your-website.com", 155, 120);

      // ✅ Save PDF
      doc.save("sainamyen-ticket-417.pdf");
    };
  };
}
function drawPill(doc, text, x, y) {
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, 35, 10, 5, 5, "F");
  doc.setTextColor(215, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(text, x + 17.5, y + 7, { align: "center" });
}

function drawRedPill(doc, text, x, y) {
  doc.setFillColor(255, 0, 0);
  doc.roundedRect(x, y, 50, 12, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(text, x + 25, y + 8, { align: "center" });
}
</script>

<style scoped>
body {
  font-family: "Prompt", sans-serif;
}
</style>
