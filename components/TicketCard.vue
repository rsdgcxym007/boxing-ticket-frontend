<template>
  <div class="bg-[#0f172a] py-10 px-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">Ticket Zones</h2>
    </div>

    <!-- ปุ่มเลื่อนซ้าย/ขวา -->
    <div class="relative">
      <!-- ปุ่มซ้าย -->
      <button
        @click="scrollLeft"
        class="absolute left-0 top-[50%] -translate-y-1/2 z-10 bg-slate-700/70 hover:bg-slate-600 text-white p-2 rounded-full shadow-md"
        v-show="showNavButtons"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <!-- ปุ่มขวา -->
      <button
        @click="scrollRight"
        class="absolute right-0 top-[50%] -translate-y-1/2 z-10 bg-slate-700/70 hover:bg-slate-600 text-white p-2 rounded-full shadow-md"
        v-show="showNavButtons"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <!-- ตัวเลื่อนแนวนอน -->
      <div ref="scrollContainer" class="overflow-x-auto">
        <div class="flex gap-6 pb-4 min-w-[768px]">
          <div
            v-for="(ticket, index) in tickets"
            :key="index"
            class="w-[320px] flex-shrink-0 rounded-xl overflow-hidden border shadow transition hover:shadow-lg hover:scale-[1.015] bg-slate-800 border-slate-700 text-white"
          >
            <div class="relative">
              <img :src="ticket.image" class="w-full h-40 object-cover" />
              <div
                class="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-md shadow-sm backdrop-blur-sm"
              >
                {{ ticket.label[locale] }}
              </div>
            </div>

            <div class="p-5 space-y-3">
              <h3 class="text-lg font-bold">{{ ticket.title[locale] }}</h3>
              <ul class="space-y-1 text-sm">
                <li
                  v-for="(benefit, i) in ticket.benefits[locale]"
                  :key="i"
                  class="flex items-start gap-2"
                >
                  <svg
                    class="w-4 h-4 text-sky-500 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{{ benefit }}</span>
                </li>
              </ul>

              <button
                class="text-sm underline text-sky-400 hover:text-sky-300"
                @click="ticket.showMore = !ticket.showMore"
              >
                {{ ticket.showMore ? t("less") : t("more") }}
              </button>

              <div v-if="ticket.showMore" class="text-sm text-slate-400">
                {{ ticket.moreInfo[locale] }}
              </div>

              <div class="flex items-end justify-between pt-4">
                <div>
                  <p class="text-sm line-through text-slate-400">
                    ฿{{ ticket.oldPrice }}
                  </p>
                  <p class="text-xl font-bold">฿{{ ticket.newPrice }}</p>
                </div>
                <button
                  @click="goToSeatPage"
                  class="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow"
                >
                  {{ t("select") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();
const router = useRouter();
const tickets = reactive([
  {
    label: {
      th: "RINGSIDE โซนด้านหลังซ้าย",
      en: "RINGSIDE Zone Back Left",
    },
    title: {
      th: "RINGSIDE ด้านหลังซ้าย + เสื้อยืดพรีเมียม",
      en: "Back Left RINGSIDE + Premium T-Shirt",
    },
    image: "/images/stage_back_left.png",
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
    oldPrice: 1800,
    newPrice: 1650,
    showMore: false,
  },
  {
    label: {
      th: "RINGSIDE โซนด้านหลังขวา",
      en: "RINGSIDE Zone Back Right",
    },
    title: {
      th: "RINGSIDE ด้านหลังขวา + เสื้อยืดพรีเมียม",
      en: "Back Right RINGSIDE + Premium T-Shirt",
    },
    image: "/images/stage_back_right.png",
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
    oldPrice: 1800,
    newPrice: 1650,
    showMore: false,
  },
  {
    label: {
      th: "RINGSIDE โซนซ้าย",
      en: "RINGSIDE Zone Left",
    },
    title: {
      th: "RINGSIDE ฝั่งซ้าย + เสื้อยืดลิมิเต็ด",
      en: "Left RINGSIDE + Limited T-Shirt",
    },
    image: "/images/stage_front_rear_left.png",
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
    newPrice: 1790,
    showMore: false,
  },
  {
    label: {
      th: "RINGSIDE โซนขวา",
      en: "RINGSIDE Zone Right",
    },
    title: {
      th: "RINGSIDE ฝั่งขวา + เสื้อยืดลิมิเต็ด",
      en: "Right RINGSIDE + Limited T-Shirt",
    },
    image: "/images/stage_front_rear_right.png",
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
    newPrice: 1790,
    showMore: false,
  },
  {
    label: {
      th: "RINGSIDE โซนด้านหน้า",
      en: "RINGSIDE Zone Front Center",
    },
    title: {
      th: "RINGSIDE ด้านหน้า VIP + ถ่ายภาพกับนักมวย",
      en: "Front RINGSIDE VIP + Photo with Fighter",
    },
    image: "/images/stage_front_center.png",
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
    oldPrice: 2800,
    newPrice: 2490,
    showMore: false,
  },
]);
const scrollContainer = ref(null);
const showNavButtons = ref(false);

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -320, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 320, behavior: "smooth" });
  }
};

onMounted(() => {
  nextTick(() => {
    if (scrollContainer.value) {
      showNavButtons.value =
        scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth;
    }
  });

  // Responsive check on window resize
  window.addEventListener("resize", () => {
    if (scrollContainer.value) {
      showNavButtons.value =
        scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth;
    }
  });
});
const goToSeatPage = () => {
  router.push("/seat-selection");
};
</script>

<style scoped>
/* optional custom scrollbar */
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 10px;
}
</style>
