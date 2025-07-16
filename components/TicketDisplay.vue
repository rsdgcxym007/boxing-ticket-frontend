<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6">
        <div class="flex justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">ตั๋วที่ออกแล้ว</h2>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div
          class="flex flex-wrap justify-center items-center gap-6 min-h-[60vh]"
          id="tickets-container"
        >
          <div
            v-for="(ticket, index) in tickets"
            :key="index"
            class="ticket-card relative text-white rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300"
            :class="getTicketBackgroundClass(ticket.type)"
          >
            <!-- Ticket Header -->
            <div
              class="bg-black bg-opacity-30 p-4 text-center border-b border-white border-opacity-20"
            >
              <h3 class="text-xl font-bold tracking-wide">
                PATONG BOXING STADIUM
              </h3>
              <p class="text-sm opacity-90 font-medium">มวยไทยป่าตอง</p>
              <!-- <div
                class="mt-2 inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold"
              >
                {{ getTicketType(ticket.type) }}
              </div> -->
            </div>

            <!-- Ticket Body -->
            <div class="p-6 space-y-4">
              <!-- Main Display Section -->
              <div class="text-center space-y-4">
                <!-- Seat/Position Number -->
                <div class="space-y-2">
                  <div
                    class="text-xs font-semibold text-white opacity-75 uppercase tracking-wider"
                  >
                    {{ ticket.type === "SEAT" ? "เลขที่นั่ง" : "ตำแหน่ง" }}
                  </div>
                  <div
                    class="text-5xl font-bold drop-shadow-2xl tracking-wider"
                  >
                    {{ ticket.seatNumber || `#${ticket.index || index + 1}` }}
                  </div>
                </div>

                <!-- Customer & Date Info - Prominent Display -->
                <div class="space-y-3">
                  <!-- Customer Name -->
                  <div class="space-y-1">
                    <div
                      class="text-xs font-semibold text-white opacity-75 uppercase tracking-wider"
                    >
                      ชื่อผู้ถือตั๋ว
                    </div>
                    <div
                      class="text-lg font-bold tracking-wide text-white drop-shadow-lg"
                    >
                      {{ ticket.customerName }}
                    </div>
                  </div>

                  <!-- Show Date -->
                  <div class="space-y-1">
                    <div
                      class="text-xs font-semibold text-white opacity-75 uppercase tracking-wider"
                    >
                      รอบการแสดง
                    </div>
                    <div class="text-base font-semibold text-white opacity-90">
                      {{ formatShowDate(ticket.showDate) }}
                    </div>
                  </div>
                </div>

                <!-- Type Badge -->
                <div
                  class="inline-block px-4 py-2 bg-black bg-opacity-25 rounded-full text-sm font-bold tracking-wide border border-white border-opacity-40"
                >
                  {{ getTicketType(ticket.type) }}
                </div>
              </div>

              <!-- QR Code Area -->
              <div
                class="bg-white text-black p-4 rounded-xl text-center shadow-2xl border-4 border-white border-opacity-20"
              >
                <div
                  class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                >
                  รหัสออเดอร์
                </div>
                <div
                  class="text-xs font-mono break-all mb-3 text-gray-500 bg-gray-100 p-2 rounded"
                >
                  {{ ticket.orderId.substring(0, 8) }}...
                </div>
                <div
                  class="h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center text-gray-600 border-2 border-dashed border-gray-300 shadow-inner"
                >
                  <div class="text-center">
                    <i class="mdi mdi-qrcode text-4xl mb-2 text-gray-700"></i>
                    <div class="text-sm font-semibold text-gray-700">
                      QR CODE
                    </div>
                    <div class="text-xs text-gray-500">สแกนเพื่อตรวจสอบ</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ticket Stub -->
            <div
              class="border-t-2 border-dashed border-white border-opacity-40 bg-black bg-opacity-20 p-3"
            >
              <div
                class="flex justify-between items-center text-xs font-semibold"
              >
                <span class="flex items-center gap-1">
                  <i class="mdi mdi-chair-rolling"></i>
                  {{ ticket.seatNumber || `#${ticket.index || index + 1}` }}
                </span>
                <span class="text-center flex-1">
                  {{ ticket.customerName }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="mdi mdi-calendar"></i>
                  {{ formatShowDate(ticket.showDate) }}
                </span>
              </div>
            </div>

            <!-- Decorative perforations -->
            <div
              class="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full -ml-2.5 shadow-lg"
            ></div>
            <div
              class="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full -mr-2.5 shadow-lg"
            ></div>

            <!-- Corner decorations -->
            <div
              class="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-white opacity-30"
            ></div>
            <div
              class="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-white opacity-30"
            ></div>
            <div
              class="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-white opacity-30"
            ></div>
            <div
              class="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-white opacity-30"
            ></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-center gap-4">
          <button
            @click="printTickets"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <i class="mdi mdi-printer"></i>
            พิมพ์ตั๋ว
          </button>
          <button
            @click="downloadTickets"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isGeneratingPDF"
          >
            <i class="mdi mdi-download" v-if="!isGeneratingPDF"></i>
            <i class="mdi mdi-loading mdi-spin" v-else></i>
            {{ isGeneratingPDF ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const props = defineProps({
  tickets: {
    type: Array,
    required: true,
  },
});

defineEmits(["close"]);

const isGeneratingPDF = ref(false);

const getTicketType = (type) => {
  switch (type) {
    case "RINGSIDE":
      return "ที่นั่ง";
    case "STANDING":
      return "ตั๋วยืน";
    case "STANDING_ADULT":
      return "ตั๋วยืน (ผู้ใหญ่)";
    case "STANDING_CHILD":
      return "ตั๋วยืน (เด็ก)";
    default:
      return type;
  }
};

const getTicketBackgroundClass = (type) => {
  switch (type) {
    case "SEAT":
      return "bg-gradient-to-br from-red-500 via-red-600 to-red-700";
    case "STANDING":
    case "STANDING_ADULT":
    case "STANDING_CHILD":
      return "bg-gradient-to-br from-green-500 via-green-600 to-green-700";
    default:
      return "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700";
  }
};

const formatShowDate = (dateStr) => {
  if (!dateStr) return "-";

  // ถ้าเป็นรูปแบบ DD/MM/YYYY แล้ว return เลย
  if (dateStr.includes("/")) {
    return dateStr;
  }

  // ถ้าเป็นรูปแบบอื่น ให้ format ใหม่
  try {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  } catch (error) {
    return dateStr;
  }
};

const printTickets = () => {
  window.print();
};

const downloadTickets = async () => {
  isGeneratingPDF.value = true;

  try {
    const tickets = props.tickets;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    let isFirstPage = true;

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];

      // Determine ticket type and color - match exact gradients from CSS
      let backgroundColor = "#2563eb"; // default blue
      let gradientColors = ["#3b82f6", "#2563eb", "#1d4ed8"]; // blue gradient
      let ticketTypeName = "ตั๋ว";

      if (ticket.type === "SEAT") {
        backgroundColor = "#dc2626"; // red
        gradientColors = ["#ef4444", "#dc2626", "#b91c1c"]; // red gradient to match from-red-500 via-red-600 to-red-700
        ticketTypeName = "ที่นั่ง";
      } else if (
        ticket.type === "STANDING" ||
        ticket.type === "STANDING_ADULT" ||
        ticket.type === "STANDING_CHILD"
      ) {
        backgroundColor = "#16a34a"; // green
        gradientColors = ["#22c55e", "#16a34a", "#15803d"]; // green gradient to match from-green-500 via-green-600 to-green-700
        ticketTypeName =
          ticket.type === "STANDING_CHILD" ? "ตั๋วยืน (เด็ก)" : "ตั๋วยืน";
      }

      // Create ticket element with gradient background
      const ticketElement = document.createElement("div");
      ticketElement.style.width = "300px";
      ticketElement.style.minHeight = "auto"; // Let content determine height
      ticketElement.style.maxWidth = "300px"; // Ensure consistent width
      ticketElement.style.height = "auto";
      // Create gradient background to match CSS
      ticketElement.style.background = `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 50%, ${gradientColors[2]} 100%)`;
      ticketElement.style.color = "white";
      ticketElement.style.fontFamily = "Arial, sans-serif";
      ticketElement.style.padding = "0";
      ticketElement.style.boxSizing = "border-box";
      ticketElement.style.borderRadius = "12px";
      ticketElement.style.position = "relative";
      ticketElement.style.overflow = "visible"; // Allow decorative elements to show
      ticketElement.style.display = "flex";
      ticketElement.style.flexDirection = "column";
      ticketElement.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)"; // Match CSS shadow-xl

      // Create header section - match the exact styling from template
      const header = document.createElement("div");
      header.style.backgroundColor = "rgba(0,0,0,0.3)";
      header.style.padding = "16px";
      header.style.textAlign = "center";
      header.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
      header.style.borderTopLeftRadius = "12px";
      header.style.borderTopRightRadius = "12px";

      const title = document.createElement("h3");
      title.textContent = "PATONG BOXING STADIUM";
      title.style.margin = "0";
      title.style.fontSize = "20px";
      title.style.fontWeight = "bold";
      title.style.color = "white";
      title.style.letterSpacing = "0.025em"; // tracking-wide
      title.style.lineHeight = "1.2";

      const subtitle = document.createElement("p");
      subtitle.textContent = "มวยไทยป่าตอง";
      subtitle.style.margin = "0";
      subtitle.style.marginTop = "4px";
      subtitle.style.fontSize = "14px";
      subtitle.style.color = "rgba(255,255,255,0.9)";
      subtitle.style.fontWeight = "500";
      subtitle.style.opacity = "0.9";

      const badge = document.createElement("div");
      badge.textContent = ticketTypeName;
      badge.style.marginTop = "8px";
      badge.style.padding = "4px 12px";
      badge.style.backgroundColor = "rgba(255,255,255,0.2)";
      badge.style.borderRadius = "9999px"; // rounded-full
      badge.style.display = "inline-block";
      badge.style.fontSize = "12px";
      badge.style.fontWeight = "600";
      badge.style.color = "white";

      header.appendChild(title);
      header.appendChild(subtitle);
      header.appendChild(badge);

      // Create main content section - adjust padding to accommodate QR section
      const mainContent = document.createElement("div");
      mainContent.style.padding = "24px 24px 0 24px"; // Remove bottom padding
      mainContent.style.display = "flex";
      mainContent.style.flexDirection = "column";
      mainContent.style.flex = "1";

      // Main display section with exact spacing (space-y-4)
      const displaySection = document.createElement("div");
      displaySection.style.textAlign = "center";
      displaySection.style.marginBottom = "16px";

      // Seat/Position Number section with space-y-2 spacing
      const seatSection = document.createElement("div");
      seatSection.style.marginBottom = "16px"; // space-y-4 between sections

      const seatLabel = document.createElement("div");
      seatLabel.textContent = ticket.type === "SEAT" ? "เลขที่นั่ง" : "ตำแหน่ง";
      seatLabel.style.fontSize = "12px";
      seatLabel.style.fontWeight = "600";
      seatLabel.style.marginBottom = "8px"; // space-y-2
      seatLabel.style.color = "rgba(255,255,255,0.75)";
      seatLabel.style.textTransform = "uppercase";
      seatLabel.style.letterSpacing = "0.05em"; // tracking-wider
      seatLabel.style.textShadow = "1px 1px 2px rgba(0,0,0,0.6)";

      const seatNumber = document.createElement("div");
      seatNumber.textContent = ticket.seatNumber || `#${i + 1}`;
      seatNumber.style.fontSize = "60px"; // text-5xl equivalent
      seatNumber.style.fontWeight = "bold";
      seatNumber.style.margin = "0";
      seatNumber.style.color = "white";
      seatNumber.style.textShadow = "2px 2px 8px rgba(0,0,0,0.5)";
      seatNumber.style.letterSpacing = "0.05em"; // tracking-wider
      seatNumber.style.lineHeight = "1";

      seatSection.appendChild(seatLabel);
      seatSection.appendChild(seatNumber);

      // Customer & Date Info with space-y-3 spacing like template
      const infoSection = document.createElement("div");
      infoSection.style.marginTop = "16px"; // space-y-4
      infoSection.style.marginBottom = "16px";

      // Customer Name section with space-y-1
      const customerSection = document.createElement("div");
      customerSection.style.marginBottom = "12px"; // space-y-3

      const customerLabel = document.createElement("div");
      customerLabel.textContent = "ชื่อผู้ถือตั๋ว";
      customerLabel.style.fontSize = "12px";
      customerLabel.style.fontWeight = "600";
      customerLabel.style.marginBottom = "4px"; // space-y-1
      customerLabel.style.color = "rgba(255,255,255,0.75)";
      customerLabel.style.textTransform = "uppercase";
      customerLabel.style.letterSpacing = "0.05em"; // tracking-wider
      customerLabel.style.textShadow = "1px 1px 2px rgba(0,0,0,0.6)";

      const customerName = document.createElement("div");
      customerName.textContent = ticket.customerName || "ไม่ระบุ";
      customerName.style.fontSize = "18px"; // text-lg
      customerName.style.fontWeight = "bold";
      customerName.style.color = "white";
      customerName.style.letterSpacing = "0.025em"; // tracking-wide
      customerName.style.textShadow = "1px 1px 4px rgba(0,0,0,0.4)";

      customerSection.appendChild(customerLabel);
      customerSection.appendChild(customerName);

      // Show Date section with space-y-1
      const dateSection = document.createElement("div");
      dateSection.style.marginBottom = "16px";

      const dateLabel = document.createElement("div");
      dateLabel.textContent = "รอบการแสดง";
      dateLabel.style.fontSize = "12px";
      dateLabel.style.fontWeight = "600";
      dateLabel.style.marginBottom = "4px"; // space-y-1
      dateLabel.style.color = "rgba(255,255,255,0.75)";
      dateLabel.style.textTransform = "uppercase";
      dateLabel.style.letterSpacing = "0.05em"; // tracking-wider
      dateLabel.style.textShadow = "1px 1px 2px rgba(0,0,0,0.6)";

      const showDate = document.createElement("div");
      showDate.textContent = formatShowDate(ticket.showDate);
      showDate.style.fontSize = "16px"; // text-base
      showDate.style.fontWeight = "600";
      showDate.style.color = "rgba(255,255,255,0.9)";
      showDate.style.textShadow = "1px 1px 4px rgba(0,0,0,0.4)";

      dateSection.appendChild(dateLabel);
      dateSection.appendChild(showDate);

      infoSection.appendChild(customerSection);
      infoSection.appendChild(dateSection);

      // Type Badge - match template exactly
      const typeBadge = document.createElement("div");
      typeBadge.textContent = ticketTypeName;
      typeBadge.style.display = "inline-block";
      typeBadge.style.padding = "8px 16px";
      typeBadge.style.backgroundColor = "rgba(255,255,255,0.25)";
      typeBadge.style.borderRadius = "9999px"; // rounded-full
      typeBadge.style.fontSize = "14px"; // text-sm
      typeBadge.style.fontWeight = "bold";
      typeBadge.style.letterSpacing = "0.025em"; // tracking-wide
      typeBadge.style.border = "1px solid rgba(255,255,255,0.4)";
      typeBadge.style.color = "white";
      typeBadge.style.marginTop = "8px";

      displaySection.appendChild(seatSection);
      displaySection.appendChild(infoSection);
      displaySection.appendChild(typeBadge);

      mainContent.appendChild(displaySection);

      // QR Code section - reduce size to fit within ticket frame properly
      const qrSection = document.createElement("div");
      qrSection.style.backgroundColor = "white";
      qrSection.style.color = "black";
      qrSection.style.padding = "12px"; // Reduced from 16px
      qrSection.style.borderRadius = "8px"; // Reduced from 12px
      qrSection.style.textAlign = "center";
      qrSection.style.margin = "0 20px 12px 20px"; // Reduced margins
      qrSection.style.boxShadow = "0 10px 25px -12px rgba(0, 0, 0, 0.15)"; // Reduced shadow
      qrSection.style.border = "2px solid rgba(255,255,255,0.2)"; // Reduced border
      qrSection.style.flexShrink = "0";

      const orderLabel = document.createElement("div");
      orderLabel.textContent = "รหัสออเดอร์";
      orderLabel.style.fontSize = "10px"; // Reduced from 12px
      orderLabel.style.fontWeight = "600";
      orderLabel.style.marginBottom = "6px"; // Reduced from 8px
      orderLabel.style.color = "#374151";
      orderLabel.style.textTransform = "uppercase";
      orderLabel.style.letterSpacing = "0.05em";

      const orderId = document.createElement("div");
      orderId.textContent = ticket.orderId
        ? ticket.orderId.substring(0, 8) + "..."
        : "N/A";
      orderId.style.fontSize = "10px"; // Reduced from 12px
      orderId.style.backgroundColor = "#f3f4f6";
      orderId.style.padding = "6px"; // Reduced from 8px
      orderId.style.borderRadius = "3px"; // Reduced from 4px
      orderId.style.marginBottom = "8px"; // Reduced from 12px
      orderId.style.color = "#6b7280";
      orderId.style.fontFamily =
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      orderId.style.wordBreak = "break-all";

      const qrContainer = document.createElement("div");
      qrContainer.style.height = "40px"; // Much smaller to fit nicely in gray background
      qrContainer.style.background =
        "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)";
      qrContainer.style.borderRadius = "4px"; // Smaller radius
      qrContainer.style.display = "flex";
      qrContainer.style.alignItems = "center";
      qrContainer.style.justifyContent = "center";
      qrContainer.style.color = "#4b5563";
      qrContainer.style.border = "1px dashed #d1d5db";
      qrContainer.style.boxShadow = "inset 0 1px 2px 0 rgba(0, 0, 0, 0.1)";

      const qrContent = document.createElement("div");
      qrContent.style.textAlign = "center";

      // QR Icon - make very small to fit within compact gray background
      const qrIcon = document.createElement("div");
      qrIcon.textContent = "QR";
      qrIcon.style.fontSize = "10px"; // Smaller to fit in 40px height container
      qrIcon.style.marginBottom = "1px"; // Minimal margin
      qrIcon.style.color = "#374151";
      qrIcon.style.fontWeight = "bold";
      qrIcon.style.border = "1px solid #374151";
      qrIcon.style.padding = "1px 2px"; // Very minimal padding
      qrIcon.style.borderRadius = "1px"; // Small radius

      const qrText = document.createElement("div");
      qrText.textContent = "QR CODE";
      qrText.style.fontSize = "6px"; // Very small to fit in compact area
      qrText.style.fontWeight = "600";
      qrText.style.color = "#374151";
      qrText.style.marginBottom = "0"; // No margin

      const qrSubText = document.createElement("div");
      qrSubText.textContent = "สแกนเพื่อตรวจสอบ";
      qrSubText.style.fontSize = "5px"; // Tiny Thai text to fit nicely
      qrSubText.style.color = "#6b7280";

      qrContent.appendChild(qrIcon);
      qrContent.appendChild(qrText);
      qrContent.appendChild(qrSubText);
      qrContainer.appendChild(qrContent);

      qrSection.appendChild(orderLabel);
      qrSection.appendChild(orderId);
      qrSection.appendChild(qrContainer);

      // Ticket Stub - reduce size slightly for better proportions
      const stub = document.createElement("div");
      stub.style.borderTop = "2px dashed rgba(255,255,255,0.4)";
      stub.style.padding = "8px"; // Reduced from 12px
      stub.style.backgroundColor = "rgba(0,0,0,0.2)";
      stub.style.display = "flex";
      stub.style.justifyContent = "space-between";
      stub.style.alignItems = "center";
      stub.style.fontSize = "10px"; // Reduced from 12px
      stub.style.color = "white";
      stub.style.fontWeight = "600";
      stub.style.borderBottomLeftRadius = "12px";
      stub.style.borderBottomRightRadius = "12px";
      stub.style.flexShrink = "0";

      const stubSeat = document.createElement("span");
      stubSeat.textContent = `${ticket.seatNumber || `#${i + 1}`}`;
      stubSeat.style.display = "flex";
      stubSeat.style.alignItems = "center";
      stubSeat.style.gap = "2px"; // Reduced gap
      stubSeat.style.fontSize = "10px"; // Ensure consistent smaller font

      const stubCustomer = document.createElement("span");
      stubCustomer.textContent = ticket.customerName || "ไม่ระบุ";
      stubCustomer.style.textAlign = "center";
      stubCustomer.style.flex = "1";
      stubCustomer.style.fontSize = "10px"; // Ensure consistent smaller font
      stubCustomer.style.overflow = "hidden"; // Prevent overflow
      stubCustomer.style.textOverflow = "ellipsis"; // Add ellipsis for long names
      stubCustomer.style.whiteSpace = "nowrap"; // Prevent wrapping

      const stubDate = document.createElement("span");
      stubDate.textContent = formatShowDate(ticket.showDate);
      stubDate.style.display = "flex";
      stubDate.style.alignItems = "center";
      stubDate.style.gap = "2px"; // Reduced gap
      stubDate.style.fontSize = "10px"; // Ensure consistent smaller font

      stub.appendChild(stubSeat);
      stub.appendChild(stubCustomer);
      stub.appendChild(stubDate);

      // Add decorative perforations - match template positioning
      const leftPerf = document.createElement("div");
      leftPerf.style.position = "absolute";
      leftPerf.style.left = "-10px";
      leftPerf.style.top = "50%";
      leftPerf.style.transform = "translateY(-50%)";
      leftPerf.style.width = "20px"; // w-5 = 20px
      leftPerf.style.height = "20px"; // h-5 = 20px
      leftPerf.style.backgroundColor = "white";
      leftPerf.style.borderRadius = "50%";
      leftPerf.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"; // shadow-lg

      const rightPerf = document.createElement("div");
      rightPerf.style.position = "absolute";
      rightPerf.style.right = "-10px";
      rightPerf.style.top = "50%";
      rightPerf.style.transform = "translateY(-50%)";
      rightPerf.style.width = "20px"; // w-5 = 20px
      rightPerf.style.height = "20px"; // h-5 = 20px
      rightPerf.style.backgroundColor = "white";
      rightPerf.style.borderRadius = "50%";
      rightPerf.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"; // shadow-lg

      // Add corner decorations with exact positioning (top-4 left-4 = 16px)
      const corners = [
        {
          top: "16px", // top-4
          left: "16px", // left-4
          borderLeft: "2px solid rgba(255,255,255,0.3)",
          borderTop: "2px solid rgba(255,255,255,0.3)",
        },
        {
          top: "16px", // top-4
          right: "16px", // right-4
          borderRight: "2px solid rgba(255,255,255,0.3)",
          borderTop: "2px solid rgba(255,255,255,0.3)",
        },
        {
          bottom: "16px", // bottom-4
          left: "16px", // left-4
          borderLeft: "2px solid rgba(255,255,255,0.3)",
          borderBottom: "2px solid rgba(255,255,255,0.3)",
        },
        {
          bottom: "16px", // bottom-4
          right: "16px", // right-4
          borderRight: "2px solid rgba(255,255,255,0.3)",
          borderBottom: "2px solid rgba(255,255,255,0.3)",
        },
      ];

      corners.forEach((corner) => {
        const cornerDiv = document.createElement("div");
        cornerDiv.style.position = "absolute";
        cornerDiv.style.width = "12px"; // w-3 = 12px
        cornerDiv.style.height = "12px"; // h-3 = 12px
        cornerDiv.style.opacity = "0.3"; // opacity-30 from template
        Object.assign(cornerDiv.style, corner);
        ticketElement.appendChild(cornerDiv);
      });

      // Assemble the ticket structure properly - QR and stub should be part of main flow
      ticketElement.appendChild(header);

      // Create a container for the body content including QR and stub
      const bodyContainer = document.createElement("div");
      bodyContainer.style.display = "flex";
      bodyContainer.style.flexDirection = "column";
      bodyContainer.style.flex = "1";

      bodyContainer.appendChild(mainContent);
      bodyContainer.appendChild(qrSection);
      bodyContainer.appendChild(stub);

      ticketElement.appendChild(bodyContainer);
      ticketElement.appendChild(leftPerf);
      ticketElement.appendChild(rightPerf);

      // Create temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.appendChild(ticketElement);
      document.body.appendChild(tempContainer);

      // Wait for DOM to settle
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        // Measure actual height of the ticket element
        const actualHeight = ticketElement.scrollHeight;
        const actualWidth = 300;

        console.log(
          `Ticket ${i} actual dimensions: ${actualWidth}x${actualHeight}`
        );

        // Create canvas to capture the complete ticket including QR and stub
        const canvas = await html2canvas(ticketElement, {
          scale: 2, // Good balance between quality and performance
          useCORS: true,
          allowTaint: true,
          backgroundColor: null, // Let gradient show through
          width: 300, // Exact width match
          height: actualHeight, // Use full actual height to include QR and stub
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 300,
          windowHeight: actualHeight, // Use full height
          onclone: (clonedDoc) => {
            // Ensure fonts are loaded in cloned document
            const clonedElement = clonedDoc.querySelector("div");
            if (clonedElement) {
              clonedElement.style.fontFamily = "Arial, sans-serif";
            }
          },
        });

        // Remove temporary container
        document.body.removeChild(tempContainer);

        // Check if canvas has content
        if (canvas.width === 0 || canvas.height === 0) {
          console.error("Canvas is empty for ticket", i);
          continue;
        }

        console.log(
          `Canvas created for ticket ${i}: ${canvas.width}x${canvas.height}`
        );

        // Calculate dimensions for PDF (ticket size: 100mm width for better visibility)
        const imgWidth = 100;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add new page if not first ticket
        if (!isFirstPage) {
          pdf.addPage();
        }

        // Center the ticket on the page
        const xPos = (210 - imgWidth) / 2; // A4 width is 210mm
        const yPos = 20; // Start from top with some margin

        // Add image to PDF
        pdf.addImage(
          canvas.toDataURL("image/png", 1.0),
          "PNG",
          xPos,
          yPos,
          imgWidth,
          imgHeight
        );

        isFirstPage = false;
      } catch (ticketError) {
        console.error(`Error processing ticket ${i}:`, ticketError);
        // Clean up temp container if error occurs
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
        continue;
      }
    }

    // Save PDF
    const currentDate = new Date()
      .toLocaleDateString("th-TH")
      .replace(/\//g, "-");
    pdf.save(`boxing-tickets-${currentDate}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("เกิดข้อผิดพลาดในการสร้าง PDF: " + error.message);
  } finally {
    isGeneratingPDF.value = false;
  }
};
</script>

<style scoped>
.ticket-card {
  min-height: 420px;
  max-width: 300px;
  width: 100%;
  position: relative;
  background-attachment: scroll;
}

.ticket-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: 0.03;
  background-image: radial-gradient(
      circle at 20% 20%,
      white 1px,
      transparent 1px
    ),
    radial-gradient(circle at 80% 80%, white 1px, transparent 1px);
  background-size: 25px 25px;
  pointer-events: none;
  z-index: 1;
}

/* PDF specific styling - Remove problematic styles */
@media print {
  .ticket-card {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 20px;
    transform: none !important;
    box-shadow: none !important;
    animation: none !important;
    background-attachment: scroll !important;
  }

  .ticket-card:hover {
    transform: none !important;
  }

  .ticket-card::after {
    display: none !important;
  }

  .ticket-card::before {
    opacity: 0 !important;
  }
}

/* Shimmer effect */
.ticket-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  animation: shimmer 4s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Enhanced text shadows */
.ticket-card .text-5xl {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.ticket-card .text-lg,
.ticket-card .text-base {
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
}

/* Header labels styling */
.ticket-card .text-xs.uppercase {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.1em;
}
</style>
