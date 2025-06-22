import { useApi } from "../composables/useApi";
import { useToast } from "vue-toastification";

export const useDashbord = () => {
  const { get, post, patch } = useApi();
  const toast = useToast();

  const getDashbord = async () => {
    try {
      const data = await get("/dashboard");
      return data;
    } catch (err: any) {
      toast.error(
        `ไม่สามารถเรียก Dashboard ได้: ${
          err.response?.data?.message || "Unknown error"
        }`
      );
      throw err;
    }
  };

  return { getDashbord };
};
