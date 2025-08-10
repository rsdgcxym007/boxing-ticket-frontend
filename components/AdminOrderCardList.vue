<template>
  <div class="space-y-3">
    <!-- No Orders -->
    <div
      v-if="orders.length === 0"
      class="bg-white rounded-xl border border-gray-200 p-12 text-center"
    >
      <div
        class="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <i class="mdi mdi-package-variant text-2xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่มีข้อมูลออเดอร์</h3>
      <p class="text-gray-600 text-sm">ไม่พบออเดอร์ที่ตรงกับเงื่อนไขการค้นหา</p>
    </div>

    <!-- Orders List -->
    <div class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group"
      >
        <!-- Compact Header -->
        <div
          class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-4 py-4 text-white relative overflow-hidden"
        >
          <!-- Decorative Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div
              class="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"
            ></div>
          </div>

          <div class="flex items-center justify-between relative z-10">
            <!-- Left: Order Info -->
            <div class="flex items-center space-x-3">
              <div
                class="bg-white/20 backdrop-blur-sm p-2 rounded-lg shadow-lg"
              >
                <i class="mdi mdi-receipt text-lg"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold tracking-wide">
                  {{ order.orderNumber }}
                </h2>
                <p class="text-blue-100 text-xs mt-1 font-medium">
                  <i class="mdi mdi-account-circle mr-1"></i>
                  {{ order.customerName || "ไม่ระบุชื่อ" }}
                  <span class="mx-1">•</span>
                  <i class="mdi mdi-phone mr-1"></i>
                  {{ order.customerPhone || "ไม่ระบุโทร" }}
                </p>
              </div>
            </div>

            <!-- Right: Status & Amount -->
            <div class="text-right">
              <div class="flex items-center justify-end gap-2 mb-2">
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
                  :class="orderHelpers.getStatusClass(order.status)"
                >
                  {{ orderHelpers.getStatusLabel(order.status) }}
                </span>
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
                  :class="
                    orderHelpers.getPaymentStatusClass(order.paymentStatus)
                  "
                >
                  {{ orderHelpers.getPaymentStatusLabel(order.paymentStatus) }}
                </span>
              </div>
              <div class="text-2xl font-black tracking-tight">
                ฿{{
                  orderHelpers.formatCurrency(
                    order.totalAmount || order.standingTotal
                  )
                }}
              </div>
              <div class="text-blue-100 text-xs mt-1 font-medium space-y-1">
                <!-- แสดง totalAmount สำหรับ PENDING status -->
                <div v-if="order.status === 'PENDING'" class="flex justify-end">
                  <span class="bg-white/20 px-2 py-1 rounded text-xs">
                    <i class="mdi mdi-cash-multiple mr-1"></i>
                    ยอดรวม: ฿{{
                      orderHelpers.formatCurrency(
                        order.totalAmount || order.standingTotal
                      )
                    }}
                  </span>
                </div>
                <!-- แสดง paymentAmount สำหรับ payment status -->
                <div v-if="order.paymentAmount > 0" class="flex justify-end">
                  <span class="bg-white/20 px-2 py-1 rounded text-xs">
                    <i class="mdi mdi-cash-check mr-1"></i>
                    ยอดที่จ่าย: ฿{{
                      orderHelpers.formatCurrency(order.paymentAmount)
                    }}
                  </span>
                </div>
                <div class="flex justify-end">
                  <span v-if="orderHelpers.getCommission(order) > 0">
                    <i class="mdi mdi-cash mr-1"></i>คอม: ฿{{
                      orderHelpers.formatCurrency(
                        orderHelpers.getCommission(order)
                      )
                    }}
                    <span class="mx-1">•</span>
                  </span>
                  <span>
                    <i class="mdi mdi-calculator mr-1"></i>สุทธิ: ฿{{
                      orderHelpers.formatCurrency(
                        orderHelpers.getNetAmount(order)
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Compact Information Layout -->
        <div class="px-4 py-3 bg-gradient-to-br from-gray-50 to-white">
          <!-- Horizontal Info Row -->
          <div class="flex flex-wrap items-center gap-3 text-xs">
            <!-- Ticket Type -->
            <div
              class="flex items-center gap-2 bg-green-50 px-2 py-1 rounded-lg border border-green-200"
            >
              <i class="mdi mdi-ticket text-green-600 text-sm"></i>
              <div>
                <span class="font-bold text-green-700">{{
                  orderHelpers.getTicketTypeLabel(order.ticketType)
                }}</span>
                <span
                  v-if="order.ticketType === 'STANDING'"
                  class="ml-2 text-green-600"
                >
                  <span v-if="order.standingAdultQty"
                    >AD:{{ order.standingAdultQty }}</span
                  >
                  <span v-if="order.standingChildQty" class="ml-1"
                    >CH:{{ order.standingChildQty }}</span
                  >
                </span>
                <span
                  v-else-if="order.seats?.length"
                  class="ml-2 text-green-600"
                >
                  {{ orderHelpers.getTicketDetails(order) }}
                </span>
              </div>
            </div>

            <!-- Show Date -->
            <div
              class="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200"
            >
              <i class="mdi mdi-calendar text-blue-600 text-sm"></i>
              <span class="font-bold text-blue-700">{{ order.showDate }}</span>
            </div>

            <!-- Payment Method -->
            <div
              class="flex items-center gap-2 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200"
            >
              <i class="mdi mdi-credit-card text-orange-600 text-sm"></i>
              <span class="font-bold text-orange-700">{{
                orderHelpers.getPaymentMethodLabel(order.paymentMethod)
              }}</span>
            </div>

            <!-- Hotel Info (if exists) -->
            <div
              v-if="order.hotelName"
              class="flex items-center gap-2 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200"
            >
              <i class="mdi mdi-bed text-purple-600 text-sm"></i>
              <div class="text-purple-700">
                <span class="font-bold">{{ order.hotelName }}</span>
                <span v-if="order.hotelDistrict" class="ml-1"
                  >({{ order.hotelDistrict }})</span
                >
                <span v-if="order.roomNumber" class="ml-1"
                  >ห้อง {{ order.roomNumber }}</span
                >
              </div>
            </div>

            <!-- Pickup Time (if exists) -->
            <div
              v-if="order.pickupScheduledTime"
              class="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200"
            >
              <i class="mdi mdi-clock-check text-indigo-600 text-sm"></i>
              <span class="font-bold text-indigo-700">{{
                order.pickupScheduledTime
              }}</span>
            </div>

            <!-- Management -->
            <div
              class="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200"
            >
              <i class="mdi mdi-account-group text-gray-600 text-sm"></i>
              <span class="font-bold text-gray-700">{{
                order.createdByName || "ไม่ระบุ"
              }}</span>
            </div>

            <!-- Referrer (if exists) -->
            <div
              v-if="order.referrer?.name"
              class="flex items-center gap-2 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200"
            >
              <i class="mdi mdi-account-plus text-yellow-600 text-sm"></i>
              <span class="font-bold text-yellow-700">{{
                order.referrer.name
              }}</span>
            </div>
          </div>

          <!-- Compact Tags Row with More Details -->
          <div
            class="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-200"
          >
            <!-- Total Amount -->
            <div
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 shadow-sm"
            >
              <i class="mdi mdi-currency-usd mr-1"></i>
              <span
                >ยอดรวม: ฿{{
                  orderHelpers.formatCurrency(
                    order.totalAmount || order.standingTotal
                  )
                }}</span
              >
            </div>

            <!-- Payment Amount (if different from total) -->
            <div
              v-if="
                order.paymentAmount &&
                order.paymentAmount !==
                  (order.totalAmount || order.standingTotal)
              "
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg text-xs font-bold border border-green-200 shadow-sm"
            >
              <i class="mdi mdi-cash-check mr-1"></i>
              <span
                >ยอดชำระ: ฿{{
                  orderHelpers.formatCurrency(order.paymentAmount)
                }}</span
              >
            </div>

            <!-- Outstanding Amount (if any) -->
            <div
              v-if="order.outstandingAmount && order.outstandingAmount > 0"
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200 shadow-sm"
            >
              <i class="mdi mdi-alert-circle mr-1"></i>
              <span
                >คงค้าง: ฿{{
                  orderHelpers.formatCurrency(order.outstandingAmount)
                }}</span
              >
            </div>

            <!-- Voucher Number -->
            <div
              v-if="order.voucherNumber"
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg text-xs font-bold border border-purple-200 shadow-sm"
            >
              <i class="mdi mdi-barcode mr-1"></i>
              <span>V/C: {{ order.voucherNumber }}</span>
            </div>

            <!-- Pickup/Dropoff Services -->
            <div
              v-if="order.includesPickup"
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg text-xs font-bold border border-green-200 shadow-sm"
            >
              <i class="mdi mdi-car-pickup mr-1"></i>
              <span>รับจากโรงแรม</span>
            </div>

            <div
              v-if="order.includesDropoff"
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 shadow-sm"
            >
              <i class="mdi mdi-car-off mr-1"></i>
              <span>ส่งถึงโรงแรม</span>
            </div>

            <!-- Passenger Info (if hotel booking) -->
            <div
              v-if="
                order.adultCount > 0 ||
                order.childCount > 0 ||
                order.infantCount > 0
              "
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 rounded-lg text-xs font-bold border border-amber-200 shadow-sm"
            >
              <i class="mdi mdi-account-group mr-1"></i>
              <span>
                <span v-if="order.adultCount > 0"
                  >AD:{{ order.adultCount }}</span
                >
                <span v-if="order.childCount > 0" class="ml-1"
                  >CH:{{ order.childCount }}</span
                >
                <span v-if="order.infantCount > 0" class="ml-1"
                  >IF:{{ order.infantCount }}</span
                >
              </span>
            </div>

            <!-- Booker Name (if different from customer) -->
            <div
              v-if="order.bookerName && order.bookerName !== order.customerName"
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200 shadow-sm"
            >
              <i class="mdi mdi-account-tie mr-1"></i>
              <span>จองโดย: {{ order.bookerName }}</span>
            </div>

            <!-- Purchase Type -->
            <div
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-xs font-bold border border-gray-200 shadow-sm"
            >
              <i class="mdi mdi-shopping mr-1"></i>
              <span>{{
                orderHelpers.getPurchaseTypeLabel(order.purchaseType)
              }}</span>
            </div>

            <!-- Source -->
            <div
              class="inline-flex items-center px-2 py-1 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 rounded-lg text-xs font-bold border border-teal-200 shadow-sm"
            >
              <i class="mdi mdi-source-branch mr-1"></i>
              <span>{{ orderHelpers.getSourceLabel(order.source) }}</span>
            </div>
          </div>
        </div>

        <!-- Compact Content Section -->
        <div class="px-4 py-3">
          <!-- Special Notes -->
          <div v-if="order.note" class="mb-3">
            <div
              class="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 rounded-lg p-3 shadow-sm"
            >
              <div class="flex items-start space-x-2">
                <div
                  class="bg-gradient-to-br from-amber-500 to-amber-600 p-1 rounded-lg shadow-md flex-shrink-0"
                >
                  <i class="mdi mdi-note-text text-white text-sm"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="font-black text-amber-800 mb-1 text-sm">
                    หมายเหตุ
                  </h4>
                  <p class="text-amber-700 leading-relaxed font-medium text-xs">
                    {{ order.note }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Compact Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-end gap-2">
            <button
              v-if="!['CANCELLED', 'EXPIRED'].includes(order.status)"
              @click="$emit('edit-order', order)"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform text-xs"
            >
              <i class="mdi mdi-pencil text-sm"></i>
              <span>แก้ไขออเดอร์</span>
            </button>
            <button
              v-if="
                order.status === OrderStatus.PAID &&
                order.paymentStatus === PaymentStatus.PAID
              "
              @click="$emit('generate-tickets', order)"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform text-xs"
            >
              <i class="mdi mdi-ticket-confirmation text-sm"></i>
              <span>ออกตั๋ว</span>
            </button>
            <button
              v-if="order.status !== OrderStatus.CANCELLED"
              @click="$emit('cancel-order', order)"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform text-xs"
            >
              <i class="mdi mdi-close-circle text-sm"></i>
              <span>ยกเลิกออเดอร์</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <nav v-if="totalPages > 1" class="flex justify-center mt-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <ul class="inline-flex items-center space-x-2">
        <li>
          <button
            class="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors border"
            :class="
              props.page === 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
            :disabled="props.page === 1"
            @click="emit('update:page', props.page - 1)"
          >
            <i class="mdi mdi-chevron-left"></i>
          </button>
        </li>
        <li v-for="page in paginationNumbers" :key="page">
          <button
            v-if="page !== '...'"
            class="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors border"
            :class="
              props.page === page
                ? 'bg-slate-600 text-white border-slate-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
            @click="emit('update:page', page)"
          >
            {{ page }}
          </button>
          <span
            v-else
            class="flex items-center justify-center w-10 h-10 text-gray-400"
            >...</span
          >
        </li>
        <li>
          <button
            class="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors border"
            :class="
              props.page === totalPages
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
            :disabled="props.page === totalPages"
            @click="emit('update:page', props.page + 1)"
          >
            <i class="mdi mdi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { OrderStatus, PaymentStatus } from "../types/Enums";
import * as orderHelpers from "../utils/orderHelpers";

const props = defineProps<{
  orders: any[];
  page: number;
  hasNext: boolean;
  total: number;
  perPage: number;
}>();

const emit = defineEmits([
  "update:page",
  "change-seats",
  "update-status",
  "cancel-order",
  "generate-tickets",
  "edit-order",
]);

const totalPages = computed(() =>
  props.total && props.perPage ? Math.ceil(props.total / props.perPage) : 1
);

const paginationNumbers = computed(() => {
  const current: number = typeof props.page === "number" ? props.page : 1;
  const total: number = totalPages.value;
  const pages: Array<number | string> = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }

  return pages;
});
</script>
