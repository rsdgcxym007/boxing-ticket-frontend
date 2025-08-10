import { ref } from "vue";
import { useReferrer } from "./useReferrer";
import { useOrder } from "./useOrder";

const masterData = ref([]);
const masterStaffAdmin = ref([]);
const loading = ref(false);
const error = ref(null);

export function useReferrerMasterData() {
  // ยิง API พร้อมกันและอัพเดท state ทั้งสอง
  const fetchAllMasterData = async () => {
    loading.value = true;
    try {
      const [refData, staffData] = await Promise.all([
        getReferrerMasterData(),
        getMasterStaffAdmin(),
      ]);
      masterData.value = refData;
      masterStaffAdmin.value = staffData;
      return { refData, staffData };
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const { getReferrerMasterData } = useReferrer();
  const { getMasterStaffAdmin } = useOrder();

  const fetchMasterData = async (forceReload = false) => {
    // ถ้า masterData มีข้อมูลแล้ว (length > 0) และไม่ได้บังคับ reload ให้ return cache
    if (
      !forceReload &&
      Array.isArray(masterData.value) &&
      masterData.value.length > 0
    ) {
      return masterData.value;
    }
    loading.value = true;
    try {
      const data = await getReferrerMasterData();
      masterData.value = data;
      return data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchMasterStaffAdmin = async () => {
    if (masterStaffAdmin.value) return masterStaffAdmin.value; // ใช้ cache
    loading.value = true;
    try {
      const data = await getMasterStaffAdmin();
      masterStaffAdmin.value = data;
      return data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    masterData,
    masterStaffAdmin,
    loading,
    error,
    fetchMasterData,
    fetchMasterStaffAdmin,
    fetchAllMasterData,
  };
}
