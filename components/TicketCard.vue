<template>
  <div
    class="grid gap-6 px-4 py-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  >
    <div
      v-for="(ticket, index) in tickets"
      :key="index"
      class="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 overflow-hidden"
    >
      <!-- รูป -->
      <div class="relative">
        <img :src="ticket.image" class="object-cover w-full h-48" />
        <div
          class="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-400 rounded-md shadow-md"
        >
          {{ ticket.label[locale] }}
        </div>
      </div>

      <!-- เนื้อหา -->
      <div class="p-5 space-y-3">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ ticket.title[locale.value] }}
        </h3>

        <ul class="ml-5 space-y-1 text-sm text-gray-700 list-disc">
          <li v-for="(benefit, i) in ticket.benefits[locale]" :key="i">
            {{ benefit }}
          </li>
        </ul>

        <button
          class="text-sm text-blue-600 hover:underline"
          @click="ticket.showMore = !ticket.showMore"
        >
          {{ ticket.showMore ? t("less") : t("more") }}
        </button>

        <div v-if="ticket.showMore" class="text-sm text-gray-600">
          {{ ticket.moreInfo[locale] }}
        </div>

        <!-- ราคา -->
        <div class="flex items-end justify-between pt-4">
          <div>
            <p class="text-sm text-gray-400 line-through">
              ฿{{ ticket.oldPrice }}
            </p>
            <p class="text-xl font-bold text-black">฿{{ ticket.newPrice }}</p>
          </div>
          <button
            class="px-5 py-2 text-white text-sm font-medium bg-orange-500 hover:bg-orange-600 rounded-lg shadow hover:shadow-md transition"
          >
            {{ t("select") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();
const tickets = reactive([
  {
    label: { th: "ที่นั่ง Stadium", en: "Stadium Seat" },
    title: { th: "ที่นั่ง Stadium + เสื้อยืด", en: "Stadium Seat + T-Shirt" },
    image:
      "https://static.ticket2attraction.com/gallery/47c2b8ac-bc62-4dc0-95fc-97e90e9c3019/c53b4c6b-8e4a-45e2-9527-e6af16e8725d-600.webp",
    benefits: {
      th: ["บัตรชมมวยไทยสนามไซน่ำเย็น", "ที่นั่ง Stadium", "เสื้อยืดที่ระลึก"],
      en: [
        "Muay Thai ticket at Saenamyen Stadium",
        "Stadium Seat",
        "Souvenir T-shirt",
      ],
    },
    moreInfo: {
      th: "รายละเอียดเพิ่มเติมของแพ็กเกจที่นั่ง Stadium...",
      en: "More details about the Stadium Seat package...",
    },
    oldPrice: 1500,
    newPrice: 1475,
    showMore: false,
  },
  {
    label: { th: "ที่นั่ง Stadium", en: "Stadium Seat" },
    title: { th: "ที่นั่ง Stadium + เสื้อยืด", en: "Stadium Seat + T-Shirt" },
    image:
      "https://static.ticket2attraction.com/gallery/47c2b8ac-bc62-4dc0-95fc-97e90e9c3019/c53b4c6b-8e4a-45e2-9527-e6af16e8725d-600.webp",
    benefits: {
      th: ["บัตรชมมวยไทยสนามไซน่ำเย็น", "ที่นั่ง Stadium", "เสื้อยืดที่ระลึก"],
      en: [
        "Muay Thai ticket at Saenamyen Stadium",
        "Stadium Seat",
        "Souvenir T-shirt",
      ],
    },
    moreInfo: {
      th: "รายละเอียดเพิ่มเติมของแพ็กเกจที่นั่ง Stadium...",
      en: "More details about the Stadium Seat package...",
    },
    oldPrice: 1500,
    newPrice: 1475,
    showMore: false,
  },
  {
    label: { th: "ที่นั่ง Stadium", en: "Stadium Seat" },
    title: { th: "ที่นั่ง Stadium + เสื้อยืด", en: "Stadium Seat + T-Shirt" },
    image:
      "https://static.ticket2attraction.com/gallery/47c2b8ac-bc62-4dc0-95fc-97e90e9c3019/c53b4c6b-8e4a-45e2-9527-e6af16e8725d-600.webp",
    benefits: {
      th: ["บัตรชมมวยไทยสนามไซน่ำเย็น", "ที่นั่ง Stadium", "เสื้อยืดที่ระลึก"],
      en: [
        "Muay Thai ticket at Saenamyen Stadium",
        "Stadium Seat",
        "Souvenir T-shirt",
      ],
    },
    moreInfo: {
      th: "รายละเอียดเพิ่มเติมของแพ็กเกจที่นั่ง Stadium...",
      en: "More details about the Stadium Seat package...",
    },
    oldPrice: 1500,
    newPrice: 1475,
    showMore: false,
  },
]);
</script>
