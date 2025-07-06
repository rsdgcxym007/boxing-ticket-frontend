<template>
  <div class="grid grid-cols-1 px-4 py-8 min-h-screen bg-[#0f1f3c] text-white">
    <!-- Header + Search -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold mb-4">จัดการ Referrer</h1>
      <div class="flex flex-row gap-2 items-center">
        <!-- ช่องค้นหา -->
        <input
          v-model="pageData.filters.keyword"
          placeholder="ค้นหาชื่อหรือโค้ด Referrer"
          class="flex-1 px-3 py-2 rounded-md border border-gray-300 text-black w-full"
        />

        <!-- ปุ่มสร้าง -->
        <button
          @click="pageData.showCreateModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap w-[40%]"
        >
          + สร้าง Referrer
        </button>
      </div>
      <div class="overflow-auto rounded-md mt-5">
        <!-- Referrer Card List -->
        <div class="grid md:grid-cols-3 xl:grid-cols-3 gap-4">
          <div
            v-for="ref in pageData.referrers"
            :key="ref.id"
            class="bg-[#1a2a47] rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-lg font-semibold truncate">{{ ref.name }}</h2>
              <span
                :class="[
                  'text-xs font-semibold px-3 py-1 rounded-full',
                  ref.status === true
                    ? 'bg-green-600 text-white'
                    : 'bg-red-500 text-white',
                ]"
              >
                {{ ref.status ? "ใช้งาน" : "ไม่ใช้งาน" }}
              </span>
            </div>

            <div class="text-sm text-gray-200 space-y-1 mb-3">
              <div>
                <span class="font-semibold text-white">โค้ด:</span>
                {{ ref.code }}
              </div>
              <div>
                <span class="font-semibold text-white">ค่าคอมมิชชัน:</span>
                {{ ref.totalCommission.toLocaleString() }} บาท
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <!-- แก้ไข -->
              <button
                @click="editReferrer(ref)"
                class="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-md"
              >
                <i class="mdi mdi-pencil-outline text-sm"></i> แก้ไข
              </button>

              <!-- ลบ -->
              <button
                @click="deleteReferrers(ref)"
                class="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1 rounded-md"
              >
                <i class="mdi mdi-trash-can-outline text-sm"></i> ลบ
              </button>

              <!-- เปลี่ยนสถานะ -->
              <button
                @click="toggleStatus(ref)"
                class="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-3 py-1 rounded-md"
              >
                <i class="mdi mdi-repeat text-sm"></i> เปลี่ยนสถานะ
              </button>
              <button
                @click="viewReferrer(ref.id)"
                class="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs px-3 py-1 rounded-md"
              >
                <i class="mdi mdi-repeat text-sm"></i> ดูเพิ่มเติม
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="changePage(pageData.page - 1)"
            :disabled="pageData.page === 1"
            class="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <span class="px-3 py-1"
            >หน้า {{ pageData.page }} / {{ pageData.totalPages }}</span
          >
          <button
            @click="changePage(pageData.page + 1)"
            :disabled="pageData.page === pageData.totalPages"
            class="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
    <!-- Empty State -->
    <div
      v-if="pageData.referrers.length === 0"
      class="text-center py-12 text-gray-400"
    >
      <i class="mdi mdi-account-off text-5xl mb-4"></i>
      <p class="text-lg font-medium">ไม่มีข้อมูลผู้แนะนำ</p>
      <p class="text-sm">คุณยังไม่ได้เพิ่ม Referrer ใด ๆ เลย</p>
    </div>

    <!-- Referrer Table -->

    <!-- Create/Edit Modal -->
    <div
      v-if="pageData.showCreateModal"
      class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
    >
      <div
        class="bg-white text-black w-full max-w-md rounded-xl shadow-lg p-6 animate-fade-in"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-6">
          {{ pageData.editing ? "แก้ไข Referrer" : "สร้าง Referrer ใหม่" }}
        </h2>

        <!-- Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >ชื่อ Referrer</label
          >
          <input
            v-model="pageData.newRef.name"
            type="text"
            class="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-sm bg-gray-50"
          />
        </div>

        <!-- Code -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >โค้ด</label
          >
          <input
            v-model="pageData.newRef.code"
            type="text"
            class="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-sm bg-gray-50"
          />
        </div>

        <!-- Status -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >สถานะ</label
          >
          <select
            v-model="pageData.newRef.status"
            class="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-2 text-sm bg-white"
          >
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-2">
          <button
            @click="pageData.showCreateModal = false"
            class="px-4 py-2 text-sm text-gray-600 hover:underline"
          >
            ยกเลิก
          </button>
          <button
            @click="handleSaveReferrer"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import debounce from "lodash/debounce";
import SidebarItem from "../../components/SidebarItem.vue";
import dayjs from "dayjs";
const menuItems = useAdminMenu();
const { getReferrers, createReferrer, updateReferrer } = useReferrer();
const route = useRoute();
const router = useRouter();
const collapsed = ref(false);
const data = usePageData();
const pageData = reactive({
  referrers: [],
  showCreateModal: false,
  editing: false,
  newRef: { name: "", code: "", status: "active" },
  filters: { keyword: "" },
  page: 1,
  limit: 10,
  totalPages: 1,
});

const fetchReferrers = async () => {
  data.loading = true;
  try {
    const res = await getReferrers({
      page: pageData.page,
      limit: pageData.limit,
      search: pageData.filters.keyword.trim() || undefined,
    });
    pageData.referrers = res.items;
    pageData.totalPages = res.totalPages || 1;
    data.loading = false;
  } catch (error) {
    data.loading = false;
    console.error("โหลด Referrer ไม่สำเร็จ:", error);
  }
};

watch(() => pageData.filters.keyword, debounce(fetchReferrers, 400));
const viewReferrer = (id) => {
  router.push(`/admin/referrer/${id}`);
};

const handleSaveReferrer = async () => {
  data.loading = true;
  try {
    if (pageData.editing) {
      const { id, ...payload } = pageData.newRef;
      await updateReferrer(id, payload);
    } else {
      await createReferrer(pageData.newRef);
    }
    pageData.showCreateModal = false;
    pageData.newRef = { name: "", code: "", status: "active" };
    pageData.editing = false;
    await fetchReferrers();
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

const deleteReferrers = async (ref) => {
  try {
    // ใช้ updateReferrer เพื่อเปลี่ยนสถานะเป็น inactive แทนการลบ
    await updateReferrer(ref.id, { status: false });
    await fetchReferrers();
  } catch (err) {
    console.error("ปิดการใช้งาน Referrer ไม่สำเร็จ:", err);
  }
};

const toggleStatus = async (ref) => {
  try {
    const newStatus = ref.status === true ? false : true;
    console.log("newStatus", newStatus);

    await updateReferrer(ref.id, { status: newStatus });
    await fetchReferrers();
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

const handleResize = () => {
  collapsed.value = window.innerWidth < 768;
};

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
input {
  background-color: #f8fafc;
}
</style>
