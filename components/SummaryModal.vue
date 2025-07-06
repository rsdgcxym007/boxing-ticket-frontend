<template>
  <BaseModal :isOpen="visible" @close="$emit('close')" size="medium">
    <template #header>
      <div class="flex items-center justify-center gap-2">
        <i class="mdi mdi-file-document-outline text-gray-800 text-2xl"></i>
        <h2 class="text-xl font-semibold text-gray-900">
          {{ t("summary.title") }}
        </h2>
      </div>
    </template>

    <div class="max-h-[70vh] overflow-y-auto p-4">
      <!-- Booking Details -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">รายละเอียดการจอง</h3>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-700"
              >{{ t("summary.zone") }}:</span
            >
            <span class="text-sm text-gray-900 font-semibold">{{
              pageData.zoneKey.toUpperCase()
            }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-700"
              >{{ t("summary.seats") }}:</span
            >
            <span class="text-sm text-gray-900 font-semibold">{{
              pageData.selectedSeats.map((s) => s.seatNumber).join(", ")
            }}</span>
          </div>

          <div class="flex justify-between border-t pt-3">
            <span class="text-sm font-medium text-gray-700"
              >{{ t("summary.total") }}:</span
            >
            <span class="text-lg font-bold text-blue-600"
              >{{ total.toLocaleString() }} {{ t("summary.baht") }}</span
            >
          </div>

          <div v-if="countdown > 0" class="flex justify-center pt-2">
            <div
              class="bg-yellow-100 border border-yellow-300 rounded-lg p-3 inline-flex items-center gap-2"
            >
              <i class="mdi mdi-clock-outline text-yellow-700 text-lg"></i>
              <span class="text-sm font-medium text-yellow-700">
                {{ t("summary.timeLeft") }}: {{ Math.floor(countdown / 60) }}:{{
                  (countdown % 60).toString().padStart(2, "0")
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Selection -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          {{ t("summary.selectMethod") }}
        </h3>

        <div class="space-y-3">
          <label
            class="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            <input
              type="radio"
              v-model="pageData.method"
              value="cash"
              class="accent-blue-600 w-4 h-4"
            />
            <span class="flex items-center gap-2 text-gray-800">
              <i class="mdi mdi-wallet-outline text-lg"></i>
              {{ t("summary.cash") }}
            </span>
          </label>
        </div>
      </div>

      <!-- Customer Information Form -->
      <div v-if="pageData.method === 'cash'" class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อลูกค้า <span class="text-red-500">*</span>
          </label>
          <input
            v-model="pageData.customerName"
            type="text"
            placeholder="กรอกชื่อลูกค้า"
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="!pageData.customerName.trim()" class="text-sm text-red-500 mt-1">
            กรุณากรอกชื่อลูกค้า
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t("summary.cashAmount") }}
          </label>
          <input
            v-model="pageData.total"
            type="number"
            min="0"
            placeholder="จำนวนเงิน"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            อีเมล <span class="text-red-500">*</span>
          </label>
          <input
            v-model="pageData.customerEmail"
            type="email"
            placeholder="กรอกอีเมล"
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="!pageData.customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)" class="text-sm text-red-500 mt-1">
            กรุณากรอกอีเมลที่ถูกต้อง
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            เบอร์โทร <span class="text-red-500">*</span>
          </label>
          <input
            v-model="pageData.customerPhone"
            type="tel"
            placeholder="กรอกเบอร์โทร"
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="!pageData.customerPhone.match(/^\d{10}$/)" class="text-sm text-red-500 mt-1">
            กรุณากรอกเบอร์โทร 10 หลัก
          </p>
        </div>
      </div>

      <!-- Referrer Code -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >รหัสผู้แนะนำ (ถ้ามี)</label
        >
        <input
          v-model="pageData.referrerCode"
          type="text"
          placeholder="กรอกรหัสผู้แนะนำ"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <div class="flex justify-between gap-4">
        <button
          @click="onCancel"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          ยกเลิก
        </button>
        <button
          @click="submitOrders"
          :disabled="!isValid"
          :class="{ 'opacity-50 cursor-not-allowed': !isValid }"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ✅ ยืนยันการชำระเงิน
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
// นำเข้า utilities และ composables ที่จำเป็น
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/auth";
import { usePageData } from "@/stores/pageData";
import { useOrder } from "@/composables/useOrder";
import { usePayments } from "@/composables/usePayments";

// ใช้ stores และ composables
const auth = useAuthStore();
const toast = useToast();
const { t } = useI18n();
const router = useRouter();
const pageData = usePageData();

// ใช้ API composables
const { cancelOrder } = useOrder();
const { createSeatedPayment } = usePayments();

// กำหนด props และ emits
const props = defineProps({
  zone: String,
  selectedSeats: Array,
  visible: Boolean,
  total: Number,
  mode: { type: String, default: "booking" },
  userRole: { type: String, default: "GUEST" },
  dataZoneSelected: Object,
});

const emit = defineEmits(["close", "confirmed"]);

// ตัวแปร reactive สำหรับจัดการสถานะ
const slipFile = ref(null);
const slipPreview = ref(null);
const submitted = ref(false);
const countdown = ref(300); // 5 นาที
let countdownTimer;

/**
 * ฟังก์ชันสำหรับตั้งค่าตัวนับเวลา
 * จะนับถอยหลังจาก 5 นาที และปิด modal เมื่อหมดเวลา
 */
const setupCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      emit("close");
      toast.warning(t("summary.timeout"));
    }
  }, 1000);
};

// เมื่อ component ถูกโหลด
onMounted(async () => {
  setupCountdown();

  // ตั้งค่าเริ่มต้น
  pageData.method = "cash";
  pageData.zoneKey = props.zone;
  pageData.selectedSeats = props.selectedSeats;
  pageData.total = props.total;
});

// เมื่อ component ถูกทำลาย
onBeforeUnmount(() => {
  clearInterval(countdownTimer);
});

/**
 * ตรวจสอบว่าข้อมูลถูกต้องหรือไม่
 */
const isValid = computed(() => {
  if (pageData.method === "cash") {
    return (
      pageData.customerName &&
      pageData.customerName.trim().length > 0 &&
      pageData.customerEmail &&
      pageData.customerEmail.trim().length > 0 &&
      pageData.customerPhone &&
      pageData.customerPhone.trim().length > 0
    );
  }
  return true;
});

/**
 * ฟังก์ชันสำหรับยกเลิกการจอง
 */
const onCancel = async () => {
  try {
    await cancelOrder(props.dataZoneSelected.orderId);
    toast.success("ยกเลิกการจองเรียบร้อย");
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการยกเลิก:", err);
    toast.error(t("summary.cancelError"));
  } finally {
    emit("close");
  }
};

/**
 * ฟังก์ชันสำหรับยืนยันการชำระเงิน
 */
const submitOrders = async () => {
  // ตรวจสอบชื่อลูกค้า
  if (pageData.customerName.length === 0) {
    toast.warning("กรุณากรอกชื่อลูกค้าก่อนดำเนินการ");
    return;
  }

  submitted.value = true;

  try {
    // สร้างการชำระเงิน
    await createSeatedPayment({
      orderId: props.dataZoneSelected.orderId,
      amount: pageData.total,
      method: pageData.method.toUpperCase(),
      customerName: pageData.customerName,
      customerEmail: pageData.customerEmail,
      customerPhone: pageData.customerPhone,
      referrerCode: pageData.referrerCode || undefined,
    });

    console.log("ข้อมูลโซนที่เลือก:", props.dataZoneSelected);
    console.log("ข้อมูลหน้า:", pageData);

    // เปลี่ยนเส้นทางตามโหมด
    if (props.mode === "booking") {
      // สำหรับการจองทั่วไป
      router.push({
        path: "/confirmation",
        query: {
          orderId: props.dataZoneSelected.orderId,
          zone: pageData.zoneKey,
          seats: pageData.selectedSeats.map((s) => s.seatNumber).join(","),
          total: pageData.total,
        },
      });
      pageData.resetPageData();
      emit("close");
    } else {
      // สำหรับแอดมิน
      pageData.resetPageData();
      router.push({
        path: "/admin/orders",
      });
      emit("close");
    }

    toast.success("ยืนยันการชำระเงินเรียบร้อย");
  } catch (e) {
    toast.error(t("summary.submitError"));
    console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", e);
  } finally {
    submitted.value = false;
  }
};
</script>

<style scoped>
/* Removed custom CSS in favor of TailwindCSS */
</style>
