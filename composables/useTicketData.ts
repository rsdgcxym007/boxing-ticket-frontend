// composables/useTicketData.ts
import { reactive } from "vue";

export function useTicketData() {
  // Helper function สำหรับ image paths ใน Electron
  const getImagePath = (path: string) => {
    if (typeof window !== "undefined" && window?.process?.type === "renderer") {
      return `.${path}`;
    }
    return path;
  };

  return reactive([
    {
      zone: "back-left",
      label: {
        th: "RINGSIDE โซนด้านหลังซ้าย",
        en: "RINGSIDE Zone Back Left",
      },
      title: {
        th: "RINGSIDE ด้านหลังซ้าย + เสื้อยืดพรีเมียม",
        en: "Back Left RINGSIDE + Premium T-Shirt",
      },
      image: getImagePath("/images/stage_back_left.png"),
      benefits: {
        th: [
          "ที่นั่งติดขอบเวทีฝั่งซ้ายด้านหลัง",
          "ชมมวยไทยสุดมันส์ใกล้ชิด",
          "ของที่ระลึก: เสื้อยืดพรีเมียม",
        ],
        en: [
          "Ringside seat (Back Left)",
          "Close-up Muay Thai action",
          "Free premium souvenir T-shirt",
        ],
      },
      moreInfo: {
        th: "เหมาะสำหรับผู้ที่ต้องการความใกล้ชิดแต่ยังมองเห็นเวทีได้มุมกว้าง",
        en: "Ideal for fans who want close seats with a wider view of the ring.",
      },
      oldPrice: 2000,
      newPrice: 1800,
      showMore: false,
    },
    {
      zone: "back-right",
      label: {
        th: "RINGSIDE โซนด้านหลังขวา",
        en: "RINGSIDE Zone Back Right",
      },
      title: {
        th: "RINGSIDE ด้านหลังขวา + เสื้อยืดพรีเมียม",
        en: "Back Right RINGSIDE + Premium T-Shirt",
      },
      image: getImagePath("/images/stage_back_right.png"),
      benefits: {
        th: [
          "ที่นั่งขอบเวทีฝั่งขวาด้านหลัง",
          "ชมได้ชัดเจนแบบมีระยะห่างเล็กน้อย",
          "เสื้อยืดที่ระลึกสุดพิเศษ",
        ],
        en: [
          "Ringside seat (Back Right)",
          "Clear view with slight distance",
          "Exclusive souvenir T-shirt",
        ],
      },
      moreInfo: {
        th: "มุมมองดี เห็นนักชกชัดตลอดการแข่งขัน",
        en: "Great angle to watch fighters in action throughout the match.",
      },
      oldPrice: 2000,
      newPrice: 1800,
      showMore: false,
    },
    {
      zone: "left",
      label: {
        th: "RINGSIDE โซนซ้าย",
        en: "RINGSIDE Zone Left",
      },
      title: {
        th: "RINGSIDE ฝั่งซ้าย + เสื้อยืดลิมิเต็ด",
        en: "Left RINGSIDE + Limited T-Shirt",
      },
      image: getImagePath("/images/stage_front_rear_left.png"),
      benefits: {
        th: [
          "ติดขอบเวทีฝั่งซ้าย มุมใกล้นักมวย",
          "เสื้อยืดรุ่นลิมิเต็ดฟรี",
          "บรรยากาศเข้มข้น",
        ],
        en: [
          "Left ringside – very close to red corner",
          "Free limited edition T-shirt",
          "Immersive Muay Thai atmosphere",
        ],
      },
      moreInfo: {
        th: "สายใกล้ชิดต้องไม่พลาด มองเห็นสีหน้าชัดทุกหมัด",
        en: "Perfect for fans who want to feel the intensity up close.",
      },
      oldPrice: 2000,
      newPrice: 1800,
      showMore: false,
    },
    {
      zone: "right",
      label: {
        th: "RINGSIDE โซนขวา",
        en: "RINGSIDE Zone Right",
      },
      title: {
        th: "RINGSIDE ฝั่งขวา + เสื้อยืดลิมิเต็ด",
        en: "Right RINGSIDE + Limited T-Shirt",
      },
      image: getImagePath("/images/stage_front_rear_right.png"),
      benefits: {
        th: [
          "ที่นั่งขอบเวทีฝั่งขวา ใกล้มุมมองนักมวย",
          "เสื้อยืดพรีเมียมฟรี",
          "มุมมองแบบมืออาชีพ",
        ],
        en: [
          "Right side ringside seat",
          "Free premium T-shirt",
          "Professional-level viewing angle",
        ],
      },
      moreInfo: {
        th: "เหมาะกับสายถ่ายภาพ มุมชัดและใกล้สุด ๆ",
        en: "Great for photographers – clear, close viewing spot.",
      },
      oldPrice: 2000,
      newPrice: 1800,
      showMore: false,
    },
    {
      zone: "front-ringside",
      label: {
        th: "RINGSIDE โซนด้านหน้า",
        en: "RINGSIDE Zone Front Center",
      },
      title: {
        th: "RINGSIDE ด้านหน้า VIP + ถ่ายภาพกับนักมวย",
        en: "Front RINGSIDE VIP + Photo with Fighter",
      },
      image: getImagePath("/images/stage_front_center.png"),
      benefits: {
        th: [
          "ที่นั่ง VIP ใกล้เวทีที่สุด",
          "รับสิทธิ์ถ่ายภาพกับนักมวยหลังจบแมตช์",
          "ของที่ระลึกสุดเอ็กซ์คลูซีฟ",
        ],
        en: [
          "Front-row VIP ringside",
          "Photo session with fighter after the match",
          "Exclusive gift pack",
        ],
      },
      moreInfo: {
        th: "พิเศษสุดสำหรับผู้ที่ต้องการประสบการณ์แบบ VVIP",
        en: "Exclusive VVIP experience for Muay Thai lovers.",
      },
      oldPrice: 2000,
      newPrice: 1800,
      showMore: false,
    },
  ]);
}
