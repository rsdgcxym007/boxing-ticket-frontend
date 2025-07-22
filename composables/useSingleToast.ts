import { useToast } from "vue-toastification";
let toastId: any = null;
export const useSingleToast = () => {
  const toast = useToast();
  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string,
    options: any = {}
  ) => {
    if (toastId) {
      toast.dismiss(toastId);
      toastId = null;
    }
    toastId = toast[type](message, { timeout: 3000, ...options });
  };
  return { showToast };
};
