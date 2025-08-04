/**
 * Composable สำหรับจัดการ image paths ใน web และ Electron
 */
export const useImagePath = () => {
  /**
   * แปลง image path ให้ทำงานได้ทั้ง web และ Electron
   * @param imagePath - path ของรูปภาพ เช่น "/images/logo.png" หรือ "logo.png"
   * @returns path ที่ถูกต้องสำหรับ environment ปัจจุบัน
   */
  const getImagePath = (imagePath: string): string => {
    // ถ้า path เริ่มต้นด้วย / ให้เอาออก
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    // ตรวจสอบว่าเป็น Electron หรือไม่ - ใช้หลายวิธีตรวจสอบ
    const isElectron =
      typeof window !== "undefined" &&
      ((window as any)?.process?.type === "renderer" ||
        (window as any)?.require !== undefined ||
        navigator?.userAgent?.includes("Electron"));

    if (isElectron) {
      // สำหรับ Electron ใช้ relative path
      return `./${cleanPath}`;
    }

    // สำหรับ web: รองรับ baseURL/i18n prefix
    // ดึง baseURL จาก Nuxt config (ถ้าใช้ใน client)
    let baseUrl = "/";
    if (typeof window !== "undefined") {
      try {
        baseUrl = (window as any).nuxtApp?.$config?.app?.baseURL || "/";
      } catch {}
    }
    const normalizedBase =
      baseUrl.endsWith("/") && baseUrl !== "/" ? baseUrl.slice(0, -1) : baseUrl;
    return normalizedBase === "/"
      ? `/${cleanPath}`
      : `${normalizedBase}/${cleanPath}`;
  };

  /**
   * สร้าง base path สำหรับ images directory
   * @returns base path สำหรับ images
   */
  const getImagesBasePath = (): string => {
    // ตรวจสอบว่าเป็น Electron หรือไม่ - ใช้หลายวิธีตรวจสอบ
    const isElectron =
      typeof window !== "undefined" &&
      ((window as any)?.process?.type === "renderer" ||
        (window as any)?.require !== undefined ||
        navigator?.userAgent?.includes("Electron"));

    if (isElectron) {
      return "./images/";
    }
    // สำหรับ web: รองรับ baseURL/i18n prefix
    let baseUrl = "/";
    if (typeof window !== "undefined") {
      try {
        baseUrl = (window as any).nuxtApp?.$config?.app?.baseURL || "/";
      } catch {}
    }
    const normalizedBase =
      baseUrl.endsWith("/") && baseUrl !== "/" ? baseUrl.slice(0, -1) : baseUrl;
    return normalizedBase === "/" ? "/images/" : `${normalizedBase}/images/`;
  };

  return {
    getImagePath,
    getImagesBasePath,
  };
};
