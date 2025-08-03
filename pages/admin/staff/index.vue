<template>
  <div
    class="staff-management-page min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <!-- Header Section -->
    <div class="mb-8">
      <!-- Page Title with Background -->
      <div
        class="bg-white/80 backdrop-blur-sm border-b border-gray-200 -mx-6 px-6 py-6 mb-6"
      >
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
              <i class="mdi mdi-account-group text-2xl"></i>
            </div>
            <div>
              <h1
                class="text-3xl font-bold text-gray-900 flex items-center gap-3"
              >
                จัดการพนักงาน
                <span
                  class="text-sm font-normal bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {{ summary?.counts.total || 0 }} คน
                </span>
              </h1>
              <p class="text-gray-600 mt-1">
                จัดการข้อมูลพนักงาน สิทธิ์การเข้าถึง และสถานะการทำงาน
              </p>
            </div>
          </div>
          <div class="flex gap-3">
            <BaseButton
              @click="loadStaffList"
              variant="outline"
              color="gray"
              size="lg"
              class="flex items-center gap-2"
            >
              <i class="mdi mdi-refresh"></i>
              <span class="hidden sm:inline">รีเฟรช</span>
            </BaseButton>
            <BaseButton
              @click="showCreateModal = true"
              color="blue"
              size="lg"
              class="flex items-center gap-2 shadow-lg"
            >
              <i class="mdi mdi-plus"></i>
              เพิ่มพนักงานใหม่
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6"
      >
        <StaffStatsCard
          title="พนักงานทั้งหมด"
          :value="summary?.counts.total || 0"
          icon="mdi mdi-account-group"
          color="blue"
        />
        <StaffStatsCard
          title="ปฏิบัติงาน"
          :value="summary?.counts.active || 0"
          icon="mdi mdi-account-check"
          color="green"
        />
        <StaffStatsCard
          title="ไม่ปฏิบัติงาน"
          :value="summary?.counts.inactive || 0"
          icon="mdi mdi-account-off"
          color="gray"
        />
        <StaffStatsCard
          title="ถูกระงับ"
          :value="summary?.counts.suspended || 0"
          icon="mdi mdi-account-alert"
          color="yellow"
        />
        <StaffStatsCard
          title="ถูกไล่ออก"
          :value="summary?.counts.terminated || 0"
          icon="mdi mdi-account-remove"
          color="red"
        />
      </div>
    </div>

    <!-- Filters Section -->
    <BaseCard class="mb-6 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <i class="mdi mdi-filter-variant text-blue-600"></i>
          ตัวกรองข้อมูล
        </h3>
        <BaseButton
          @click="clearFilters"
          variant="ghost"
          color="gray"
          size="sm"
          class="flex items-center gap-2"
        >
          <i class="mdi mdi-filter-remove"></i>
          ล้างตัวกรอง
        </BaseButton>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div>
          <BaseInput
            v-model="filters.search"
            label="ค้นหา"
            placeholder="ค้นหาชื่อ, อีเมล, หรือรหัสพนักงาน"
            @input="debouncedSearch"
            className="w-full h-[40px] rounded-lg"
          >
          </BaseInput>
        </div>

        <div>
          <BaseSelect
            v-model="filters.role"
            :options="roleOptions"
            label="ตำแหน่ง"
            placeholder="เลือกตำแหน่ง"
            searchable
            clearable
            @change="loadStaffList"
            className="w-full h-[40px] rounded-lg"
          />
        </div>

        <div>
          <BaseSelect
            v-model="filters.status"
            :options="statusOptions"
            label="สถานะ"
            placeholder="เลือกสถานะ"
            searchable
            clearable
            @change="loadStaffList"
            className="w-full h-[40px] rounded-lg"
          />
        </div>

        <div>
          <BaseSelect
            v-model="filters.department"
            :options="departmentOptions"
            label="แผนก"
            placeholder="เลือกแผนก"
            searchable
            clearable
            @change="loadStaffList"
            className="w-full h-[40px] rounded-lg"
          />
        </div>
      </div>
    </BaseCard>

    <!-- Staff Table -->
    <BaseCard
      class="shadow-sm border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
        >
          <h3
            class="text-lg font-semibold text-gray-800 flex items-center gap-2"
          >
            <i class="mdi mdi-table text-blue-600"></i>
            รายชื่อพนักงาน
            <span
              class="text-sm font-normal bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
            >
              {{ totalItems }} รายการ
            </span>
          </h3>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <i class="mdi mdi-information-outline"></i>
            <span>หน้า {{ currentPage }} จาก {{ totalPages }}</span>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-account text-blue-500"></i>
                  พนักงาน
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-account-tie text-green-500"></i>
                  ตำแหน่ง
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-domain text-purple-500"></i>
                  แผนก
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-check-circle text-orange-500"></i>
                  สถานะ
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-calendar text-indigo-500"></i>
                  วันที่สร้าง
                </div>
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                <div class="flex items-center justify-end gap-2">
                  <i class="mdi mdi-cog text-red-500"></i>
                  การดำเนินการ
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" v-for="n in 5" :key="n" class="animate-pulse">
              <td v-for="i in 6" :key="i" class="px-6 py-4">
                <div class="bg-gray-200 rounded-lg h-4 w-full"></div>
              </td>
            </tr>
            <tr v-else-if="staffList.length === 0" class="text-center">
              <td colspan="6" class="px-6 py-16">
                <div class="text-gray-500">
                  <i
                    class="mdi mdi-account-off text-6xl mb-4 text-gray-300"
                  ></i>
                  <p class="text-lg font-medium">ไม่พบข้อมูลพนักงาน</p>
                  <p class="text-sm text-gray-400 mt-1">
                    ลองปรับเปลี่ยนตัวกรองหรือเพิ่มพนักงานใหม่
                  </p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="staff in staffList"
              :key="staff.id"
              class="hover:bg-blue-50/50 transition-all duration-200 group"
            >
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="relative">
                      <img
                        v-if="staff.avatar"
                        :src="staff.avatar"
                        :alt="`${staff.firstName} ${staff.lastName}`"
                        class="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div
                        v-else
                        class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-2 border-white shadow-sm"
                      >
                        <span class="text-white font-semibold text-sm">
                          {{ staff.firstName?.charAt(0)
                          }}{{ staff.lastName?.charAt(0) }}
                        </span>
                      </div>
                      <!-- Status indicator -->
                      <div
                        :class="[
                          'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
                          getStatusIndicatorClass(staff.status),
                        ]"
                      ></div>
                    </div>
                  </div>
                  <div class="ml-4 min-w-0 flex-1">
                    <div
                      class="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors"
                    >
                      {{ staff.firstName }} {{ staff.lastName }}
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      <i class="mdi mdi-email-outline mr-1"></i>
                      {{ staff.email }}
                    </div>
                    <div class="text-xs text-gray-400 font-mono">
                      <i class="mdi mdi-identifier mr-1"></i>
                      รหัส: {{ staff.staffCode }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i :class="getRoleIcon(staff.role)" class="text-lg"></i>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                    :class="getRoleBadgeClass(staff.role)"
                  >
                    {{ getRoleLabel(staff.role) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-domain text-purple-500"></i>
                  <span class="text-sm text-gray-900 font-medium">
                    {{ staff.position || "-" }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i :class="getStatusIcon(staff.status)" class="text-lg"></i>
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                    :class="getStatusBadgeClass(staff.status)"
                  >
                    {{ getStatusLabel(staff.status) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <i class="mdi mdi-calendar text-indigo-500"></i>
                  <span>{{ formatDate(staff.createdAt) }}</span>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-1">
                  <BaseButton
                    @click="viewStaff(staff)"
                    size="sm"
                    variant="ghost"
                    color="blue"
                    class="group/btn"
                  >
                    <i
                      class="mdi mdi-eye group-hover/btn:scale-110 transition-transform"
                    ></i>
                  </BaseButton>
                  <BaseButton
                    @click="editStaff(staff)"
                    size="sm"
                    variant="ghost"
                    color="green"
                    class="group/btn"
                  >
                    <i
                      class="mdi mdi-pencil group-hover/btn:scale-110 transition-transform"
                    ></i>
                  </BaseButton>
                  <BaseButton
                    @click="changeStatus(staff)"
                    size="sm"
                    variant="ghost"
                    color="yellow"
                    class="group/btn"
                  >
                    <i
                      class="mdi mdi-account-cog group-hover/btn:scale-110 transition-transform"
                    ></i>
                  </BaseButton>
                  <BaseButton
                    @click="resetPassword(staff)"
                    size="sm"
                    variant="ghost"
                    color="purple"
                    class="group/btn"
                  >
                    <i
                      class="mdi mdi-key-variant group-hover/btn:scale-110 transition-transform"
                    ></i>
                  </BaseButton>
                  <BaseButton
                    @click="confirmDelete(staff)"
                    size="sm"
                    variant="ghost"
                    color="red"
                    class="group/btn"
                  >
                    <i
                      class="mdi mdi-delete group-hover/btn:scale-110 transition-transform"
                    ></i>
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6">
        <StaffPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          @page-change="handlePageChange"
        />
      </div>
    </BaseCard>

    <!-- Create/Edit Modal -->
    <StaffFormModal
      v-model="showCreateModal"
      :staff="selectedStaff"
      :departments="departments.departments"
      @update:isOpen="showCreateModal = $event"
      @saved="handleStaffSaved"
      @close="showCreateModal = false"
    />

    <!-- Status Change Modal -->
    <StaffStatusModal
      v-model="showStatusModal"
      :staff="selectedStaff"
      @saved="handleStatusChanged"
      @update:isOpen="showStatusModal = $event"
      @close="showStatusModal = false"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :isOpen="showDeleteModal"
      @close="
        () => {
          showDeleteModal = false;
        }
      "
      title="ยืนยันการลบ"
    >
      <div class="text-center">
        <i class="mdi mdi-alert-circle text-red-500 text-6xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          ยืนยันการลบพนักงาน
        </h3>
        <p class="text-gray-600 mb-6">
          คุณต้องการลบพนักงาน
          <strong
            >{{ selectedStaff?.firstName }}
            {{ selectedStaff?.lastName }}</strong
          >
          หรือไม่?
          <br />
          การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>
        <div class="flex justify-center gap-4">
          <BaseButton
            @click="showDeleteModal = false"
            variant="outline"
            color="gray"
          >
            ยกเลิก
          </BaseButton>
          <BaseButton @click="handleDelete" color="red" :loading="deleting">
            ลบพนักงาน
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Reset Password Confirmation Modal -->
    <BaseModal
      :isOpen="showResetPasswordModal"
      title="รีเซ็ตรหัสผ่าน"
      @close="
        () => {
          showResetPasswordModal = false;
        }
      "
    >
      <div class="text-center">
        <i class="mdi mdi-key-variant text-purple-500 text-6xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          ยืนยันการรีเซ็ตรหัสผ่าน
        </h3>
        <p class="text-gray-600 mb-6">
          คุณต้องการรีเซ็ตรหัสผ่านของพนักงาน
          <strong
            >{{ selectedStaff?.firstName }}
            {{ selectedStaff?.lastName }}</strong
          >
          หรือไม่?
          <br />
          รหัสผ่านใหม่จะเป็น:
          <code class="bg-gray-100 px-2 py-1 rounded"
            >Staff{{ selectedStaff?.staffCode }}!</code
          >
        </p>
        <div class="flex justify-center gap-4">
          <BaseButton
            @click="showResetPasswordModal = false"
            variant="outline"
            color="gray"
          >
            ยกเลิก
          </BaseButton>
          <BaseButton
            @click="handleResetPassword"
            color="purple"
            :loading="deleting"
          >
            รีเซ็ตรหัสผ่าน
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSingleToast } from "../../../composables/useSingleToast";
import {
  useStaff,
  type Staff,
  type StaffSummary,
} from "../../../composables/useStaff";
import { useDebounceFn } from "@vueuse/core";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
const router = useRouter();
// Composables
const { showToast } = useSingleToast();
const {
  getStaffList,
  getStaffSummary,
  getDepartments,
  deleteStaff,
  resetStaffPassword,
} = useStaff();

interface DepartmentsResponse {
  departments: string[];
  total: number;
}

// State
const loading = ref(false);
const deleting = ref(false);
const staffList = ref<Staff[]>([]);
const summary = ref<StaffSummary | null>(null);
const departments = ref<DepartmentsResponse>({
  departments: ["ออฟฟิศ"],
  total: 0,
});
const selectedStaff = ref<Staff | null>(null);

// Modals
const showCreateModal = ref(false);
const showStatusModal = ref(false);
const showDeleteModal = ref(false);
const showResetPasswordModal = ref(false);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);

// Filters
const filters = ref({
  search: "",
  role: "",
  status: "",
  department: "",
});

// Options
const roleOptions = [
  { value: "", label: "ทุกตำแหน่ง", icon: "mdi mdi-account-group" },
  {
    value: "admin",
    label: "ผู้ดูแลระบบ",
    icon: "mdi mdi-shield-crown",
    badge: "Admin",
  },
  {
    value: "manager",
    label: "ผู้จัดการ",
    icon: "mdi mdi-account-tie",
    badge: "Manager",
  },
  {
    value: "supervisor",
    label: "หัวหน้างาน",
    icon: "mdi mdi-account-star",
    badge: "Supervisor",
  },
  { value: "staff", label: "พนักงาน", icon: "mdi mdi-account", badge: "Staff" },
];

const statusOptions = [
  { value: "", label: "ทุกสถานะ", icon: "mdi mdi-format-list-bulleted" },
  {
    value: "active",
    label: "ปฏิบัติงาน",
    icon: "mdi mdi-check-circle",
    badge: "Active",
  },
  {
    value: "inactive",
    label: "ไม่ปฏิบัติงาน",
    icon: "mdi mdi-pause-circle",
    badge: "Inactive",
  },
  {
    value: "suspended",
    label: "ถูกระงับ",
    icon: "mdi mdi-alert-circle",
    badge: "Suspended",
  },
  {
    value: "terminated",
    label: "ถูกไล่ออก",
    icon: "mdi mdi-close-circle",
    badge: "Terminated",
  },
];

const departmentOptions = computed(() => [
  { value: "", label: "ทุกแผนก", icon: "mdi mdi-office-building" },
  ...departments.value.departments.map((dept) => ({
    value: dept,
    label: dept,
    icon: "mdi mdi-domain",
  })),
]);

const loadDepartments = async () => {
  try {
    const res = (await getDepartments()) as any;
    console.log("res", res);

    departments.value.departments = res.departments;
  } catch (error) {
    console.error("Failed to load departments:", error);
  }
};

// Methods
const loadStaffList = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      ...Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => value)
      ),
    };

    const response = await getStaffList(params);
    staffList.value = response.data.items;
    console.log(" staffList.value ", staffList.value);

    totalItems.value = response.data?.pagination.total || 0;
  } catch (error) {
    console.error("Failed to load staff list:", error);
  } finally {
    loading.value = false;
  }
};

const loadSummary = async () => {
  try {
    const res = await getStaffSummary();
    summary.value = {
      counts: res.counts,
      distribution: res.distribution,
      growth: res.growth,
    };
  } catch (error) {
    console.error("Failed to load staff summary:", error);
  }
};

const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1;
  loadStaffList();
}, 500);

const clearFilters = () => {
  filters.value = {
    search: "",
    role: "",
    status: "",
    department: "",
  };
  currentPage.value = 1;
  loadStaffList();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadStaffList();
};

// Staff Actions

const viewStaff = (staff: Staff) => {
  router.push(`/admin/staff/${staff.id}`);
};

const editStaff = (staff: Staff) => {
  selectedStaff.value = staff;
  showCreateModal.value = true;
};

const changeStatus = (staff: Staff) => {
  selectedStaff.value = staff;
  showStatusModal.value = true;
};

const confirmDelete = (staff: Staff) => {
  selectedStaff.value = staff;
  showDeleteModal.value = true;
};

const resetPassword = (staff: Staff) => {
  selectedStaff.value = staff;
  showResetPasswordModal.value = true;
};

const handleDelete = async () => {
  if (!selectedStaff.value) return;

  try {
    deleting.value = true;
    await deleteStaff(selectedStaff.value.id);
    showDeleteModal.value = false;
    selectedStaff.value = null;
    await loadStaffList();
    await loadSummary();
  } catch (error) {
    console.error("Failed to delete staff:", error);
  } finally {
    deleting.value = false;
  }
};

const handleStaffSaved = () => {
  showCreateModal.value = false;
  selectedStaff.value = null;
  loadStaffList();
  loadSummary();
};

const handleStatusChanged = () => {
  showStatusModal.value = false;
  selectedStaff.value = null;
  loadStaffList();
  loadSummary();
};

const handleResetPassword = async () => {
  if (!selectedStaff.value) return;

  try {
    deleting.value = true;
    const staffCode = selectedStaff.value.staffCode;
    await resetStaffPassword(selectedStaff.value.id);
    showResetPasswordModal.value = false;
    selectedStaff.value = null;
    showToast(
      "success",
      `รีเซ็ตรหัสผ่านสำเร็จ รหัสผ่านใหม่: Staff${staffCode}!`
    );
  } catch (error) {
    console.error("Failed to reset password:", error);
  } finally {
    deleting.value = false;
  }
};

// Utility Functions
const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: "ผู้ดูแลระบบ",
    manager: "ผู้จัดการ",
    supervisor: "หัวหน้างาน",
    staff: "พนักงาน",
  };
  return labels[role] || role;
};

const getRoleIcon = (role: string) => {
  const icons: Record<string, string> = {
    admin: "mdi mdi-shield-crown text-purple-500",
    manager: "mdi mdi-account-tie text-blue-500",
    supervisor: "mdi mdi-account-star text-green-500",
    staff: "mdi mdi-account text-gray-500",
  };
  return icons[role] || "mdi mdi-account text-gray-500";
};

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    admin:
      "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300",
    manager:
      "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300",
    supervisor:
      "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
    staff:
      "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
  };
  return (
    classes[role] ||
    "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300"
  );
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "ปฏิบัติงาน",
    inactive: "ไม่ปฏิบัติงาน",
    suspended: "ถูกระงับ",
    terminated: "ถูกไล่ออก",
  };
  return labels[status] || status;
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    active: "mdi mdi-check-circle text-green-500",
    inactive: "mdi mdi-pause-circle text-gray-500",
    suspended: "mdi mdi-alert-circle text-yellow-500",
    terminated: "mdi mdi-close-circle text-red-500",
  };
  return icons[status] || "mdi mdi-help-circle text-gray-500";
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active:
      "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
    inactive:
      "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
    suspended:
      "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    terminated:
      "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
  };
  return (
    classes[status] ||
    "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300"
  );
};

const getStatusIndicatorClass = (status: string) => {
  const classes: Record<string, string> = {
    active: "bg-green-500",
    inactive: "bg-gray-400",
    suspended: "bg-yellow-500",
    terminated: "bg-red-500",
  };
  return classes[status] || "bg-gray-400";
};

const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

// Lifecycle
onMounted(async () => {
  await Promise.all([loadStaffList(), loadSummary(), loadDepartments()]);
});

// Meta
// definePageMeta({
//   layout: 'default',
//   middleware: 'only-admin-staff'
// })
</script>

<style scoped>
.staff-management-page {
  padding: 1.5rem;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.staff-management-page > * {
  animation: fadeInUp 0.5s ease-out;
}

/* Hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Glass morphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>
