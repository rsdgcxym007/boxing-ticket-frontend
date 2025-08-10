<template>
  <BaseModal
    :isOpen="props.showModal"
    @close="$emit('update:showModal', false)"
    size="large"
  >
    <div v-if="isDataLoading" class="flex items-center justify-center h-full">
      <BaseLoading />
    </div>
    <div
      v-else
      class="fixed inset-0 flex items-start justify-center bg-[#0a1323] text-white px-4 overflow-auto pt-16 pb-8"
    >
      <div
        class="w-full max-w-xl md:max-w-lg sm:max-w-md p-6 rounded-3xl border border-white bg-[#0a1323] backdrop-blur-md shadow-2xl space-y-8"
      >
        <button
          @click="$emit('update:showModal', false)"
          class="absolute top-4 right-4 text-white hover:text-red-500 transition"
        >
          <i class="mdi mdi-close text-2xl"></i>
        </button>

        <h2
          class="text-3xl font-semibold text-center flex items-center justify-center gap-2 text-white"
        >
          <i class="mdi mdi-ticket-confirm-outline text-blue-400 text-4xl" />
          Order: {{ pageData.orderNumber }}
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
          />
          <p
            v-if="
              pageData.customerPhone.trim() &&
              !/^\d{10}$/.test(pageData.customerPhone.trim())
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
            type="email"
            placeholder="เช่น example@email.com"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition hover:border-red-300 hover:ring-1"
          />
          <p
            v-if="
              pageData.customerEmail.trim() &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pageData.customerEmail.trim())
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
              <i class="mdi mdi-account-outline text-lg" />
              ผู้ใหญ่ (1,500 บาท)
            </label>
            <div class="flex items-center gap-2">
              <button
                @click="
                  pageData.standingAdultQty = Math.max(
                    0,
                    pageData.standingAdultQty - 1
                  )
                "
                class="px-3 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
              >
                -
              </button>
              <input
                v-model.number="pageData.standingAdultQty"
                type="number"
                min="0"
                class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition hover:border-purple-300 hover:ring-1"
              />
              <button
                @click="pageData.standingAdultQty++"
                class="px-3 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
              >
                +
              </button>
            </div>
          </div>
          <div class="flex-1">
            <label class="text-sm mb-1 flex items-center gap-2 text-pink-300">
              <i class="mdi mdi-account-outline text-lg" />
              เด็ก (1,300 บาท)
            </label>
            <div class="flex items-center gap-2">
              <button
                @click="
                  pageData.standingChildQty = Math.max(
                    0,
                    pageData.standingChildQty - 1
                  )
                "
                class="px-3 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
              >
                -
              </button>
              <input
                v-model.number="pageData.standingChildQty"
                type="number"
                min="0"
                class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition hover:border-pink-300 hover:ring-1"
              />
              <button
                @click="pageData.standingChildQty++"
                class="px-3 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Referrer -->
        <div>
          <label class="text-sm mb-1 flex items-center gap-2 text-yellow-300">
            <i class="mdi mdi-account-outline text-lg" />
            รหัสผู้แนะนำ (ถ้ามี)
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
            <i class="mdi mdi-calendar-outline text-lg" />
            วันที่แสดง
          </label>
          <DatePicker
            v-model="pageData.showDate"
            :dark="true"
            class="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition hover:border-indigo-300 hover:ring-1"
          />
        </div>

        <!-- ปุ่มดำเนินการ -->
        <div class="flex flex-col gap-3 pt-2">
          <BaseButton
            @click="handleCreateOrder"
            class="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            อัพเดทออเดอร์
          </BaseButton>

          <BaseButton
            @click="handlePayNow"
            :disabled="!orderId"
            class="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
          >
            ยืนยันการชำระเงิน
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
// นำเข้า utilities และ composables ที่จำเป็น
import { ref, watch, computed } from "vue";
import { useSingleToast } from "../composables/useSingleToast";
import { usePayments } from "../composables/usePayments";
import { useOrder } from "../composables/useOrder";
import { useAuthStore } from "../stores/auth";
import { usePageData } from "../stores/pageData";
import dayjs from "dayjs";

// กำหนดประเภทข้อมูลสำหรับออเดอร์ตั๋วยืน
interface StandingOrderData {
  id?: string;
  referrerCode?: string;
  orderNumber?: string;
  email?: string;
  total?: string;
  status?: string;
  method?: string;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string | null;
  referrerId?: string;
  referrerCommission?: number;
  showDate?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  standingAdultQty?: number;
  standingChildQty?: number;
  standingTotal?: number;
  standingCommission?: number;
  seats?: any[];
  seatBookings?: any[];
  referrer?: {
    name: string;
    code: string;
  };
  zoneName?: string;
}

// กำหนด props และ emits
const props = defineProps<{
  showModal: boolean;
  modelValue: boolean;
  order?: StandingOrderData;
  show?: boolean; // Explicitly declare the `show` prop
}>();

const emit = defineEmits(["update:showModal", "update:modelValue", "success"]);

// ใช้ composables และ stores
const { showToast } = useSingleToast();
const auth = useAuthStore();
const isLoading = usePageData();
const { updateStanding } = useOrder();
const {
  createStandingPayment, // 🆕 ใช้ API ใหม่สำหรับชำระเงิน
} = usePayments();

// ตัวแปร reactive สำหรับจัดการสถานะ
const orderId = ref<string | null>(props.order?.id ?? null);

// ข้อมูลฟอร์ม
const pageData = ref({
  customerName: props.order?.customerName ?? "",
  customerPhone: props.order?.customerPhone ?? "",
  customerEmail: props.order?.email ?? "",
  standingAdultQty: props.order?.standingAdultQty ?? 0,
  standingChildQty: props.order?.standingChildQty ?? 0,
  referrerCode: props.order?.referrerCode ?? props.order?.referrer?.code ?? "",
  showDate: props.order?.showDate ?? dayjs().format("YYYY-MM-DD"),
  orderNumber: props.order?.orderNumber ?? "", // เพิ่ม orderNumber
});

/**
 * ฟังก์ชันสำหรับสร้าง/อัพเดทออเดอร์
 */
const handleCreateOrder = async () => {
  isLoading.loading = true;
  const {
    standingAdultQty,
    standingChildQty,
    showDate,
    customerName,
    customerPhone,
    customerEmail,
  } = pageData.value;

  // ตรวจสอบข้อมูล
  if (
    !showDate ||
    !customerName.trim() ||
    !customerPhone.trim() ||
    !customerEmail.trim()
  ) {
    showToast("error", "กรุณากรอกข้อมูลให้ครบถ้วน");
    isLoading.loading = false;
    return;
  }

  if (standingAdultQty + standingChildQty === 0) {
    showToast("error", "กรุณาระบุจำนวนตั๋วอย่างน้อย 1 ใบ");
    isLoading.loading = false;
    return;
  }

  try {
    // เรียก API สำหรับอัพเดทออเดอร์
    const res = await updateStanding({
      id: props.order?.id ?? "",
      standingAdultQty,
      standingChildQty,
      showDate: dayjs(showDate).format("YYYY-MM-DD"),
      paymentMethod: "CASH",
      referrerCode: pageData.value.referrerCode ?? "",
      customerName: pageData.value.customerName,
      customerPhone: pageData.value.customerPhone,
      customerEmail: pageData.value.customerEmail,
    } as any);

    orderId.value = res.id;
  } catch (err: any) {
    console.error("เกิดข้อผิดพลาดในการอัพเดทออเดอร์:", err);
    showToast("error", err.message || "เกิดข้อผิดพลาดในการอัพเดทออเดอร์");
  } finally {
    isLoading.loading = false;
  }
};

/**
 * ฟังก์ชันสำหรับชำระเงิน
 */
const handlePayNow = async () => {
  if (!orderId.value) {
    showToast("error", "กรุณาอัพเดทออเดอร์ก่อนชำระเงิน");
    return;
  }

  isLoading.loading = true;
  const { standingAdultQty, standingChildQty, customerName, referrerCode } =
    pageData.value;
  const total = standingAdultQty * 1500 + standingChildQty * 1300;

  try {
    // เรียก API สำหรับชำระเงิน
    await createStandingPayment({
      orderId: orderId.value,
      amount: total,
      method: "CASH",
      customerName,
      referrerCode: referrerCode || undefined,
    });

    showToast("success", "ชำระเงินสำเร็จ");

    // ปิด modal และแจ้งเตือนว่าสำเร็จ
    emit("update:modelValue", false);
    emit("success");
  } catch (err: any) {
    console.error("เกิดข้อผิดพลาดในการชำระเงิน:", err);
    showToast("error", err.message || "ไม่สามารถชำระเงินได้");
  } finally {
    isLoading.loading = false;
  }
};

// เพิ่มตัวแปร reactive สำหรับสถานะการโหลด
const isDataLoading = ref(false);

/**
 * ตรวจสอบการเปลี่ยนแปลงของ props.order
 */
watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      isDataLoading.value = true; // เริ่มโหลดข้อมูล
      pageData.value = {
        customerName: newOrder.customerName ?? "",
        customerEmail: newOrder.email ?? "",
        customerPhone: newOrder.customerPhone ?? "",
        standingAdultQty: newOrder.standingAdultQty ?? 0,
        standingChildQty: newOrder.standingChildQty ?? 0,
        referrerCode: newOrder.referrerCode ?? newOrder.referrer?.code ?? "",
        showDate: newOrder.showDate ?? dayjs().format("YYYY-MM-DD"),
        orderNumber: newOrder.orderNumber ?? "",
      };
      orderId.value = newOrder.id ?? null;
      isDataLoading.value = false; // ข้อมูลโหลดเสร็จแล้ว
    }
  },
  { immediate: true }
);

/**
 * ตรวจสอบการเปลี่ยนแปลงของ props.showModal
 */
watch(
  () => props.showModal,
  async (newShowModal) => {
    if (newShowModal) {
      isDataLoading.value = true;
      try {
        // โหลดข้อมูลใหม่เมื่อ modal ถูกเปิด
        if (props.order) {
          pageData.value = {
            customerName: props.order.customerName ?? "",
            customerEmail: props.order.email ?? "",
            customerPhone: props.order.customerPhone ?? "",
            standingAdultQty: props.order.standingAdultQty ?? 0,
            standingChildQty: props.order.standingChildQty ?? 0,
            referrerCode:
              props.order.referrerCode ?? props.order.referrer?.code ?? "",
            showDate: props.order.showDate ?? dayjs().format("YYYY-MM-DD"),
            orderNumber: props.order.orderNumber ?? "",
          };
          orderId.value = props.order.id ?? null;
        }
      } catch (error) {
        console.error("Error loading order data:", error);
      } finally {
        isDataLoading.value = false;
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* CSS Animation สำหรับการเปลี่ยนแปลงที่นุ่มนวล */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for better UX */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Debug styles for modal visibility */
.standing-ticket-modal {
  z-index: 9999;
  display: block !important;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-top: 4rem; /* Ensure content starts below the top bar */
  padding-bottom: 2rem;
}

.backdrop-blur-md {
  backdrop-filter: blur(10px);
}

.absolute {
  position: absolute;
}

.top-4 {
  top: 1rem;
}

.right-4 {
  right: 1rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.hover\:text-red-500:hover {
  color: #ef4444;
}

.transition {
  transition: all 0.2s ease-in-out;
}

@media (max-width: 768px) {
  .standing-ticket-modal div {
    max-width: 90%;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .standing-ticket-modal div {
    max-width: 95%;
    padding: 0.5rem;
  }

  .text-3xl {
    font-size: 1.25rem;
  }

  .text-4xl {
    font-size: 1.75rem;
  }

  input {
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  button {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}
</style>
