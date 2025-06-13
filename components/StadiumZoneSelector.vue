<template>
  <div
    class="relative w-full bg-gradient-to-b from-black via-zinc-900 to-black flex justify-center items-center overflow-hidden"
  >
    <div
      class="relative w-full max-w-4xl aspect-square shadow-2xl rounded-xl overflow-hidden"
    >
      <img
        src="/images/stage_steage.png"
        alt="stadium background"
        class="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
      />

      <svg
        viewBox="0 0 1000 1000"
        class="absolute inset-0 w-full h-full z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              flood-color="#ffffff"
            />
          </filter>
        </defs>

        <g v-for="zone in pageData.zones" :key="zone.id">
          <polygon
            :points="zone.points"
            :fill="isSelected(zone) ? darken(zone.fill) : zone.fill"
            :stroke="isSelected(zone) ? '#fff' : 'white'"
            stroke-width="2"
            class="cursor-pointer transition duration-300"
            :style="isSelected(zone) ? 'filter: url(#glow)' : ''"
            @click="selectZone(zone)"
          />
          <text
            :x="zone.labelX"
            :y="zone.labelY"
            text-anchor="middle"
            alignment-baseline="middle"
            font-size="18"
            fill="white"
            class="pointer-events-none font-extrabold drop-shadow"
          >
            {{ zone.name }}
          </text>
        </g>
      </svg>
    </div>
  </div>
  <ModalStadiumZoneSelector
    :zoneKey="pageData.selectedZone"
    :show="pageData.showZoneModal"
    @close="pageData.showZoneModal = false"
  />
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const pageData = reactive({
  selectedZone: "",
  zones: [
    {
      id: "back-left",
      name: "BACK LEFT",
      fill: "#ca8a04",
      labelX: 340,
      labelY: 130,
      points: "470,70 210,70 210,190 300,269 470,270",
    },
    {
      id: "back-right",
      name: "BACK RIGHT",
      fill: "#ea580c",
      labelX: 650,
      labelY: 130,
      points: "535,70 814,70 690,260 550,260 535,255",
    },
    {
      id: "left",
      name: "LEFT",
      fill: "#c2410c",
      labelX: 250,
      labelY: 400,
      points: "170,165 310,270 310,650 280,700 170,800 170,300",
    },
    {
      id: "right",
      name: "RIGHT",
      fill: "#dc2626",
      labelX: 740,
      labelY: 400,
      points: "690,260 810,70 830,70 835,770 690,650 689,400",
    },
    {
      id: "front-ringside",
      name: "FRONT RINGSIDE",
      fill: "#2563eb",
      labelX: 500,
      labelY: 750,
      points: "300,669 710,670 809,830 190,832",
    },
  ],
  showZoneModal: false,
});

function darken(color) {
  const hex = color.replace("#", "");
  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 40);
  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 40);
  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 40);
  return `rgb(${r},${g},${b})`;
}

function isSelected(zone) {
  return pageData.selectedZone?.id === zone.id;
}

const selectZone = async (zone) => {
  console.log("zone", zone);

  pageData.selectedZone = "";
  await nextTick();
  pageData.selectedZone = zone.id;
  pageData.showZoneModal = true;
};

function handleScroll() {
  if (window.scrollY > 100 && pageData.selectedZone) {
    pageData.selectedZone = null;
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
