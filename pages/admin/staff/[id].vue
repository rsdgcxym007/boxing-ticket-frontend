<template>
  <div class="staff-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <BaseSpinner size="lg" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <i class="mdi mdi-alert-circle text-red-500 text-6xl mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <BaseButton @click="$router.push('/admin/staff')" color="blue">
        กลับสู่รายการพนักงาน
      </BaseButton>
    </div>

    <!-- Staff Detail -->
    <div v-else-if="staff" class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-4">
          <BaseButton
            @click="$router.push('/admin/staff')"
            variant="ghost"
            color="gray"
            size="sm"
          >
            <i class="mdi mdi-arrow-left"></i>
          </BaseButton>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ staff.firstName }} {{ staff.lastName }}
            </h1>
            <p class="text-gray-600">รหัสพนักงาน: {{ staff.staffCode }}</p>
          </div>
        </div>

        <div class="flex space-x-3">
          <BaseButton @click="editStaff" color="green" size="lg">
            <i class="mdi mdi-pencil mr-2"></i>
            แก้ไขข้อมูล
          </BaseButton>
          <BaseButton @click="changeStatus" color="yellow" size="lg">
            <i class="mdi mdi-account-cog mr-2"></i>
            เปลี่ยนสถานะ
          </BaseButton>
        </div>
      </div>

      <!-- Status Banner -->
      <div
        v-if="staff.status !== 'active'"
        class="p-4 rounded-lg"
        :class="getStatusBannerClass(staff.status)"
      >
        <div class="flex items-center">
          <i :class="getStatusIcon(staff.status)" class="text-xl mr-3"></i>
          <div>
            <h4 class="font-medium">{{ getStatusLabel(staff.status) }}</h4>
            <p class="text-sm mt-1">{{ getStatusDescription(staff.status) }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-medium">ข้อมูลส่วนตัว</h3>
            </template>

            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 h-16 w-16">
                  <img
                    v-if="staff.avatar"
                    :src="staff.avatar"
                    :alt="`${staff.firstName} ${staff.lastName}`"
                    class="h-16 w-16 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center"
                  >
                    <i class="mdi mdi-account text-gray-600 text-2xl"></i>
                  </div>
                </div>
                <div>
                  <h4 class="text-xl font-semibold text-gray-900">
                    {{ staff.firstName }} {{ staff.lastName }}
                  </h4>
                  <p class="text-gray-600">{{ staff.email }}</p>
                  <p class="text-gray-500 text-sm">
                    {{ staff.phone || "ไม่ระบุเบอร์โทรศัพท์" }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >ตำแหน่ง</label
                  >
                  <span
                    class="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="getRoleBadgeClass(staff.role)"
                  >
                    {{ getRoleLabel(staff.role) }}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >สถานะ</label
                  >
                  <span
                    class="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="getStatusBadgeClass(staff.status)"
                  >
                    {{ getStatusLabel(staff.status) }}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >แผนก</label
                  >
                  <p class="mt-1 text-sm text-gray-900">
                    {{ staff.department || "ไม่ระบุ" }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >ตำแหน่งงาน</label
                  >
                  <p class="mt-1 text-sm text-gray-900">
                    {{ staff.position || "ไม่ระบุ" }}
                  </p>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Permissions -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-medium">สิทธิ์การใช้งาน</h3>
            </template>

            <div
              v-if="staff.permissions && staff.permissions.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div
                v-for="permission in staff.permissions"
                :key="permission"
                class="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <i class="mdi mdi-check-circle text-green-600"></i>
                <div>
                  <div class="font-medium text-sm text-gray-900">
                    {{ getPermissionLabel(permission) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ getPermissionDescription(permission) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <i class="mdi mdi-lock text-4xl mb-2"></i>
              <p>ไม่มีสิทธิ์การใช้งานเฉพาะ</p>
            </div>
          </BaseCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-medium">การดำเนินการ</h3>
            </template>

            <div class="space-y-3">
              <BaseButton
                @click="editStaff"
                variant="outline"
                color="green"
                size="sm"
                class="w-full justify-start"
              >
                <i class="mdi mdi-pencil mr-2"></i>
                แก้ไขข้อมูล
              </BaseButton>
              <BaseButton
                @click="changeStatus"
                variant="outline"
                color="yellow"
                size="sm"
                class="w-full justify-start"
              >
                <i class="mdi mdi-account-cog mr-2"></i>
                เปลี่ยนสถานะ
              </BaseButton>
              <BaseButton
                @click="confirmDelete"
                variant="outline"
                color="red"
                size="sm"
                class="w-full justify-start"
              >
                <i class="mdi mdi-delete mr-2"></i>
                ลบพนักงาน
              </BaseButton>
            </div>
          </BaseCard>

          <!-- Audit Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-medium">ข้อมูลระบบ</h3>
            </template>

            <div class="space-y-3 text-sm">
              <div>
                <label class="block font-medium text-gray-700"
                  >สร้างเมื่อ</label
                >
                <p class="text-gray-900">{{ formatDate(staff.createdAt) }}</p>
              </div>
              <div>
                <label class="block font-medium text-gray-700"
                  >อัปเดตล่าสุด</label
                >
                <p class="text-gray-900">{{ formatDate(staff.updatedAt) }}</p>
              </div>
              <div v-if="staff.createdBy">
                <label class="block font-medium text-gray-700">สร้างโดย</label>
                <p class="text-gray-900">{{ staff.createdBy }}</p>
              </div>
              <div v-if="staff.updatedBy">
                <label class="block font-medium text-gray-700">แก้ไขโดย</label>
                <p class="text-gray-900">{{ staff.updatedBy }}</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <StaffFormModal
      v-model="showEditModal"
      :staff="staff"
      :departments="departments"
      @saved="handleStaffUpdated"
    />

    <StaffStatusModal
      v-model="showStatusModal"
      :staff="staff"
      @saved="handleStatusChanged"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal v-model="showDeleteModal" title="ยืนยันการลบ">
      <div class="text-center">
        <i class="mdi mdi-alert-circle text-red-500 text-6xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          ยืนยันการลบพนักงาน
        </h3>
        <p class="text-gray-600 mb-6">
          คุณต้องการลบพนักงาน
          <strong>{{ staff?.firstName }} {{ staff?.lastName }}</strong> หรือไม่?
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSingleToast } from "../../../composables/useSingleToast";
import { useStaff, type Staff } from "../../../composables/useStaff";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();
const { showToast } = useSingleToast();
const { getStaffById, deleteStaff, getDepartments } = useStaff();

// State
const loading = ref(false);
const deleting = ref(false);
const error = ref("");
const staff = ref<Staff | null>(null);
const departments = ref<string[]>([]);

// Modals
const showEditModal = ref(false);
const showStatusModal = ref(false);
const showDeleteModal = ref(false);

// Methods
const loadStaff = async () => {
  try {
    loading.value = true;
    error.value = "";

    const staffId = route.params.id as string;
    if (!staffId) {
      error.value = "ไม่พบรหัสพนักงาน";
      return;
    }

    staff.value = await getStaffById(staffId);
  } catch (err: any) {
    console.error("Failed to load staff:", err);
    error.value = err.message || "ไม่สามารถโหลดข้อมูลพนักงานได้";
  } finally {
    loading.value = false;
  }
};

const loadDepartments = async () => {
  try {
    const res = (await getDepartments()) as any;
    departments.value = res.departments;
  } catch (error) {
    console.error("Failed to load departments:", error);
  }
};

const editStaff = () => {
  showEditModal.value = true;
};

const changeStatus = () => {
  showStatusModal.value = true;
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!staff.value) return;

  try {
    deleting.value = true;
    await deleteStaff(staff.value.id);
    showToast("success", "ลบพนักงานสำเร็จ");
    router.push("/admin/staff");
  } catch (error) {
    console.error("Failed to delete staff:", error);
  } finally {
    deleting.value = false;
    showDeleteModal.value = false;
  }
};

const handleStaffUpdated = async () => {
  showEditModal.value = false;
  await loadStaff();
};

const handleStatusChanged = async () => {
  showStatusModal.value = false;
  await loadStaff();
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

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    manager: "bg-blue-100 text-blue-800",
    supervisor: "bg-green-100 text-green-800",
    staff: "bg-gray-100 text-gray-800",
  };
  return classes[role] || "bg-gray-100 text-gray-800";
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

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-yellow-100 text-yellow-800",
    terminated: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getStatusBannerClass = (status: string) => {
  const classes: Record<string, string> = {
    inactive: "bg-gray-100 border-gray-300 text-gray-800",
    suspended: "bg-yellow-100 border-yellow-300 text-yellow-800",
    terminated: "bg-red-100 border-red-300 text-red-800",
  };
  return classes[status] || "bg-gray-100 border-gray-300 text-gray-800";
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    inactive: "mdi mdi-account-off",
    suspended: "mdi mdi-account-alert",
    terminated: "mdi mdi-account-remove",
  };
  return icons[status] || "mdi mdi-account-off";
};

const getStatusDescription = (status: string) => {
  const descriptions: Record<string, string> = {
    inactive: "พนักงานคนนี้ไม่ได้ปฏิบัติงานในขณะนี้",
    suspended: "พนักงานคนนี้ถูกระงับการปฏิบัติงานชั่วคราว",
    terminated: "พนักงานคนนี้ถูกไล่ออกจากงาน",
  };
  return descriptions[status] || "";
};

const getPermissionLabel = (permission: string) => {
  const labels: Record<string, string> = {
    view_analytics: "ดูรายงานและวิเคราะห์",
    export_reports: "ส่งออกรายงาน",
    manage_staff: "จัดการพนักงาน",
    view_staff: "ดูข้อมูลพนักงาน",
    manage_orders: "จัดการออเดอร์",
    cancel_orders: "ยกเลิกออเดอร์",
    refund_orders: "คืนเงินออเดอร์",
    system_settings: "ตั้งค่าระบบ",
    audit_logs: "ดู Audit Logs",
    view_performance: "ดูข้อมูลประสิทธิภาพ",
    system_monitoring: "ติดตามระบบ",
  };
  return labels[permission] || permission;
};

const getPermissionDescription = (permission: string) => {
  const descriptions: Record<string, string> = {
    view_analytics: "สามารถดูรายงานต่าง ๆ และข้อมูลวิเคราะห์",
    export_reports: "สามารถส่งออกรายงานในรูปแบบต่าง ๆ",
    manage_staff: "สามารถเพิ่ม แก้ไข ลบข้อมูลพนักงาน",
    view_staff: "สามารถดูข้อมูลพนักงานทั้งหมด",
    manage_orders: "สามารถสร้าง แก้ไข ยกเลิกออเดอร์",
    cancel_orders: "สามารถยกเลิกออเดอร์ที่มีอยู่",
    refund_orders: "สามารถทำการคืนเงินให้ลูกค้า",
    system_settings: "สามารถแก้ไขการตั้งค่าระบบ",
    audit_logs: "สามารถดูประวัติการใช้งานระบบ",
    view_performance: "สามารถดูข้อมูลประสิทธิภาพของระบบ",
    system_monitoring: "สามารถติดตามสถานะการทำงานของระบบ",
  };
  return descriptions[permission] || "";
};

const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};

// Lifecycle
onMounted(async () => {
  await Promise.all([loadStaff(), loadDepartments()]);
});

// Meta
// definePageMeta({
//   layout: 'default',
//   middleware: 'only-admin-staff'
// })
</script>

<style scoped>
.staff-detail-page {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1.5rem;
}
</style>
