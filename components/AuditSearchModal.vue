<template>
  <BaseModal
    :isOpen="isOpen"
    @close="$emit('close')"
    title="ค้นหาขั้นสูง"
    size="lg"
  >
    <form @submit.prevent="handleSearch" class="space-y-6">
      <!-- Search Query -->
      <BaseInput
        v-model="form.query"
        label="คำค้นหา"
        placeholder="ค้นหาในข้อมูล audit logs..."
        required
      >
        <template #prefix>
          <i class="mdi mdi-magnify text-gray-400"></i>
        </template>
      </BaseInput>

      <!-- Date Range -->
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="form.startDate"
          label="วันที่เริ่มต้น"
          type="date"
        />
        <BaseInput v-model="form.endDate" label="วันที่สิ้นสุด" type="date" />
      </div>

      <!-- Filters -->
      <div class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700">ตัวกรอง</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="form.entityType"
            :options="entityTypeOptions"
            label="ประเภทข้อมูล"
            placeholder="เลือกประเภทข้อมูล"
            searchable
            clearable
          />
          <BaseInput
            v-model="form.ipAddress"
            label="IP Address"
            placeholder="192.168.1.1"
          />
        </div>
      </div>

      <!-- Advanced Options -->
      <div class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700">ตัวเลือกขั้นสูง</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="form.sortBy"
            :options="sortOptions"
            label="เรียงลำดับตาม"
            placeholder="เลือกการเรียงลำดับ"
          />
          <BaseSelect
            v-model="form.sortOrder"
            :options="sortOrderOptions"
            label="ลำดับ"
            placeholder="เลือกลำดับ"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput
            v-model.number="form.limit"
            label="จำนวนผลลัพธ์"
            type="number"
            min="10"
            max="1000"
            step="10"
          />
          <BaseSelect
            v-model="form.riskLevel"
            :options="riskLevelOptions"
            label="ระดับความเสี่ยง"
            placeholder="เลือกระดับความเสี่ยง"
            clearable
          />
        </div>
      </div>

      <!-- Search Patterns -->
      <div class="space-y-4">
        <h4 class="text-sm font-semibold text-gray-700">รูปแบบการค้นหา</h4>

        <div class="space-y-3">
          <label class="flex items-center space-x-3">
            <input
              v-model="form.exactMatch"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm text-gray-700">ค้นหาแบบตรงทุกตัวอักษร</span>
          </label>

          <label class="flex items-center space-x-3">
            <input
              v-model="form.caseSensitive"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm text-gray-700">แยกตัวพิมพ์เล็ก-ใหญ่</span>
          </label>

          <label class="flex items-center space-x-3">
            <input
              v-model="form.includeSystemLogs"
              type="checkbox"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm text-gray-700">รวม logs ของระบบ</span>
          </label>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h5 class="text-sm font-semibold text-gray-700 mb-2">พรีวิวการค้นหา</h5>
        <div class="text-sm text-gray-600 space-y-1">
          <div>• คำค้นหา: "{{ form.query || "ไม่ได้ระบุ" }}"</div>
          <div v-if="form.startDate || form.endDate">
            • ช่วงเวลา: {{ formatDateRange() }}
          </div>
          <div v-if="activeFiltersCount > 0">
            • ตัวกรอง: {{ activeFiltersCount }} รายการ
          </div>
          <div>• จำนวนผลลัพธ์: สูงสุด {{ form.limit }} รายการ</div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-between">
        <BaseButton
          @click="resetForm"
          variant="outline"
          color="gray"
          class="flex items-center gap-2"
        >
          <i class="mdi mdi-refresh"></i>
          รีเซ็ต
        </BaseButton>

        <div class="flex gap-3">
          <BaseButton @click="$emit('close')" variant="outline" color="gray">
            ยกเลิก
          </BaseButton>
          <BaseButton
            @click="handleSearch"
            color="indigo"
            :disabled="!form.query"
            class="flex items-center gap-2"
          >
            <i class="mdi mdi-magnify"></i>
            ค้นหา
          </BaseButton>
        </div>
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
  search: [params: any];
}>();

const form = ref({
  query: "",
  startDate: "",
  endDate: "",
  userId: "",
  action: "",
  entityType: "",
  ipAddress: "",
  sortBy: "timestamp",
  sortOrder: "desc",
  limit: 100,
  riskLevel: "",
  exactMatch: false,
  caseSensitive: false,
  includeSystemLogs: true,
});

const userOptions = [
  { value: "", label: "ทุกผู้ใช้" },
  // Add user options from API
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
  { value: "EXPORT", label: "ส่งออก" },
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

const sortOptions = [
  { value: "timestamp", label: "เวลา" },
  { value: "userId", label: "ผู้ใช้" },
  { value: "action", label: "การกระทำ" },
  { value: "entityType", label: "ประเภทข้อมูล" },
  { value: "ipAddress", label: "IP Address" },
];

const sortOrderOptions = [
  { value: "desc", label: "ใหม่ล่าสุด" },
  { value: "asc", label: "เก่าสุด" },
];

const riskLevelOptions = [
  { value: "", label: "ทุกระดับ" },
  { value: "low", label: "ต่ำ" },
  { value: "medium", label: "ปานกลาง" },
  { value: "high", label: "สูง" },
  { value: "critical", label: "วิกฤต" },
];

const activeFiltersCount = computed(() => {
  let count = 0;
  if (form.value.userId) count++;
  if (form.value.action) count++;
  if (form.value.entityType) count++;
  if (form.value.ipAddress) count++;
  if (form.value.riskLevel) count++;
  if (form.value.startDate) count++;
  if (form.value.endDate) count++;
  return count;
});

const formatDateRange = () => {
  if (!form.value.startDate && !form.value.endDate) return "ไม่ได้ระบุ";

  const start = form.value.startDate
    ? dayjs(form.value.startDate).format("DD/MM/YYYY")
    : "ไม่จำกัด";
  const end = form.value.endDate
    ? dayjs(form.value.endDate).format("DD/MM/YYYY")
    : "ไม่จำกัด";

  return `${start} - ${end}`;
};

const handleSearch = () => {
  const searchParams = {
    query: form.value.query,
    filters: {
      ...(form.value.startDate && { startDate: form.value.startDate }),
      ...(form.value.endDate && { endDate: form.value.endDate }),
      ...(form.value.userId && { userId: form.value.userId }),
      ...(form.value.action && { action: form.value.action }),
      ...(form.value.entityType && { entityType: form.value.entityType }),
      ...(form.value.ipAddress && { ipAddress: form.value.ipAddress }),
      ...(form.value.riskLevel && { riskLevel: form.value.riskLevel }),
    },
    options: {
      sortBy: form.value.sortBy,
      sortOrder: form.value.sortOrder,
      limit: form.value.limit,
      exactMatch: form.value.exactMatch,
      caseSensitive: form.value.caseSensitive,
      includeSystemLogs: form.value.includeSystemLogs,
    },
  };

  emit("search", searchParams);
};

const resetForm = () => {
  form.value = {
    query: "",
    startDate: "",
    endDate: "",
    userId: "",
    action: "",
    entityType: "",
    ipAddress: "",
    sortBy: "timestamp",
    sortOrder: "desc",
    limit: 100,
    riskLevel: "",
    exactMatch: false,
    caseSensitive: false,
    includeSystemLogs: true,
  };
};
</script>

<style scoped>
/* Custom styling if needed */
</style>
