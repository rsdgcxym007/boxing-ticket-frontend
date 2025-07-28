import { ref } from "vue";
import { useReferrer } from "./useReferrer";
import { useOrder } from "./useOrder";

const masterData = ref(null);
const masterStaffAdmin = ref(null);
const loading = ref(false);
const error = ref(null);

export function useReferrerMasterData() {
  const masterData = ref(null);
  const masterStaffAdmin = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const { getReferrerMasterData } = useReferrer();
  const { getMasterStaffAdmin } = useOrder();

  const fetchMasterData = async () => {
    if (masterData.value) return masterData.value; // ใช้ cache
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
  };
}
