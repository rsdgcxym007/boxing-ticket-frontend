import { ref } from "vue";
import { useReferrer } from "./useReferrer";

const masterData = ref(null);
const loading = ref(false);
const error = ref(null);

export function useReferrerMasterData() {
  const { getReferrerMasterData } = useReferrer();

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

  return {
    masterData,
    loading,
    error,
    fetchMasterData,
  };
}
