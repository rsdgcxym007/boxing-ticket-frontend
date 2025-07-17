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

      <!-- ชื่อผู้ซื้อ -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-blue-300">
          <i class="mdi mdi-account-outline text-lg" />
          ชื่อผู้ซื้อ
        </label>
        <input
          v-model="pageData.customerName"
          type="text"
          placeholder="เช่น สมชาย ใจดี"
          class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition hover:border-blue-300 hover:ring-1"
        />
      </div>

      <!-- เบอร์โทรผู้ซื้อ -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-green-300">
          <i class="mdi mdi-phone-outline text-lg" />
          เบอร์โทรผู้ซื้อ
        </label>
        <input
          v-model="pageData.customerPhone"
          type="text"
          placeholder="เช่น 0801234567"
          class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition hover:border-green-300 hover:ring-1"
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

      <!-- อีเมลผู้ซื้อ -->
      <div>
        <label class="text-sm mb-1 flex items-center gap-2 text-red-300">
          <i class="mdi mdi-email-outline text-lg" />
          อีเมลผู้ซื้อ
        </label>
        <input
          v-model="pageData.customerEmail"
          type="text"
          placeholder="เช่น example@gmail.com"
          class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition hover:border-red-300 hover:ring-1"
        />
        <p
          v-if="
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pageData.customerEmail.trim()) &&
            pageData.customerEmail.trim()
          "
          class="text-xs text-red-500 mt-1"
        >
          ❌ กรุณากรอกอีเมลให้ถูกต้อง
        </p>
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
        <input
          v-model="pageData.referrerCode"
          type="text"
          placeholder="เช่น FRESHYTOUR"
          class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition hover:border-yellow-300 hover:ring-1"
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
    :selectedSeats="[]"
    :zone="'Standing'"
    :total="calculateTotal().toLocaleString()"
    :userRole="''"
    :dataZoneSelected="dataOrder"
    :mode="'CASH'"
    @close="onCloseSummaryModal"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "vue-toastification";

// 🎯 API Composables - ใช้ฟังก์ชันใหม่ที่อัปเดตแล้ว
import { usePayments } from "../composables/usePayments";
import { useOrder } from "../composables/useOrder";

// 🏪 Store Management
import { useAuthStore } from "../stores/auth";
import { usePageData } from "../stores/pageData";
import { useIntegratedSeatBooking } from "../composables/useIntegratedSeatBooking";

// 📱 การตั้งค่าเริ่มต้น
const auth = useAuthStore();
const isLoading = usePageData();
const toast = useToast();
const showSummaryModal = ref(false);
const dataOrder = ref();
const seatBookingSystem = useIntegratedSeatBooking();
const { clearAllSelections } = seatBookingSystem;
// 🎫 Payment & Order API - ใช้ฟังก์ชันใหม่
const {
  submitOrder,
  cancelOrder, // 🆕 ใช้ API ใหม่สำหรับสร้างออเดอร์
} = useOrder();
const {
  createStandingPayment, // 🆕 ใช้ API ใหม่สำหรับชำระเงิน
} = usePayments();

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
  standingAdultQty: 0, // จำนวนตั๋วผู้ใหญ่
  standingChildQty: 0, // จำนวนตั๋วเด็ก
  referrerCode: "", // รหัสผู้แนะนำ
  paymentMethod: "CASH", // วิธีการชำระเงิน (เริ่มต้นเป็นเงินสด)
  showDate: `${yyyy}-${mm}-${dd}`, // วันที่แสดง
});

const orderId = ref<string | null>(null);

// 💰 คำนวณราคารวม
const calculateTotal = () => {
  const { standingAdultQty, standingChildQty } = pageData.value;
  return standingAdultQty * 1500 + standingChildQty * 1300;
};

// 🆕 จองตั๋วยืนแบบใหม่ (แนะนำ - ใช้ API v1)
const bookStandingTicketNew = async () => {
  const {
    standingAdultQty,
    standingChildQty,
    showDate,
    customerName,
    customerPhone,
    customerEmail,
    paymentMethod,
  } = pageData.value;

  // ✅ ตรวจสอบข้อมูลก่อนส่ง
  if (
    !showDate ||
    standingAdultQty + standingChildQty === 0 ||
    !customerName.trim()
  ) {
    toast.error("❌ กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อลูกค้า,จำนวนตั๋ว, วันที่)");
    return;
  }

  isLoading.loading = true;

  try {
    // 📋 เตรียมข้อมูลสำหรับ API v1
    const bookingData = {
      ticketType: "STANDING",
      standingAdultQty,
      standingChildQty,
      showDate,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      paymentMethod,
      referrerCode: pageData.value.referrerCode || undefined,
    };

    const response = await submitOrder(bookingData);
    dataOrder.value = response;
    console.log("dataOrder.value", dataOrder.value);

    showSummaryModal.value = true;
    // 🎉 แสดงผลลัพธ์การจอง
    toast.success("🎉 จองตั๋วยืนสำเร็จ! คุณสามารถชำระเงินได้แล้ว");

    // 📋 เก็บข้อมูลการจองสำหรับขั้นตอนถัดไป
    if (response.id) {
      orderId.value = response.id;
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการจองตั๋ว:", error);
    toast.error("❌ ไม่สามารถจองตั๋วได้ กรุณาลองใหม่อีกครั้ง");
  } finally {
    isLoading.loading = false;
  }
};

// 🆕 ยืนยันการชำระเงิน
const confirmPaymentForOrder = async () => {
  if (!orderId.value) {
    toast.error("❌ ไม่พบข้อมูลออเดอร์ กรุณาจองตั๋วก่อน");
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
    };

    await createStandingPayment(paymentData as any);

    toast.success("🎉 ยืนยันการชำระเงินสำเร็จ!");
    console.log("✅ ยืนยันการชำระเงินสำเร็จ");

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
    };
    orderId.value = null;
  } catch (error) {
    // console.error("❌ เกิดข้อผิดพลาดในการยืนยันการชำระเงิน:", error);
    toast.error(`❌ ${error}`);
  } finally {
    isLoading.loading = false;
  }
};
const onCloseSummaryModal = async () => {
  showSummaryModal.value = false;
  const success = await cancelOrder(dataOrder.value.id);
};
</script>
