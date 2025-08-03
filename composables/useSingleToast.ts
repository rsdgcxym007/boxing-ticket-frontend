let toastId: any = null;
export const useSingleToast = () => {
  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string,
    options: any = {}
  ) => {
    // Only run on client side where vue-toastification is available
    if (typeof window === "undefined") return;

    // Dynamic import to avoid SSR issues
    import("vue-toastification")
      .then(({ useToast }) => {
        const toast = useToast();
        if (toastId) {
          toast.dismiss(toastId);
          toastId = null;
        }
        toastId = toast[type](message, { timeout: 3000, ...options });
      })
      .catch((err) => {
        console.warn("Toast not available:", err);
      });
  };
  return { showToast };
};
