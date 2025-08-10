<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#0a1323] text-white px-4"
  >
    <div
      class="w-full max-w-xl p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl space-y-8"
    >
      <h2
        class="text-3xl font-semibold text-center flex items-center justify-center gap-2 text-white"
      >
        <i class="mdi mdi-ticket-confirm-outline text-blue-400 text-4xl" />
        ออกตั๋วยืน
      </h2>

      <!-- Purchase Type -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
          <i class="mdi mdi-store-outline text-orange-400" />
          ประเภทการซื้อ
        </label>
        <div class="flex gap-4">
          <label
            v-for="option in purchaseTypeOptionsForForm.filter(
              (o) =>
                o.value === OrderPurchaseType.ONSITE ||
                o.value === OrderPurchaseType.BOOKING
            )"
            :key="option.value"
            class="flex-1 flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-white/20 hover:border-orange-400 bg-white/5 hover:bg-orange-50/10 transition-all duration-300"
          >
            <input
              type="radio"
              v-model="pageData.purchaseType"
              :value="option.value"
              class="accent-orange-500 w-4 h-4"
            />
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-100/20 rounded-lg">
                <i :class="`mdi ${option.icon} text-orange-400 text-lg`"></i>
              </div>
              <div>
                <p class="font-semibold text-white">{{ option.label }}</p>
                <p class="text-xs text-gray-400">{{ option.description }}</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- 🏨 ข้อมูลโรงแรม -->
      <div
        v-if="pageData.purchaseType === OrderPurchaseType.BOOKING"
        class="space-y-4 p-4 rounded-xl border border-orange-300/30 bg-orange-50/5"
      >
        <h3
          class="text-lg font-semibold text-orange-300 flex items-center gap-2"
        >
          <i class="mdi mdi-domain text-orange-400" />
          ข้อมูลโรงแรม / ข้อมูลผู้จอง
        </h3>

        <!-- ข้อมูลผู้จอง -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-account-outline text-lg" />
              ชื่อผู้ซื้อ
            </label>
            <input
              v-model="pageData.customerName"
              type="text"
              placeholder="เช่น สมชาย ใจดี"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
            />
          </div>
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-phone-outline text-lg" />
              เบอร์โทรผู้ซื้อ
            </label>
            <input
              v-model="pageData.customerPhone"
              type="text"
              placeholder="เช่น 0801234567"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
              @input="
                pageData.customerPhone = pageData.customerPhone
                  .replace(/[^\d]/g, '')
                  .slice(0, 10)
              "
            />
            <p
              v-if="
                !/^\d{10}$/.test(pageData.customerPhone.trim()) &&
                pageData.customerPhone.trim()
              "
              class="text-xs text-red-500 mt-1"
            >
              ❌ เบอร์โทรต้องมี 10 ตัวเลข
            </p>
          </div>
        </div>

        <div>
          <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
            <i class="mdi mdi-email-outline text-lg" />
            อีเมลผู้ซื้อ
          </label>
          <input
            v-model="pageData.customerEmail"
            type="text"
            placeholder="เช่น example@gmail.com"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
          />
          <p
            v-if="
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                pageData.customerEmail.trim()
              ) && pageData.customerEmail.trim()
            "
            class="text-xs text-red-500 mt-1"
          >
            ❌ กรุณากรอกอีเมลให้ถูกต้อง
          </p>
        </div>

        <!-- ชื่อโรงแรมและเขต -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-home-city-outline text-lg" />
              ชื่อโรงแรม
            </label>
            <input
              v-model="pageData.hotelName"
              type="text"
              placeholder="เช่น โรงแรมแกรนด์พาเลซ"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
            />
          </div>
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-map-marker-outline text-lg" />
              เขต/พื้นที่
            </label>
            <input
              v-model="pageData.hotelDistrict"
              type="text"
              placeholder="เช่น สีลม, สุขุมวิท"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
            />
          </div>
        </div>

        <!-- หมายเลขห้องและ Voucher -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-door-closed-outline text-lg" />
              หมายเลขห้อง
            </label>
            <input
              v-model="pageData.roomNumber"
              type="text"
              placeholder="เช่น 1205"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
            />
          </div>
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-ticket-confirmation-outline text-lg" />
              เลขที่ Voucher (V/C)
            </label>
            <input
              v-model="pageData.voucherNumber"
              type="text"
              placeholder="เช่น VC12345"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
            />
          </div>
        </div>

        <!-- จำนวนผู้เข้าพัก -->
        <div class="flex gap-3">
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-account-outline text-lg" />
              ผู้ใหญ่ (AD)
            </label>
            <div class="flex items-center gap-2">
              <button
                @click="
                  pageData.adultCount = Math.max(1, pageData.adultCount - 1)
                "
                class="px-2 py-1 bg-orange-400 text-white rounded-full hover:bg-orange-500"
              >
                <i class="mdi mdi-minus" />
              </button>
              <input
                v-model.number="pageData.adultCount"
                type="number"
                min="1"
                class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
              />
              <button
                @click="pageData.adultCount++"
                class="px-2 py-1 bg-orange-400 text-white rounded-full hover:bg-orange-500"
              >
                <i class="mdi mdi-plus" />
              </button>
            </div>
          </div>
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-account-child-outline text-lg" />
              เด็ก (CH)
            </label>
            <div class="flex items-center gap-2">
              <button
                @click="
                  pageData.childCount = Math.max(0, pageData.childCount - 1)
                "
                class="px-2 py-1 bg-orange-400 text-white rounded-full hover:bg-orange-500"
              >
                <i class="mdi mdi-minus" />
              </button>
              <input
                v-model.number="pageData.childCount"
                type="number"
                min="0"
                class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
              />
              <button
                @click="pageData.childCount++"
                class="px-2 py-1 bg-orange-400 text-white rounded-full hover:bg-orange-500"
              >
                <i class="mdi mdi-plus" />
              </button>
            </div>
          </div>
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-baby-face-outline text-lg" />
              ทารก (IF)
            </label>
            <div class="flex items-center gap-2">
              <button
                @click="
                  pageData.infantCount = Math.max(0, pageData.infantCount - 1)
                "
                class="px-2 py-1 bg-orange-400 text-white rounded-full hover:bg-orange-500"
              >
                <i class="mdi mdi-minus" />
              </button>
              <input
                v-model.number="pageData.infantCount"
                type="number"
                min="0"
                class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
              />
              <button
                @click="pageData.infantCount++"
                class="px-2 py-1 bg-orange-400 text-white rounded-full hover:bg-orange-500"
              >
                <i class="mdi mdi-plus" />
              </button>
            </div>
          </div>
        </div>

        <!-- ข้อมูลการรับส่งและผู้จอง -->
        <div class="space-y-3">
          <div>
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-account-tie-outline text-lg" />
              ชื่อผู้จอง
            </label>
            <input
              v-model="pageData.bookerName"
              type="text"
              placeholder="เช่น คุณสมชาย ใจดี"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
            />
          </div>

          <div>
            <label class="text-sm mb-1 flex items-center gap-2 text-orange-300">
              <i class="mdi mdi-clock-time-four-outline text-lg" />
              เวลาที่คนไปรับ
            </label>
            <input
              v-model="pageData.pickupScheduledTime"
              type="time"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition hover:border-orange-300 hover:ring-1"
            />
          </div>

          <!-- การรับส่ง -->
          <div class="flex gap-4">
            <label
              class="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-orange-300/30 hover:border-orange-400 bg-white/5 hover:bg-orange-50/10 transition-all duration-300"
            >
              <input
                type="checkbox"
                v-model="pageData.includesPickup"
                class="accent-orange-500 w-4 h-4"
              />
              <div class="flex items-center gap-2">
                <i class="mdi mdi-car-pickup text-orange-400"></i>
                <span class="text-orange-200">รวมการรับ</span>
              </div>
            </label>

            <label
              class="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-orange-300/30 hover:border-orange-400 bg-white/5 hover:bg-orange-50/10 transition-all duration-300"
            >
              <input
                type="checkbox"
                v-model="pageData.includesDropoff"
                class="accent-orange-500 w-4 h-4"
              />
              <div class="flex items-center gap-2">
                <i class="mdi mdi-car-off text-orange-400"></i>
                <span class="text-orange-200">รวมการส่ง</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- จำนวนตั๋ว -->
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="text-sm mb-1 flex items-center gap-2 text-purple-300">
            <i class="mdi mdi-human-male text-purple-400" />
            ผู้ใหญ่ <span class="text-xs text-gray-400">(1500)</span>
          </label>
          <div class="flex items-center gap-2">
            <button
              @click="
                pageData.standingAdultQty = Math.max(
                  0,
                  pageData.standingAdultQty - 1
                )
              "
              class="px-2 py-1 bg-purple-400 text-white rounded-full hover:bg-purple-500"
            >
              <i class="mdi mdi-minus" />
            </button>
            <input
              v-model.number="pageData.standingAdultQty"
              type="number"
              min="0"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition hover:border-purple-300 hover:ring-1"
            />
            <button
              @click="pageData.standingAdultQty++"
              class="px-2 py-1 bg-purple-400 text-white rounded-full hover:bg-purple-500"
            >
              <i class="mdi mdi-plus" />
            </button>
          </div>
        </div>
        <div class="flex-1">
          <label class="text-sm mb-1 flex items-center gap-2 text-pink-300">
            <i class="mdi mdi-human-child text-pink-400" />
            เด็ก <span class="text-xs text-gray-400">(1300)</span>
          </label>
          <div class="flex items-center gap-2">
            <button
              @click="
                pageData.standingChildQty = Math.max(
                  0,
                  pageData.standingChildQty - 1
                )
              "
              class="px-2 py-1 bg-pink-400 text-white rounded-full hover:bg-pink-500"
            >
              <i class="mdi mdi-minus" />
            </button>
            <input
              v-model.number="pageData.standingChildQty"
              type="number"
              min="0"
              class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition hover:border-pink-300 hover:ring-1"
            />
            <button
              @click="pageData.standingChildQty++"
              class="px-2 py-1 bg-pink-400 text-white rounded-full hover:bg-pink-500"
            >
              <i class="mdi mdi-plus" />
            </button>
          </div>
        </div>
      </div>

      <!-- Referrer -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-yellow-300">
          <i class="mdi mdi-account-star-outline text-yellow-400" />
          Referrer Code (ถ้ามี)
        </label>
        <BaseSelect
          v-model="pageData.referrerCode"
          :options="masterData || []"
          placeholder="กรอกรหัสผู้แนะนำ เช่น FRESHYTOUR"
          clearable
          searchable
          className="w-full h-[40.5px]"
        />
      </div>

      <!-- วันที่ -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-indigo-300">
          <i class="mdi mdi-calendar-month-outline text-indigo-400" />
          วันที่แสดง
        </label>
        <DatePicker
          v-model="pageData.showDate"
          placeholder="เลือกวันที่"
          :dark="true"
        />
      </div>
      <!-- <div class="space-y-3">
        <label
          class="flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 border-green-200 hover:border-green-400 bg-white hover:bg-green-50 transition-all duration-300"
        >
          <input
            type="radio"
            v-model="pageData.paymentMethod"
            value="CASH"
            class="accent-green-600 w-5 h-5"
          />
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <i class="mdi mdi-wallet-outline text-green-600 text-xl"></i>
            </div>
            <div>
              <p class="font-bold text-gray-800">{{ "CASH" }}</p>
            </div>
          </div>
        </label>
      </div> -->
      <!-- <div class="space-y-3 mt-2">
        <label
          class="flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 border-green-200 hover:border-green-400 bg-white hover:bg-green-50 transition-all duration-300"
        >
          <input
            type="radio"
            v-model="pageData.paymentMethod"
            value="CREDIT_CARD"
            class="accent-green-600 w-5 h-5"
          />
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <i class="mdi mdi-wallet-outline text-green-600 text-xl"></i>
            </div>
            <div>
              <p class="font-bold text-gray-800">{{ "VISA CARD" }}</p>
            </div>
          </div>
        </label>
      </div>
      <div
        class="text-right text-lg font-semibold text-white bg-white/10 p-4 rounded-xl border border-white/20"
      >
        รวมทั้งหมด:
        <span class="text-green-400">
          {{ calculateTotal().toLocaleString() }} บาท
        </span>
      </div> -->
      <!-- ปุ่มดำเนินการ -->
      <div class="flex flex-col gap-3 pt-2">
        <!-- 🆕 ปุ่มจองแบบใหม่ (แนะนำ) -->
        <BaseButton
          @click="bookStandingTicketNew"
          variant="primary"
          size="lg"
          :disabled="isLoading.loading"
          class="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <i class="mdi mdi-ticket-plus-outline text-xl" />
          สร้างออเดอร์
        </BaseButton>
        <BaseButton
          @click="bookStandingBooking"
          variant="primary"
          size="lg"
          :disabled="isLoading.loading"
          class="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <i class="mdi mdi-ticket-plus-outline text-xl" />
          จองออเดอร์
        </BaseButton>

        <!-- 🆕 ปุ่มยืนยันการชำระเงิน -->
        <!-- <BaseButton
          @click="confirmPaymentForOrder"
          variant="success"
          size="lg"
          :disabled="isLoading.loading || orderId === null"
          class="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
        >
          <i class="mdi mdi-cash-check-outline text-xl text-green-500" />
          ยืนยันการชำระเงิน
        </BaseButton> -->
      </div>
    </div>
  </div>
  <SummaryModal
    v-if="showSummaryModal"
    :visible="showSummaryModal"
    :purchaseType="pageData.purchaseType"
    :selectedSeats="[]"
    :zone="'Standing'"
    :total="calculateTotal()"
    :userRole="''"
    :dataZoneSelected="dataOrder"
    :mode="'CASH'"
    @close="onCloseSummaryModal"
  />
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useReferrerMasterData } from "../composables/useReferrerMasterData";
import BaseSelect from "../components/base/BaseSelect.vue";
import { purchaseTypeOptions } from "../utils/orderOptions";

// Referrer options from master data
const { masterData, fetchMasterData } = useReferrerMasterData();

// Purchase type options for form with icons and descriptions
const purchaseTypeOptionsForForm = computed(() =>
  purchaseTypeOptions.map((option) => ({
    ...option,
    icon:
      option.value === OrderPurchaseType.WEBSITE
        ? "mdi-web"
        : option.value === OrderPurchaseType.BOOKING
        ? "mdi-phone-in-talk"
        : "mdi-store",
    description:
      option.value === OrderPurchaseType.WEBSITE
        ? "ซื้อผ่านเว็บไซต์"
        : option.value === OrderPurchaseType.BOOKING
        ? "BOOKING"
        : "ซื้อหน้างาน",
  }))
);

onMounted(async () => {
  await fetchMasterData();
});

import { ref } from "vue";
import { useSingleToast } from "../composables/useSingleToast";

// 🎯 API Composables - ใช้ฟังก์ชันใหม่ที่อัปเดตแล้ว
import { usePayments } from "../composables/usePayments";
import { useOrder } from "../composables/useOrder";

// 🏪 Store Management
import { useAuthStore } from "../stores/auth";
import { usePageData } from "../stores/pageData";
import { useIntegratedSeatBooking } from "../composables/useIntegratedSeatBooking";

import { OrderPurchaseType } from "@/types/Enums";
// 📱 การตั้งค่าเริ่มต้น
const auth = useAuthStore();
const isLoading = usePageData();
const { showToast } = useSingleToast();
const showSummaryModal = ref(false);
const dataOrder = ref();
const seatBookingSystem = useIntegratedSeatBooking();
const { clearAllSelections } = seatBookingSystem;
// 🎫 Payment & Order API - ใช้ฟังก์ชันใหม่
const { submitOrder, cancelOrder } = useOrder();
const { createStandingPayment } = usePayments();

// 📅 ตั้งค่าวันที่เริ่มต้น (วันปัจจุบัน)
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

// 📋 ข้อมูลฟอร์มสำหรับจองตั๋วยืน
const pageData = ref({
  customerName: "", // ชื่อลูกค้า
  customerPhone: "", // เบอร์โทรลูกค้า
  customerEmail: "", // อีเมลลูกค้า
  standingAdultQty: 1, // จำนวนตั๋วผู้ใหญ่
  standingChildQty: 0, // จำนวนตั๋วเด็ก
  referrerCode: null, // รหัสผู้แนะนำ
  paymentMethod: "CASH", // วิธีการชำระเงิน (เริ่มต้นเป็นเงินสด)
  showDate: `${yyyy}-${mm}-${dd}`, // วันที่แสดง
  purchaseType: "ONSITE", // ประเภทการซื้อ (เริ่มต้นเป็นหน้างาน)
  // 🏨 ข้อมูลโรงแรม
  hotelName: null, // ชื่อโรงแรม
  hotelDistrict: null, // เขต/พื้นที่
  roomNumber: null, // หมายเลขห้อง
  adultCount: 0, // จำนวนผู้ใหญ่ (AD)
  childCount: 0, // จำนวนเด็ก (CH)
  infantCount: 0, // จำนวนทารก (IF)
  voucherNumber: null, // เลขที่ voucher (V/C)
  pickupScheduledTime: null, // เวลาที่คนไปรับ
  bookerName: null, // ชื่อผู้จอง
  includesPickup: false, // รวมการรับ
  includesDropoff: false, // รวมการส่ง
});

const orderId = ref<string | null>(null);

// 💰 คำนวณราคารวม
const calculateTotal = () => {
  const { standingAdultQty, standingChildQty } = pageData.value;
  return standingAdultQty * 1500 + standingChildQty * 1300;
};

const bookStandingBooking = async () => {
  isLoading.loading = true;

  try {
    // ส่งข้อมูลทั้งหมดใน pageData.value เข้า submitOrder โดยตรง
    const response = await submitOrder({
      ...pageData.value,
      status: "BOOKED",
      ticketType: "STANDING",
    });
    // รวมค่าที่ผู้ใช้กรอกไว้ในฟอร์ม (pageData) เข้ากับข้อมูลที่ตอบจาก API
    // เพื่อให้ SummaryModal แสดงค่าที่กรอกได้ทันที แม้ API จะไม่ echo ฟิลด์ทั้งหมดกลับมา
    dataOrder.value = {
      ...(response || {}),
      ...pageData.value,
      // ทำให้แน่ใจว่ามี orderId ให้ modal ใช้
      orderId: (response && (response.id || response.orderId)) || undefined,
    };

    showToast("success", "🎉 จองตั๋วยืนสำเร็จ! คุณสามารถชำระเงินได้แล้ว");

    if (response?.id) {
      orderId.value = response.id;
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการจองตั๋ว:", error);
    // showToast("error", "❌ ไม่สามารถจองตั๋วได้ กรุณาลองใหม่อีกครั้ง");
  } finally {
    isLoading.loading = false;
  }
};
// 🆕 จองตั๋วยืนแบบใหม่ (แนะนำ - ใช้ API v1)
const bookStandingTicketNew = async () => {
  isLoading.loading = true;

  try {
    // ส่งข้อมูลทั้งหมดใน pageData.value เข้า submitOrder โดยตรง
    const response = await submitOrder({
      ...pageData.value,
      ticketType: "STANDING",
    });
    // รวมค่าที่ผู้ใช้กรอกไว้ในฟอร์ม (pageData) เข้ากับข้อมูลที่ตอบจาก API
    // เพื่อให้ SummaryModal แสดงค่าที่กรอกได้ทันที แม้ API จะไม่ echo ฟิลด์ทั้งหมดกลับมา
    dataOrder.value = {
      ...(response || {}),
      ...pageData.value,
      // ทำให้แน่ใจว่ามี orderId ให้ modal ใช้
      orderId: (response && (response.id || response.orderId)) || undefined,
    };

    showSummaryModal.value = true;
    showToast("success", "🎉 จองตั๋วยืนสำเร็จ! คุณสามารถชำระเงินได้แล้ว");

    if (response?.id) {
      orderId.value = response.id;
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการจองตั๋ว:", error);
    // showToast("error", "❌ ไม่สามารถจองตั๋วได้ กรุณาลองใหม่อีกครั้ง");
  } finally {
    isLoading.loading = false;
  }
};

// 🆕 ยืนยันการชำระเงิน
const confirmPaymentForOrder = async () => {
  if (!orderId.value) {
    showToast("error", "❌ ไม่พบข้อมูลออเดอร์ กรุณาจองตั๋วก่อน");
    return;
  }
  isLoading.loading = true;

  try {
    const paymentData = {
      orderId: orderId.value,
      method: pageData.value.paymentMethod,
      amount: calculateTotal(),
      customerName: pageData.value.customerName.trim(),
      referrerCode: pageData.value.referrerCode || undefined,
      purchaseType: pageData.value.purchaseType,
    };

    await createStandingPayment(paymentData as any);

    showToast("success", "🎉 ยืนยันการชำระเงินสำเร็จ!");
    // 🆕 ล้างค่าฟอร์มเพื่อสร้างออเดอร์ใหม่
    pageData.value = {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      standingAdultQty: 0,
      standingChildQty: 0,
      referrerCode: "",
      paymentMethod: "CASH",
      showDate: `${yyyy}-${mm}-${dd}`,
      purchaseType: pageData.value.purchaseType,
      // 🏨 ล้างข้อมูลโรงแรม
      hotelName: "",
      hotelDistrict: "",
      roomNumber: "",
      adultCount: 1,
      childCount: 0,
      infantCount: 0,
      voucherNumber: "",
      pickupScheduledTime: "",
      bookerName: "",
      includesPickup: false,
      includesDropoff: false,
    };
    orderId.value = null;
  } catch (error) {
    // console.error("❌ เกิดข้อผิดพลาดในการยืนยันการชำระเงิน:", error);
    showToast("error", `❌ ${error}`);
  } finally {
    isLoading.loading = false;
  }
};
const onCloseSummaryModal = async () => {
  showSummaryModal.value = false;
  const success = await cancelOrder(dataOrder.value.id);
};
</script>
