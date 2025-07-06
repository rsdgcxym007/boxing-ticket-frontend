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
        v-show="pageData.showNavButtons"
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
        v-show="pageData.showNavButtons"
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
            v-for="(ticket, index) in pageData.tickets"
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

            <div
              class="p-5 space-y-3 flex flex-col justify-between min-h-[320px]"
            >
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
                  v-if="!['user'].includes(auth?.user?.role)"
                  @click="openZoneModal(ticket.zone)"
                  class="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow"
                >
                  {{ t("select") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zone Selector Modal -->
      <ModalStadiumZoneSelector
        :zoneKey="pageData.selectedZoneKey"
        :isOpen="pageData.showZoneModal"
        @close="pageData.showZoneModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useTicketData } from "@/composables/useTicketData";
import ModalStadiumZoneSelector from "@/components/ModalStadiumZoneSelector.vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

if (!auth?.user) {
  auth.loadUser();
}
const { locale, t } = useI18n();
const router = useRouter();
const scrollContainer = ref(null);

const pageData = reactive({
  tickets: useTicketData(),
  showNavButtons: false,
  showZoneModal: false,
  selectedZoneKey: null,
});

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

const openZoneModal = async (zoneKey) => {
  pageData.selectedZoneKey = "";
  await nextTick();
  pageData.selectedZoneKey = zoneKey;
  pageData.showZoneModal = true;
};

onMounted(() => {
  nextTick(() => {
    if (scrollContainer.value) {
      pageData.showNavButtons =
        scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth;
    }
  });
  window.addEventListener("resize", () => {
    if (scrollContainer.value) {
      pageData.showNavButtons =
        scrollContainer.value.scrollWidth > scrollContainer.value.clientWidth;
    }
  });
});
</script>

<style scoped>
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 10px;
}
</style>
