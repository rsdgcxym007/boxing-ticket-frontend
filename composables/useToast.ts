// ใส่ไว้ใน utils/useToast.ts
export const useToast = () => {
  // สร้าง container กลางจอ ถ้ายังไม่มี
  let container = document.getElementById("custom-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "custom-toast-container";
    container.className = `
      fixed top-16 left-1/2 transform -translate-x-1/2
      flex flex-col items-center gap-4 z-[9999] pointer-events-none
    `;
    document.body.appendChild(container);
  }

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    const toast = document.createElement("div");

    const bgColor =
      type === "success"
        ? "bg-green-100 border-green-500 text-green-700"
        : type === "error"
        ? "bg-red-100 border-red-500 text-red-700"
        : "bg-yellow-100 border-yellow-500 text-yellow-700";

    const icons = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
      error: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z" /></svg>`,
    };

    toast.innerHTML = `
      <div class="max-w-xs w-full px-6 py-4 rounded-xl border ${bgColor} shadow-lg text-center animate-toast-enter">
        <div>${icons[type]}</div>
        <div class="mt-2 text-sm font-medium break-words">${message}</div>
      </div>
    `;

    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    toast.style.transition = "all 0.3s ease";

    container!.appendChild(toast);

    // Fade in
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 10);

    // Auto-remove
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  return { showToast };
};
