<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative border border-blue-200"
    >
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
      >
        <i class="mdi mdi-close text-lg"></i>
      </button>

      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-amber-500 p-2 rounded-lg">
          <i class="mdi mdi-account-check text-white text-lg"></i>
        </div>
        <div>
          <h3 class="text-xl font-bold text-blue-900">
            อัพเดทสถานะการเข้าร่วม
          </h3>
          <p class="text-sm text-blue-600">ออเดอร์: {{ order?.orderNumber }}</p>
        </div>
      </div>

      <!-- Order Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="font-medium text-blue-700">ลูกค้า:</span>
            <span class="text-blue-900">{{
              order?.customerName || "ไม่ระบุ"
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-blue-700">เบอร์โทร:</span>
            <span class="text-blue-900">{{
              order?.customerPhone || "ไม่ระบุ"
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-blue-700">วันที่แสดง:</span>
            <span class="text-blue-900">{{
              order?.showDate || "ไม่ระบุ"
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-blue-700">สถานะปัจจุบัน:</span>
            <span
              class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium"
            >
              {{ getAttendanceStatusLabel(order?.attendanceStatus) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Status Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-blue-700 mb-3">
          เลือกสถานะการเข้าร่วมใหม่
        </label>
        <div class="space-y-3">
          <label
            v-for="status in attendanceStatusOptions"
            :key="status.value"
            class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
            :class="{
              'bg-blue-100 border-blue-300': selectedStatus === status.value,
            }"
          >
            <input
              v-model="selectedStatus"
              type="radio"
              :value="status.value"
              class="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <div class="font-medium text-gray-900">{{ status.label }}</div>
              <div class="text-sm text-gray-600">{{ status.description }}</div>
            </div>
            <div
              class="w-3 h-3 rounded-full ml-2"
              :class="status.colorClass"
            ></div>
          </label>
        </div>
      </div>

      <!-- Note Input -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-blue-700 mb-2">
          หมายเหตุ (ไม่บังคับ)
        </label>
        <textarea
          v-model="updateNote"
          rows="3"
          placeholder="เพิ่มหมายเหตุสำหรับการอัพเดทนี้..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="closeModal"
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          ยกเลิก
        </button>
        <button
          @click="updateAttendanceStatus"
          :disabled="!selectedStatus || isUpdating"
          class="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <i v-if="isUpdating" class="mdi mdi-loading animate-spin mr-2"></i>
          {{ isUpdating ? "กำลังอัพเดท..." : "อัพเดท" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useOrder } from "../composables/useOrder";
import { useSingleToast } from "../composables/useSingleToast";

interface Props {
  showModal: boolean;
  order?: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:showModal": [value: boolean];
  success: [];
  close: [];
}>();

// Composables
const { updateOrder } = useOrder();
const { showToast } = useSingleToast();

// State
const selectedStatus = ref("");
const updateNote = ref("");
const isUpdating = ref(false);

// Attendance status options with descriptions
const attendanceStatusOptions = [
  {
    value: "CHECKED_IN",
    label: "เข้าร่วมแล้ว",
    description: "ลูกค้าเข้าร่วมกิจกรรมแล้ว",
    colorClass: "bg-green-500",
  },
  {
    value: "PENDING",
    label: "กำลังรอ",
    description: "กำลังรอการเข้าร่วม",
    colorClass: "bg-red-500",
  },
  {
    value: "NO_SHOW",
    label: "ไม่เข้าร่วม",
    description: "ลูกค้าไม่เข้าร่วมกิจกรรม",
    colorClass: "bg-gray-500",
  },
];

// Computed
const getAttendanceStatusLabel = (status: string) => {
  const option = attendanceStatusOptions.find((opt) => opt.value === status);
  return option?.label || status || "ไม่ระบุ";
};

// Methods
const closeModal = () => {
  emit("update:showModal", false);
  emit("close");
  resetForm();
};

const resetForm = () => {
  selectedStatus.value = "";
  updateNote.value = "";
  isUpdating.value = false;
};

const updateAttendanceStatus = async () => {
  if (!selectedStatus.value || !props.order) {
    showToast("error", "กรุณาเลือกสถานะการเข้าร่วม");
    return;
  }

  isUpdating.value = true;

  try {
    await updateOrder(props.order.id, selectedStatus.value);

    showToast(
      "success",
      `อัพเดทสถานะการเข้าร่วมเป็น "${getAttendanceStatusLabel(
        selectedStatus.value
      )}" สำเร็จ`
    );

    emit("success");
    closeModal();
  } catch (error) {
    console.error("Failed to update attendance status:", error);
    // Error message is already handled in useOrder composable
  } finally {
    isUpdating.value = false;
  }
};

// Watch for modal changes to reset form
watch(
  () => props.showModal,
  (newValue) => {
    if (newValue) {
      // Reset form when opening modal
      selectedStatus.value = "";
      updateNote.value = "";
    } else {
      resetForm();
    }
  }
);
</script>

<style scoped>
/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
input:focus {
  outline: none;
}

/* Backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
}
</style>
