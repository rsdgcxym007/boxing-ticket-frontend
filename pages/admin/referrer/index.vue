<template>
  <div
    class="referrer-management-page min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6"
  >
    <!-- Header Section -->
    <div class="mb-8">
      <!-- Modern Header with Glassmorphism -->
      <div
        class="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl mx-auto max-w-7xl px-8 py-8 mb-8 shadow-lg"
      >
        <div
          class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6"
        >
          <div class="flex items-center gap-6">
            <div class="relative">
              <div
                class="p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-lg"
              >
                <i class="mdi mdi-account-star text-3xl"></i>
              </div>
              <div
                class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
              >
                <i class="mdi mdi-check text-white text-xs"></i>
              </div>
            </div>
            <div>
              <h1
                class="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                จัดการผู้แนะนำ
              </h1>
              <div class="flex items-center gap-4 mt-2">
                <p class="text-gray-600 text-lg">
                  จัดการข้อมูลผู้แนะนำและติดตามคอมมิชชัน
                </p>
                <span
                  class="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-semibold shadow-sm"
                >
                  {{ pageData.referrers?.length || 0 }} คน
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <BaseButton
              @click="fetchReferrers"
              variant="outline"
              color="gray"
              size="lg"
              class="flex items-center gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              <i class="mdi mdi-refresh"></i>
              <span class="hidden sm:inline">รีเฟรช</span>
            </BaseButton>
            <BaseButton
              @click="pageData.showCreateModal = true"
              size="lg"
              class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
            >
              <i class="mdi mdi-plus"></i>
              เพิ่มผู้แนะนำใหม่
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Search and Filter Section with Modern Design -->
      <div
        class="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl mx-auto max-w-7xl px-6 py-6 shadow-lg mb-8"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-3">
            <div
              class="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-lg"
            >
              <i class="mdi mdi-magnify text-lg"></i>
            </div>
            ค้นหาและกรองข้อมูล
          </h3>
          <BaseButton
            @click="resetFilters"
            variant="outline"
            color="gray"
            size="sm"
            class="flex items-center gap-2"
          >
            <i class="mdi mdi-filter-remove"></i>
            ล้างตัวกรอง
          </BaseButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="relative w-full">
            <BaseInput
              v-model="pageData.filters.keyword"
              label="ค้นหา"
              placeholder="ค้นหาชื่อหรือโค้ด Referrer"
              className="w-full h-full rounded-lg"
            />
          </div>

          <div class="w-full">
            <BaseSelect
              v-model="statusFilter"
              :options="statusOptions"
              label="สถานะ"
              placeholder="เลือกสถานะ"
              clearable
              @change="fetchReferrers"
              class="w-full"
            />
          </div>

          <div class="w-full">
            <BaseSelect
              v-model="sortBy"
              :options="sortOptions"
              label="เรียงลำดับ"
              placeholder="เลือกการเรียงลำดับ"
              @change="fetchReferrers"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Referrer Cards Grid -->
    <div class="max-w-7xl mx-auto">
      <!-- Loading State -->
      <div
        v-if="data.loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div v-for="n in 8" :key="n" class="animate-pulse">
          <div
            class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div class="flex justify-between items-start mb-6">
              <div class="h-6 bg-gray-200 rounded-lg w-3/4"></div>
              <div class="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div class="space-y-4">
              <div class="h-4 bg-gray-200 rounded-lg w-full"></div>
              <div class="h-4 bg-gray-200 rounded-lg w-2/3"></div>
              <div class="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            </div>
            <div class="flex gap-3 mt-6">
              <div class="h-9 bg-gray-200 rounded-lg flex-1"></div>
              <div class="h-9 bg-gray-200 rounded-lg flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="pageData.referrers.length === 0"
        class="text-center py-20"
      >
        <div
          class="bg-white/90 backdrop-blur-xl rounded-3xl p-16 shadow-xl max-w-lg mx-auto border border-gray-100"
        >
          <div
            class="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <i
              class="mdi mdi-account-group-outline text-4xl text-indigo-600"
            ></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            ไม่พบข้อมูลผู้แนะนำ
          </h3>
          <p class="text-gray-600 mb-8 text-lg">
            เริ่มต้นด้วยการเพิ่มผู้แนะนำคนแรกของคุณ
          </p>
          <BaseButton
            @click="pageData.showCreateModal = true"
            size="lg"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
          >
            <i class="mdi mdi-plus mr-2"></i>
            เพิ่มผู้แนะนำใหม่
          </BaseButton>
        </div>
      </div>

      <!-- Referrer Cards -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="ref in pageData.referrers"
          :key="ref.id"
          class="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-indigo-200 hover:-translate-y-1"
        >
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div
                  class="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                >
                  <span class="text-white font-bold text-xl">
                    {{ ref.name?.charAt(0)?.toUpperCase() || "R" }}
                  </span>
                </div>
                <div
                  class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                ></div>
              </div>
              <div>
                <h3
                  class="font-bold text-gray-900 text-lg group-hover:text-indigo-700 transition-colors leading-tight"
                >
                  {{ ref.name }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  ID:
                  <span
                    class="font-mono bg-gray-100 px-2 py-1 rounded text-xs"
                    >{{ ref.code }}</span
                  >
                </p>
              </div>
            </div>
            <span
              :class="[
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border',
                ref.isActive === true
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200',
              ]"
            >
              <i
                :class="[
                  'mr-1.5 text-xs',
                  ref.isActive === true
                    ? 'mdi mdi-check-circle'
                    : 'mdi mdi-close-circle',
                ]"
              ></i>
              {{ ref.isActive ? "ใช้งาน" : "ไม่ใช้งาน" }}
            </span>
          </div>

          <!-- Details Grid -->
          <div class="space-y-4 mb-6">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 flex items-center gap-2">
                <i class="mdi mdi-tag text-indigo-500"></i>
                รหัส:
              </span>
              <span
                class="font-semibold text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded"
                >{{ ref.code }}</span
              >
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 flex items-center gap-2">
                <i class="mdi mdi-cash text-emerald-500"></i>
                คอมมิชชัน:
              </span>
              <span class="font-bold text-emerald-600 text-base">
                {{ formatCurrency(ref.totalCommission || 0) }}
              </span>
            </div>

            <div
              v-if="ref.phone"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-600 flex items-center gap-2">
                <i class="mdi mdi-phone text-purple-500"></i>
                โทรศัพท์:
              </span>
              <span class="text-gray-900 font-medium">{{ ref.phone }}</span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 flex items-center gap-2">
                <i class="mdi mdi-calendar text-orange-500"></i>
                สร้างเมื่อ:
              </span>
              <span class="text-gray-900 font-medium">{{
                formatDate(ref.createdAt)
              }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-4 border-t border-gray-100">
            <BaseButton
              @click="viewReferrer(ref.id)"
              variant="outline"
              color="blue"
              size="sm"
              class="flex-1 flex items-center justify-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <i class="mdi mdi-eye text-sm"></i>
              <span class="hidden sm:inline">ดูรายละเอียด</span>
              <span class="sm:hidden">ดู</span>
            </BaseButton>

            <BaseButton
              @click="editReferrer(ref)"
              variant="outline"
              color="green"
              size="sm"
              class="flex-1 flex items-center justify-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <i class="mdi mdi-pencil text-sm"></i>
              <span class="hidden sm:inline">แก้ไข</span>
              <span class="sm:hidden">แก้ไข</span>
            </BaseButton>

            <BaseButton
              @click="toggleStatus(ref)"
              variant="outline"
              :color="ref.isActive ? 'red' : 'green'"
              size="sm"
              class="flex items-center justify-center gap-2"
              :class="
                ref.isActive
                  ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                  : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
              "
            >
              <i
                :class="ref.isActive ? 'mdi mdi-pause' : 'mdi mdi-play'"
                class="text-sm"
              ></i>
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pageData.totalPages > 1" class="mt-12">
        <div
          class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              แสดง {{ (pageData.page - 1) * pageData.limit + 1 }} -
              {{
                Math.min(
                  pageData.page * pageData.limit,
                  pageData.totalPages * pageData.limit
                )
              }}
              จาก {{ pageData.totalPages * pageData.limit }} รายการ
            </div>
            <div class="flex items-center gap-2">
              <BaseButton
                @click="changePage(pageData.page - 1)"
                :disabled="pageData.page === 1"
                variant="outline"
                color="gray"
                size="sm"
                class="flex items-center gap-2"
              >
                <i class="mdi mdi-chevron-left"></i>
                ก่อนหน้า
              </BaseButton>

              <div class="flex items-center gap-1">
                <template v-for="page in getVisiblePages()" :key="page">
                  <BaseButton
                    v-if="page !== '...'"
                    @click="changePage(page)"
                    :variant="page === pageData.page ? 'solid' : 'outline'"
                    :color="page === pageData.page ? 'blue' : 'gray'"
                    size="sm"
                    class="w-10 h-10"
                  >
                    {{ page }}
                  </BaseButton>
                  <span v-else class="px-2 text-gray-400">...</span>
                </template>
              </div>

              <BaseButton
                @click="changePage(pageData.page + 1)"
                :disabled="pageData.page === pageData.totalPages"
                variant="outline"
                color="gray"
                size="sm"
                class="flex items-center gap-2"
              >
                ถัดไป
                <i class="mdi mdi-chevron-right"></i>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Create/Edit Modal -->
    <div
      v-if="pageData.showCreateModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        class="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fade-in transform transition-all"
      >
        <div class="flex items-center gap-4 mb-8">
          <div
            class="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl"
          >
            <i class="mdi mdi-account-plus text-2xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ pageData.editing ? "แก้ไข Referrer" : "สร้าง Referrer ใหม่" }}
            </h2>
            <p class="text-gray-600 mt-1">กรอกข้อมูลผู้แนะนำ</p>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >ชื่อ Referrer</label
            >
            <BaseInput
              v-model="pageData.newRef.name"
              placeholder="กรอกชื่อผู้แนะนำ"
              className="w-full h-full rounded-lg"
            />
          </div>

          <!-- Code -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >โค้ด</label
            >
            <BaseInput
              v-model="pageData.newRef.code"
              placeholder="กรอกรหัสผู้แนะนำ"
              className="w-full h-full rounded-lg"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >เบอร์โทร</label
            >
            <BaseInput
              v-model="pageData.newRef.phone"
              placeholder="กรอกหมายเลขโทรศัพท์"
              className="w-full h-full rounded-lg"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >สถานะ</label
            >
            <BaseSelect
              v-model="pageData.newRef.isActive"
              :options="[
                { label: 'ใช้งาน', value: true },
                { label: 'ไม่ใช้งาน', value: false },
              ]"
              placeholder="เลือกสถานะ"
              class="w-full"
            />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <BaseButton
            @click="pageData.showCreateModal = false"
            variant="outline"
            color="gray"
            class="px-6"
          >
            ยกเลิก
          </BaseButton>
          <BaseButton
            @click="handleSaveReferrer"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8"
          >
            <i class="mdi mdi-check mr-2"></i>
            บันทึก
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import debounce from "lodash/debounce";
import dayjs from "dayjs";
import { useReferrerMasterData } from "@/composables/useReferrerMasterData";
// Master data composable for referrer
const { fetchMasterData } = useReferrerMasterData();

// Define page meta
definePageMeta({
  middleware: ["only-admin-staff"],
  layout: "default",
});

// Composables
const { getReferrers, createReferrer, updateReferrer } = useReferrer();
const route = useRoute();
const router = useRouter();
const collapsed = ref(false);
const data = usePageData();

// Status and sort options
const statusFilter = ref("");
const sortBy = ref("");

const statusOptions = [
  { label: "ทั้งหมด", value: "" },
  { label: "ใช้งาน", value: "true" },
  { label: "ไม่ใช้งาน", value: "false" },
];

const sortOptions = [
  { label: "ล่าสุด", value: "latest" },
  { label: "เก่าสุด", value: "oldest" },
  { label: "ชื่อ A-Z", value: "name_asc" },
  { label: "ชื่อ Z-A", value: "name_desc" },
];

// Page data
const pageData = reactive({
  referrers: [],
  showCreateModal: false,
  editing: false,
  newRef: {
    name: "",
    code: "",
    phone: "",
    isActive: true,
    status: true,
  },
  filters: { keyword: "" },
  page: 1,
  limit: 12,
  totalPages: 1,
});

// Methods
const fetchReferrers = async () => {
  data.loading = true;

  try {
    const res = await getReferrers({
      page: pageData.page,
      limit: pageData.limit,
      search: pageData.filters.keyword.trim() || undefined,
      status: statusFilter.value || undefined,
      sortBy: sortBy.value || undefined,
    });
    pageData.referrers = res.items;
    pageData.totalPages = res.totalPages || 1;
    data.loading = false;
  } catch (error) {
    data.loading = false;
    console.error("โหลด Referrer ไม่สำเร็จ:", error);
  }
};

const resetFilters = () => {
  pageData.filters.keyword = "";
  statusFilter.value = "";
  sortBy.value = "";
  pageData.page = 1;
  fetchReferrers();
};

// Watch for filter changes
watch(() => pageData.filters.keyword, debounce(fetchReferrers, 400));

const viewReferrer = (id) => {
  router.push(`/admin/referrer/${id}`);
};

const handleSaveReferrer = async () => {
  data.loading = true;
  try {
    if (pageData.editing) {
      const { id, ...payload } = pageData.newRef;
      await updateReferrer(id, {
        name: pageData.newRef.name,
        code: pageData.newRef.code,
        phone: pageData.newRef.phone,
        isActive: pageData.newRef.isActive,
        status: pageData.newRef.isActive ? "active" : "inactive",
      });
    } else {
      await createReferrer({
        name: pageData.newRef.name,
        code: pageData.newRef.code,
        phone: pageData.newRef.phone,
        status: pageData.newRef.isActive ? "active" : "inactive",
      });
    }
    pageData.showCreateModal = false;
    pageData.newRef = {
      name: "",
      code: "",
      phone: "",
      isActive: true,
    };
    pageData.editing = false;
    await fetchReferrers();
    await fetchMasterData();
    data.loading = false;
  } catch (err) {
    data.loading = false;
    console.error("บันทึก Referrer ไม่สำเร็จ:", err);
  }
};

const editReferrer = (ref) => {
  pageData.newRef = { ...ref };
  pageData.editing = true;
  pageData.showCreateModal = true;
};

const toggleStatus = async (ref) => {
  try {
    const newStatus = ref.isActive === true ? false : true;
    await updateReferrer(ref.id, { isActive: newStatus });
    await fetchReferrers();
    await fetchMasterData();
  } catch (err) {
    console.error("เปลี่ยนสถานะไม่สำเร็จ:", err);
  }
};

const changePage = async (newPage) => {
  if (newPage >= 1 && newPage <= pageData.totalPages) {
    pageData.page = newPage;
    await fetchReferrers();
  }
};

const getVisiblePages = () => {
  const current = pageData.page;
  const total = pageData.totalPages;
  const delta = 2;
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - delta; i <= current + delta; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
};

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount || 0);
};

const formatDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

const handleResize = () => {
  collapsed.value = window.innerWidth < 768;
};

// Lifecycle
onMounted(async () => {
  handleResize();
  window.addEventListener("resize", handleResize);
  await fetchReferrers();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.referrer-management-page {
  min-height: 100vh;
}

@media (max-width: 768px) {
  .referrer-management-page {
    padding: 1rem;
  }
}
</style>
