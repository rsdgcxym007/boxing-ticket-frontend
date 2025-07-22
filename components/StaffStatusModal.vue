<template>
  <BaseModal
    :isOpen="isOpen"
    @update:isOpen="isOpen = $event"
    title="เปลี่ยนสถานะพนักงาน"
    @close="closeModal"
  >
    <div v-if="staff" class="space-y-6">
      <!-- Staff Info -->
      <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 h-12 w-12">
          <img
            v-if="staff.avatar"
            :src="staff.avatar"
            :alt="`${staff.firstName} ${staff.lastName}`"
            class="h-12 w-12 rounded-full object-cover"
          />
          <div
            v-else
            class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center"
          >
            <i class="mdi mdi-account text-gray-600 text-xl"></i>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">
            {{ staff.firstName }} {{ staff.lastName }}
          </h3>
          <p class="text-sm text-gray-600">{{ staff.email }}</p>
          <p class="text-xs text-gray-500">รหัส: {{ staff.staffCode }}</p>
        </div>
      </div>

      <!-- Current Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          สถานะปัจจุบัน
        </label>
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          :class="getStatusBadgeClass(staff.status)"
        >
          {{ getStatusLabel(staff.status) }}
        </span>
      </div>

      <!-- New Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          สถานะใหม่
        </label>
        <BaseSelect
          v-model="newStatus"
          :options="statusOptions"
          placeholder="เลือกสถานะใหม่"
          required
          :error="errors.status"
        />
      </div>

      <!-- Reason -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          เหตุผล
        </label>
        <textarea
          v-model="reason"
          rows="3"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="กรอกเหตุผลในการเปลี่ยนสถานะ (ไม่บังคับ)"
        ></textarea>
      </div>

      <!-- Warning Messages -->
      <div
        v-if="showWarning"
        class="p-4 bg-yellow-50 border border-yellow-200 rounded-md"
      >
        <div class="flex">
          <i class="mdi mdi-alert text-yellow-400 text-xl mr-3"></i>
          <div>
            <h4 class="text-sm font-medium text-yellow-800">คำเตือน</h4>
            <p class="text-sm text-yellow-700 mt-1">
              {{ warningMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4 pt-6 border-t">
        <BaseButton @click="closeModal" variant="outline" color="gray">
          ยกเลิก
        </BaseButton>
        <BaseButton
          @click="handleSubmit"
          :color="confirmButtonColor"
          :loading="saving"
          :disabled="!newStatus || newStatus === staff.status"
        >
          ยืนยันการเปลี่ยนแปลง
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useStaff, type Staff } from "../composables/useStaff";

interface Props {
  modelValue: boolean;
  staff?: Staff | null;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { changeStaffStatus } = useStaff();

// State
const saving = ref(false);
const newStatus = ref("");
const reason = ref("");
const errors = ref({
  status: "",
});

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const statusOptions = [
  { value: "active", label: "ปฏิบัติงาน" },
  { value: "inactive", label: "ไม่ปฏิบัติงาน" },
  { value: "suspended", label: "ถูกระงับ" },
  { value: "terminated", label: "ถูกไล่ออก" },
];

const showWarning = computed(() => {
  return newStatus.value === "suspended" || newStatus.value === "terminated";
});

const warningMessage = computed(() => {
  if (newStatus.value === "suspended") {
    return "การระงับพนักงานจะทำให้พนักงานไม่สามารถเข้าใช้งานระบบได้ชั่วคราว";
  }
  if (newStatus.value === "terminated") {
    return "การไล่ออกพนักงานจะทำให้พนักงานไม่สามารถเข้าใช้งานระบบได้อีกต่อไป";
  }
  return "";
});

const confirmButtonColor = computed(() => {
  if (newStatus.value === "terminated") return "red";
  if (newStatus.value === "suspended") return "yellow";
  if (newStatus.value === "active") return "green";
  return "blue";
});

// Methods
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "ปฏิบัติงาน",
    inactive: "ไม่ปฏิบัติงาน",
    suspended: "ถูกระงับ",
    terminated: "ถูกไล่ออก",
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-yellow-100 text-yellow-800",
    terminated: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const handleSubmit = async () => {
  if (!props.staff || !newStatus.value) return;

  errors.value.status = "";

  if (newStatus.value === props.staff.status) {
    errors.value.status = "กรุณาเลือกสถานะที่แตกต่างจากสถานะปัจจุบัน";
    return;
  }

  try {
    saving.value = true;

    await changeStaffStatus(
      props.staff.id,
      newStatus.value as any,
      reason.value || undefined
    );

    emit("saved");
    closeModal();
  } catch (error) {
    console.error("Failed to change staff status:", error);
  } finally {
    saving.value = false;
  }
};

const closeModal = () => {
  emit("update:modelValue", false);
  newStatus.value = "";
  reason.value = "";
  errors.value.status = "";
};

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && props.staff) {
      newStatus.value = props.staff.status;
    } else {
      newStatus.value = "";
      reason.value = "";
      errors.value.status = "";
    }
  }
);
</script>

<style scoped>
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}
</style>
