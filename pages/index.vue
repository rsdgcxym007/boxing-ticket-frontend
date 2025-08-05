<template>
  <div>
    <BoxingIntroVideo />

    <!-- <AnimatedSection>
      <HeroBanner />
    </AnimatedSection> -->

    <AnimatedSection>
      <div
        class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-12 items-center"
      >
        <div
          class="bg-gradient-to-br from-[#1a2b4d] p-10 to-[#0f1f3c] rounded-xl border border-blue-500/20"
        >
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <span class="text-blue-400 font-bold">ที่นั่งว่าง</span>
          </h3>
          <div class="space-y-3">
            <div
              v-for="zone in seatAvailability?.zones"
              :key="zone.zoneId"
              class="flex items-center gap-3"
            >
              <div
                class="w-3 h-3 rounded-full"
                :class="
                  zone.occupancyRate === 0
                    ? 'bg-green-500'
                    : zone.occupancyRate < 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                "
              ></div>
              <span class="text-sm capitalize text-white flex-1">{{
                zone.zoneName.replace(/-/g, " ")
              }}</span>
              <span class="text-xs text-gray-400"
                >{{ zone.availableSeats }}/{{ zone.totalSeats }}</span
              >
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-700">
            <div class="flex justify-between">
              <span class="text-gray-400">ที่นั่งทั้งหมด</span>
              <span class="font-bold text-yellow-300">{{
                seatAvailability?.summary?.totalSeats || 0
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">ที่นั่งว่าง</span>
              <span class="font-bold text-red-400">{{
                seatAvailability?.summary?.totalAvailable || 0
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <AnimatedSection>
      <StadiumZoneSelector />
    </AnimatedSection>

    <AnimatedSection>
      <Contact />
    </AnimatedSection>

    <AnimatedSection>
      <Footer />
    </AnimatedSection>

    <!-- Display Seat Availability -->
  </div>
</template>

<script setup>
import BoxingIntroVideo from "@/components/BoxingIntroVideo.vue";
import HeroBanner from "@/components/HeroBanner.vue";
import AnimatedSection from "@/components/AnimatedSection.vue";
import Contact from "../components/Contact.vue";
import { ref, onMounted } from "vue";
import { useDashboard } from "@/composables/useDashbord";
import { usePageData } from "@/stores/pageData";

const { getSeatAvailability } = useDashboard();
const seatAvailability = ref(null);
const currentShowDate = ref("2024-12-25");
const pageData = usePageData();
onMounted(async () => {
  try {
    pageData.loading = true;
    seatAvailability.value = await getSeatAvailability(new Date());
    pageData.loading = false;
  } catch (error) {
    console.error("Error fetching seat availability:", error);
    pageData.loading = false;
  }
});
</script>
