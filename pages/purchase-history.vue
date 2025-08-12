<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto py-12 px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold text-gray-900">ประวัติการซื้อ</h1>
            <p class="text-gray-600 mt-2">
              ดูประวัติการสั่งซื้อและการชำระเงินทั้งหมด
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <select
              v-model="filterPeriod"
              @change="filterByPeriod"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              <option value="today">วันนี้</option>
              <option value="week">สัปดาห์นี้</option>
              <option value="month">เดือนนี้</option>
              <option value="year">ปีนี้</option>
            </select>
            <select
              v-model="filterStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">สถานะทั้งหมด</option>
              <option value="completed">สำเร็จ</option>
              <option value="pending">รอชำระ</option>
              <option value="cancelled">ยกเลิก</option>
              <option value="refunded">คืนเงิน</option>
            </select>
            <button
              @click="exportHistory"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Icon icon="mdi:download" />
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                ยอดสั่งซื้อทั้งหมด
              </p>
              <p class="text-2xl font-bold text-gray-900">
                {{ filteredOrders.length }}
              </p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon icon="mdi:receipt" class="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">ยอดเงินรวม</p>
              <p class="text-2xl font-bold text-green-600">
                ฿{{ totalAmount.toLocaleString() }}
              </p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <Icon icon="mdi:cash" class="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">คำสั่งซื้อสำเร็จ</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ completedOrdersCount }}
              </p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon icon="mdi:check-circle" class="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">เฉลี่ยต่อครั้ง</p>
              <p class="text-2xl font-bold text-purple-600">
                ฿{{ averageOrderValue.toLocaleString() }}
              </p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <Icon icon="mdi:calculator" class="text-2xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">รายการคำสั่งซื้อ</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  คำสั่งซื้อ
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  วันที่
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  รายการ
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ยอดเงิน
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  สถานะ
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  การชำระเงิน
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in paginatedOrders"
                :key="order.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ order.orderId }}
                    </div>
                    <div class="text-sm text-gray-500">
                      Ref: {{ order.referenceNumber }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(order.orderDate) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatTime(order.orderDate) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ order.eventName }}</div>
                  <div class="text-sm text-gray-500">
                    {{ order.ticketCount }} ตั๋ว • {{ order.seatType }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDate(order.eventDate) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    ฿{{ order.totalAmount.toLocaleString() }}
                  </div>
                  <div v-if="order.discount > 0" class="text-sm text-green-600">
                    ส่วนลด ฿{{ order.discount.toLocaleString() }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClasses(order.status)"
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ getPaymentMethodText(order.paymentMethod) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ order.paymentReference }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewOrderDetails(order.id)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      <Icon icon="mdi:eye" class="text-lg" />
                    </button>
                    <button
                      v-if="order.status === 'completed'"
                      @click="downloadReceipt(order.id)"
                      class="text-green-600 hover:text-green-900"
                    >
                      <Icon icon="mdi:download" class="text-lg" />
                    </button>
                    <button
                      v-if="
                        order.status === 'completed' &&
                        canRefund(order.orderDate)
                      "
                      @click="requestRefund(order.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <Icon icon="mdi:undo" class="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ก่อนหน้า
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ถัดไป
            </button>
          </div>
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700">
                แสดง
                <span class="font-medium">{{ startIndex }}</span>
                ถึง
                <span class="font-medium">{{ endIndex }}</span>
                จาก
                <span class="font-medium">{{ filteredOrders.length }}</span>
                รายการ
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              >
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="mdi:chevron-left" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon icon="mdi:chevron-right" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <Icon
          icon="mdi:receipt-outline"
          class="text-6xl text-gray-400 mx-auto mb-4"
        />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          ไม่พบประวัติการซื้อ
        </h3>
        <p class="text-gray-600 mb-6">
          คุณยังไม่มีประวัติการสั่งซื้อตามเงื่อนไขที่เลือก
        </p>
        <button
          @click="navigateTo('/')"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          เริ่มซื้อตั๋ว
        </button>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div
      v-if="showOrderModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900">
            รายละเอียดคำสั่งซื้อ
          </h3>
          <button
            @click="showOrderModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon icon="mdi:close" class="text-2xl" />
          </button>
        </div>

        <div v-if="selectedOrder" class="space-y-6">
          <!-- Order Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600"
                >เลขที่คำสั่งซื้อ</label
              >
              <p class="text-lg font-semibold">{{ selectedOrder.orderId }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"
                >วันที่สั่งซื้อ</label
              >
              <p class="text-lg">{{ formatDate(selectedOrder.orderDate) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"
                >สถานะ</label
              >
              <span
                :class="getStatusClasses(selectedOrder.status)"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ getStatusText(selectedOrder.status) }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"
                >วิธีการชำระเงิน</label
              >
              <p class="text-lg">
                {{ getPaymentMethodText(selectedOrder.paymentMethod) }}
              </p>
            </div>
          </div>

          <!-- Event Details -->
          <div class="border-t pt-6">
            <h4 class="text-lg font-semibold mb-4">รายละเอียดการแข่งขัน</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <h5 class="font-semibold text-lg">
                {{ selectedOrder.eventName }}
              </h5>
              <p class="text-gray-600 mt-1">
                {{ formatDate(selectedOrder.eventDate) }} •
                {{ selectedOrder.eventTime }}
              </p>
              <p class="text-gray-600">{{ selectedOrder.venue }}</p>
            </div>
          </div>

          <!-- Ticket Details -->
          <div class="border-t pt-6">
            <h4 class="text-lg font-semibold mb-4">รายละเอียดตั๋ว</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>ประเภทที่นั่ง</span>
                <span class="font-medium">{{ selectedOrder.seatType }}</span>
              </div>
              <div class="flex justify-between">
                <span>จำนวนตั๋ว</span>
                <span class="font-medium"
                  >{{ selectedOrder.ticketCount }} ใบ</span
                >
              </div>
              <div class="flex justify-between">
                <span>ราคาต่อใบ</span>
                <span class="font-medium"
                  >฿{{ selectedOrder.pricePerTicket.toLocaleString() }}</span
                >
              </div>
              <div class="flex justify-between">
                <span>ราคารวม</span>
                <span class="font-medium"
                  >฿{{
                    (
                      selectedOrder.ticketCount * selectedOrder.pricePerTicket
                    ).toLocaleString()
                  }}</span
                >
              </div>
              <div
                v-if="selectedOrder.discount > 0"
                class="flex justify-between text-green-600"
              >
                <span>ส่วนลด</span>
                <span class="font-medium"
                  >-฿{{ selectedOrder.discount.toLocaleString() }}</span
                >
              </div>
              <div class="flex justify-between text-lg font-bold border-t pt-2">
                <span>ยอดรวมสุทธิ</span>
                <span>฿{{ selectedOrder.totalAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="border-t pt-6 flex gap-4">
            <button
              v-if="selectedOrder.status === 'completed'"
              @click="downloadReceipt(selectedOrder.id)"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ดาวน์โหลดใบเสร็จ
            </button>
            <button
              @click="showOrderModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ปิด
            </button>
          </div>
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
const filterPeriod = ref("all");
const filterStatus = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const showOrderModal = ref(false);
const selectedOrder = ref(null);

// Mock orders data
const orders = ref([
  {
    id: 1,
    orderId: "PBX-2024-001",
    referenceNumber: "REF-001-2024",
    orderDate: "2024-01-15T10:30:00",
    eventName: "Muay Thai Championship Night",
    eventDate: "2024-02-20",
    eventTime: "21:00",
    venue: "Patong Boxing Stadium",
    ticketCount: 2,
    seatType: "Ringside",
    pricePerTicket: 1800,
    discount: 0,
    totalAmount: 3600,
    status: "completed",
    paymentMethod: "credit_card",
    paymentReference: "VISA-****-1234",
  },
  {
    id: 2,
    orderId: "PBX-2024-002",
    referenceNumber: "REF-002-2024",
    orderDate: "2024-01-20T14:15:00",
    eventName: "International Boxing Match",
    eventDate: "2024-02-25",
    eventTime: "20:00",
    venue: "Patong Boxing Stadium",
    ticketCount: 1,
    seatType: "Standard",
    pricePerTicket: 1500,
    discount: 150,
    totalAmount: 1350,
    status: "completed",
    paymentMethod: "qr_code",
    paymentReference: "QR-PAY-002",
  },
  {
    id: 3,
    orderId: "PBX-2024-003",
    referenceNumber: "REF-003-2024",
    orderDate: "2024-01-25T16:45:00",
    eventName: "Friday Fight Night",
    eventDate: "2024-02-28",
    eventTime: "21:00",
    venue: "Patong Boxing Stadium",
    ticketCount: 4,
    seatType: "VIP",
    pricePerTicket: 2500,
    discount: 500,
    totalAmount: 9500,
    status: "pending",
    paymentMethod: "bank_transfer",
    paymentReference: "BT-003-2024",
  },
  {
    id: 4,
    orderId: "PBX-2024-004",
    referenceNumber: "REF-004-2024",
    orderDate: "2024-01-10T09:20:00",
    eventName: "Weekend Warriors",
    eventDate: "2024-01-30",
    eventTime: "20:30",
    venue: "Patong Boxing Stadium",
    ticketCount: 2,
    seatType: "Standard",
    pricePerTicket: 1500,
    discount: 0,
    totalAmount: 3000,
    status: "cancelled",
    paymentMethod: "credit_card",
    paymentReference: "VISA-****-5678",
  },
  {
    id: 5,
    orderId: "PBX-2024-005",
    referenceNumber: "REF-005-2024",
    orderDate: "2024-01-05T11:30:00",
    eventName: "New Year Special Event",
    eventDate: "2024-01-15",
    eventTime: "22:00",
    venue: "Patong Boxing Stadium",
    ticketCount: 3,
    seatType: "Ringside",
    pricePerTicket: 1800,
    discount: 270,
    totalAmount: 5130,
    status: "refunded",
    paymentMethod: "debit_card",
    paymentReference: "DEBIT-****-9012",
  },
]);

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value;

  if (filterStatus.value) {
    filtered = filtered.filter((order) => order.status === filterStatus.value);
  }

  // Additional period filtering can be added here

  return filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
});

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage);
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOrders.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endIndex = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredOrders.value.length
  );
});

const totalAmount = computed(() => {
  return filteredOrders.value.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
});

const completedOrdersCount = computed(() => {
  return filteredOrders.value.filter((order) => order.status === "completed")
    .length;
});

const averageOrderValue = computed(() => {
  const completed = filteredOrders.value.filter(
    (order) => order.status === "completed"
  );
  if (completed.length === 0) return 0;
  return (
    completed.reduce((sum, order) => sum + order.totalAmount, 0) /
    completed.length
  );
});

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusText = (status) => {
  switch (status) {
    case "completed":
      return "สำเร็จ";
    case "pending":
      return "รอชำระ";
    case "cancelled":
      return "ยกเลิก";
    case "refunded":
      return "คืนเงิน";
    default:
      return status;
  }
};

const getStatusClasses = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPaymentMethodText = (method) => {
  switch (method) {
    case "credit_card":
      return "บัตรเครดิต";
    case "debit_card":
      return "บัตรเดบิต";
    case "qr_code":
      return "QR Code";
    case "bank_transfer":
      return "โอนเงิน";
    default:
      return method;
  }
};

const canRefund = (orderDate) => {
  const order = new Date(orderDate);
  const now = new Date();
  const timeDiff = now.getTime() - order.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  return daysDiff <= 7; // Can refund within 7 days
};

const filterByPeriod = () => {
  // Implement period filtering logic
  currentPage.value = 1;
};

const viewOrderDetails = (orderId) => {
  selectedOrder.value = orders.value.find((order) => order.id === orderId);
  showOrderModal.value = true;
};

const downloadReceipt = async (orderId) => {
  try {
    // Logic to download receipt PDF
    alert("กำลังดาวน์โหลดใบเสร็จ...");
  } catch (error) {
    console.error("Error downloading receipt:", error);
    alert("เกิดข้อผิดพลาดในการดาวน์โหลดใบเสร็จ");
  }
};

const requestRefund = async (orderId) => {
  if (!confirm("คุณแน่ใจหรือไม่ที่จะขอคืนเงินสำหรับคำสั่งซื้อนี้?")) return;

  try {
    // Logic to request refund
    alert("ส่งคำขอคืนเงินเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error requesting refund:", error);
    alert("เกิดข้อผิดพลาดในการส่งคำขอคืนเงิน");
  }
};

const exportHistory = async () => {
  try {
    // Logic to export purchase history
    alert("กำลังส่งออกข้อมูล...");
  } catch (error) {
    console.error("Error exporting history:", error);
    alert("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
  }
};

// Pagination methods
const goToPage = (page) => {
  if (page !== "..." && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// SEO
useSeoMeta({
  title: "Purchase History - Patong Boxing Stadium",
  description:
    "View your complete purchase history and manage orders at Patong Boxing Stadium",
  ogTitle: "Purchase History - Patong Boxing Stadium",
  ogDescription: "Track your boxing ticket purchases and download receipts",
});
</script>
