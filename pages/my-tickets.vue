<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto py-12 px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold text-gray-900">ตั๋วของฉัน</h1>
            <p class="text-gray-600 mt-2">จัดการและดูตั๋วทั้งหมดของคุณ</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <select
              v-model="filterStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">สถานะทั้งหมด</option>
              <option value="active">ใช้งานได้</option>
              <option value="used">ใช้แล้ว</option>
              <option value="expired">หมดอายุ</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
            <button
              @click="refreshTickets"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Icon icon="mdi:refresh" />
              รีเฟรช
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">ตั๋วทั้งหมด</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ tickets.length }}
              </p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon icon="mdi:ticket" class="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">ใช้งานได้</p>
              <p class="text-2xl font-bold text-green-600">
                {{ activeTicketsCount }}
              </p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <Icon icon="mdi:check-circle" class="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">ใช้แล้ว</p>
              <p class="text-2xl font-bold text-gray-600">
                {{ usedTicketsCount }}
              </p>
            </div>
            <div class="p-3 bg-gray-100 rounded-full">
              <Icon icon="mdi:history" class="text-2xl text-gray-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">มูลค่ารวม</p>
              <p class="text-2xl font-bold text-purple-600">
                ฿{{ totalValue.toLocaleString() }}
              </p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <Icon icon="mdi:cash" class="text-2xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets Grid -->
      <div class="space-y-6">
        <div
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="flex flex-col lg:flex-row">
            <!-- Ticket Image -->
            <div class="lg:w-1/3">
              <img
                :src="ticket.eventImage || '/images/default-event.jpg'"
                :alt="ticket.eventName"
                class="w-full h-48 lg:h-full object-cover"
              />
            </div>

            <!-- Ticket Details -->
            <div class="flex-1 p-6">
              <div class="flex flex-col lg:flex-row justify-between h-full">
                <div class="flex-1">
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">
                        {{ ticket.eventName }}
                      </h3>
                      <div class="flex flex-wrap gap-2 mb-3">
                        <span
                          :class="getStatusClasses(ticket.status)"
                          class="px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {{ getStatusText(ticket.status) }}
                        </span>
                        <span
                          class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {{ ticket.seatType }}
                        </span>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-gray-900">
                        ฿{{ ticket.price.toLocaleString() }}
                      </p>
                      <p class="text-sm text-gray-600">
                        {{ ticket.seatNumber }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="flex items-center gap-2 text-gray-600">
                      <Icon icon="mdi:calendar" class="text-lg" />
                      <span>{{ formatDate(ticket.eventDate) }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <Icon icon="mdi:clock" class="text-lg" />
                      <span>{{ ticket.eventTime }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <Icon icon="mdi:map-marker" class="text-lg" />
                      <span>{{ ticket.venue }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <Icon icon="mdi:receipt" class="text-lg" />
                      <span>Order: {{ ticket.orderId }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col gap-3 lg:ml-6 lg:w-48">
                  <button
                    v-if="ticket.status === 'active'"
                    @click="viewTicketDetails(ticket.id)"
                    class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:eye" />
                    ดูตั๋ว
                  </button>

                  <button
                    v-if="ticket.status === 'active'"
                    @click="showQRCode(ticket)"
                    class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:qrcode" />
                    QR Code
                  </button>

                  <button
                    @click="downloadTicket(ticket.id)"
                    class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:download" />
                    ดาวน์โหลด
                  </button>

                  <button
                    v-if="
                      ticket.status === 'active' && canCancel(ticket.eventDate)
                    "
                    @click="cancelTicket(ticket.id)"
                    class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:cancel" />
                    ยกเลิก
                  </button>

                  <button
                    v-if="ticket.status === 'used'"
                    @click="rateEvent(ticket.id)"
                    class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:star" />
                    ให้คะแนน
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTickets.length === 0" class="text-center py-12">
        <Icon
          icon="mdi:ticket-outline"
          class="text-6xl text-gray-400 mx-auto mb-4"
        />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">ไม่พบตั๋ว</h3>
        <p class="text-gray-600 mb-6">คุณยังไม่มีตั๋วตามเงื่อนไขที่เลือก</p>
        <button
          @click="navigateTo('/')"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ซื้อตั๋วเลี้อง
        </button>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div
      v-if="showQRModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">
          QR Code ตั๋วของคุณ
        </h3>

        <div class="bg-white p-4 rounded-lg border-2 border-gray-200 mb-6">
          <div
            class="w-48 h-48 mx-auto bg-gray-100 rounded flex items-center justify-center"
          >
            <!-- QR Code would be generated here -->
            <Icon icon="mdi:qrcode" class="text-6xl text-gray-400" />
          </div>
        </div>

        <div class="text-sm text-gray-600 mb-6">
          <p class="mb-2">{{ selectedTicket?.eventName }}</p>
          <p class="mb-2">
            {{ formatDate(selectedTicket?.eventDate) }}
            {{ selectedTicket?.eventTime }}
          </p>
          <p class="font-mono text-xs">{{ selectedTicket?.orderId }}</p>
        </div>

        <div class="flex gap-3">
          <button
            @click="saveQRCode"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            บันทึก QR Code
          </button>
          <button
            @click="showQRModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Authentication check
definePageMeta({
  middleware: "auth",
});

// Reactive data
const filterStatus = ref("");
const showQRModal = ref(false);
const selectedTicket = ref(null);

// Mock tickets data
const tickets = ref([
  {
    id: 1,
    eventName: "Muay Thai Championship Night",
    eventDate: "2024-02-20",
    eventTime: "21:00",
    venue: "Patong Boxing Stadium",
    seatType: "Ringside",
    seatNumber: "R-15",
    price: 1800,
    status: "active",
    orderId: "PBX-2024-001",
    eventImage: "/images/muay-thai-event-1.jpg",
  },
  {
    id: 2,
    eventName: "International Boxing Match",
    eventDate: "2024-02-25",
    eventTime: "20:00",
    venue: "Patong Boxing Stadium",
    seatType: "Standard",
    seatNumber: "S-42",
    price: 1500,
    status: "active",
    orderId: "PBX-2024-002",
    eventImage: "/images/boxing-event-1.jpg",
  },
  {
    id: 3,
    eventName: "Friday Fight Night",
    eventDate: "2024-01-30",
    eventTime: "21:00",
    venue: "Patong Boxing Stadium",
    seatType: "Ringside",
    seatNumber: "R-8",
    price: 1800,
    status: "used",
    orderId: "PBX-2024-003",
    eventImage: "/images/fight-night-1.jpg",
  },
  {
    id: 4,
    eventName: "New Year Special Event",
    eventDate: "2024-01-01",
    eventTime: "22:00",
    venue: "Patong Boxing Stadium",
    seatType: "VIP",
    seatNumber: "V-5",
    price: 2500,
    status: "used",
    orderId: "PBX-2024-004",
    eventImage: "/images/new-year-event.jpg",
  },
  {
    id: 5,
    eventName: "Weekend Warriors",
    eventDate: "2024-01-10",
    eventTime: "20:30",
    venue: "Patong Boxing Stadium",
    seatType: "Standard",
    seatNumber: "S-28",
    price: 1500,
    status: "expired",
    orderId: "PBX-2024-005",
    eventImage: "/images/weekend-warriors.jpg",
  },
]);

// Computed properties
const filteredTickets = computed(() => {
  if (!filterStatus.value) return tickets.value;
  return tickets.value.filter((ticket) => ticket.status === filterStatus.value);
});

const activeTicketsCount = computed(() => {
  return tickets.value.filter((ticket) => ticket.status === "active").length;
});

const usedTicketsCount = computed(() => {
  return tickets.value.filter((ticket) => ticket.status === "used").length;
});

const totalValue = computed(() => {
  return tickets.value.reduce((total, ticket) => total + ticket.price, 0);
});

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "ใช้งานได้";
    case "used":
      return "ใช้แล้ว";
    case "expired":
      return "หมดอายุ";
    case "cancelled":
      return "ยกเลิก";
    default:
      return status;
  }
};

const getStatusClasses = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "used":
      return "bg-gray-100 text-gray-800";
    case "expired":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const canCancel = (eventDate) => {
  const event = new Date(eventDate);
  const now = new Date();
  const timeDiff = event.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  return hoursDiff > 24; // Can cancel if more than 24 hours before event
};

const viewTicketDetails = (ticketId) => {
  navigateTo(`/tickets/${ticketId}`);
};

const showQRCode = (ticket) => {
  selectedTicket.value = ticket;
  showQRModal.value = true;
};

const saveQRCode = () => {
  // Logic to save QR code image
  alert("QR Code ถูกบันทึกแล้ว");
  showQRModal.value = false;
};

const downloadTicket = async (ticketId) => {
  try {
    // Logic to download ticket PDF
    alert("กำลังดาวน์โหลดตั๋ว...");
  } catch (error) {
    console.error("Error downloading ticket:", error);
    alert("เกิดข้อผิดพลาดในการดาวน์โหลดตั๋ว");
  }
};

const cancelTicket = async (ticketId) => {
  if (!confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกตั๋วนี้?")) return;

  try {
    // Logic to cancel ticket
    const ticketIndex = tickets.value.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      tickets.value[ticketIndex].status = "cancelled";
    }
    alert("ยกเลิกตั๋วเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    alert("เกิดข้อผิดพลาดในการยกเลิกตั๋ว");
  }
};

const rateEvent = (ticketId) => {
  // Navigate to rating page or show rating modal
  alert("ฟีเจอร์การให้คะแนนจะเปิดใช้งานในเร็วๆ นี้");
};

const refreshTickets = async () => {
  try {
    // Logic to refresh tickets from API
    alert("รีเฟรชข้อมูลตั๋วเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error refreshing tickets:", error);
    alert("เกิดข้อผิดพลาดในการรีเฟรชข้อมูล");
  }
};

// SEO
useSeoMeta({
  title: "My Tickets - Patong Boxing Stadium",
  description:
    "View and manage all your boxing event tickets at Patong Boxing Stadium",
  ogTitle: "My Tickets - Patong Boxing Stadium",
  ogDescription: "Manage your boxing event tickets and view upcoming events",
});
</script>
