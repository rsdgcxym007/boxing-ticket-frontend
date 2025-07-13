<template>
  <BaseModal
    :isOpen="isOpen"
    @close="$emit('close')"
    title="ส่งออกรายงาน Audit"
    size="lg"
  >
    <form @submit.prevent="handleExport" class="space-y-6">
      <!-- Format Selection -->
      <div class="space-y-3">
        <label class="text-sm font-semibold text-gray-700">รูปแบบไฟล์</label>
        <div class="grid grid-cols-3 gap-3">
          <label
            class="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
            :class="
              form.format === 'csv'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            "
          >
            <input
              v-model="form.format"
              type="radio"
              value="csv"
              class="sr-only"
            />
            <div class="text-center">
              <i
                class="mdi mdi-file-delimited text-2xl text-green-500 mb-1"
              ></i>
              <div class="text-sm font-medium">CSV</div>
            </div>
          </label>
          <label
            class="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
            :class="
              form.format === 'excel'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            "
          >
            <input
              v-model="form.format"
              type="radio"
              value="excel"
              class="sr-only"
            />
            <div class="text-center">
              <i class="mdi mdi-file-excel text-2xl text-green-600 mb-1"></i>
              <div class="text-sm font-medium">Excel</div>
            </div>
          </label>
          <label
            class="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
            :class="
              form.format === 'pdf'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            "
          >
            <input
              v-model="form.format"
              type="radio"
              value="pdf"
              class="sr-only"
            />
            <div class="text-center">
              <i class="mdi mdi-file-pdf-box text-2xl text-red-500 mb-1"></i>
              <div class="text-sm font-medium">PDF</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Date Range -->
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="form.startDate"
          label="วันที่เริ่มต้น"
          type="date"
          required
        />
        <BaseInput
          v-model="form.endDate"
          label="วันที่สิ้นสุด"
          type="date"
          required
        />
      </div>

      <!-- Filters -->
      <div class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700">ตัวกรอง (ไม่จำเป็น)</h4>

        <div class="grid grid-cols-2 gap-4">
          <BaseSelect
            v-model="form.userId"
            :options="userOptions"
            label="ผู้ใช้"
            placeholder="เลือกผู้ใช้"
            searchable
            clearable
          />
          <BaseSelect
            v-model="form.action"
            :options="actionOptions"
            label="การกระทำ"
            placeholder="เลือกการกระทำ"
            searchable
            clearable
          />
        </div>

        <BaseSelect
          v-model="form.entityType"
          :options="entityTypeOptions"
          label="ประเภทข้อมูล"
          placeholder="เลือกประเภทข้อมูล"
          searchable
          clearable
        />
      </div>

      <!-- Preview Info -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h5 class="text-sm font-semibold text-gray-700 mb-2">
          ข้อมูลที่จะส่งออก
        </h5>
        <div class="text-sm text-gray-600 space-y-1">
          <div>• รูปแบบ: {{ formatLabels[form.format] }}</div>
          <div>• ช่วงเวลา: {{ formatDateRange() }}</div>
          <div v-if="activeFiltersCount > 0">
            • ตัวกรอง: {{ activeFiltersCount }} รายการ
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton @click="$emit('close')" variant="outline" color="gray">
          ยกเลิก
        </BaseButton>
        <BaseButton
          @click="handleExport"
          color="indigo"
          :loading="loading"
          :disabled="!form.startDate || !form.endDate"
          class="flex items-center gap-2"
        >
          <i class="mdi mdi-download"></i>
          ส่งออกรายงาน
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  close: [];
  export: [params: any];
}>();

const loading = ref(false);

const form = ref({
  format: "csv",
  startDate: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
  endDate: dayjs().format("YYYY-MM-DD"),
  userId: "",
  action: "",
  entityType: "",
});

const formatLabels = {
  csv: "CSV (Excel แบบง่าย)",
  excel: "Excel (.xlsx)",
  pdf: "PDF",
};

const userOptions = [
  { value: "", label: "ทุกผู้ใช้" },
  // Add more user options as needed
];

const actionOptions = [
  { value: "", label: "ทุกการกระทำ" },
  { value: "CREATE", label: "สร้าง" },
  { value: "UPDATE", label: "แก้ไข" },
  { value: "DELETE", label: "ลบ" },
  { value: "LOGIN", label: "เข้าสู่ระบบ" },
  { value: "LOGOUT", label: "ออกจากระบบ" },
  { value: "VIEW", label: "ดู" },
  { value: "DOWNLOAD", label: "ดาวน์โหลด" },
];

const entityTypeOptions = [
  { value: "", label: "ทุกประเภท" },
  { value: "USER", label: "ผู้ใช้" },
  { value: "ORDER", label: "คำสั่งซื้อ" },
  { value: "PAYMENT", label: "การชำระเงิน" },
  { value: "TICKET", label: "ตั๋ว" },
  { value: "SEAT", label: "ที่นั่ง" },
  { value: "STAFF", label: "พนักงาน" },
  { value: "REFERRER", label: "ผู้แนะนำ" },
  { value: "SYSTEM", label: "ระบบ" },
];

const activeFiltersCount = computed(() => {
  let count = 0;
  if (form.value.userId) count++;
  if (form.value.action) count++;
  if (form.value.entityType) count++;
  return count;
});

const formatDateRange = () => {
  if (!form.value.startDate || !form.value.endDate) return "ไม่ได้ระบุ";

  const start = dayjs(form.value.startDate).format("DD/MM/YYYY");
  const end = dayjs(form.value.endDate).format("DD/MM/YYYY");

  return `${start} - ${end}`;
};

const handleExport = async () => {
  loading.value = true;

  try {
    const exportParams = {
      format: form.value.format,
      startDate: form.value.startDate,
      endDate: form.value.endDate,
      filters: {
        ...(form.value.userId && { userId: form.value.userId }),
        ...(form.value.action && { action: form.value.action }),
        ...(form.value.entityType && { entityType: form.value.entityType }),
      },
    };

    emit("export", exportParams);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Custom styling for radio buttons */
input[type="radio"]:checked + div {
  box-shadow: 0 0 0 2px #6366f1;
}
</style>
